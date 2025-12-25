import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import { EditProjectForm } from "@/components/edit-project-form"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in")
    }

    // Get the current user
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    })

    if (!user) {
        redirect("/profile")
    }

    // Fetch the project
    const project = await prisma.project.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            githubUrl: true,
            demoUrl: true,
            images: true,
            tags: true,
            seekingContributors: true,
            userId: true,
        }
    })

    if (!project) {
        notFound()
    }

    // Verify ownership
    if (project.userId !== user.id) {
        redirect(`/project/${slug}`)
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Link href={`/project/${slug}`} className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-block font-mono">
                    &larr; Back to Project
                </Link>

                <EditProjectForm project={project} />
            </div>
        </div>
    )
}
