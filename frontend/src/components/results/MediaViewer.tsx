import React, { useState, useRef } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Layers,
  Film,
} from "lucide-react";
import { Finding, MediaFile } from "@sitesentinel/shared";
import { OverlayLayer } from "./OverlayLayer";

interface MediaViewerProps {
  media: MediaFile[];
  findings: Finding[];
  selectedFindingId: string | null;
  onSelectFinding: (id: string) => void;
  hoveredFindingId: string | null;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  media,
  findings,
  selectedFindingId,
  onSelectFinding,
  hoveredFindingId,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedMediaIdx, setSelectedMediaIdx] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentMedia = media[selectedMediaIdx] || media[0];
  const mediaUrl = currentMedia?.signed_url || "";

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 4));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`field-panel flex flex-col bg-black overflow-hidden relative ${
        isFullscreen ? "p-0 rounded-none h-screen w-screen" : "h-[540px]"
      }`}
    >
      {/* Toolbar */}
      <div className="z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-mono text-teal-400 font-bold uppercase">
            {currentMedia?.media_type || "IMAGE"}
          </span>
          <span className="text-slate-600">|</span>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOverlays}
              onChange={(e) => setShowOverlays(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-teal-500 focus:ring-teal-500"
            />
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Overlays</span>
          </label>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-slate-400 text-[11px] mr-2">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors ml-1"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div
        className="flex-1 overflow-hidden relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
          className="relative max-h-full max-w-full flex items-center justify-center"
        >
          {mediaUrl ? (
            <img
              src={mediaUrl}
              alt="Inspection Subject"
              className="max-h-[460px] w-auto object-contain rounded shadow-2xl pointer-events-none"
            />
          ) : (
            <div className="w-[600px] h-[400px] bg-slate-900 flex items-center justify-center text-slate-500">
              No media visual preview available
            </div>
          )}

          {showOverlays && (
            <OverlayLayer
              findings={findings}
              selectedFindingId={selectedFindingId}
              onSelectFinding={onSelectFinding}
              hoveredFindingId={hoveredFindingId}
            />
          )}
        </div>
      </div>

      {/* Frame Scrubber (If multiple frames or video extracted) */}
      {media.length > 1 && (
        <div className="z-30 bg-slate-950/95 border-t border-slate-800 px-4 py-2 flex items-center gap-3 overflow-x-auto">
          <Film className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
            Frames ({media.length}):
          </span>
          <div className="flex items-center gap-2">
            {media.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setSelectedMediaIdx(idx)}
                className={`relative px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  selectedMediaIdx === idx
                    ? "bg-teal-500 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                Frame #{idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
