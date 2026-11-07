import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  BookOpen,
  User,
  Camera,
  Briefcase,
  Sliders,
  Aperture,
  Palette,
  Lightbulb,
  CheckCircle,
  Loader2,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { CreativeDirectionsMap, DeepCreativeDirection } from '../types/analysis';

interface CreativeDirectionSectionProps {
  creativeDirections: CreativeDirectionsMap;
  imageBase64?: string;
  mimeType?: string;
  currentSummary?: string;
  isDemo?: boolean;
}

type GenreKey = 'cinematic' | 'editorial' | 'portrait' | 'documentary' | 'commercial';

interface GenreTab {
  key: GenreKey;
  label: string;
  icon: React.ElementType;
  badge: string;
}

const GENRE_TABS: GenreTab[] = [
  { key: 'cinematic', label: 'Cinematic', icon: Film, badge: '2.39:1 / Neo-Noir' },
  { key: 'editorial', label: 'Editorial', icon: BookOpen, badge: 'Vogue / Lookbook' },
  { key: 'portrait', label: 'Portrait', icon: User, badge: 'Fine Art / Emotive' },
  { key: 'documentary', label: 'Documentary', icon: Camera, badge: 'Magnum / Realism' },
  { key: 'commercial', label: 'Commercial', icon: Briefcase, badge: 'Luxury / Ad' },
];

