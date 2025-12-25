"use client"

import { useActionState } from "react"
import { createProject } from "@/lib/actions/project"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RocketIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const initialState = {
    message: "",
    errors: {},
}

export function ShipForm() {
    const [state, action, isPending] = useActionState(createProject, initialState)

    return (
        <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-2 font-mono">
                    <RocketIcon className="size-6 text-primary" /> Ship Project
                </CardTitle>
                <CardDescription>
                    Share your latest creation with the developer community.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={action} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Name</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g. SuperCal"
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
                        />
                        {state?.errors?.description && (
                            <p className="text-sm text-destructive">{state.errors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="imageFile">Cover Image (Upload)</Label>
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
                            />
                            {state?.errors?.imageUrl && (
                                <p className="text-sm text-destructive">{state.errors.imageUrl}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="githubUrl">GitHub Repository</Label>
                            <Input
                                id="githubUrl"
                                name="githubUrl"
                                placeholder="https://github.com/username/repo"
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
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                            id="tags"
                            name="tags"
                            placeholder="Next.js, TypeScript, AI"
                        />
                        {state?.errors?.tags && (
                            <p className="text-sm text-destructive">{state.errors.tags}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="seekingContributors" name="seekingContributors" value="true" />
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
                        />
                        {state?.errors?.content && (
                            <p className="text-sm text-destructive">{state.errors.content}</p>
                        )}
                    </div>

                    {state?.message && (
                        <p className="text-sm font-medium text-destructive">{state.message}</p>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                        {isPending ? "Shipping..." : "Ship It 🚀"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
