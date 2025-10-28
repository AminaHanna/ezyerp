import { BottomNavigation } from "@/components/BottomNavigation";
import { useUserSession } from "@/hooks/useUserSession";
import { Users, TrendingUp, Receipt, Package } from "lucide-react";
import { Card } from "@/components/ui/card";

const Home = () => {
  const { user } = useUserSession();

  const stats = [
    { icon: Users, label: "Total Customers", value: "156", color: "text-primary" },
    { icon: TrendingUp, label: "Total Revenue", value: "₹2.5M", color: "text-success" },
    { icon: Receipt, label: "Pending Receipts", value: "23", color: "text-destructive" },
    { icon: Package, label: "Stock Items", value: "450", color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm text-primary-foreground/80">
            Welcome back, <span className="font-semibold">{user?.username}</span>!
          </p>
          {user && (
            <p className="text-xs text-primary-foreground/70 mt-2">
              Office: {user.officecode} | ID: {user.officeid}
            </p>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <button className="w-full bg-card border border-border rounded-lg p-4 text-left hover:shadow-md transition-shadow">
            <p className="font-semibold text-foreground">Add New Customer</p>
            <p className="text-xs text-muted-foreground mt-1">Create a new customer profile</p>
          </button>
          <button className="w-full bg-card border border-border rounded-lg p-4 text-left hover:shadow-md transition-shadow">
            <p className="font-semibold text-foreground">Create Invoice</p>
            <p className="text-xs text-muted-foreground mt-1">Generate a new sales invoice</p>
          </button>
          <button className="w-full bg-card border border-border rounded-lg p-4 text-left hover:shadow-md transition-shadow">
            <p className="font-semibold text-foreground">Record Payment</p>
            <p className="text-xs text-muted-foreground mt-1">Log a customer payment</p>
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Home;
