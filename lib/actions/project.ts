"use server"

import { z } from "zod"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import fs from "fs/promises"
import path from "path"

// const prisma = new PrismaClient() -> removed


const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().min(10, "Description must be at least 10 characters").max(300),
    content: z.string().min(20, "Please provide more details about your project"),
    githubUrl: z.string().url("Invalid URL").refine((url) => url.includes("github.com"), {
        message: "Must be a GitHub URL",
    }),
    demoUrl: z.string().optional().or(z.literal("")),
    imageUrl: z.string().refine((val) => !val || val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/"), {
        message: "Invalid Image URL",
    }).optional().or(z.literal("")),
    tags: z.string().min(1, "Add at least one tag"),
    seekingContributors: z.coerce.boolean(),
})

export async function createProject(prevState: any, formData: FormData) {
    const { userId } = await auth()

    if (!userId) {
        return { message: "Unauthorized Check" }
    }

    // Fetch the internal User ID, or auto-create if doesn't exist
    let user = await prisma.user.findUnique({
        where: { clerkId: userId },
    })

    if (!user) {
        // Auto-create user profile from Clerk data
        const clerkUser = await currentUser()
        if (!clerkUser) {
            return { message: "Unable to fetch user information. Please try again." }
        }

        user = await prisma.user.create({
            data: {
                clerkId: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress || "",
                name: clerkUser.fullName || clerkUser.firstName || "Anonymous",
                username: clerkUser.username || `user-${userId.slice(-8)}`,
                image: clerkUser.imageUrl || null,
                bio: "",
                skills: [],
            },
        })
    }

    // Handle file upload
    const imageFile = formData.get("imageFile") as File | null
    let uploadedImageUrl = ""

    if (imageFile && imageFile.size > 0) {
        // Validate file type
        if (!imageFile.type.startsWith("image/")) {
            return { message: "File must be an image" }
        }

        // Validate file size (e.g., 5MB limit)
        if (imageFile.size > 5 * 1024 * 1024) {
            return { message: "File size must be less than 5MB" }
        }

        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer())
            const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
            const uploadDir = path.join(process.cwd(), "public", "uploads")

            // Ensure directory exists
            await fs.mkdir(uploadDir, { recursive: true })

            await fs.writeFile(path.join(uploadDir, filename), buffer)
            uploadedImageUrl = `/uploads/${filename}`
        } catch (error) {
            console.error("Upload error:", error)
            return { message: "Failed to upload image" }
        }
    }

    const rawData = {
        title: formData.get("title"),
        description: formData.get("description"),
        content: formData.get("content"),
        githubUrl: formData.get("githubUrl"),
        demoUrl: formData.get("demoUrl"),
        imageUrl: uploadedImageUrl || formData.get("imageUrl"),
        tags: formData.get("tags"),
        seekingContributors: formData.get("seekingContributors"),
    }

    const validated = projectSchema.safeParse(rawData)

    if (!validated.success) {
        return {
            message: "Please check your inputs",
            errors: validated.error.flatten().fieldErrors,
        }
    }

    const { title, description, content, githubUrl, demoUrl, imageUrl, tags, seekingContributors } = validated.data

    // Simple slug generation
    let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")

    // Basic uniqueness check (append random if exists)
    // Ideally use a better slug generator or loop
    const existing = await prisma.project.findUnique({ where: { slug } })
    if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 10000)}`
    }

    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean)

    try {
        await prisma.project.create({
            data: {
                title,
                slug,
                description,
                content,
                githubUrl,
                demoUrl: demoUrl || null,
                images: imageUrl ? [imageUrl] : [],
                tags: tagList,
                userId: user.id,
                seekingContributors,
            },
        })
    } catch (error) {
        console.error("Failed to create project:", error)
        return { message: "Failed to create project. Please try again." }
    }

    revalidatePath("/")
    redirect(`/project/${slug}`)
}

export async function updateProject(prevState: any, formData: FormData) {
    const { userId } = await auth()

    if (!userId) {
        return { message: "Unauthorized" }
    }

    const projectId = formData.get("projectId") as string
    if (!projectId) {
        return { message: "Project ID is required" }
    }

    // Verify ownership
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    })

    if (!user) {
        return { message: "User profile not found" }
    }

    const existingProject = await prisma.project.findUnique({
        where: { id: projectId },
    })

    if (!existingProject) {
        return { message: "Project not found" }
    }

    if (existingProject.userId !== user.id) {
        return { message: "You are not authorized to edit this project" }
    }

    // Handle file upload
    const imageFile = formData.get("imageFile") as File | null
    let uploadedImageUrl = ""

    if (imageFile && imageFile.size > 0) {
        if (!imageFile.type.startsWith("image/")) {
            return { message: "File must be an image" }
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            return { message: "File size must be less than 5MB" }
        }

        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer())
            const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
            const uploadDir = path.join(process.cwd(), "public", "uploads")

            await fs.mkdir(uploadDir, { recursive: true })
            await fs.writeFile(path.join(uploadDir, filename), buffer)
            uploadedImageUrl = `/uploads/${filename}`
        } catch (error) {
            console.error("Upload error:", error)
            return { message: "Failed to upload image" }
        }
    }

    const rawData = {
        title: formData.get("title"),
        description: formData.get("description"),
        content: formData.get("content"),
        githubUrl: formData.get("githubUrl"),
        demoUrl: formData.get("demoUrl"),
        imageUrl: uploadedImageUrl || formData.get("imageUrl") || existingProject.images[0] || "",
        tags: formData.get("tags"),
        seekingContributors: formData.get("seekingContributors"),
    }

    const validated = projectSchema.safeParse(rawData)

    if (!validated.success) {
        return {
            message: "Please check your inputs",
            errors: validated.error.flatten().fieldErrors,
        }
    }

    const { title, description, content, githubUrl, demoUrl, imageUrl, tags, seekingContributors } = validated.data

    // Regenerate slug if title changed
    let newSlug = existingProject.slug
    if (title !== existingProject.title) {
        newSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")

        const slugExists = await prisma.project.findFirst({
            where: {
                slug: newSlug,
                id: { not: projectId }
            }
        })

        if (slugExists) {
            newSlug = `${newSlug}-${Math.floor(Math.random() * 10000)}`
        }
    }

    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean)

    try {
        await prisma.project.update({
            where: { id: projectId },
            data: {
                title,
                slug: newSlug,
                description,
                content,
                githubUrl,
                demoUrl: demoUrl || null,
                images: imageUrl ? [imageUrl] : existingProject.images,
                tags: tagList,
                seekingContributors,
            },
        })
    } catch (error) {
        console.error("Failed to update project:", error)
        return { message: "Failed to update project. Please try again." }
    }

    revalidatePath("/")
    revalidatePath(`/project/${existingProject.slug}`)
    redirect(`/project/${newSlug}`)
}

export async function deleteProject(projectId: string) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, message: "Unauthorized" }
    }

    // Verify ownership
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    })

    if (!user) {
        return { success: false, message: "User profile not found" }
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId },
    })

    if (!project) {
        return { success: false, message: "Project not found" }
    }

    if (project.userId !== user.id) {
        return { success: false, message: "You are not authorized to delete this project" }
    }

    // Delete uploaded images from filesystem
    for (const imageUrl of project.images) {
        if (imageUrl.startsWith("/uploads/")) {
            try {
                const imagePath = path.join(process.cwd(), "public", imageUrl)
                await fs.unlink(imagePath)
            } catch (error) {
                console.error("Failed to delete image:", error)
                // Continue even if image deletion fails
            }
        }
    }

    try {
        // Delete project (comments and likes will cascade)
        await prisma.project.delete({
            where: { id: projectId },
        })
    } catch (error) {
        console.error("Failed to delete project:", error)
        return { success: false, message: "Failed to delete project. Please try again." }
    }

    revalidatePath("/")
    redirect("/")
}
