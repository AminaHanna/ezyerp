import { Phone, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhoneNumber, getPhoneNumberDisplay } from "@/utils/phoneUtils";

interface PhoneNumberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumbers: PhoneNumber[];
  customerName: string;
  onCallSelected: (phoneNumber: PhoneNumber) => void;
}

export const PhoneNumberDialog = ({
  open,
  onOpenChange,
  phoneNumbers,
  customerName,
  onCallSelected,
}: PhoneNumberDialogProps) => {
  if (phoneNumbers.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              No Phone Numbers
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No phone numbers are available for <strong>{customerName}</strong>.
            </p>
            <p className="text-xs text-muted-foreground">
              Please add phone numbers to this customer's profile to enable calling.
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (phoneNumbers.length === 1) {
    // Auto-select single phone number
    const phoneNumber = phoneNumbers[0];
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Call {customerName}
            </DialogTitle>
            <DialogDescription>
              Initiating call to {phoneNumber.type}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground mb-1">
                {phoneNumber.label}
              </p>
              <p className="text-lg font-semibold text-primary">
                {phoneNumber.number}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  onCallSelected(phoneNumber);
                  onOpenChange(false);
                }}
                className="flex-1 gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Multiple phone numbers - show selection
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Call {customerName}
          </DialogTitle>
          <DialogDescription>
            Select a phone number to call
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {phoneNumbers.map((phoneNumber, index) => (
            <button
              key={index}
              onClick={() => {
                onCallSelected(phoneNumber);
                onOpenChange(false);
              }}
              className="w-full p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {phoneNumber.label}
                  </p>
                  <p className="text-base font-semibold text-primary">
                    {phoneNumber.number}
                  </p>
                </div>
                <div className="ml-4">
                  {phoneNumber.type === "whatsapp" ? (
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Phone className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </button>
          ))}
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

