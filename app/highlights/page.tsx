import { getWeeklyHighlights, type HighlightedProject } from "@/lib/data/highlights"
import { ProjectCard } from "@/components/project-card"
import { TrophyIcon, FlameIcon, ZapIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HighlightsPage() {
    const highlights = await getWeeklyHighlights()

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/10 text-amber-500 mb-4">
                        <TrophyIcon className="size-8" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-mono tracking-tight bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                        Weekly Highlights
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        The most shipped, engaged, and celebrated projects of the week.
                    </p>
                </header>

                {highlights.length === 0 ? (
                    <div className="text-center py-20 border rounded-xl bg-muted/20 border-border/50 border-dashed">
                        <h3 className="text-2xl font-bold font-mono">No highlights yet</h3>
                        <p className="text-muted-foreground mt-2">
                            The week just started! Be the first to ship something epic.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {highlights.map((project: HighlightedProject, index: number) => (
                            <div key={project.id} className="relative group">
                                <div className="absolute -top-4 -left-4 z-20 size-12 rounded-full bg-background border shadow-xl flex items-center justify-center font-black text-xl font-mono">
                                    {index < 3 ? (
                                        <span className={
                                            index === 0 ? "text-amber-500" :
                                                index === 1 ? "text-zinc-400" :
                                                    "text-amber-700"
                                        }>#{index + 1}</span>
                                    ) : (
                                        <span className="text-muted-foreground">#{index + 1}</span>
                                    )}
                                </div>
                                {index === 0 && (
                                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                                )}
                                <div className="relative h-full">
                                    <ProjectCard project={project} />
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background border px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center gap-2 whitespace-nowrap z-10">
                                    <FlameIcon className="size-3 text-orange-500" />
                                    {project._count.likes} Likes
                                    <span className="text-muted-foreground/30">|</span>
                                    <ZapIcon className="size-3 text-blue-500" />
                                    {project._count.comments} Comments
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
