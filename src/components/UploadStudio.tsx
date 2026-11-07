import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  X,
  FileCheck,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { optimizeImageForAnalysis } from '../utils/imageOptimizer';

interface UploadStudioProps {
  onAnalyze: (data: {
    imageBase64: string;
    mimeType: string;
    fileName: string;
    fileSizeKB: number;
    imageDimensions: { width: number; height: number };
  }) => Promise<void>;
  onLoadDemo: () => void;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const UploadStudio: React.FC<UploadStudioProps> = ({
  onAnalyze,
  onLoadDemo,
  isLoading,
  error,
  onClearError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis stages during real Gemini processing
  const loadingSteps = [
    'Ingesting photograph into memory buffer...',
    'Scanning exposure latitude & dynamic range...',
    'Evaluating lighting ratios & shadow transitions...',
    'Inspecting focal plane sharpness & bokeh character...',
    'Measuring composition balance & framing geometry...',
    'Extracting harmonic color palette & tonal curve...',
    'Synthesizing FAZLENZ master critique & creative roadmap...',
  ];

  // Rotate loading step every 1.8s
  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setValidationError(null);
    onClearError();

    // Validate type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setValidationError(
        `Unsupported file type (${file.type || 'unknown'}). Please upload a JPG, JPEG, PNG, or WEBP image.`
      );
      return;
    }

