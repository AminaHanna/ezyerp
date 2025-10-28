import { useState } from "react";
import { Phone, MessageCircle, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneNumberDialog } from "@/components/PhoneNumberDialog";
import { PhoneNumber, parsePhoneNumbers, initiateCall } from "@/utils/phoneUtils";

interface CustomerCardProps {
  name: string;
  day: string;
  balance: number;
  onClick?: () => void;
  mobileno?: string | null;
  whatsappno?: string | null;
}

export const CustomerCard = ({
  name,
  day,
  balance,
  onClick,
  mobileno,
  whatsappno,
}: CustomerCardProps) => {
  const isPositive = balance > 0;
  const isZero = balance === 0;
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);

  // Parse available phone numbers
  const phoneNumbers = parsePhoneNumbers(mobileno, whatsappno);

  // Handle call button click
  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    if (phoneNumbers.length === 0) {
      setShowPhoneDialog(true);
    } else {
      setShowPhoneDialog(true);
    }
  };

  // Handle phone number selection from dialog
  const handlePhoneSelected = (phoneNumber: PhoneNumber) => {
    initiateCall(phoneNumber.number);
  };

  return (
    <>
      <div
        className="bg-card rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground uppercase">{day}</p>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={handleCallClick}
              className={cn(
                "transition-colors",
                phoneNumbers.length > 0
                  ? "text-primary hover:text-primary-glow"
                  : "text-muted-foreground hover:text-muted-foreground/70 cursor-not-allowed"
              )}
              title={phoneNumbers.length > 0 ? "Call customer" : "No phone numbers available"}
            >
              <Phone className="w-5 h-5" />
            </button>
            <button className="text-primary hover:text-primary-glow transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-end">
              <span
                className={cn(
                  "text-lg font-bold",
                  isPositive && "text-success",
                  !isPositive && !isZero && "text-destructive",
                  isZero && "text-muted-foreground"
                )}
              >
                ₹ {balance}
              </span>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Phone Number Selection Dialog */}
      <PhoneNumberDialog
        open={showPhoneDialog}
        onOpenChange={setShowPhoneDialog}
        phoneNumbers={phoneNumbers}
        customerName={name}
        onCallSelected={handlePhoneSelected}
      />
    </>
  );
};
