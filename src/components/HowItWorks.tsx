import React from 'react';
import { Upload, Eye, Award, CheckCircle2, Sliders, Shield } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Your Photograph',
      description:
        'Drag and drop any JPG, JPEG, PNG, or WEBP image up to 10 MB. Ingest portraits, street scenes, landscapes, or commercial stills straight from your camera.',
      badge: 'In-Memory Buffer',
      icon: Upload,
    },
    {
      step: '02',
      title: 'Let FrameIQ Study the Image',
      description:
        'Powered by Google Gemini 3.8 Flash multimodal vision, FrameIQ scans light direction, falloff ratios, optical sharpness planes, dynamic range, and compositional alignment.',
      badge: 'Gemini Multimodal AI',
      icon: Eye,
    },
    {
      step: '03',
      title: 'Receive Professional Feedback',
      description:
        'Access a 100-point photographic scorecard, strongest aspects, refinement notes, concrete darkroom slider tweaks, and tailored creative directions (Cinematic, Editorial, Commercial, etc.).',
      badge: 'Actionable Critique',
      icon: Award,
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-[#181c26] bg-[#08090d]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4ff00]">
            METHODOLOGY
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How FrameIQ Works
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            A three-step workstation crafted for photographers who desire objective, discerning feedback without subjective bias.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-[#10131a] rounded-2xl border border-[#202533] hover:border-[#323b4e] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-neutral-700 group-hover:text-[#d4ff00] transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#151923] border border-[#262c3b] flex items-center justify-center text-[#d4ff00]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#181d28] text-neutral-300 border border-[#242b3b] mb-3">
                    {item.badge}
                  </span>

                  <h3 className="text-lg font-bold text-white mb-2.5 tracking-wide">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1a1f2b] flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00]" />
                  <span>Instant Studio Turnaround</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
