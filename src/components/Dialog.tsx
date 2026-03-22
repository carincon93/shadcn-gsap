import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Button
} from "@/components/ui";

export function DialogComp({ className }: { className?: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="glass" glowColor="lime">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription> Dialog Description </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}