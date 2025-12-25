"use client"

import { useActionState } from "react"
import { updateUserProfile } from "@/lib/actions/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState = {
    success: false,
    error: "",
}

export function ProfileForm({
    user,
    clerkUser,
}: {
    user: any
    clerkUser: any
}) {
    // Adapter to match signature if needed, or just use as is. 
    // updateUserProfile signature: (formData: FormData) => Promise<{success...}>
    // useActionState expects: (prevState: any, formData: FormData) => Promise<any>
    // So I need to wrap it.
    const [state, action, isPending] = useActionState(async (prev: any, formData: FormData) => {
        const res = await updateUserProfile(formData)
        return res // { success: boolean, error?: string }
    }, initialState)

    return (
        <form action={action} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    name="username"
                    defaultValue={user?.username || clerkUser?.username || ""}
                    placeholder="johndoe"
                />
                <p className="text-xs text-muted-foreground">
                    Unique handle for your profile URL.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={user?.name || clerkUser?.fullName || ""}
                    placeholder="John Doe"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={user?.bio || ""}
                    placeholder="I build things with Next.js..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="skills">Skills (Comma separated)</Label>
                <Input
                    id="skills"
                    name="skills"
                    defaultValue={user?.skills.join(", ") || ""}
                    placeholder="React, TypeScript, Node.js"
                />
            </div>

            {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
            )}
            {state?.success && (
                <p className="text-sm text-green-600">Profile updated successfully!</p>
            )}

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    )
}
