import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Target, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchShotsBySet, RelayStats } from "@/lib/api";

const getShotColor = (score: number) => {
  if (score >= 10.0) return "text-success font-bold";
  if (score >= 9.8) return "text-warning font-semibold";
  if (score >= 9.5) return "text-foreground";
  return "text-destructive";
};

function TargetSVG({ shots }: { shots: { x_mm?: number; y_mm?: number; primary_score: number }[] }) {
  // SVG is 200x200, center at (100,100), scale x_mm/y_mm by 4 for display (as in the example)
  return (
    <svg width="100%" height="auto" viewBox="0 0 200 200" className="my-4 rounded-lg shadow-lg border border-border bg-background w-full h-auto max-w-full">
      {/* Colored rings */}
      <g strokeWidth={1}>
        <g fill="#f8fafc" stroke="#d1d5db">
          <circle r={91} cx={100} cy={100} />
          <circle r={81} cx={100} cy={100} />
          <circle r={71} cx={100} cy={100} />
        </g>
        <g fill="#1e293b" stroke="#f8fafc">
          <circle r={61} cx={100} cy={100} />
          <circle r={51} cx={100} cy={100} />
          <circle r={41} cx={100} cy={100} />
          <circle r={31} cx={100} cy={100} />
          <circle r={21} cx={100} cy={100} />
          <circle r={11} cx={100} cy={100} />
        </g>
        <circle r={1} cx={100} cy={100} fill="#f8fafc" stroke="#f8fafc" />
      </g>
      {/* Shots */}
      {shots.map((shot, i) => {
        // If x_mm/y_mm are not available, center the shot
        const dx = shot.x_mm !== undefined ? shot.x_mm * 4 : 0;
        const dy = shot.y_mm !== undefined ? -shot.y_mm * 4 : 0;
        return (
          <circle
            key={i}
            cx={100 + dx}
            cy={100 + dy}
            r={9}
            fill="#f43f5e" // rose-500
            stroke="#1e293b" // slate-800
            strokeWidth={1.5}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}

export default function SetView() {
  const { date, setId } = useParams();
  const navigate = useNavigate();
  const [relays, setRelays] = useState<RelayStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date || !setId) return;
    setLoading(true);
    fetchShotsBySet(date, Number(setId))
      .then(setRelays)
      .catch((err) => setError(err.message || "Failed to load set data"))
      .finally(() => setLoading(false));
  }, [date, setId]);

  if (loading) return <div className="flex-1 p-6">Loading...</div>;
  if (error) return <div className="flex-1 p-6 text-red-500">{error}</div>;
  if (!relays.length) return <div className="flex-1 p-6">No data</div>;

  const relay = relays[0]; // Only one relay per set for now
  // Split shots into 6 panels of 10
  const panels = Array.from({ length: 6 }, (_, i) => relay.list_of_shots.slice(i * 10, (i + 1) * 10));

  return (
    <div className="flex-1 p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/day/${date}`)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-lg">Back to Day</span>
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Set {setId}
            </h1>
            <p className="text-lg text-muted-foreground">Set details and shot breakdown</p>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Target className="h-6 w-6" />
            Set Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-8 mb-6 text-xl">
            <div>
              <span className="font-semibold">Shots:</span> {relay.total_shots}
            </div>
            <div>
              <span className="font-semibold">Total Score:</span> {relay.total_score.toFixed(1)}
            </div>
            <div>
              <span className="font-semibold">Best:</span> {relay.best_score.toFixed(1)}
            </div>
            <div>
              <span className="font-semibold">Avg:</span> {relay.average_score.toFixed(1)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {panels.map((panel, pIdx) => (
              <div key={pIdx} className="border-2 border-border rounded-lg p-4 bg-muted/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-foreground">Set {pIdx + 1}</h3>
                  <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                    {panel.reduce((sum, shot) => sum + shot.primary_score, 0).toFixed(1)}
                  </Badge>
                </div>
                <TargetSVG shots={panel} />
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {panel.map((shot, idx) => (
                    <div 
                      key={idx}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-lg font-medium transition-all duration-200 hover:scale-105 ${getShotColor(shot.primary_score)}`}
                    >
                      {shot.primary_score.toFixed(1)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}