    // Validate size (10MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(
        `File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select an image under 10MB.`
      );
      return;
    }

    setSelectedFile(file);

    // Read as Base64 and measure image dimensions
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageBase64(result);
      setPreviewUrl(result);

      // Extract natural dimensions
      const img = new Image();
      img.onload = () => {
        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = result;
    };
    reader.onerror = () => {
      setValidationError('Failed to read file from disk. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageBase64(null);
    setDimensions(null);
    setValidationError(null);
    onClearError();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerAnalyze = async () => {
    if (!imageBase64 || !selectedFile || !dimensions) return;
    try {
      const transmissionBase64 = await optimizeImageForAnalysis(imageBase64);
      const isPng = transmissionBase64.startsWith('data:image/png');
      await onAnalyze({
        imageBase64: transmissionBase64,
        mimeType: isPng ? 'image/png' : 'image/jpeg',
        fileName: selectedFile.name,
        fileSizeKB: Math.round(selectedFile.size / 1024),
        imageDimensions: dimensions,
      });
    } catch {
      await onAnalyze({
        imageBase64,
        mimeType: selectedFile.type,
        fileName: selectedFile.name,
        fileSizeKB: Math.round(selectedFile.size / 1024),
        imageDimensions: dimensions,
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6" id="studio">
      <div className="bg-[#10131a] rounded-3xl border border-[#232836] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle workstation accent lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4ff00]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181d27] border border-[#262c3b] text-neutral-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
            <span>AI Multimodal Vision Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Upload Your Photograph
          </h2>
          <p className="text-sm text-neutral-400">
            Submit any photograph for immediate breakdown across composition, lighting, focus, color, and creative potential.
          </p>
        </div>

        {/* Error notification banner */}
        {(validationError || error) && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-red-200 text-sm flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{validationError || error}</span>
            </div>
            <button
              onClick={() => {
                setValidationError(null);
                onClearError();
              }}
              className="text-red-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* LOADING STATE DISPLAY */}
        {isLoading ? (
          <div className="py-16 px-6 text-center rounded-2xl bg-[#090b0f] border border-[#222838] flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              {/* Shutter / Aperture pulsing ring */}
              <div className="w-24 h-24 rounded-full border-4 border-[#232a39] border-t-[#d4ff00] animate-spin flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#d4ff00] animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4ff00]">
                ANALYZING WITH GEMINI 3.8 FLASH
              </span>
              <h3 className="text-lg font-bold text-white">
                {loadingSteps[loadingStepIndex]}
              </h3>
              <p className="text-xs text-neutral-400">
                Evaluating tonal curves, golden ratio geometry, and technical sharpness planes.
              </p>
            </div>

            {/* Stepper dots */}
            <div className="flex items-center gap-1.5 pt-2">
              {loadingSteps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === loadingStepIndex ? 'w-6 bg-[#d4ff00]' : 'w-1.5 bg-[#252c3c]'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : !previewUrl ? (
          /* EMPTY STATE / DRAG-AND-DROP UPLOAD ZONE */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center transition-all cursor-pointer relative group ${
              isDragOver
                ? 'border-[#d4ff00] bg-[#d4ff00]/5 scale-[0.99]'
                : 'border-[#262c3b] hover:border-[#3e475e] bg-[#0a0c10]'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#151922] border border-[#262c3b] flex items-center justify-center group-hover:scale-110 group-hover:border-[#d4ff00] transition-all duration-200">
                <Upload className="w-7 h-7 text-[#d4ff00]" />
              </div>

              <div className="space-y-1">
                <p className="text-base sm:text-lg font-semibold text-white">
                  Drag and drop your photograph here, or{' '}
                  <span className="text-[#d4ff00] underline underline-offset-4">browse files</span>
                </p>
                <p className="text-xs text-neutral-400">
                  Supports JPG, JPEG, PNG, and WEBP formats • Up to 10 MB per image
                </p>
              </div>

              {/* Privacy Notice Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121620] border border-[#202634] text-[11px] text-neutral-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero persistence: photographs are analyzed in memory only</span>
              </div>
            </div>
          </div>
        ) : (
          /* IMAGE PREVIEW BEFORE ANALYSIS */
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#07080b] border border-[#252c3c] flex items-center justify-center max-h-[500px]">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="max-h-[480px] w-auto h-auto object-contain mx-auto"
              />

              {/* Top-right remove / change button */}
              <button
                onClick={handleRemoveImage}
                title="Remove image"
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/80 backdrop-blur-md text-neutral-300 hover:text-white hover:bg-black border border-neutral-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Bottom metadata overlay */}
              <div className="absolute bottom-3 inset-x-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-neutral-800 text-xs font-mono text-neutral-300">
                <div className="flex items-center gap-2 truncate max-w-xs sm:max-w-md">
                  <FileCheck className="w-4 h-4 text-[#d4ff00] flex-shrink-0" />
                  <span className="truncate">{selectedFile?.name}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  {dimensions && (
                    <span>
                      {dimensions.width} &times; {dimensions.height} px
                    </span>
                  )}
                  {selectedFile && (
                    <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#d4ff00] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            {/* Launch Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#090b0f] border border-[#1f2533]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4ff00] flex-shrink-0" />
                <span className="text-xs text-neutral-300">
                  Image validated. Ready for deep 7-category photographic breakdown.
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleRemoveImage}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#161a24] hover:bg-[#1e2330] text-xs font-semibold text-neutral-300 border border-[#262c3b] transition-all min-h-[44px] flex items-center justify-center"
                >
                  Discard
                </button>
                <button
                  onClick={handleTriggerAnalyze}
                  disabled={isLoading}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#c6f000] text-xs font-bold text-black transition-all shadow-lg shadow-[#d4ff00]/20 disabled:opacity-50 min-h-[44px]"
                >
                  <Zap className="w-4 h-4" />
                  <span>Analyze Photograph</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEMO SHORTCUT / HELPER BAY */}
        {!previewUrl && !isLoading && (
          <div className="mt-8 pt-6 border-t border-[#1b202c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Sparkles className="w-4 h-4 text-[#d4ff00] flex-shrink-0" />
              <span>Don't have an image ready right now?</span>
            </div>

            <button
              onClick={onLoadDemo}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1c2230] text-xs font-medium text-neutral-200 border border-[#242b3b] hover:border-[#d4ff00]/40 transition-all group min-h-[44px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Explore Sample Demo Analysis</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-[#d4ff00] transition-all" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
