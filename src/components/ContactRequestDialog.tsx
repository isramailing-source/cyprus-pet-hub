import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, MessageCircle } from "lucide-react";

interface ContactRequestDialogProps {
  onSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const ContactRequestDialog = ({ onSubmit, isLoading }: ContactRequestDialogProps) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    await onSubmit(message);
    setMessage("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          <MessageCircle className="h-3 w-3 mr-1" />
          Request Contact Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Seller Contact Information</DialogTitle>
          <DialogDescription>
            Send a message to request the seller's contact details. This helps prevent spam and ensures legitimate inquiries.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Your message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Hi, I'm interested in this pet. Could you please share your contact information?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              A brief message helps sellers understand your interest and may improve response rates.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Requesting...
              </>
            ) : (
              "Request Contact Information"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};