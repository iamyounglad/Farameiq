import React, { useEffect, useRef, useState } from 'react';
import { Activity, Layers, SunMedium, ShieldAlert } from 'lucide-react';

interface HistogramViewerProps {
  imageSrc: string;
}

export const HistogramViewer: React.FC<HistogramViewerProps> = ({ imageSrc }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeChannel, setActiveChannel] = useState<'luma' | 'rgb' | 'r' | 'g' | 'b'>('rgb');
  const [clipping, setClipping] = useState<{ shadowClipped: boolean; highlightClipped: boolean }>({
    shadowClipped: false,
    highlightClipped: false,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Create offscreen sampling canvas
      const sampleCanvas = document.createElement('canvas');
      const maxSampleDim = 200;
      const scale = Math.min(maxSampleDim / img.naturalWidth, maxSampleDim / img.naturalHeight, 1);
      const w = Math.max(10, Math.floor(img.naturalWidth * scale));
      const h = Math.max(10, Math.floor(img.naturalHeight * scale));

      sampleCanvas.width = w;
      sampleCanvas.height = h;
      const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h).data;

      // 256 bins for R, G, B, and Luminance
      const rBins = new Uint32Array(256);
      const gBins = new Uint32Array(256);
      const bBins = new Uint32Array(256);
      const lumaBins = new Uint32Array(256);

      let shadowCount = 0;
      let highlightCount = 0;
      const totalPixels = w * h;

      for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        // Rec. 709 luminance weights
        const luma = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);

        rBins[r]++;
        gBins[g]++;
        bBins[b]++;
        lumaBins[luma]++;

        if (luma <= 3) shadowCount++;
        if (luma >= 252) highlightCount++;
      }

      setClipping({
        shadowClipped: shadowCount / totalPixels > 0.04,
        highlightClipped: highlightCount / totalPixels > 0.03,
      });

      // Render onto canvas
      renderHistogram(rBins, gBins, bBins, lumaBins);
      setIsReady(true);
    };

    img.src = imageSrc;
  }, [imageSrc, activeChannel]);

  const renderHistogram = (
    rBins: Uint32Array,
    gBins: Uint32Array,
    bBins: Uint32Array,
    lumaBins: Uint32Array
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0c0f16');
    bgGrad.addColorStop(1, '#080a0e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Grid lines for darkroom zones (Zone 0 to X)
    ctx.strokeStyle = '#1e2330';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const x = (width / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Determine max peak for scaling (ignore extreme ends 0 and 255 for better normalization)
    const getMax = (arr: Uint32Array) => {
      let max = 1;
      for (let i = 2; i < 254; i++) {
        if (arr[i] > max) max = arr[i];
      }
      return max;
    };

    const maxLuma = getMax(lumaBins);
    const maxR = getMax(rBins);
    const maxG = getMax(gBins);
    const maxB = getMax(bBins);
    const overallMax = Math.max(maxLuma, maxR, maxG, maxB);

    const drawCurve = (bins: Uint32Array, color: string, fillGradColor: string, blendMode?: GlobalCompositeOperation) => {
      if (blendMode) ctx.globalCompositeOperation = blendMode;

      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * width;
        const val = Math.min(bins[i], overallMax);
        const y = height - (val / overallMax) * (height - 8);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, fillGradColor);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.globalCompositeOperation = 'source-over';
    };

    if (activeChannel === 'rgb') {
      drawCurve(rBins, '#ef4444', 'rgba(239, 68, 68, 0.25)', 'screen');
      drawCurve(gBins, '#22c55e', 'rgba(34, 197, 94, 0.25)', 'screen');
      drawCurve(bBins, '#3b82f6', 'rgba(59, 130, 246, 0.25)', 'screen');
    } else if (activeChannel === 'luma') {
      drawCurve(lumaBins, '#d4ff00', 'rgba(212, 255, 0, 0.35)');
    } else if (activeChannel === 'r') {
      drawCurve(rBins, '#ef4444', 'rgba(239, 68, 68, 0.4)');
    } else if (activeChannel === 'g') {
      drawCurve(gBins, '#22c55e', 'rgba(34, 197, 94, 0.4)');
    } else if (activeChannel === 'b') {
      drawCurve(bBins, '#3b82f6', 'rgba(59, 130, 246, 0.4)');
    }
  };

  return (
    <div className="bg-[#10131a] rounded-xl border border-[#232836] p-4 text-xs font-mono">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1b202c]">
        <div className="flex items-center gap-2 text-neutral-300 font-semibold tracking-wider uppercase text-[11px]">
          <Activity className="w-3.5 h-3.5 text-[#d4ff00]" />
          <span>Real-time Tonal Histogram</span>
        </div>

        {/* Channel Selector */}
        <div className="flex items-center gap-1 bg-[#090b0f] p-0.5 rounded-lg border border-[#1e2330]">
          <button
            onClick={() => setActiveChannel('rgb')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              activeChannel === 'rgb' ? 'bg-[#222836] text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            RGB
          </button>
          <button
            onClick={() => setActiveChannel('luma')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              activeChannel === 'luma' ? 'bg-[#d4ff00] text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            LUMA
          </button>
          <button
            onClick={() => setActiveChannel('r')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              activeChannel === 'r' ? 'bg-red-500/20 text-red-400 font-bold' : 'text-neutral-500 hover:text-red-400'
            }`}
          >
            R
          </button>
          <button
            onClick={() => setActiveChannel('g')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              activeChannel === 'g' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-neutral-500 hover:text-emerald-400'
            }`}
          >
            G
          </button>
          <button
            onClick={() => setActiveChannel('b')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              activeChannel === 'b' ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-neutral-500 hover:text-blue-400'
            }`}
          >
            B
          </button>
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-[#1a1f2b] shadow-inner">
        <canvas ref={canvasRef} width={280} height={100} className="w-full h-24 block" />
        
        {/* Shadow / Midtone / Highlight Labels */}
        <div className="absolute bottom-1 inset-x-2 flex justify-between text-[9px] text-neutral-500 pointer-events-none">
          <span>0 (Shadows)</span>
          <span>128 (Midtones)</span>
          <span>255 (Highlights)</span>
        </div>
      </div>

      {/* Exposure Warning / Clipping indicators */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded border ${
            clipping.shadowClipped
              ? 'bg-blue-950/40 border-blue-800 text-blue-300'
              : 'bg-[#0d1016] border-[#1b202c] text-neutral-400'
          }`}
        >
          <ShieldAlert className="w-3 h-3 text-blue-400 flex-shrink-0" />
          <span>Shadows: {clipping.shadowClipped ? 'Crushed (<5%)' : 'Clean Detail'}</span>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded border ${
            clipping.highlightClipped
              ? 'bg-amber-950/40 border-amber-800 text-amber-300'
              : 'bg-[#0d1016] border-[#1b202c] text-neutral-400'
          }`}
        >
          <SunMedium className="w-3 h-3 text-amber-400 flex-shrink-0" />
          <span>Highlights: {clipping.highlightClipped ? 'Specular Peak' : 'Controlled'}</span>
        </div>
      </div>
    </div>
  );
};
