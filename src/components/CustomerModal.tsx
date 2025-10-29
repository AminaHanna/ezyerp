import { MapPin, FileText, Clock, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  customerId: string;
}

const menuItems = [
  { icon: MapPin, label: "Location", path: "/location" },
  { icon: FileText, label: "Customer Statement", path: "/statement" },
  { icon: Clock, label: "Credit Age Report", path: "/credit-aging" },
  { icon: Wallet, label: "Collection Entry", path: "/collection-entry" },
];

export const CustomerModal = ({
  open,
  onOpenChange,
  customerName,
  customerId,
}: CustomerModalProps) => {
  const navigate = useNavigate();

  const handleMenuClick = (item: typeof menuItems[0]) => {
    onOpenChange(false);

    // Navigate to the appropriate page
    if (item.path === "/statement" || item.path === "/credit-aging" || item.path === "/collection-entry") {
      // Pass customer name via navigation state
      navigate(`${item.path}/${customerId}`, { state: { customerName } });
    } else {
      navigate(item.path);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-center text-xl">{customerName}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleMenuClick(item)}
                className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-base font-medium text-foreground">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
