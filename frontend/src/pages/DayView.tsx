import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Target, Plus, Eye, Calendar, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InteractiveShotTarget } from "@/components/ui/interactive-shot-target";
import { fetchShotsByDay, DayStats } from "@/lib/api";

const getScoreColor = (score: number) => {
  if (score >= 590) return "text-success";
  if (score >= 580) return "text-warning";
  return "text-destructive";
};

const getTargetType = (shots: { secondary_score: number }[]) => {
  if (shots.length === 0) return "rifle";
  return shots[0].secondary_score > 0 ? "pistol" : "rifle";
};

export default function DayView() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [dayStats, setDayStats] = useState<DayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSighters, setShowSighters] = useState(false);
  const [sighterZoom, setSighterZoom] = useState(1);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    fetchShotsByDay(date)
      .then(setDayStats)
      .catch((err) => setError(err.message || "Failed to load day data"))
      .finally(() => setLoading(false));
  }, [date]);

  const handleSetClick = (setId: number) => {
    navigate(`/set/${date}/${setId}`);
  };

  if (loading) return <div className="flex-1 p-6">Loading...</div>;
  if (error) return <div className="flex-1 p-6 text-red-500">{error}</div>;
  if (!dayStats) return <div className="flex-1 p-6">No data</div>;

  return (
    <div className="flex-1 p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-lg">Back to Dashboard</span>
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              {new Date(dayStats.day).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h1>
            <p className="text-lg text-muted-foreground">Session details and performance</p>
          </div>
        </div>
        <Button className="bg-gradient-primary hover:shadow-golden transition-all duration-300 text-lg px-6 py-3">
          <Plus className="h-5 w-5 mr-2" />
          Add Set
        </Button>
      </div>

      {/* Day Summary */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Day Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-8 mb-6 text-xl">
            <div>
              <span className="font-semibold">Total Shots:</span> {dayStats.total_shots}
            </div>
            <div>
              <span className="font-semibold">Sighters:</span> {dayStats.total_sighters}
            </div>
            <div>
              <span className="font-semibold">Best Score:</span> <span className={getScoreColor(dayStats.best_score) + " font-bold text-2xl"}>{dayStats.best_score}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dayStats.list_of_relays.map((relay, idx) => {
              const targetType = getTargetType(relay.list_of_shots);
              return (
                <Card key={idx} className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Target className="h-6 w-6" />
                      Set {idx + 1}
                      <Badge variant="outline" className="text-xs">
                        {targetType === "pistol" ? "Pistol" : "Rifle"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 mb-4 text-lg">
                      <span className="font-semibold">Shots:</span> {relay.total_shots}
                      <span className="font-semibold">Total Score:</span> {relay.total_score.toFixed(1)}
                      <span className="font-semibold">Best:</span> {relay.best_score.toFixed(1)}
                      <span className="font-semibold">Avg:</span> {relay.average_score.toFixed(1)}
                    </div>
                    <Button size="lg" className="text-lg px-6 py-2" onClick={() => handleSetClick(idx + 1)}>
                      View Set
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {dayStats.list_of_sighters.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-xl">Sighters</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSighters(!showSighters)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {showSighters ? "Hide Target" : "Render Target"}
                </Button>
              </div>
              {!showSighters && (
                <div className="flex flex-wrap gap-3">
                  {dayStats.list_of_sighters.map((shot, idx) => (
                    <Badge key={idx} variant="secondary" className="text-lg px-4 py-2">
                      {(() => {
                        const isPistol = dayStats.list_of_sighters.length > 0 && dayStats.list_of_sighters[0].secondary_score > 0;
                        if (isPistol) {
                          return (
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-bold">{Math.round(shot.primary_score)}</span>
                              <span className="text-xs text-muted-foreground">{shot.secondary_score.toFixed(1)}</span>
                            </div>
                          );
                        } else {
                          return shot.primary_score.toFixed(1);
                        }
                      })()}
                    </Badge>
                  ))}
                </div>
              )}
              {showSighters && (
                <div className="relative">
                  <div className="flex justify-end mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSighters(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <InteractiveShotTarget
                      shots={dayStats.list_of_sighters}
                      zoom={sighterZoom}
                      onZoomChange={setSighterZoom}
                      showZoomControls={true}
                      showClearButton={true}
                      showShotList={true}
                      title="Sighters"
                      className="border-2 border-border rounded-lg p-4 bg-muted/10"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}