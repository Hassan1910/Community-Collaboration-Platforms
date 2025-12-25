
import { prisma } from "@/lib/db"

export async function getWeeklyHighlights() {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Fetch projects from the last 7 days
    const projects = await prisma.project.findMany({
        where: {
            createdAt: {
                gte: sevenDaysAgo,
            },
        },
        include: {
            user: {
                select: {
                    name: true,
                    username: true,
                    image: true,
                },
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
        },
        // We can't easily sort by calculated field in basic Prisma findMany
        // So we'll fetch them (assuming volume isn't massive for a weekly batch) and sort in memory
        take: 100,
    })

    // Calculate score and sort
    const scoredProjects = projects.map((project) => ({
        ...project,
        score: project._count.likes + project._count.comments * 2,
    }))

    const sortedProjects = scoredProjects.sort((a, b) => b.score - a.score)

    // Return top 10
    return sortedProjects.slice(0, 10)
}

export type HighlightedProject = Awaited<ReturnType<typeof getWeeklyHighlights>>[number]
