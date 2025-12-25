"use client"

import { useActionState } from "react"
import { postComment } from "@/lib/actions/interaction"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface Comment {
    id: string
    content: string
    createdAt: Date
    user: {
        name: string | null
        username: string | null
        image: string | null
    }
}

interface CommentSectionProps {
    projectId: string
    comments: Comment[]
    currentUserImage?: string | null
}

const initialState = {
    message: "",
    success: false,
}

export function CommentSection({ projectId, comments, currentUserImage }: CommentSectionProps) {
    const [state, formAction, isPending] = useActionState(postComment, initialState)

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold font-mono">Run Log ({comments.length})</h3>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <Avatar className="size-10 border">
                            <AvatarImage src={comment.user.image || undefined} />
                            <AvatarFallback>{comment.user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{comment.user.name || comment.user.username}</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <p className="text-muted-foreground text-sm italic">No logs yet. Be the first to advise.</p>
                )}
            </div>

            <div className="border-t pt-6">
                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="projectId" value={projectId} />
                    <div className="flex gap-4">
                        <Avatar className="size-10 border shrink-0">
                            <AvatarImage src={currentUserImage || undefined} />
                            <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                            <Textarea
                                name="content"
                                placeholder="Add a comment or feedback..."
                                className="bg-background min-h-[100px]"
                                required
                            />
                            {state.message && !state.success && (
                                <p className="text-red-500 text-sm">{state.message}</p>
                            )}
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                                Post Comment
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
