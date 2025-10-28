import { User, MapPin, Building2, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AuthUser } from "@/types/api";

interface UserInfoCardProps {
  user: AuthUser | null;
  employeeName?: string;
  officeName?: string;
  location?: string;
  userType?: string;
}

export const UserInfoCard = ({
  user,
  employeeName,
  officeName,
  location,
  userType,
}: UserInfoCardProps) => {
  if (!user) {
    return null;
  }

  // Use employee_name from API response, fallback to username, then to prop
  const displayName = user.employee_name || employeeName || user.username || "User";
  // Use officename from API response, fallback to prop, then to officecode
  const displayOffice = user.officename || officeName || user.officecode || "N/A";
  // Use location from API response, fallback to prop
  const displayLocation = user.location || location || "N/A";
  const displayUserType = userType || "User";

  return (
    <Card className="w-full p-3 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border-primary/30 shadow-sm">
      {/* Compact Header */}
      <div className="flex items-center gap-3 mb-3">
        {/* User Avatar - Smaller */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Name and User Type */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-foreground truncate">
              {displayName}
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
              <Shield className="w-3 h-3" />
              {displayUserType}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">User ID: {user.userid || "N/A"}</p>
        </div>
      </div>

      {/* Compact Grid - 2x2 layout */}
      <div className="grid grid-cols-2 gap-2">
        {/* Office */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/50 border border-primary/10">
          <Building2 className="w-4 h-4 text-primary/60 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Office</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {displayOffice}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/50 border border-primary/10">
          <MapPin className="w-4 h-4 text-primary/60 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {displayLocation}
            </p>
          </div>
        </div>

        {/* Office ID */}
        {/* <div className="flex items-center gap-2 p-2 rounded-lg bg-white/50 border border-primary/10">
          <Building2 className="w-4 h-4 text-primary/60 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Office ID</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {officeName || "N/A"}
            </p>
          </div>
        </div> */}
      </div>
    </Card>
  );
};