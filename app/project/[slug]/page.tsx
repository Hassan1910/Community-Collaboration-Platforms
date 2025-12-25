import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GithubIcon, ExternalLinkIcon, CalendarIcon, PencilIcon } from "lucide-react"
import { auth } from "@clerk/nextjs/server"
import { LikeButton } from "@/components/like-button"
import { CommentSection } from "@/components/comment-section"
import { DeleteProjectDialog } from "@/components/delete-project-dialog"

export const dynamic = "force-dynamic"

import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const project = await prisma.project.findUnique({
        where: { slug },
        include: { user: true }
    })

    if (!project) {
        return {
            title: "Project Not Found",
            description: "The requested project could not be found."
        }
    }

    return {
        title: `${project.title} | Project Twist`,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            type: "article",
            images: project.images.length > 0 ? [{ url: project.images[0] }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: project.title,
            description: project.description,
            images: project.images.length > 0 ? [project.images[0]] : undefined,
        }
    }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const { userId } = await auth()

    const project = await prisma.project.findUnique({
        where: { slug },
        include: {
            user: {
                select: {
                    id: true,
                    clerkId: true,
                    name: true,
                    username: true,
                    image: true,
                    bio: true
                }
            },
            _count: {
                select: { likes: true }
            }
        }
    })

    if (!project) notFound()

    let isLiked = false
    let currentUserImage = null
    const isOwner = userId === project.user.clerkId

    if (userId) {
        const user = await prisma.user.findUnique({ where: { clerkId: userId } })
        if (user) {
            currentUserImage = user.image
            const like = await prisma.like.findUnique({
                where: {
                    userId_projectId: {
                        userId: user.id,
                        projectId: project.id
                    }
                }
            })
            isLiked = !!like
        }
    }

    const comments = await prisma.comment.findMany({
        where: { projectId: project.id },
        include: {
            user: {
                select: {
                    name: true,
                    username: true,
                    image: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="min-h-screen bg-background pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        name: project.title,
                        description: project.description,
                        applicationCategory: 'DeveloperApplication',
                        operatingSystem: 'Web',
                        author: {
                            '@type': 'Person',
                            name: project.user.name || project.user.username,
                        },
                        image: project.images[0],
                        url: `https://project-twist.com/project/${project.slug}`,
                    })
                }}
            />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Navigation Breadcrumb (Optional but nice) */}
                <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-block font-mono">
                    &larr; Back to Feed
                </Link>

                {/* Header Section */}
                <header className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tight">{project.title}</h1>
                            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.seekingContributors && (
                                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 border-none">Help Wanted</Badge>
                                )}
                                {project.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <LikeButton
                                projectId={project.id}
                                initialLikesCount={project._count.likes}
                                initialIsLiked={isLiked}
                            />
                            {project.demoUrl && (
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="gap-2">
                                        <ExternalLinkIcon className="size-4" /> Live Demo
                                    </Button>
                                </a>
                            )}
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="lg" className="gap-2">
                                    <GithubIcon className="size-4" /> Code
                                </Button>
                            </a>
                        </div>
                        {isOwner && (
                            <div className="flex gap-2 mt-4 md:mt-0">
                                <Link href={`/project/${project.slug}/edit`}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <PencilIcon className="size-4" /> Edit
                                    </Button>
                                </Link>
                                <DeleteProjectDialog projectId={project.id} projectTitle={project.title} />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/50">
                        <div className="flex items-center gap-3">
                            <Avatar className="size-10 border">
                                <AvatarImage src={project.user.image || undefined} />
                                <AvatarFallback>{project.user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-medium text-foreground">{project.user.name || project.user.username}</p>
                                <p className="text-muted-foreground">@{project.user.username}</p>
                            </div>
                        </div>
                        <div className="h-4 w-px bg-border mx-2" />
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <CalendarIcon className="size-4" />
                            <span>Shipped on {project.createdAt.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                        </div>
                    </div>
                </header>

                {project.images[0] && (
                    <div className="mb-12 rounded-xl overflow-hidden border bg-muted/20">
                        <img src={project.images[0]} alt={project.title} className="w-full max-h-[500px] object-cover" />
                    </div>
                )}

                {/* Content Section */}
                <article className="prose prose-zinc dark:prose-invert max-w-none lg:prose-lg prose-headings:font-mono prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-lg">
                    <ReactMarkdown>
                        {project.content}
                    </ReactMarkdown>
                </article>

                <div className="mt-16 pt-16 border-t border-border/50 max-w-2xl">
                    <CommentSection
                        projectId={project.id}
                        comments={comments}
                        currentUserImage={currentUserImage}
                    />
                </div>
            </div>
        </div>
    )
}
