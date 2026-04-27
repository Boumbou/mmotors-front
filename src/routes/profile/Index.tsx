import { useParams } from "react-router"

export default function Profile() {
    //fetch userid from url params
    const { id } = useParams()
    return (
        <div className="flex min-h-svh p-6">
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
            <div>
            <h1 className="font-medium">Profile</h1>
            <p>Visible uniquement pour vous utilisateur {id}</p>
            </div>
        </div>
        </div>
    )
}