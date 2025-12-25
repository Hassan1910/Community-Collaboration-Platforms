"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// const prisma = new PrismaClient()


export async function updateUserProfile(formData: FormData) {
    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const bio = formData.get("bio") as string
    const username = formData.get("username") as string
    // Simple skill parsing: split by comma
    const skillsString = formData.get("skills") as string
    const skills = skillsString.split(",").map(s => s.trim()).filter(Boolean)

    try {
        await prisma.user.upsert({
            where: { clerkId: userId },
            update: {
                name,
                bio,
                username,
                skills,
            },
            create: {
                clerkId: userId,
                email: "", // Helper: Clerk usually provides this, handle logic deeper if strictly needed
                name,
                bio,
                username,
                skills,
            },
        })

        revalidatePath("/profile")
        return { success: true }
    } catch (error) {
        console.error("Failed to update profile", error)
        return { success: false, error: "Failed to update profile" }
    }
}

export async function getUserProfile() {
    const { userId } = await auth()
    if (!userId) return null

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    })

    return user
}
