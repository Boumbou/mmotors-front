import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


export function DeleteDialog({header, description, OnDeleteApplication, children}: {header: string, description: string, OnDeleteApplication: () => void, children: React.ReactNode}) {
    return(
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-red-100">
                <DialogHeader>
                    {header}
                </DialogHeader>
                <DialogDescription >
                    {description}
                </DialogDescription>
                <DialogFooter >
                    <Button variant="destructive" className="text-sm" onClick={OnDeleteApplication}>
                        <HugeiconsIcon icon={Trash2} className="w-5 h-5 mr-2" />
                        Confirmer la suppression
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}