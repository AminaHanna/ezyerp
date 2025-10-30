import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, HelpCircle, FileText, Bell, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const More = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: Package, label: "Stocks", description: "Manage inventory and stock levels", action: () => navigate("/stocks") },
    // { icon: Settings, label: "Settings", description: "App preferences and configuration" },
    // { icon: Bell, label: "Notifications", description: "Manage your notifications" },
    // { icon: FileText, label: "Reports", description: "View business reports" },
    // { icon: HelpCircle, label: "Help & Support", description: "Get help and support" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">More</h1>
          {user && (
            <p className="text-sm text-primary-foreground/80 mt-1">
              Logged in as: <span className="font-semibold">{user.username}</span>
            </p>
          )}
        </div>
      </header>

      <div className="px-4 py-6 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className="w-full bg-card border border-border rounded-lg p-4 text-left hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
            </button>
          );
        })}

        {/* Logout Button */}
        <div className="pt-4 border-t border-border mt-6">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default More;
