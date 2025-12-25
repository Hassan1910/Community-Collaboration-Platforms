import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ShipForm } from "./ship-form"

export default async function ShipPage() {
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in")
    }

    return (
        <div className="container max-w-2xl mx-auto py-12 px-4">
            <ShipForm />
        </div>
    )
}
