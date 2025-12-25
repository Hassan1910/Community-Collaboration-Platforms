import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProjectCardProps {
    project: {
        id: string
        title: string
        slug: string
        description: string
        images: string[]
        tags: string[]
        seekingContributors: boolean
        user: {
            name: string | null
            image: string | null
            username: string | null
        }
    }
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/project/${project.slug}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer flex flex-col overflow-hidden border-border/60">
                {project.images[0] ? (
                    <div className="aspect-video w-full overflow-hidden bg-muted relative group">
                        <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                ) : (
                    <div className="aspect-video w-full bg-muted/30 flex items-center justify-center text-muted-foreground/20 font-mono text-4xl">
                        {project.title.slice(0, 1).toUpperCase()}
                    </div>
                )}
                {project.seekingContributors && (
                    <Badge className="absolute top-2 right-2 z-10 bg-amber-500/90 hover:bg-amber-500 text-white border-none shadow-sm backdrop-blur-[2px]">
                        Help Wanted
                    </Badge>
                )}
                <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-lg">{project.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">{tag}</Badge>
                        ))}
                        {project.tags.length > 3 && (
                            <span className="text-[10px] text-muted-foreground self-center">+{project.tags.length - 3}</span>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{project.description}</p>
                </CardContent>
                <CardFooter className="flex items-center gap-2 text-sm text-muted-foreground border-t bg-muted/5 py-3">
                    <Avatar className="size-6 border">
                        <AvatarImage src={project.user.image || undefined} />
                        <AvatarFallback className="text-xs">{project.user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-[150px]">{project.user.username || "Anonymous"}</span>
                </CardFooter>
            </Card>
        </Link>
    )
}
