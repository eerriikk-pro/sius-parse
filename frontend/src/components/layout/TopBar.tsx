import { User as UserIcon, LogOut, Settings, Target, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  user?: {
    username: string;
    email: string;
    full_name: string;
    athlete_id?: number;
    disabled?: boolean;
    is_admin?: boolean;
  };
  onLogout?: () => void;
}

export const TopBar = ({ user, onLogout }: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-gradient-card border-b border-border flex items-center justify-between px-6 shadow-card">
      <div className="flex items-center gap-3">
        <Target className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">RRGC Shooting Scores</h1>
          <p className="text-sm text-muted-foreground">10m Air Rifle & Pistol</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user.full_name || user.username}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative h-10 w-10 rounded-full">
                  <UserIcon className="h-6 w-6 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.full_name || user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}> 
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}> 
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                {user.is_admin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}> 
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}> 
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button variant="outline">
            <UserIcon className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};