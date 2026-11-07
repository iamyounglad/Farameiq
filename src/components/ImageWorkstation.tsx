import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import {
  Grid3X3,
  Maximize2,
  Minimize2,
  Eye,
  Crop,
  Copy,
  Check,
  Search,
  Sparkles,
  Compass,
  SlidersHorizontal,
  SplitSquareVertical,
  CheckCircle2,
} from 'lucide-react';
import { HistogramViewer } from './HistogramViewer';

interface ImageWorkstationProps {
  imageSrc: string;
  fileName?: string;
  dimensions?: { width: number; height: number } | null;
  dominantHexTones?: string[];
  detectedRule?: string;
  onCopyColor?: (hex: string) => void;
}

type GridOverlay = 'none' | 'thirds' | 'phi' | 'spiral' | 'crosshair' | 'diagonal';
type AspectCrop = 'original' | '3:2' | '4:5' | '16:9' | '2.39:1' | '1:1';

export const ImageWorkstation: React.FC<ImageWorkstationProps> = ({
  imageSrc,
  fileName,
  dimensions,
  dominantHexTones = ['#222733', '#4a5568', '#718096', '#a0aec0', '#e2e8f0'],
  detectedRule,
  onCopyColor,
}) => {
  const [activeGrid, setActiveGrid] = useState<GridOverlay>('thirds');
  const [aspectCrop, setAspectCrop] = useState<AspectCrop>('original');
  const [isMonochrome, setIsMonochrome] = useState(false);
  const [isLoupeActive, setIsLoupeActive] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50, clientX: 0, clientY: 0 });
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Before / After experience
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [compareSplitPos, setCompareSplitPos] = useState(50); // percentage 0-100
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keyboard shortcut for Esc to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Handle pointer/mouse position for Loupe and Comparison Slider
  const updatePointerPosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setLoupePos({
      x: clampedX,
      y: clampedY,
      clientX: clientX - rect.left,
      clientY: clientY - rect.top,
    });

    if (isDraggingSplit) {
      setCompareSplitPos(clampedX);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    updatePointerPosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      updatePointerPosition(touch.clientX, touch.clientY);
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      updatePointerPosition(touch.clientX, touch.clientY);
    }
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    if (onCopyColor) onCopyColor(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Helper for Cinema Crop Guides (translucent matte border)
  const getCropMaskStyle = () => {
    if (aspectCrop === 'original') return null;

    // Ratios expressed as width/height
    const ratioValues: Record<string, number> = {
      '3:2': 3 / 2,
      '4:5': 4 / 5,
      '16:9': 16 / 9,
      '2.39:1': 2.39 / 1,
      '1:1': 1 / 1,
    };

    const targetRatio = ratioValues[aspectCrop];
    if (!targetRatio) return null;

    return { targetRatio };
  };

  const cropMask = getCropMaskStyle();

  return (
    <div className="flex flex-col gap-4 w-full max-w-full">
      {/* Studio Monitor Frame */}
      <div className="bg-[#10131a] rounded-2xl border border-[#232836] p-3 sm:p-5 shadow-2xl relative overflow-hidden w-full">
        {/* Top Workstation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1c212d] text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] animate-pulse flex-shrink-0" />
            <span className="font-mono text-neutral-200 font-semibold tracking-wider uppercase text-[11px] truncate">
              Studio Canvas Monitor
            </span>
            {dimensions && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#181d27] text-neutral-400 font-mono text-[10px] border border-[#232a39] flex-shrink-0">
                {dimensions.width} &times; {dimensions.height}
              </span>
            )}
          </div>

          {/* Quick Workstation Action Pills */}
          <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto scrollbar-none py-0.5">
            {/* Before / After Grade Simulation */}
            <button
              onClick={() => setIsComparisonMode(!isComparisonMode)}
              title="Compare original raw capture with AI-optimized darkroom grade"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                isComparisonMode
                  ? 'bg-[#d4ff00] text-black font-bold shadow-md shadow-[#d4ff00]/20'
                  : 'bg-[#151922] text-neutral-300 hover:text-white border border-[#222736]'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Before / After</span>
            </button>

            {/* Monochrome toggle for tonal analysis */}
            <button
              onClick={() => setIsMonochrome(!isMonochrome)}
              title="Toggle Monochrome (Inspect pure tonal luminance without color bias)"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                isMonochrome
                  ? 'bg-neutral-200 text-black shadow-sm font-semibold'
                  : 'bg-[#151922] text-neutral-400 hover:text-white border border-[#222736]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>B&W Tone</span>
            </button>

            {/* Loupe Sharpness Inspector */}
            <button
              onClick={() => setIsLoupeActive(!isLoupeActive)}
              title="Toggle 2.5x Loupe Magnifier to inspect eye/focal sharpness"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                isLoupeActive
                  ? 'bg-[#d4ff00] text-black font-semibold shadow-sm'
                  : 'bg-[#151922] text-neutral-400 hover:text-white border border-[#222736]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Loupe 2.5x</span>
            </button>

            {/* Fullscreen view */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Toggle expanded viewport"
              className="p-1.5 rounded-lg bg-[#151922] text-neutral-400 hover:text-white border border-[#222736] flex-shrink-0"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Viewport Toolbar: Composition Grids & Aspect Ratios (Horizontally scrollable on mobile) */}
        <div className="flex flex-col gap-2 mb-3 bg-[#0a0c10] p-2.5 rounded-xl border border-[#1b202c] text-xs">
          {/* Row 1: Grids */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <span className="text-[10px] uppercase font-mono text-neutral-400 mr-1 flex items-center gap-1 flex-shrink-0">
              <Grid3X3 className="w-3 h-3 text-[#d4ff00]" />
              Grid:
            </span>
            {(
              [
                { id: 'none', label: 'Off' },
                { id: 'thirds', label: 'Rule of Thirds' },
                { id: 'phi', label: 'Phi Golden Ratio' },
                { id: 'spiral', label: 'Golden Spiral' },
                { id: 'crosshair', label: 'Horizon Level' },
                { id: 'diagonal', label: 'Diagonals' },
              ] as const
            ).map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGrid(g.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-colors flex-shrink-0 min-h-[30px] flex items-center ${
                  activeGrid === g.id
                    ? 'bg-[#d4ff00]/15 text-[#d4ff00] font-semibold border border-[#d4ff00]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-[#161a24] border border-transparent'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Row 2: Crop Ratio Simulation (Horizontally scrollable on mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 border-t border-[#161a23]">
            <span className="text-[10px] uppercase font-mono text-neutral-400 mr-1 flex items-center gap-1 flex-shrink-0">
              <Crop className="w-3 h-3 text-neutral-400" />
              Crop:
            </span>
            {(
              [
                { id: 'original', label: 'Original' },
                { id: '4:5', label: '4:5 Portrait' },
                { id: '16:9', label: '16:9 Cinema' },
                { id: '2.39:1', label: '2.39:1 Anamorphic' },
                { id: '1:1', label: '1:1 Square' },
                { id: '3:2', label: '3:2 Standard' },
              ] as const
            ).map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setAspectCrop(ratio.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-colors flex-shrink-0 min-h-[30px] flex items-center ${
                  aspectCrop === ratio.id
                    ? 'bg-[#252c3c] text-white font-semibold border border-[#3b4458]'
                    : 'text-neutral-400 hover:text-white hover:bg-[#161a24] border border-transparent'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Image Stage — Elevated Visual Prominence */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          className={`relative rounded-xl overflow-hidden bg-[#06070a] flex items-center justify-center border border-[#1e2330] group select-none transition-all ${
            isFullscreen
              ? 'fixed inset-3 sm:inset-6 z-50 shadow-2xl bg-black/95 flex items-center justify-center'
              : 'min-h-[380px] sm:min-h-[460px] max-h-[660px]'
          }`}
          style={{ touchAction: isDraggingSplit || isLoupeActive ? 'none' : 'auto' }}
        >
          {/* Close button if fullscreen */}
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-700 text-white hover:bg-neutral-800 shadow-xl"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          )}

          {/* BEFORE / AFTER COMPARISON VIEW */}
          {isComparisonMode ? (
            <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] max-h-[660px] flex items-center justify-center overflow-hidden">
              {/* After Image (FAZLENZ Simulated Grade) as background */}
              <img
                src={imageSrc}
                alt="After: Color-graded simulation"
                className={`max-w-full max-h-[620px] w-auto h-auto object-contain transition-all ${
                  isMonochrome
                    ? 'grayscale contrast-125 brightness-95'
                    : 'contrast-[1.12] saturate-[1.08] brightness-[0.98]'
                }`}
                style={{
                  filter: isMonochrome
                    ? 'grayscale(100%) contrast(125%)'
                    : 'contrast(1.10) saturate(1.08) brightness(0.99) sepia(0.04)',
                }}
              />

              {/* Before Image (Original Raw) clipped to left of slider */}
              <div
                className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - compareSplitPos}% 0 0)` }}
              >
                <img
                  src={imageSrc}
                  alt="Before: Original capture"
                  className="max-w-full max-h-[620px] w-auto h-auto object-contain"
                />
              </div>

              {/* Split Draggable Line */}
              <div
                className="absolute top-0 bottom-0 z-30 w-1 bg-[#d4ff00] cursor-ew-resize flex items-center justify-center shadow-[0_0_12px_#d4ff00]"
                style={{ left: `${compareSplitPos}%` }}
                onMouseDown={() => setIsDraggingSplit(true)}
                onTouchStart={() => setIsDraggingSplit(true)}
              >
                <div className="w-8 h-8 rounded-full bg-black/90 border-2 border-[#d4ff00] shadow-xl flex items-center justify-center text-[#d4ff00] text-[10px] font-mono font-bold select-none">
                  &#8596;
                </div>
              </div>

              {/* Split Indicator Tags */}
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-neutral-300">
                BEFORE: ORIGINAL
              </div>
              <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#d4ff00]/40 text-[10px] font-mono text-[#d4ff00]">
                AFTER: FAZLENZ GRADE
              </div>
            </div>
          ) : (
            /* STANDARD VIEW */
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={imageSrc}
                alt={fileName || 'Photograph for analysis'}
                className={`max-w-full max-h-[620px] w-auto h-auto object-contain transition-all duration-200 ${
                  isMonochrome ? 'grayscale contrast-110 brightness-95' : ''
                }`}
              />
            </div>
          )}

          {/* CROP MATTE OVERLAY (Shows translucent framing bounds) */}
          {cropMask && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className="border-2 border-[#d4ff00] shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] relative"
                style={{
                  aspectRatio: `${cropMask.targetRatio}`,
                  width: cropMask.targetRatio >= 1 ? '92%' : 'auto',
                  height: cropMask.targetRatio < 1 ? '92%' : 'auto',
                  maxWidth: '96%',
                  maxHeight: '96%',
                }}
              >
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-[#d4ff00] border border-[#d4ff00]/40">
                  {aspectCrop.toUpperCase()} FRAME
                </span>
              </div>
            </div>
          )}

          {/* COMPOSITION GRID OVERLAYS */}
          {activeGrid === 'thirds' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 border border-[#d4ff00]/25">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-[#d4ff00]/25 relative">
                    {(i === 0 || i === 1 || i === 3 || i === 4) && (
                      <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full border-2 border-[#d4ff00] bg-black/80 shadow-[0_0_8px_#d4ff00]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeGrid === 'phi' && (
            <div className="absolute inset-0 pointer-events-none flex flex-col">
              <div className="w-full h-full flex flex-col border border-emerald-400/30">
                <div className="h-[38.2%] w-full flex border-b border-emerald-400/30">
                  <div className="w-[38.2%] border-r border-emerald-400/30" />
                  <div className="w-[23.6%] border-r border-emerald-400/30" />
                  <div className="w-[38.2%]" />
                </div>
                <div className="h-[23.6%] w-full flex border-b border-emerald-400/30">
                  <div className="w-[38.2%] border-r border-emerald-400/30" />
                  <div className="w-[23.6%] border-r border-emerald-400/30" />
                  <div className="w-[38.2%]" />
                </div>
                <div className="h-[38.2%] w-full flex">
                  <div className="w-[38.2%] border-r border-emerald-400/30" />
                  <div className="w-[23.6%] border-r border-emerald-400/30" />
                  <div className="w-[38.2%]" />
                </div>
              </div>
            </div>
          )}

          {activeGrid === 'spiral' && (
            <div className="absolute inset-0 pointer-events-none">
              <svg viewBox="0 0 1000 618" preserveAspectRatio="none" className="w-full h-full opacity-45">
                <path
                  d="M0,618 A618,618 0 0,1 618,0 A382,382 0 0,1 1000,382 A236,236 0 0,1 764,618 A146,146 0 0,1 618,472 A90,90 0 0,1 708,382 A56,56 0 0,1 764,438 A34,34 0 0,1 730,472"
                  fill="none"
                  stroke="#d4ff00"
                  strokeWidth="3.5"
                  strokeDasharray="6,4"
                />
                <rect x="0" y="0" width="618" height="618" fill="none" stroke="#d4ff00" strokeWidth="1" opacity="0.3" />
                <rect x="618" y="0" width="382" height="382" fill="none" stroke="#d4ff00" strokeWidth="1" opacity="0.3" />
                <rect x="764" y="382" width="236" height="236" fill="none" stroke="#d4ff00" strokeWidth="1" opacity="0.3" />
              </svg>
            </div>
          )}

          {activeGrid === 'crosshair' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-full h-[1px] bg-cyan-400/50 absolute top-1/2 -translate-y-1/2" />
              <div className="h-full w-[1px] bg-cyan-400/50 absolute left-1/2 -translate-x-1/2" />
              <div className="w-16 h-16 rounded-full border border-cyan-400/70 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
            </div>
          )}

          {activeGrid === 'diagonal' && (
            <div className="absolute inset-0 pointer-events-none">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-40">
                <line x1="0" y1="0" x2="100" y2="100" stroke="#f59e0b" strokeWidth="0.8" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="#f59e0b" strokeWidth="0.8" />
                <line x1="0" y1="100" x2="100" y2="0" stroke="#f59e0b" strokeWidth="0.8" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3,3" />
              </svg>
            </div>
          )}

          {/* LOUPE MAGNIFIER (2.5x zoom follower) */}
          {isLoupeActive && (
            <div
              className="absolute pointer-events-none w-36 h-36 rounded-full border-2 border-[#d4ff00] shadow-2xl overflow-hidden z-30"
              style={{
                left: `${loupePos.clientX - 72}px`,
                top: `${loupePos.clientY - 72}px`,
                boxShadow: '0 0 25px rgba(212, 255, 0, 0.4), inset 0 0 15px rgba(0,0,0,0.8)',
              }}
            >
              <div
                className="w-full h-full bg-no-repeat rounded-full"
                style={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: '350%',
                  backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
                  filter: isMonochrome ? 'grayscale(100%)' : 'none',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-4 h-4 border border-[#d4ff00]/70 rounded-full" />
              </div>
              <span className="absolute bottom-1 inset-x-0 text-center font-mono text-[9px] text-[#d4ff00] bg-black/85">
                2.5X FOCUS
              </span>
            </div>
          )}

          {/* Bottom status badge over image */}
          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] font-mono text-neutral-300">
            <Compass className="w-3 h-3 text-[#d4ff00]" />
            <span className="truncate max-w-[200px] sm:max-w-none">{detectedRule || 'Framing Geometry Analyzed'}</span>
          </div>
        </div>

        {/* Workstation Lower Bay: Extracted Color Palette (Responsive & Mobile-scrollable) */}
        <div className="mt-3 pt-3 border-t border-[#1b202c]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4ff00] flex-shrink-0" />
              <span className="text-xs font-mono font-medium text-neutral-300">Extracted Palette:</span>
              <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">(Tap swatch to copy hex)</span>
            </div>

            {/* Swatches (Scrollable without overflow) */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {dominantHexTones.map((hex, index) => {
                const isCopied = copiedHex === hex;
                return (
                  <button
                    key={`${hex}-${index}`}
                    onClick={() => handleCopyHex(hex)}
                    className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0a0c10] border border-[#202532] hover:border-[#d4ff00] transition-all flex-shrink-0 min-h-[32px]"
                  >
                    <span
                      className="w-4 h-4 rounded-md shadow-sm border border-white/10 flex-shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="font-mono text-[11px] text-neutral-300 uppercase tracking-wider group-hover:text-white">
                      {hex}
                    </span>
                    {isCopied ? (
                      <Check className="w-3 h-3 text-[#d4ff00]" />
                    ) : (
                      <Copy className="w-3 h-3 text-neutral-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Real-Time Histogram Bar */}
      <HistogramViewer imageSrc={imageSrc} />
    </div>
  );
};
