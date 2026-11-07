import React from 'react';
import { Aperture, ShieldCheck, Check, Layers, Sparkles, Scale } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const rubricDetails = [
    { name: 'Composition & Framing', points: '20 pts', desc: 'Rule adherence, balance, leading lines, horizon alignment, negative space.' },
    { name: 'Lighting & Shadows', points: '20 pts', desc: 'Key-to-fill ratio, shadow depth, specular highlight handling, directional falloff.' },
    { name: 'Exposure & Tonal Balance', points: '15 pts', desc: 'Dynamic range management, clipping avoidance, mid-tone zone retention.' },
    { name: 'Focus & Sharpness', points: '15 pts', desc: 'Critical focus accuracy on the subject, micro-contrast, optical falloff, motion stability.' },
    { name: 'Colour & White Balance', points: '10 pts', desc: 'Harmonic color theory, white balance calibration, skin rendition fidelity.' },
    { name: 'Subject Separation', points: '10 pts', desc: 'Bokeh isolation, tonal contrast from background, atmospheric depth.' },
    { name: 'Mood & Storytelling', points: '10 pts', desc: 'Emotional weight, narrative tension, visual intrigue, conceptual resonance.' },
  ];

  const tiers = [
    { range: '90 – 100', name: 'Exhibition Grade', note: 'Gallery worthy. Exceptional intentionality across every visual plane.' },
    { range: '80 – 89', name: 'Professional Standard', note: 'Commercial and editorial publication caliber with master technical command.' },
    { range: '70 – 79', name: 'Advanced Practice', note: 'Strong artistic eye with minor darkroom or lighting refinement opportunities.' },
    { range: '55 – 69', name: 'Developing Vision', note: 'Promising visual foundation requiring attention to focus, framing, or exposure.' },
    { range: '< 55', name: 'Foundational Study', note: 'Notable technical hurdles in stabilization, exposure latitude, or framing.' },
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-[#181c26] bg-[#0a0c11]" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Brand Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141822] border border-[#232938] text-neutral-300 text-xs font-mono">
              <Aperture className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>THE FAZLENZ VISION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Crafted for creators who refuse to settle for vague critique.
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              FRAMEIQ was engineered by <strong className="text-white">FAZLENZ</strong> to bridge the gap between intuitive camera craft and systematic visual excellence. Too many feedback communities rely on subjective clichés. We engineered a precision analysis studio that reads the true optical, tonal, and geometric properties of each image.
            </p>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Whether you shoot medium format Hasselblads, full-frame Sony Alpha bodies, Leica rangefinders, or computational mobile cameras, FRAMEIQ gives you the critical eyes of an elite photography director, colorist, and darkroom master.
            </p>

            {/* Privacy Guarantee Box */}
            <div className="p-4 rounded-xl bg-[#10131b] border border-[#23293a] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-300">
                <strong className="text-white block mb-0.5">Absolute Photo Privacy Guarantee</strong>
                Your uploaded images are processed temporarily in volatile server memory for real-time Gemini multimodal analysis. Photos are never stored, logged, indexed, or used to train public models.
              </div>
            </div>
          </div>

          {/* Quality Tiers Table */}
          <div className="lg:col-span-5 bg-[#10131a] rounded-2xl border border-[#232836] p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#1c222e]">
              <Scale className="w-4 h-4 text-[#d4ff00]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Evaluation Tiers
              </h3>
            </div>

            <div className="space-y-3">
              {tiers.map((tier, index) => (
                <div key={index} className="p-2.5 rounded-lg bg-[#0a0c10] border border-[#1b202c] text-xs">
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="font-bold text-white">{tier.name}</span>
                    <span className="text-[#d4ff00] font-bold">{tier.range} PTS</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">{tier.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 100-Point Scoring Rubric Breakdown */}
        <div className="bg-[#10131a] rounded-3xl border border-[#232836] p-6 sm:p-10 shadow-2xl">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4ff00]">
              SCORING INTEGRITY
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              The 100-Point Documented Photographic Rubric
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              Every score generated by FRAMEIQ is calculated directly from the mathematical sum of these 7 distinct categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rubricDetails.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#090b0f] border border-[#1e2330] hover:border-[#2b3345] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white text-xs">{item.name}</span>
                  <span className="font-mono text-xs font-bold text-[#d4ff00] px-2 py-0.5 rounded bg-[#d4ff00]/10 border border-[#d4ff00]/20">
                    {item.points}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}

            {/* Total Summary Card */}
            <div className="p-4 rounded-xl bg-[#161d10] border border-[#d4ff00]/40 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-[#d4ff00] uppercase tracking-wider mb-1">
                MATHEMATICAL TOTAL
              </span>
              <div className="text-2xl font-black text-white font-mono">100 MAXIMUM POINTS</div>
              <p className="text-[11px] text-neutral-300 mt-1">
                Calibrated to reward visual discipline and intentional artistic control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
