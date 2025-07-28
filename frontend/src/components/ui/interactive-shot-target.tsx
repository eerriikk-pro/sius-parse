import { useState } from "react";
import { ShotTarget, Shot } from "./shot-target";
import { Badge } from "./badge";

interface InteractiveShotTargetProps {
  shots: Shot[];
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  showZoomControls?: boolean;
  showClearButton?: boolean;
  showShotList?: boolean;
  className?: string;
  title?: string;
}

export function InteractiveShotTarget({
  shots,
  zoom = 1,
  onZoomChange,
  showZoomControls = true,
  showClearButton = true,
  showShotList = true,
  className = "",
  title
}: InteractiveShotTargetProps) {
  const [hoveredShotIndex, setHoveredShotIndex] = useState<number | null>(null);
  const [hoveredSetIndex, setHoveredSetIndex] = useState<number | null>(null);
  const [selectedShots, setSelectedShots] = useState<Set<number>>(new Set());

  const isPistolTarget = shots.length > 0 && shots[0].secondary_score > 0;

  const getShotColor = (score: number) => {
    if (score >= 10.0) return "text-success font-bold";
    if (score >= 9.8) return "text-warning font-semibold";
    if (score >= 9.5) return "text-foreground";
    return "text-destructive";
  };

  const handleClearSelection = () => {
    setSelectedShots(new Set());
  };

  const handleShotClick = (index: number) => {
    const newSelected = new Set(selectedShots);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedShots(newSelected);
  };

  const handleSetClick = (setNumber: number) => {
    const startIndex = (setNumber - 1) * 10;
    const endIndex = Math.min(startIndex + 10, shots.length);
    const setShots = new Set(Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i));
    
    // Check if all shots in the set are already selected
    const allSelected = Array.from(setShots).every(index => selectedShots.has(index));
    
    const newSelected = new Set(selectedShots);
    if (allSelected) {
      // If all are selected, deselect all
      setShots.forEach(index => newSelected.delete(index));
    } else {
      // If not all are selected, select all
      setShots.forEach(index => newSelected.add(index));
    }
    setSelectedShots(newSelected);
  };

  return (
    <div className={`flex gap-4 h-[80vh] ${className}`}>
      {/* Shot list column */}
      {showShotList && (
        <div className="flex flex-col gap-2 min-w-[200px] max-w-[250px]">
          {title && (
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">
              {title}
            </h4>
          )}
          <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/40">
            <div className="flex flex-col gap-1">
              {shots.map((shot, idx) => {
                const isHovered = hoveredShotIndex === idx;
                const isSetHovered = hoveredSetIndex === Math.floor(idx / 10) + 1;
                const isSelected = selectedShots.has(idx);
                const setNumber = Math.floor(idx / 10) + 1;
                const isFirstInSet = idx % 10 === 0;
                
                return (
                  <div key={idx}>
                    {isFirstInSet && (() => {
                      const startIndex = (setNumber - 1) * 10;
                      const endIndex = Math.min(startIndex + 10, shots.length);
                      const setShots = shots.slice(startIndex, endIndex);
                      const primarySum = setShots.reduce((sum, shot) => sum + shot.primary_score, 0);
                      const secondarySum = setShots.reduce((sum, shot) => sum + shot.secondary_score, 0);
                      const isPistol = shots.length > 0 && shots[0].secondary_score > 0;
                      
                      return (
                        <div 
                          className="text-xs font-semibold text-muted-foreground py-1 px-2 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => handleSetClick(setNumber)}
                          onMouseEnter={() => setHoveredSetIndex(setNumber)}
                          onMouseLeave={() => setHoveredSetIndex(null)}
                        >
                          Set {setNumber} - {isPistol ? `${Math.round(primarySum)} (${secondarySum.toFixed(1)})` : primarySum.toFixed(1)}
                        </div>
                      );
                    })()}
                    <div
                      className={`h-8 rounded border flex items-center justify-between px-2 text-xs font-medium transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
                        getShotColor(shot.primary_score)
                      } ${
                        isSelected ? 'bg-muted' : ''
                      } ${
                        isSetHovered ? 'bg-muted/30' : ''
                      }`}
                      onMouseEnter={() => setHoveredShotIndex(idx)}
                      onMouseLeave={() => setHoveredShotIndex(null)}
                      onClick={() => handleShotClick(idx)}
                    >
                      <span className="font-bold">
                        {isPistolTarget ? Math.round(shot.primary_score) : shot.primary_score.toFixed(1)}
                      </span>
                      {isPistolTarget && (
                        <span className="text-muted-foreground">
                          {shot.secondary_score.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {selectedShots.size > 0 && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {selectedShots.size} selected
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Target rendering */}
      <div className="flex-1 h-full flex items-center justify-center">
        <ShotTarget
          shots={shots}
          zoom={zoom}
          onZoomChange={onZoomChange}
          hoveredShotIndex={hoveredShotIndex}
          hoveredSetIndex={hoveredSetIndex}
          selectedShots={selectedShots}
          onClearSelection={handleClearSelection}
          showZoomControls={showZoomControls}
          showClearButton={showClearButton}
          className="h-full"
        />
      </div>
    </div>
  );
} 