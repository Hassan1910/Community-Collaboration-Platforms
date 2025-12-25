"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
// import { z } from "zod" // Will use later for comments

export async function toggleLike(projectId: string) {
    const { userId } = await auth()

    if (!userId) {
        return { message: "Unauthorized", success: false }
    }

    // Get internal user id
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    })

    if (!user) {
        return { message: "User not found", success: false }
    }

    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_projectId: {
                    userId: user.id,
                    projectId,
                },
            },
        })

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: { id: existingLike.id },
            })
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId: user.id,
                    projectId,
                },
            })
        }

        revalidatePath(`/project/${projectId}`) // Or revalidate generic path if needed
        revalidatePath("/") // To update feed counts if visible there

        return { success: true }
    } catch (error) {
        console.error("Error toggling like:", error)
        return { message: "Failed to toggle like", success: false }
    }
}

export async function postComment(prevState: any, formData: FormData) {
    const { userId } = await auth()

    if (!userId) {
        return { message: "Unauthorized", success: false }
    }

    const projectId = formData.get("projectId") as string
    const content = formData.get("content") as string

    if (!projectId || !content || content.trim().length === 0) {
        return { message: "Invalid input", success: false }
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    })

    if (!user) {
        return { message: "User not found", success: false }
    }

    try {
        await prisma.comment.create({
            data: {
                content,
                userId: user.id,
                projectId,
            },
        })

        revalidatePath(`/project/${projectId}`)
        return { success: true, message: "Comment posted" }
    } catch (error) {
        console.error("Failed to post comment:", error)
        return { message: "Failed to post comment", success: false }
    }
}

export async function deleteComment(commentId: string) {
    const { userId } = await auth()

    if (!userId) {
        return { message: "Unauthorized", success: false }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!user) return { success: false, message: "User not found" }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        })

        if (!comment) {
            return { message: "Comment not found", success: false }
        }

        if (comment.userId !== user.id) {
            return { message: "Unauthorized", success: false }
        }

        await prisma.comment.delete({
            where: { id: commentId },
        })

        revalidatePath(`/project/${comment.projectId}`)
        return { success: true, message: "Comment deleted" }
    } catch (error) {
        console.error("Failed to delete comment:", error)
        return { message: "Failed to delete comment", success: false }
    }
}
