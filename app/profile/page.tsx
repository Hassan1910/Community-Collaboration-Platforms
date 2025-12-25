import { auth, currentUser } from "@clerk/nextjs/server"
export const dynamic = "force-dynamic"
import { getUserProfile } from "@/lib/actions/user"
import { ProfileForm } from "@/components/profile-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
    const { userId } = await auth()

    if (!userId) {
        redirect("/")
    }

    // Get user from our DB or fall back to Clerk data for defaults
    const dbUser = await getUserProfile()
    const clerkUser = await currentUser()

    if (!clerkUser) return null;

    return (
        <div className="container max-w-2xl py-10">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        {/* Avatar can go here */}
                        <div>
                            <CardTitle>Your Profile</CardTitle>
                            <CardDescription>Manage your public developer profile.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ProfileForm user={dbUser} clerkUser={clerkUser} />
                </CardContent>
            </Card>
        </div>
    )
}

