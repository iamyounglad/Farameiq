import React, { useState } from 'react';
import { Aperture, Sparkles, Menu, X, ArrowRight, Shield } from 'lucide-react';

interface NavbarProps {
  onNavigateToStudio: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToAbout: () => void;
  onLoadDemo: () => void;
  hasActiveReport: boolean;
  onResetToUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateToStudio,
  onNavigateToHowItWorks,
  onNavigateToAbout,
  onLoadDemo,
  hasActiveReport,
  onResetToUpload,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-[#090b0f]/85 backdrop-blur-md border-b border-[#1b202c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand & Logo */}
        <div
          onClick={onResetToUpload}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#141822] border border-[#252b3b] flex items-center justify-center group-hover:border-[#d4ff00] transition-colors shadow-lg shadow-black/50">
            <Aperture className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#d4ff00] group-hover:rotate-45 transition-transform duration-500" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#d4ff00] shadow-[0_0_8px_#d4ff00]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black text-white tracking-widest font-mono">
                FRAMEIQ
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-[#181d27] text-neutral-400 border border-[#242b3b]">
                v1.0
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
              by <strong className="text-neutral-200 font-semibold">FAZLENZ</strong>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-neutral-400">
          <button
            onClick={onNavigateToStudio}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Studio
          </button>
          <button
            onClick={onNavigateToHowItWorks}
            className="hover:text-white transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button
            onClick={onNavigateToAbout}
            className="hover:text-white transition-colors cursor-pointer"
          >
            About & Rubric
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onLoadDemo}
            className="px-3 py-1.5 rounded-xl bg-[#141822] hover:bg-[#1a202d] text-xs font-mono text-neutral-300 hover:text-white border border-[#222836] transition-all"
          >
            Sample Demo
          </button>

          <button
            onClick={onNavigateToStudio}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d4ff00] hover:bg-[#c6f000] text-xs font-bold text-black transition-all shadow-md shadow-[#d4ff00]/15"
          >
            <span>Analyse Photo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-[#141822] text-neutral-300 border border-[#222836]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0e14] border-b border-[#1f2533] px-4 py-4 space-y-3 font-mono text-xs">
          <button
            onClick={() => {
              onNavigateToStudio();
              closeMenu();
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-neutral-300 hover:text-white hover:bg-[#151924]"
          >
            Studio
          </button>
          <button
            onClick={() => {
              onNavigateToHowItWorks();
              closeMenu();
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-neutral-300 hover:text-white hover:bg-[#151924]"
          >
            How it works
          </button>
          <button
            onClick={() => {
              onNavigateToAbout();
              closeMenu();
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-neutral-300 hover:text-white hover:bg-[#151924]"
          >
            About & Rubric
          </button>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onLoadDemo();
                closeMenu();
              }}
              className="w-full py-2.5 rounded-xl bg-[#161a24] text-neutral-200 border border-[#242b3b] text-center"
            >
              Explore Sample Demo
            </button>
            <button
              onClick={() => {
                onNavigateToStudio();
                closeMenu();
              }}
              className="w-full py-2.5 rounded-xl bg-[#d4ff00] text-black font-bold text-center"
            >
              Analyse Photograph
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
