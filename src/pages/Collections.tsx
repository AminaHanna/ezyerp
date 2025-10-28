import { BottomNavigation } from "@/components/BottomNavigation";
import { Receipt } from "lucide-react";

const Collections = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">Collections</h1>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center px-4 py-20">
        <Receipt className="w-20 h-20 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Payment Collections</h2>
        <p className="text-center text-muted-foreground">
          View and manage all payment collections here
        </p>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Collections;

