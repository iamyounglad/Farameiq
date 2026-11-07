import React from 'react';
import { Aperture, ArrowUp, Heart, Shield } from 'lucide-react';

interface FooterProps {
  onNavigateToStudio: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToAbout: () => void;
  onLoadDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToStudio,
  onNavigateToHowItWorks,
  onNavigateToAbout,
  onLoadDemo,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07080b] border-t border-[#181c26] text-neutral-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Info (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#141822] border border-[#252b3b] flex items-center justify-center text-[#d4ff00]">
                <Aperture className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black text-white tracking-widest">
                  FRAMEIQ
                </span>
                <span className="text-[10px] text-neutral-400">
                  by <strong className="text-neutral-200">FAZLENZ</strong>
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-300 font-sans italic max-w-sm">
              "See beyond the frame."
            </p>

            <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-md">
              Your intelligent photography analysis studio. Powered by Gemini multimodal vision to deliver surgical composition critique, lighting evaluation, tonal analysis, and creative direction.
            </p>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-neutral-200 uppercase tracking-widest text-[11px] block font-bold">
              Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onNavigateToStudio} className="hover:text-white transition-colors">
                  Studio Workstation
                </button>
              </li>
              <li>
                <button onClick={onNavigateToHowItWorks} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={onNavigateToAbout} className="hover:text-white transition-colors">
                  100-Point Rubric
                </button>
              </li>
              <li>
                <button onClick={onLoadDemo} className="hover:text-[#d4ff00] transition-colors">
                  Explore Sample Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Specs (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-neutral-200 uppercase tracking-widest text-[11px] block font-bold">
              System Specifications
            </span>
            <div className="space-y-2 text-[11px] text-neutral-400">
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="text-[#d4ff00]">Gemini 3.8 Flash</span>
              </div>
              <div className="flex justify-between">
                <span>Latency:</span>
                <span className="text-neutral-300">Fast Multimodal</span>
              </div>
              <div className="flex justify-between">
                <span>Formats:</span>
                <span className="text-neutral-300">JPG, PNG, WEBP</span>
              </div>
              <div className="flex justify-between">
                <span>Max Payload:</span>
                <span className="text-neutral-300">10 MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#141822] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div>
            &copy; {new Date().getFullYear()} FRAMEIQ by FAZLENZ. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Volatile Memory Only • Zero Retention</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
