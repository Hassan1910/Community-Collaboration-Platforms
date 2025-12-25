"use client"

import { useState } from "react"
import { deleteProject } from "@/lib/actions/project"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TrashIcon, Loader2Icon } from "lucide-react"

interface DeleteProjectDialogProps {
    projectId: string
    projectTitle: string
}

export function DeleteProjectDialog({ projectId, projectTitle }: DeleteProjectDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        setIsDeleting(true)
        setError(null)

        try {
            const result = await deleteProject(projectId)
            if (result && !result.success) {
                setError(result.message)
                setIsDeleting(false)
            }
            // If successful, the redirect happens server-side
        } catch (err) {
            setError("An unexpected error occurred")
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                    <TrashIcon className="size-4" /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <strong>&quot;{projectTitle}&quot;</strong>?
                        This action cannot be undone. All comments and likes will also be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2Icon className="size-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Project"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
