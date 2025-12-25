"use client"

import { useActionState } from "react"
import { updateProject } from "@/lib/actions/project"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PencilIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface EditProjectFormProps {
    project: {
        id: string
        title: string
        description: string
        content: string
        githubUrl: string
        demoUrl: string | null
        images: string[]
        tags: string[]
        seekingContributors: boolean
    }
}

const initialState = {
    message: "",
    errors: {},
}

export function EditProjectForm({ project }: EditProjectFormProps) {
    const [state, action, isPending] = useActionState(updateProject, initialState)

    return (
        <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-2 font-mono">
                    <PencilIcon className="size-6 text-primary" /> Edit Project
                </CardTitle>
                <CardDescription>
                    Update your project details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={action} className="space-y-6">
                    <input type="hidden" name="projectId" value={project.id} />

                    <div className="space-y-2">
                        <Label htmlFor="title">Project Name</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g. SuperCal"
                            defaultValue={project.title}
                        />
                        {state?.errors?.title && (
                            <p className="text-sm text-destructive">{state.errors.title}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Tagline (Short Description)</Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="A magical calendar for developers"
                            defaultValue={project.description}
                        />
                        {state?.errors?.description && (
                            <p className="text-sm text-destructive">{state.errors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="imageFile">Cover Image (Upload New)</Label>
                            <Input
                                id="imageFile"
                                name="imageFile"
                                type="file"
                                accept="image/*"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Cover Image URL (Optional)</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                placeholder="https://example.com/banner.png"
                                defaultValue={project.images[0] || ""}
                            />
                            {state?.errors?.imageUrl && (
                                <p className="text-sm text-destructive">{state.errors.imageUrl}</p>
                            )}
                        </div>
                    </div>

                    {project.images[0] && (
                        <div className="rounded-lg overflow-hidden border bg-muted/20 max-w-sm">
                            <img src={project.images[0]} alt="Current cover" className="w-full h-32 object-cover" />
                            <p className="text-xs text-muted-foreground p-2">Current cover image</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="githubUrl">GitHub Repository</Label>
                            <Input
                                id="githubUrl"
                                name="githubUrl"
                                placeholder="https://github.com/username/repo"
                                defaultValue={project.githubUrl}
                            />
                            {state?.errors?.githubUrl && (
                                <p className="text-sm text-destructive">{state.errors.githubUrl}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="demoUrl">Live Demo URL (Optional)</Label>
                            <Input
                                id="demoUrl"
                                name="demoUrl"
                                placeholder="https://supercal.com"
                                defaultValue={project.demoUrl || ""}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                            id="tags"
                            name="tags"
                            placeholder="Next.js, TypeScript, AI"
                            defaultValue={project.tags.join(", ")}
                        />
                        {state?.errors?.tags && (
                            <p className="text-sm text-destructive">{state.errors.tags}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="seekingContributors"
                            name="seekingContributors"
                            value="true"
                            defaultChecked={project.seekingContributors}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="seekingContributors">
                                I am looking for contributors
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Signal to others that you want help building this.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">About the Project (Markdown)</Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="Tell us the story of how you built this..."
                            className="min-h-[200px] font-mono text-sm"
                            defaultValue={project.content}
                        />
                        {state?.errors?.content && (
                            <p className="text-sm text-destructive">{state.errors.content}</p>
                        )}
                    </div>

                    {state?.message && (
                        <p className="text-sm font-medium text-destructive">{state.message}</p>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
