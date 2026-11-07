import React, { useState } from 'react';
import {
  Award,
  Download,
  Copy,
  Check,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  Sliders,
  Camera,
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Sparkles,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { PhotoAnalysisReport } from '../types/analysis';
import { ImageWorkstation } from './ImageWorkstation';
import { CreativeDirectionSection } from './CreativeDirectionSection';
import { formatReportAsMarkdown, downloadTextFile } from '../utils/reportFormatter';

interface AnalysisDashboardProps {
  report: PhotoAnalysisReport;
  imageSrc: string;
  imageBase64?: string;
  mimeType?: string;
  onReset: () => void;
  onShowToast: (message: string) => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  report,
  imageSrc,
  imageBase64,
  mimeType,
  onReset,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(true);

  const handleCopyReport = async () => {
    try {
      const text = formatReportAsMarkdown(report);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onShowToast('Analysis report copied to clipboard.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('Could not copy report to clipboard.');
    }
  };

  const handleDownloadReport = () => {
    const text = formatReportAsMarkdown(report);
    const safeName = (report.imageFileName || 'photo')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `FRAMEIQ_${safeName}_Analysis.txt`;
    downloadTextFile(filename, text);
    onShowToast(`Report downloaded as ${filename}`);
  };

  // Color helper for category ratings
  const getRatingBadge = (rating: string) => {
    switch ((rating || '').toLowerCase()) {
      case 'masterful':
        return 'bg-[#d4ff00]/15 text-[#d4ff00] border-[#d4ff00]/40';
      case 'strong':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'good':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'needs attention':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-red-500/15 text-red-400 border-red-500/30';
    }
  };

  // 8 Centralized Rubric Categories with Weights
  const categoryList = [
    { key: 'composition', label: 'Composition & Framing', data: report.categories?.composition, weight: '20%' },
    { key: 'exposure', label: 'Exposure & Tonal Balance', data: report.categories?.exposure, weight: '15%' },
    { key: 'focusAndSharpness', label: 'Focus & Sharpness', data: report.categories?.focusAndSharpness, weight: '15%' },
    { key: 'lighting', label: 'Lighting & Shadows', data: report.categories?.lighting, weight: '15%' },
    { key: 'whiteBalance', label: 'White Balance', data: report.categories?.whiteBalance, weight: '10%' },
    { key: 'contrast', label: 'Tone Contrast', data: report.categories?.contrast, weight: '10%' },
    { key: 'colourAccuracy', label: 'Colour Accuracy', data: report.categories?.colourAccuracy, weight: '10%' },
    { key: 'backgroundAndDistractions', label: 'Background & Isolation', data: report.categories?.backgroundAndDistractions, weight: '5%' },
  ].filter(item => Boolean(item.data));

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 overflow-hidden">
      {/* Top Status & Action Bar */}
      <div className="bg-[#10131a] rounded-2xl border border-[#232836] p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {report.isDemo ? (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                SAMPLE DEMO ANALYSIS
              </span>
            ) : (
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase ${report.engineMetadata?.fallbackUsed ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40' : 'bg-[#d4ff00]/15 text-[#d4ff00] border border-[#d4ff00]/40'} flex items-center gap-1.5`}>
                <Zap className="w-3 h-3" />
                {report.engineMetadata?.fallbackUsed 
                  ? `${report.engineMetadata.originalProvider.toUpperCase()} UNAVAILABLE — ${report.engineMetadata.finalProvider.toUpperCase()} BACKUP USED`
                  : `POWERED BY ${report.engineMetadata?.providerName.toUpperCase() || 'GEMINI'}`}
              </span>
            )}
            <h2 className="text-base sm:text-lg font-bold text-white font-mono truncate max-w-xs sm:max-w-md">
              {report.imageFileName || 'Uploaded Photograph'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-neutral-400 font-mono flex-wrap">
            <span>
              {report.imageDimensions
                ? `${report.imageDimensions.width} × ${report.imageDimensions.height} px`
                : 'High-Resolution'}
            </span>
            <span>•</span>
            <span>{report.imageSizeKB ? `${(report.imageSizeKB / 1024).toFixed(1)} MB` : '10MB max'}</span>
            <span>•</span>
            <span>{new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleCopyReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#161a24] hover:bg-[#1e2330] text-xs font-semibold text-neutral-200 border border-[#262c3b] hover:text-white transition-all shadow-sm min-h-[42px]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span className="text-[#d4ff00]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#161a24] hover:bg-[#1e2330] text-xs font-semibold text-neutral-200 border border-[#262c3b] hover:text-white transition-all shadow-sm min-h-[42px]"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Download</span>
          </button>

          <button
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#c6f000] text-xs font-bold text-black transition-all shadow-lg shadow-[#d4ff00]/15 min-h-[42px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyse Another</span>
          </button>
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT COLUMN: Interactive Canvas Monitor & Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <ImageWorkstation
            imageSrc={imageSrc}
            fileName={report.imageFileName}
            dimensions={report.imageDimensions}
            dominantHexTones={report.color?.dominantHexTones}
            detectedRule={report.composition?.detectedRule}
            onCopyColor={(hex) => onShowToast(`Color ${hex} copied to clipboard.`)}
          />

          {/* Engine Metadata Card (Model consistency & tracking) */}
          {report.engineMetadata && (
            <div className="bg-[#10131a] rounded-2xl border border-[#232836] p-4 text-xs font-mono space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#1b202c]">
                <span className="text-neutral-200 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#d4ff00]" />
                  Engine & Rubric Provenance
                </span>
                <span className="text-[10px] text-[#d4ff00] px-1.5 py-0.5 rounded bg-[#d4ff00]/10 border border-[#d4ff00]/20">
                  VERIFIED
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Model:</span>
                  <span className="text-neutral-300 font-semibold">{report.engineMetadata.modelIdentifier}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Prompt Version:</span>
                  <span className="text-neutral-300 font-semibold">{report.engineMetadata.promptVersion}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Config:</span>
                  <span className="text-neutral-300 font-semibold">{report.engineMetadata.generationConfig}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Image Processor:</span>
                  <span className="text-neutral-300 font-semibold">{report.engineMetadata.imageProcessingVersion}</span>
                </div>
              </div>
            </div>
          )}

          {/* Technical Diagnostics Summary */}
          <div className="bg-[#10131a] rounded-2xl border border-[#232836] p-4 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b202c]">
              <span className="text-neutral-200 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#d4ff00]" />
                Technical Scene Metrics
              </span>
              <span className="text-[10px] text-neutral-500">Optical Inspection</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-start gap-2">
                <span className="text-neutral-400">Depth of Field:</span>
                <span className="text-neutral-200 text-right max-w-[65%]">
                  {report.technical?.visibleDepthOfField}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-neutral-400">Focal Plane:</span>
                <span className="text-neutral-200 text-right max-w-[65%]">
                  {report.technical?.focalPlaneAccuracy}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-neutral-400">Light Quality:</span>
                <span className="text-neutral-200 text-right max-w-[65%]">
                  {report.lighting?.lightQuality}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-neutral-400">White Balance:</span>
                <span className="text-neutral-200 text-right max-w-[65%]">
                  {report.color?.whiteBalanceNote}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Comprehensive Scores & Strategic Critique (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* OVERALL SCORE HERO CARD */}
          <div className="bg-[#10131a] rounded-2xl border border-[#232836] p-5 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#d4ff00]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#1f2533]">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-neutral-400 block mb-1">
                  Overall Weighted Score (8-Category Rubric)
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                    {report.overallScore}
                  </span>
                  <span className="text-2xl font-mono text-neutral-500">/ 100</span>
                </div>
                <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4ff00]/15 text-[#d4ff00] border border-[#d4ff00]/40 text-xs font-bold font-mono">
                  <Award className="w-3.5 h-3.5 text-[#d4ff00]" />
                  <span>{report.overallTier}</span>
                </div>
              </div>

              {/* Large Radial Score Indicator */}
              <div className="flex items-center gap-4 self-center sm:self-auto">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-[#1a202c]"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-[#d4ff00] transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - report.overallScore / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                    <span className="text-2xl sm:text-3xl font-black text-white">{report.overallScore}%</span>
                    <span className="text-[9px] text-[#d4ff00] uppercase font-bold tracking-wider">INDEX</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar Quick-Matrix Bar (8 metrics) */}
            <div className="pt-4 pb-2 grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center text-xs font-mono">
              <div className="p-1.5 rounded-lg bg-[#090b0f] border border-[#1b202c]">
                <span className="text-[9px] text-neutral-400 block truncate">Comp (20%)</span>
                <span className="text-[#d4ff00] font-bold text-[11px]">{report.categories?.composition?.score ?? 0}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#090b0f] border border-[#1b202c]">
                <span className="text-[9px] text-neutral-400 block truncate">Expo (15%)</span>
                <span className="text-[#d4ff00] font-bold text-[11px]">{report.categories?.exposure?.score ?? 0}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#090b0f] border border-[#1b202c]">
                <span className="text-[9px] text-neutral-400 block truncate">Focus (15%)</span>
                <span className="text-[#d4ff00] font-bold text-[11px]">{report.categories?.focusAndSharpness?.score ?? 0}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#090b0f] border border-[#1b202c]">
                <span className="text-[9px] text-neutral-400 block truncate">Light (15%)</span>
                <span className="text-[#d4ff00] font-bold text-[11px]">{report.categories?.lighting?.score ?? 0}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#090b0f] border border-[#1b202c]">
                <span className="text-[9px] text-neutral-400 block truncate">WB (10%)</span>
                <span className="text-[#d4ff00] font-bold text-[11px]">{report.categories?.whiteBalance?.score ?? 0}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#090b0f] border border-[#1b202c]">
                <span className="text-[9px] text-neutral-400 block truncate">Contrast (10%)</span>
                <span className="text-[#d4ff00] font-bold text-[11px]">{report.categories?.contrast?.score ?? 0}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#090b0f] border border-[#1b202c]">
                <span className="text-[9px] text-neutral-400 block truncate">Colour (10%)</span>
                <span className="text-[#d4ff00] font-bold text-[11px]">{report.categories?.colourAccuracy?.score ?? 0}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#090b0f] border border-[#1b202c]">
                <span className="text-[9px] text-neutral-400 block truncate">Bg (5%)</span>
                <span className="text-[#d4ff00] font-bold text-[11px]">{report.categories?.backgroundAndDistractions?.score ?? 0}</span>
              </div>
            </div>

            {/* Curator's Executive Critique & Professional Verdict */}
            <div className="pt-4 border-t border-[#1a1f2c] space-y-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1 font-bold">
                  Curator's Executive Critique
                </span>
                <p className="text-neutral-200 text-sm sm:text-base leading-relaxed font-sans">
                  {report.summary}
                </p>
              </div>

              {report.professionalVerdict && (
                <div className="p-3 rounded-xl bg-[#090b0f] border border-[#1e2330] text-xs">
                  <span className="text-[#d4ff00] font-mono font-bold block mb-0.5">PROFESSIONAL VERDICT</span>
                  <p className="text-neutral-300 italic">{report.professionalVerdict}</p>
                </div>
              )}
            </div>
          </div>

          {/* HIGHLIGHT CARDS: Professional Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strongest Aspect */}
            <div className="bg-[#10131a] rounded-2xl border border-emerald-900/40 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Primary Strength
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">
                  {report.strongestAspect?.title}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {report.strongestAspect?.explanation}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-950/60 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <Target className="w-3 h-3" />
                <span>Validated Visual Anchor</span>
              </div>
            </div>

            {/* Areas Needing Improvement */}
            <div className="bg-[#10131a] rounded-2xl border border-amber-900/40 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    Refinement Opportunities
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {(report.areasNeedingImprovement || []).map((area, i) => (
                    <li key={i} className="text-xs text-neutral-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-400 font-mono font-bold flex-shrink-0">{i + 1}.</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-950/60 flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
                <Sliders className="w-3 h-3" />
                <span>Actionable Darkroom & In-Camera Tweaks</span>
              </div>
            </div>
          </div>

          {/* 8-CATEGORY RUBRIC BREAKDOWN */}
          <div className="bg-[#10131a] rounded-2xl border border-[#232836] p-4 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#1d222e]">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#d4ff00]" />
                  <h3 className="text-base font-bold text-white tracking-wide">
                    Centralized 8-Category Rubric Breakdown
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Standardized 0–100 scoring with rigorous weighting per category.
                </p>
              </div>

              <button
                onClick={() => setExpandedCategories(!expandedCategories)}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161a24] text-xs font-medium text-neutral-300 hover:text-white border border-[#262c3b] transition-all min-h-[36px]"
              >
                <span>{expandedCategories ? 'Collapse Guidance' : 'Expand All Guidance'}</span>
                {expandedCategories ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Category Rows */}
            <div className="space-y-4">
              {categoryList.map(({ key, label, data, weight }) => {
                const scoreVal = data?.score ?? 75;
                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-xl bg-[#090b0f] border border-[#1b202c] hover:border-[#272e3d] transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">{label}</span>
                        <span className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.5 rounded bg-[#151922] border border-[#222836]">
                          Weight: {weight}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${getRatingBadge(
                            data?.rating || 'Strong'
                          )}`}
                        >
                          {data?.rating || 'Strong'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="font-bold text-white text-sm">{scoreVal}</span>
                        <span className="text-neutral-500">/ 100 pts</span>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#181d27] overflow-hidden mb-2.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#d4ff00] to-[#d4ff00] transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(0, scoreVal))}%` }}
                      />
                    </div>

                    {/* Observations & Practical Advice */}
                    {expandedCategories && (
                      <div className="space-y-2 text-xs pt-1.5 border-t border-[#141822] animate-in fade-in duration-200">
                        <div className="text-neutral-300 leading-relaxed">
                          <strong className="text-neutral-400 font-mono text-[10px] uppercase tracking-wider mr-1.5">
                            Visual Observation:
                          </strong>
                          {data?.keyObservations}
                        </div>
                        <div className="text-[#d4ff00] leading-relaxed">
                          <strong className="text-neutral-400 font-mono text-[10px] uppercase tracking-wider mr-1.5">
                            Curator's Advice:
                          </strong>
                          {data?.advice}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PRACTICAL RECOMMENDATIONS & DARKROOM SLIDERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#10131a] rounded-2xl border border-[#232836] p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1c212d]">
                  <Camera className="w-4 h-4 text-[#d4ff00]" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Next Shoot Action Items
                  </h4>
                </div>
                <ul className="space-y-3">
                  {(report.practicalRecommendations || []).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                      <span className="w-5 h-5 rounded-md bg-[#161a24] border border-[#262c3b] text-[#d4ff00] font-mono font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                        {i + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#10131a] rounded-2xl border border-[#232836] p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1c212d]">
                  <Sliders className="w-4 h-4 text-[#d4ff00]" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Darkroom / Post Tweaks
                  </h4>
                </div>
                <ul className="space-y-3">
                  {(report.editingSuggestions || []).map((sug, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-[#d4ff00] mt-1.5 flex-shrink-0 shadow-sm shadow-[#d4ff00]/50" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CREATIVE DIRECTION WORKSTATION */}
          <CreativeDirectionSection
            creativeDirections={report.creativeDirections}
            imageBase64={imageBase64}
            mimeType={mimeType}
            currentSummary={report.summary}
            isDemo={report.isDemo}
          />
        </div>
      </div>
    </div>
  );
};
