
import { Clock, Folder01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"


export default function AlreadyApplied() {
    



    return (
        <div className=" lg:basis-1/2 basis-full flex-col gap-10 p-8 align-stretch rounded-lg bg-white ">
            <div className="flex flex-row justify-between mb-10">
                <h2 className="md:text-2xl  text-lg font-medium">Vous avez déjà déposé un dossier</h2>
                <HugeiconsIcon icon={Folder01Icon} className="w-8 h-8 text-slate-500" />
            </div>
            
            <p className="text-slate-500 bg-blue-100 p-4 rounded-lg mb-4"> 
                <HugeiconsIcon icon={Clock} className="w-6 h-6 inline-block text-blue-500 mr-2 mb-3" />
                Vous avez déjà soumis un dossier pour ce véhicule. <br />
                Encore un peu de patience, nous examinons votre dossier et reprendrons contact avec vous dès que possible.

            </p>
        </div>
    )
}