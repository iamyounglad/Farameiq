import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  CheckCircle2,
  Layers,
  Award,
  Zap,
} from 'lucide-react';

interface HeroProps {
  onAnalyzeClick: () => void;
  onDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeClick, onDemoClick }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#d4ff00]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Copy */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Brand Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121620] border border-[#232938] text-xs font-mono text-neutral-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
            <span className="text-[#d4ff00] font-semibold">FRAMEIQ</span>
            <span className="text-neutral-500">•</span>
            <span>Intelligent Photography Studio by FAZLENZ</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
            See beyond <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#d4ff00]">
              the frame.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Understand your photography. Improve your vision. Create better images.
          </p>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Professional AI analysis grounded in actual visual content — dissecting composition, lighting, tonal balance, critical focus, and creative direction.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onAnalyzeClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#d4ff00] hover:bg-[#c8f200] text-black font-bold text-sm tracking-wide transition-all shadow-xl shadow-[#d4ff00]/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Analyse a photograph</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onDemoClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#141822] hover:bg-[#1c2230] text-neutral-200 hover:text-white border border-[#252c3c] hover:border-[#38435c] text-sm font-semibold transition-all"
            >
              <Eye className="w-4 h-4 text-neutral-400" />
              <span>Explore a sample analysis</span>
            </button>
          </div>

          {/* Feature Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>100-Point Documented Rubric</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>Multimodal Vision Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>Darkroom Slider Guidance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>Zero Photo Retention</span>
            </div>
          </div>
        </div>

        {/* Workstation Interactive Preview Graphic */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#10131a] border border-[#252b3a] p-3 sm:p-5 shadow-2xl">
            {/* Header chrome */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1c212e] text-xs font-mono">
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00]" />
                <span className="font-semibold text-neutral-200">FRAMEIQ STUDIO MONITOR</span>
                <span className="text-neutral-500 hidden sm:inline">• 2400 &times; 3000 • 85mm Optical Study</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px]">
                  PREVIEW WORKBENCH
                </span>
              </div>
            </div>

            {/* Split Screen Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Photo with Rule of Thirds Grid overlay */}
              <div className="md:col-span-7 relative rounded-xl overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/10] border border-[#1e2432]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
                  alt="Photography workstation preview"
                  className="w-full h-full object-cover"
                />

                {/* Thirds Grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-[#d4ff00]/30 relative">
                      {(i === 0 || i === 1 || i === 3 || i === 4) && (
                        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#d4ff00] bg-black shadow-[0_0_8px_#d4ff00]" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Floating telemetry tag */}
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-[#d4ff00]">
                  Composition: Golden Phi Ratio detected
                </div>
              </div>

              {/* Analysis Telemetry Cards on Right */}
              <div className="md:col-span-5 space-y-3 text-xs">
                {/* Score highlight */}
                <div className="p-3.5 rounded-xl bg-[#0a0c10] border border-[#1d222e]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-neutral-400 text-[10px] uppercase">Calculated Quality</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#d4ff00]/15 text-[#d4ff00] font-mono text-[10px] font-bold">
                      EXHIBITION GRADE
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-3xl font-black text-white">88</span>
                    <span className="text-neutral-500">/ 100 PTS</span>
                  </div>
                </div>

                {/* Metric bars */}
                <div className="p-3.5 rounded-xl bg-[#0a0c10] border border-[#1d222e] space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-300">Composition & Lines</span>
                      <span className="text-[#d4ff00] font-bold">18 / 20</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#181d26] overflow-hidden">
                      <div className="w-[90%] h-full bg-[#d4ff00] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-300">Lighting & Falloff</span>
                      <span className="text-[#d4ff00] font-bold">18 / 20</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#181d26] overflow-hidden">
                      <div className="w-[90%] h-full bg-[#d4ff00] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-300">Focus & Acutance</span>
                      <span className="text-[#d4ff00] font-bold">14 / 15</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#181d26] overflow-hidden">
                      <div className="w-[93%] h-full bg-[#d4ff00] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Darkroom slider tip */}
                <div className="p-3 rounded-xl bg-[#0a0c10] border border-[#1d222e] text-[11px] text-neutral-300">
                  <span className="text-[#d4ff00] font-mono font-bold block mb-0.5">DARKROOM RECIPE</span>
                  "Pull specular highlights -12 to soften forehead sheen; add +4 warm amber in highlight grade."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
