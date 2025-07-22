import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Target, 
  Trophy, 
  TrendingUp, 
  Users, 
  ChevronRight,
  ChevronDown,
  Medal,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Scores", href: "/scores", icon: Target },
  { name: "Progress", href: "/progress", icon: TrendingUp },
];

const rifleLeaderboardData = [
  { rank: 1, name: "Sarah Johnson", score: 594, change: "+2" },
  { rank: 2, name: "Mike Chen", score: 591, change: "0" },
  { rank: 3, name: "Emma Wilson", score: 588, change: "-1" },
  { rank: 4, name: "James Brown", score: 585, change: "+1" },
  { rank: 5, name: "Lisa Davis", score: 582, change: "-2" },
];

const pistolLeaderboardData = [
  { rank: 1, name: "Alex Morgan", score: 567, change: "+3" },
  { rank: 2, name: "David Kim", score: 563, change: "+1" },
  { rank: 3, name: "Rachel Green", score: 559, change: "0" },
  { rank: 4, name: "Tom Wilson", score: 556, change: "-1" },
  { rank: 5, name: "Julia Roberts", score: 553, change: "+2" },
];

export const Sidebar = () => {
  const [isProgressExpanded, setIsProgressExpanded] = useState(true);
  const [isLeaderboardExpanded, setIsLeaderboardExpanded] = useState(true);
  const [showRifleLeaderboard, setShowRifleLeaderboard] = useState(true);

  return (
    <div className="w-72 bg-gradient-card border-r border-border flex flex-col h-full">
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-golden"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Monthly Progress Section */}
      <div className="p-4 border-t border-border">
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Monthly Progress
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProgressExpanded(!isProgressExpanded)}
              >
                {isProgressExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {isProgressExpanded && (
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Best Score</span>
                <span className="text-sm font-medium">594/600</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average</span>
                <span className="text-sm font-medium">578/600</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sessions</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-500" 
                  style={{ width: "72%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                72% of monthly goal
              </p>
            </CardContent>
          )}
        </Card>

        {/* Leaderboard Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Club Leaderboard
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLeaderboardExpanded(!isLeaderboardExpanded)}
              >
                {isLeaderboardExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
            {isLeaderboardExpanded && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <Label htmlFor="discipline-switch" className="text-xs">Pistol</Label>
                <Switch
                  id="discipline-switch"
                  checked={showRifleLeaderboard}
                  onCheckedChange={setShowRifleLeaderboard}
                />
                <Label htmlFor="discipline-switch" className="text-xs">Rifle</Label>
              </div>
            )}
          </CardHeader>
          {isLeaderboardExpanded && (
            <CardContent className="space-y-2">
              {(showRifleLeaderboard ? rifleLeaderboardData : pistolLeaderboardData).map((player, index) => (
                <div key={player.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    {index < 3 ? (
                      <Medal className={`h-4 w-4 ${
                        index === 0 ? "text-yellow-500" : 
                        index === 1 ? "text-gray-400" : 
                        "text-amber-600"
                      }`} />
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground w-4 text-center">
                        {player.rank}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.score}/600</p>
                  </div>
                  <Badge 
                    variant={player.change.startsWith("+") ? "default" : player.change.startsWith("-") ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {player.change}
                  </Badge>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View Full Leaderboard
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};