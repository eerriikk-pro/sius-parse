import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./button";

export interface Shot {
  x_mm?: number;
  y_mm?: number;
  primary_score: number;
  secondary_score: number;
}

interface ShotTargetProps {
  shots: Shot[];
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  hoveredShotIndex?: number;
  hoveredSetIndex?: number;
  selectedShots?: Set<number>;
  onClearSelection?: () => void;
  showZoomControls?: boolean;
  showClearButton?: boolean;
  className?: string;
}

export function ShotTarget({ 
  shots, 
  zoom = 1, 
  onZoomChange, 
  hoveredShotIndex, 
  hoveredSetIndex,
  selectedShots, 
  onClearSelection,
  showZoomControls = true,
  showClearButton = true,
  className = ""
}: ShotTargetProps) {
  // Determine if this is a pistol target based on the first shot's secondary_score
  const isPistolTarget = shots.length > 0 && shots[0].secondary_score > 0;
  
  // Shot size should be proportional to target type
  const shotRadius = isPistolTarget ? 18 : 8;
  
  // For pistol targets, we need to zoom out the entire target since rings are much larger
  const targetScale = isPistolTarget ? 0.3 : 1; // Scale pistol target down to 30%
  const finalZoom = zoom * targetScale;
  
  // Calculate proper centering translation
  const translateX = (200 - 200 * finalZoom) / 2;
  const translateY = (200 - 200 * finalZoom) / 2;
  
  return (
    <div className={`relative ${className}`}>
      {/* Zoom controls positioned at top-right of each target */}
      {showZoomControls && onZoomChange && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-background/80 backdrop-blur rounded-md p-1 border border-border">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[2rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
            disabled={zoom >= 3}
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {/* Clear selection button positioned at bottom-left of target */}
      {showClearButton && selectedShots && selectedShots.size > 0 && onClearSelection && (
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-2 left-2 z-10 bg-background/90 backdrop-blur text-xs px-2 py-1 h-6"
          onClick={onClearSelection}
        >
          Clear
        </Button>
      )}
      
      <svg width="100%" height="100%" viewBox="0 0 200 200" className="rounded-lg shadow-lg border border-border bg-background w-full h-full max-w-full">
        {/* Apply zoom transform with proper centering */}
        <g transform={`scale(${finalZoom}) translate(${translateX / finalZoom}, ${translateY / finalZoom})`}>
          {/* Target rings - different for pistol vs rifle */}
          <g strokeWidth={1}>
            {isPistolTarget ? (
              // Pistol target rings (10m Air Pistol Target specifications) - doubled radii
              <>
                {/* White rings (1-6) */}
                <g fill="#f8fafc" stroke="#d1d5db">
                  <circle r={311} cx={100} cy={100} /> {/* 1 ring (155.5 * 2) */}
                  <circle r={279} cx={100} cy={100} /> {/* 2 ring (139.5 * 2) */}
                  <circle r={247} cx={100} cy={100} /> {/* 3 ring (123.5 * 2) */}
                  <circle r={215} cx={100} cy={100} /> {/* 4 ring (107.5 * 2) */}
                  <circle r={183} cx={100} cy={100} /> {/* 5 ring (91.5 * 2) */}
                  <circle r={151} cx={100} cy={100} /> {/* 6 ring (75.5 * 2) */}
                </g>
                {/* Black rings (7-10) */}
                <g fill="#1e293b" stroke="#f8fafc">
                  <circle r={119} cx={100} cy={100} /> {/* 7 ring (59.5 * 2) */}
                  <circle r={87} cx={100} cy={100} /> {/* 8 ring (43.5 * 2) */}
                  <circle r={55} cx={100} cy={100} /> {/* 9 ring (27.5 * 2) */}
                  <circle r={23} cx={100} cy={100} /> {/* 10 ring (11.5 * 2) */}
                </g>
                {/* Inner ten dot */}
                <circle r={10} cx={100} cy={100} fill="#f8fafc" stroke="#f8fafc" /> {/* 5 * 2 */}
              </>
            ) : (
              // Rifle target rings (10m Air Rifle Target specifications) - doubled radii
              <>
                {/* White rings (1-3) */}
                <g fill="#f8fafc" stroke="#d1d5db">
                  <circle r={91} cx={100} cy={100} /> {/* 1 ring (45.5 * 2) */}
                  <circle r={81} cx={100} cy={100} /> {/* 2 ring (40.5 * 2) */}
                  <circle r={71} cx={100} cy={100} /> {/* 3 ring (35.5 * 2) */}
                </g>
                {/* Black rings (4-9) */}
                <g fill="#1e293b" stroke="#f8fafc">
                  <circle r={61} cx={100} cy={100} /> {/* 4 ring (30.5 * 2) */}
                  <circle r={51} cx={100} cy={100} /> {/* 5 ring (25.5 * 2) */}
                  <circle r={41} cx={100} cy={100} /> {/* 6 ring (20.5 * 2) */}
                  <circle r={31} cx={100} cy={100} /> {/* 7 ring (15.5 * 2) */}
                  <circle r={21} cx={100} cy={100} /> {/* 8 ring (10.5 * 2) */}
                  <circle r={11} cx={100} cy={100} /> {/* 9 ring (5.5 * 2) */}
                </g>
                {/* 10 ring dot */}
                <circle r={1} cx={100} cy={100} fill="#f8fafc" stroke="#f8fafc" /> {/* 0.5 * 2 */}
              </>
            )}
          </g>
          {/* Shots */}
          {(() => {
            const shotsToRender = selectedShots && selectedShots.size > 0 
              ? shots.filter((_, i) => selectedShots.has(i))
              : shots;
            
            return shotsToRender.map((shot, i) => {
              // If x_mm/y_mm are not available, center the shot
              const dx = shot.x_mm !== undefined ? shot.x_mm * 4 : 0;
              const dy = shot.y_mm !== undefined ? -shot.y_mm * 4 : 0;
              return (
                <circle
                  key={i}
                  cx={100 + dx}
                  cy={100 + dy}
                  r={shotRadius}
                  fill="#f43f5e" // rose-500
                  stroke="#1e293b" // slate-800
                  strokeWidth={1.5}
                  opacity={0.85}
                />
              );
            });
          })()}
          {/* Hovered shot rendered on top */}
          {hoveredShotIndex !== undefined && shots[hoveredShotIndex] && (() => {
            const shot = shots[hoveredShotIndex];
            const dx = shot.x_mm !== undefined ? shot.x_mm * 4 : 0;
            const dy = shot.y_mm !== undefined ? -shot.y_mm * 4 : 0;
            return (
              <circle
                cx={100 + dx}
                cy={100 + dy}
                r={shotRadius}
                fill="#ef4444" // red-500 - sharper red
                stroke="#1e293b" // slate-800
                strokeWidth={1.5}
                opacity={1}
              />
            );
          })()}
          {/* Hovered set shots rendered on top */}
          {hoveredSetIndex !== undefined && (() => {
            const startIndex = (hoveredSetIndex - 1) * 10;
            const endIndex = Math.min(startIndex + 10, shots.length);
            return Array.from({ length: endIndex - startIndex }, (_, i) => {
              const shotIndex = startIndex + i;
              const shot = shots[shotIndex];
              if (!shot) return null;
              
              const dx = shot.x_mm !== undefined ? shot.x_mm * 4 : 0;
              const dy = shot.y_mm !== undefined ? -shot.y_mm * 4 : 0;
              return (
                <circle
                  key={`hovered-set-${shotIndex}`}
                  cx={100 + dx}
                  cy={100 + dy}
                  r={shotRadius}
                  fill="#ef4444" // red-500 - sharper red
                  stroke="#1e293b" // slate-800
                  strokeWidth={1.5}
                  opacity={0.8}
                />
              );
            });
          })()}
        </g>
      </svg>
    </div>
  );
} 