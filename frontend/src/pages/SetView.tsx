import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Target, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShotTarget } from "@/components/ui/shot-target";
import { InteractiveShotTarget } from "@/components/ui/interactive-shot-target";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fetchShotsBySet, RelayStats } from "@/lib/api";

const getShotColor = (score: number) => {
  if (score >= 10.0) return "text-success font-bold";
  if (score >= 9.8) return "text-warning font-semibold";
  if (score >= 9.5) return "text-foreground";
  return "text-destructive";
};

const getTargetType = (shots: { secondary_score: number }[]) => {
  if (shots.length === 0) return "rifle";
  return shots[0].secondary_score > 0 ? "pistol" : "rifle";
};

export default function SetView() {
  const { date, setId } = useParams();
  const navigate = useNavigate();
  const [relays, setRelays] = useState<RelayStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panelZooms, setPanelZooms] = useState<number[]>([1, 1, 1, 1, 1, 1]);
  const [hoveredShotIndex, setHoveredShotIndex] = useState<number | null>(null);
  const [selectedShots, setSelectedShots] = useState<Set<number>[]>([new Set(), new Set(), new Set(), new Set(), new Set(), new Set()]);
  const [viewMode, setViewMode] = useState<"sets" | "all">("sets");

  useEffect(() => {
    if (!date || !setId) return;
    setLoading(true);
    fetchShotsBySet(date, Number(setId))
      .then(setRelays)
      .catch((err) => setError(err.message || "Failed to load set data"))
      .finally(() => setLoading(false));
  }, [date, setId]);

  const handleZoomChange = (panelIndex: number, newZoom: number) => {
    const newZooms = [...panelZooms];
    newZooms[panelIndex] = newZoom;
    setPanelZooms(newZooms);
  };

  if (loading) return <div className="flex-1 p-6">Loading...</div>;
  if (error) return <div className="flex-1 p-6 text-red-500">{error}</div>;
  if (!relays.length) return <div className="flex-1 p-6">No data</div>;

  const relay = relays[0]; // Only one relay per set for now
  const targetType = getTargetType(relay.list_of_shots);
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
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs font-medium text-muted-foreground">View</span>
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "sets" | "all")}>
            <ToggleGroupItem value="sets" className="px-4 py-2">
              Sets
            </ToggleGroupItem>
            <ToggleGroupItem value="all" className="px-4 py-2">
              All
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Target className="h-6 w-6" />
            Set Stats
            <Badge variant="outline" className="ml-2 text-sm">
              {targetType === "pistol" ? "Pistol" : "Rifle"}
            </Badge>
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
          {viewMode === "sets" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {panels.map((panel, pIdx) => (
                <div key={pIdx} className="border-2 border-border rounded-lg p-4 bg-muted/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">Set {pIdx + 1}</h3>
                    <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                      {(() => {
                        const primarySum = panel.reduce((sum, shot) => sum + shot.primary_score, 0);
                        const secondarySum = panel.reduce((sum, shot) => sum + shot.secondary_score, 0);
                        const isPistol = panel.length > 0 && panel[0].secondary_score > 0;
                        
                        if (isPistol) {
                          return `${Math.round(primarySum)} (${secondarySum.toFixed(1)})`;
                        } else {
                          return primarySum.toFixed(1);
                        }
                      })()}
                    </Badge>
                  </div>
                  <ShotTarget 
                    shots={panel} 
                    zoom={panelZooms[pIdx]}
                    onZoomChange={(zoom) => handleZoomChange(pIdx, zoom)}
                    hoveredShotIndex={hoveredShotIndex !== null && hoveredShotIndex >= pIdx * 10 && hoveredShotIndex < (pIdx + 1) * 10 ? hoveredShotIndex - pIdx * 10 : undefined}
                    selectedShots={selectedShots[pIdx]}
                    onClearSelection={() => {
                      const newSelected = [...selectedShots];
                      newSelected[pIdx] = new Set();
                      setSelectedShots(newSelected);
                    }}
                  />
                  <div className="relative">
                    <div className="grid grid-cols-10 gap-1 mt-4">
                      {panel.map((shot, idx) => {
                        const globalShotIndex = pIdx * 10 + idx;
                        const isHovered = hoveredShotIndex === globalShotIndex;
                        return (
                          <div 
                            key={idx}
                            className={`aspect-square rounded border flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${getShotColor(shot.primary_score)} ${isHovered ? 'ring-2 ring-red-500 ring-offset-1' : ''} ${selectedShots[pIdx].has(idx) ? 'bg-muted' : ''}`}
                            onMouseEnter={() => setHoveredShotIndex(globalShotIndex)}
                            onMouseLeave={() => setHoveredShotIndex(null)}
                            onClick={() => {
                              const newSelected = [...selectedShots];
                              const panelSelected = new Set(newSelected[pIdx]);
                              if (panelSelected.has(idx)) {
                                panelSelected.delete(idx);
                              } else {
                                panelSelected.add(idx);
                              }
                              newSelected[pIdx] = panelSelected;
                              setSelectedShots(newSelected);
                            }}
                          >
                            {(() => {
                              const isPistol = panel.length > 0 && panel[0].secondary_score > 0;
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
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-border rounded-lg p-4 bg-muted/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">All Shots</h3>
                <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                  {(() => {
                    const primarySum = relay.list_of_shots.reduce((sum, shot) => sum + shot.primary_score, 0);
                    const secondarySum = relay.list_of_shots.reduce((sum, shot) => sum + shot.secondary_score, 0);
                    const isPistol = relay.list_of_shots.length > 0 && relay.list_of_shots[0].secondary_score > 0;
                    
                    if (isPistol) {
                      return `${Math.round(primarySum)} (${secondarySum.toFixed(1)})`;
                    } else {
                      return primarySum.toFixed(1);
                    }
                  })()}
                </Badge>
              </div>
              <InteractiveShotTarget
                shots={relay.list_of_shots}
                title="Shot List"
                showZoomControls={true}
                showClearButton={true}
                showShotList={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}