import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Button
} from "@/components/ui";

export function DialogComp() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="glass" glowColor="lime">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription> Dialog Description </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}