export const CreativeDirectionSection: React.FC<CreativeDirectionSectionProps> = ({
  creativeDirections,
  imageBase64,
  mimeType,
  currentSummary,
  isDemo,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<GenreKey>('cinematic');
  const [deepBlueprint, setDeepBlueprint] = useState<Record<string, DeepCreativeDirection>>({});
  const [isLoadingDeep, setIsLoadingDeep] = useState(false);
  const [errorDeep, setErrorDeep] = useState<string | null>(null);

  const activeDirection = creativeDirections[selectedGenre];
  const activeDeep = deepBlueprint[selectedGenre];

  // Request deep Gemini direction for the chosen genre
  const fetchDeepBlueprint = async (genre: GenreKey) => {
    if (isLoadingDeep) return;

    // If demo analysis or no base64, provide instant curated blueprint
    if (isDemo || !imageBase64) {
      setIsLoadingDeep(true);
      setErrorDeep(null);
      setTimeout(() => {
        setDeepBlueprint((prev) => ({
          ...prev,
          [genre]: {
            genre,
            title: `${genre.toUpperCase()} MASTERCLASS: ATMOSPHERIC DIRECTING`,
            artisticVision: `Transform this image into a signature ${genre} showpiece by commanding tonal balance, controlled negative space, and evocative color separation tailored to this specific composition.`,
            lightingSetup:
              'Key: 48" deep parabolic softbox 45° camera right, 1.5 stops over fill. Rim: Rim strip with grid camera left behind subject. Flag: Large black solid floppy flag camera-left for dramatic jawline negative fill.',
            recommendedLenses:
              genre === 'cinematic'
                ? '50mm or 85mm T1.5 Anamorphic 1.8x squeeze with front cylindrical element'
                : genre === 'portrait'
                ? '85mm f/1.4 or 105mm f/1.4 prime lens at f/2.0 for razor eye sharpness and soft falloff'
                : genre === 'editorial'
                ? '50mm f/1.2 or 70-200mm f/2.8 at 135mm for flattering compression'
                : genre === 'commercial'
                ? '90mm f/2.8 Macro or 24-70mm f/2.8 II for edge-to-edge optical resolution'
                : '28mm or 35mm f/1.8 prime lens for intimate environmental documentary proximity',
            colorGradingRecipe: {
              shadows: 'Push +8 Teal (208° Hue) with lifted blacks +5 for cinematic film curve roll-off',
              midtones: 'Calibrate neutral skin tone vector at 48° (Golden Amber) with +3 micro-saturation',
              highlights: 'Soft honey-warm glow (42° Hue) with highlight compression -12 to prevent clipping',
              contrastAndSaturation: 'Contrast S-curve with -8 overall vibrance and +14 luminance clarity',
            },
            compositionReframe:
              'Adjust camera axis down 4 inches to level with subject eye-line; add 8% negative space on left to establish visual tension.',
            editorialStoryline:
              `"In the stillness between glances, FAZLENZ explores the intersection of solitude and luminescence."`,
            keyTakeaways: [
              'Command the key-to-fill ratio with deliberate negative fill flags',
              'Align the focal plane strictly to the leading eye pupil',
              'Use a 1/8 Black Pro-Mist filter to bloom specular catchlights gently',
              'Balance color temperature across background and subject layers',
            ],
          },
        }));
        setIsLoadingDeep(false);
      }, 600);
      return;
    }

    // Call real Gemini API endpoint /api/creative-direction
    setIsLoadingDeep(true);
    setErrorDeep(null);

    try {
      const res = await fetch('/api/creative-direction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          genre,
          currentSummary,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate deep creative blueprint.');
      }

      const deepData: DeepCreativeDirection = await res.json();
      setDeepBlueprint((prev) => ({
        ...prev,
        [genre]: deepData,
      }));
    } catch (err: any) {
      console.error('Deep creative direction error:', err);
      setErrorDeep(err.message || 'Could not generate creative roadmap. Please try again.');
    } finally {
      setIsLoadingDeep(false);
    }
  };

  const handleSelectGenre = (genre: GenreKey) => {
    setSelectedGenre(genre);
    // If not yet generated, automatically trigger generation for real image
    if (!deepBlueprint[genre] && imageBase64) {
      fetchDeepBlueprint(genre);
    }
  };

  return (
    <div className="bg-[#10131a] rounded-2xl border border-[#232836] p-4 sm:p-6 shadow-xl relative overflow-hidden w-full">
      {/* Background ambient subtle glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4ff00]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#1d222e]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#d4ff00]" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Creative Direction Studio
            </h3>
          </div>
          <p className="text-xs text-neutral-400">
            Select a photographic direction to consult Gemini on lighting blueprints, lens packages, and color grades.
          </p>
        </div>

        {/* Action button to expand deep blueprint */}
        <button
          onClick={() => fetchDeepBlueprint(selectedGenre)}
          disabled={isLoadingDeep}
          className="self-start sm:self-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#171c26] hover:bg-[#1f2634] text-xs font-semibold text-[#d4ff00] border border-[#2c3444] hover:border-[#d4ff00]/50 transition-all shadow-sm disabled:opacity-50 min-h-[40px]"
        >
          {isLoadingDeep ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4ff00]" />
              <span>Consulting Gemini...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>
                {activeDeep ? 'Regenerate Gemini Blueprint' : `Generate Gemini ${GENRE_TABS.find(t => t.key === selectedGenre)?.label} Vision`}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Genre Selector Tabs (Mobile-friendly horizontal scroll) */}
      <div className="flex sm:grid sm:grid-cols-5 gap-2 mb-5 overflow-x-auto scrollbar-none pb-1">
        {GENRE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedGenre === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleSelectGenre(tab.key)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all flex-shrink-0 min-w-[130px] sm:min-w-0 ${
                isSelected
                  ? 'bg-[#181e2b] border-[#d4ff00] text-white shadow-lg shadow-[#d4ff00]/10'
                  : 'bg-[#0a0c10] border-[#1d222e] text-neutral-400 hover:text-white hover:bg-[#121620]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <Icon
                  className={`w-4 h-4 ${isSelected ? 'text-[#d4ff00]' : 'text-neutral-500'}`}
                />
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />}
              </div>
              <span className="font-semibold text-xs tracking-wide">{tab.label}</span>
              <span className="text-[10px] text-neutral-500 font-mono mt-0.5">{tab.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Genre Primary Insight Card */}
      <div className="bg-[#090b0f] rounded-xl border border-[#1e2330] p-4 sm:p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-[#d4ff00]/15 text-[#d4ff00] border border-[#d4ff00]/40">
            {selectedGenre} Direction
          </span>
          <h4 className="text-sm font-bold text-white tracking-wide">
            {activeDirection?.headline || 'Artistic Stylization'}
          </h4>
        </div>

        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-3">
          {activeDirection?.advice}
        </p>

        <div className="flex items-start gap-2 pt-3 border-t border-[#181c25] text-xs">
          <Lightbulb className="w-3.5 h-3.5 text-[#d4ff00] flex-shrink-0 mt-0.5" />
          <div className="text-neutral-400">
            <strong className="text-neutral-200">FAZLENZ Pro Tip: </strong>
            {activeDirection?.specializedTip}
          </div>
        </div>
      </div>

      {/* Error state if deep blueprint fails */}
      {errorDeep && (
        <div className="p-3 mb-4 rounded-xl bg-red-950/30 border border-red-800 text-xs text-red-300">
          {errorDeep}
        </div>
      )}

      {/* Deep-Dive Creative Roadmap (Generated by Gemini) */}
      {activeDeep ? (
        <div className="bg-[#0e1219] rounded-xl border border-[#273042] p-4 sm:p-5 mt-4 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e2533] flex-wrap gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Layers className="w-4 h-4 text-[#d4ff00] flex-shrink-0" />
              <h5 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider truncate">
                {activeDeep.title}
              </h5>
            </div>
            <span className="text-[10px] font-mono text-[#d4ff00] px-2 py-0.5 rounded bg-[#d4ff00]/10 border border-[#d4ff00]/25">
              GEMINI DIRECTIVE
            </span>
          </div>

          {/* Artistic Vision & Storyline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#090b0f] p-3 rounded-lg border border-[#1b212d]">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                Artistic Philosophy
              </span>
              <p className="text-neutral-300 leading-relaxed">{activeDeep.artisticVision}</p>
            </div>

            <div className="bg-[#090b0f] p-3 rounded-lg border border-[#1b212d]">
              <span className="text-[10px] font-mono uppercase text-[#d4ff00] block mb-1">
                Editorial Storyline / Narrative
              </span>
              <p className="text-neutral-300 italic leading-relaxed">
                {activeDeep.editorialStoryline}
              </p>
            </div>
          </div>

          {/* Lighting & Lens Blueprint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#090b0f] p-3 rounded-lg border border-[#1b212d]">
              <div className="flex items-center gap-1.5 text-neutral-200 font-semibold mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span>Precision Lighting Setup</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">{activeDeep.lightingSetup}</p>
            </div>

            <div className="bg-[#090b0f] p-3 rounded-lg border border-[#1b212d]">
              <div className="flex items-center gap-1.5 text-neutral-200 font-semibold mb-1">
                <Camera className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span>Recommended Optical Package</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">{activeDeep.recommendedLenses}</p>
            </div>
          </div>

          {/* Darkroom Color Grading Recipe */}
          <div className="bg-[#090b0f] p-3.5 rounded-lg border border-[#1b212d]">
            <div className="flex items-center gap-2 mb-2.5">
              <Palette className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Digital Darkroom Color Recipe (LUT Breakdown)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#10141c] border border-[#1c2230]">
                <span className="text-[10px] font-mono text-cyan-400 block mb-0.5">Shadows</span>
                <span className="text-neutral-300 text-[11px] leading-snug">
                  {activeDeep.colorGradingRecipe.shadows}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#10141c] border border-[#1c2230]">
                <span className="text-[10px] font-mono text-amber-400 block mb-0.5">Midtones</span>
                <span className="text-neutral-300 text-[11px] leading-snug">
                  {activeDeep.colorGradingRecipe.midtones}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#10141c] border border-[#1c2230]">
                <span className="text-[10px] font-mono text-yellow-300 block mb-0.5">Highlights</span>
                <span className="text-neutral-300 text-[11px] leading-snug">
                  {activeDeep.colorGradingRecipe.highlights}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#10141c] border border-[#1c2230]">
                <span className="text-[10px] font-mono text-emerald-400 block mb-0.5">Tone Curve</span>
                <span className="text-neutral-300 text-[11px] leading-snug">
                  {activeDeep.colorGradingRecipe.contrastAndSaturation}
                </span>
              </div>
            </div>
          </div>

          {/* Composition Reframe & Action Checklist */}
          <div className="bg-[#090b0f] p-3.5 rounded-lg border border-[#1b212d] text-xs">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
              Composition Re-framing Strategy
            </span>
            <p className="text-neutral-300 mb-3">{activeDeep.compositionReframe}</p>

            <span className="text-[10px] font-mono uppercase text-[#d4ff00] block mb-1.5 font-bold">
              Director's Action Points
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {activeDeep.keyTakeaways.map((point, i) => (
                <div key={i} className="flex items-start gap-1.5 text-neutral-300 text-[11px]">
                  <CheckCircle className="w-3 h-3 text-[#d4ff00] flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty/Prompt State to encourage generating deep vision */
        <div className="p-4 rounded-xl bg-[#090b0f] border border-[#1a1f2c] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Aperture className="w-4 h-4 text-[#d4ff00] flex-shrink-0" />
            <span className="text-neutral-300">
              Want custom lighting schematics, lens choices, and darkroom recipes for {GENRE_TABS.find(t => t.key === selectedGenre)?.label} photography?
            </span>
          </div>
          <button
            onClick={() => fetchDeepBlueprint(selectedGenre)}
            disabled={isLoadingDeep}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#d4ff00] text-black font-bold text-xs hover:bg-[#c6f000] transition-all min-h-[36px]"
          >
            <span>Generate Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
