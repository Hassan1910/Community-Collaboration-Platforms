"use client"

import { useState, useTransition } from "react"
import { toggleLike } from "@/lib/actions/interaction"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react" // Assuming lucide-react is installed or available
import { cn } from "@/lib/utils"

interface LikeButtonProps {
    projectId: string
    initialLikesCount: number
    initialIsLiked: boolean
}

export function LikeButton({
    projectId,
    initialLikesCount,
    initialIsLiked,
}: LikeButtonProps) {
    const [likesCount, setLikesCount] = useState(initialLikesCount)
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        // Optimistic update
        const previousLikesCount = likesCount
        const previousIsLiked = isLiked

        setIsLiked(!isLiked)
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

        startTransition(async () => {
            const result = await toggleLike(projectId)
            if (!result.success) {
                // Revert on failure
                setIsLiked(previousIsLiked)
                setLikesCount(previousLikesCount)
                // Ideally toast error here
            }
        })
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={isPending}
            className={cn("flex items-center gap-2", isLiked && "text-red-500 hover:text-red-600")}
        >
            <Heart className={cn("size-4", isLiked && "fill-current")} />
            <span>{likesCount}</span>
        </Button>
    )
}
