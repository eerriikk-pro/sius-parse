import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Target, TrendingUp, Eye, Plus, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchRecentScores, fetchStats, DayStats, RelayStats, Stats } from "@/lib/api";

const PERIOD_OPTIONS = [
  { label: "Past Week", value: "7days" },
  { label: "2 Weeks", value: "14days" },
  { label: "30 Days", value: "30days" },
  { label: "Custom", value: "custom" },
];

const getScoreColor = (score: number) => {
  if (score >= 590) return "text-success";
  if (score >= 580) return "text-warning";
  return "text-destructive";
};

const getScoreBadge = (score: number) => {
  if (score >= 590) return "default";
  if (score >= 580) return "secondary";
  return "destructive";
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [recentScores, setRecentScores] = useState<DayStats[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customDays, setCustomDays] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    let period = selectedPeriod;
    if (selectedPeriod === "custom") period = `${customDays}days`;
    setLoading(true);
    Promise.all([
      fetchRecentScores(Number(period.replace("days", ""))),
      fetchStats(period)
    ])
      .then(([scores, stats]) => {
        setRecentScores(scores);
        setStats(stats);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, [selectedPeriod, customDays]);

  const handleDayClick = (date: string) => {
    navigate(`/day/${date}`);
  };

  const handleSetClick = (date: string, setId: number) => {
    navigate(`/set/${date}/${setId}`);
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track your shooting progress and scores</p>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowCustom((v) => !v)}
          >
            {PERIOD_OPTIONS.find(opt => opt.value === selectedPeriod)?.label || `${customDays} Days`}
            <ChevronDown className="h-4 w-4" />
          </Button>
          {(showCustom || selectedPeriod === "custom") && (
            <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded shadow-lg z-10">
              {PERIOD_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-muted ${selectedPeriod === opt.value ? 'bg-muted' : ''}`}
                  onClick={() => {
                    setSelectedPeriod(opt.value);
                    if (opt.value !== "custom") setShowCustom(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
              {selectedPeriod === "custom" && (
                <div className="px-4 py-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={customDays}
                    onChange={e => setCustomDays(Number(e.target.value))}
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                  <span>days</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats ? stats.best_score : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.best_score_delta >= 0 ? "+" : ""}${stats.best_score_delta} from last week` : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats ? stats.average_score.toFixed(1) : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.average_score_delta >= 0 ? "+" : ""}${stats.average_score_delta.toFixed(1)} from last week` : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scores Timeline */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Scores</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {recentScores.map((day) => (
                  <div 
                    key={day.day}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleDayClick(day.day)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-foreground">
                          {new Date(day.day).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {day.list_of_relays.length} sets
                        </Badge>
                        {day.total_sighters > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {day.total_sighters} sighters
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${getScoreColor(day.best_score)}`}>
                          {day.best_score}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {day.list_of_relays.map((relay, idx) => (
                        <div 
                          key={idx}
                          className="border border-border rounded-md p-3 hover:bg-muted/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetClick(day.day, 1); // Only one relay/set per day for now
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                Set 1
                              </span>
                              <Badge 
                                variant="secondary"
                                className="text-xs"
                              >
                                relay
                              </Badge>
                            </div>
                            <Badge variant={getScoreBadge(relay.total_score)} className="text-sm font-bold">
                              {relay.total_score}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {relay.total_shots} shots
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}