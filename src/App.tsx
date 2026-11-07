import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UploadStudio } from './components/UploadStudio';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { HowItWorks } from './components/HowItWorks';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { PhotoAnalysisReport } from './types/analysis';
import { SAMPLE_ANALYSIS_REPORT, DEMO_PHOTO_URL } from './data/sampleAnalysis';

export default function App() {
  const [currentReport, setCurrentReport] = useState<PhotoAnalysisReport | null>(null);
  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(null);
  const [activeImageBase64, setActiveImageBase64] = useState<string | null>(null);
  const [activeMimeType, setActiveMimeType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const studioRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const scrollToStudio = () => {
    // If report is currently displayed, scroll to results or studio
    const target = studioRef.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load sample demo analysis
  const handleLoadDemo = () => {
    setApiError(null);
    setCurrentReport(SAMPLE_ANALYSIS_REPORT);
    setActiveImageSrc(DEMO_PHOTO_URL);
    setActiveImageBase64(null); // Demo uses public photo URL
    setActiveMimeType('image/jpeg');
    setToastMessage('Loaded demo sample analysis. Clearly marked as DEMO.');

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Real Gemini image analysis
  const handleAnalyzePhoto = async (data: {
    imageBase64: string;
    mimeType: string;
    fileName: string;
    fileSizeKB: number;
    imageDimensions: { width: number; height: number };
  }) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const reportData: PhotoAnalysisReport = await response.json();
      setCurrentReport(reportData);
      setActiveImageSrc(data.imageBase64);
      setActiveImageBase64(data.imageBase64);
      setActiveMimeType(data.mimeType);
      setToastMessage('Analysis complete. Photographic evaluation ready.');

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Error during photo analysis:', err);
      setApiError(
        err.message || 'An error occurred during photographic analysis. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to upload another photo
  const handleReset = () => {
    setCurrentReport(null);
    setActiveImageSrc(null);
    setActiveImageBase64(null);
    setActiveMimeType(null);
    setApiError(null);
    setTimeout(() => {
      studioRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#090b0f] text-neutral-100 flex flex-col font-sans selection:bg-[#d4ff00] selection:text-black">
      {/* Top Navigation */}
      <Navbar
        onNavigateToStudio={scrollToStudio}
        onNavigateToHowItWorks={scrollToHowItWorks}
        onNavigateToAbout={scrollToAbout}
        onLoadDemo={handleLoadDemo}
        hasActiveReport={Boolean(currentReport)}
        onResetToUpload={handleReset}
      />

      <main className="flex-grow">
        {/* If no report is active, show Hero and Upload Studio */}
        {!currentReport ? (
          <>
            <Hero
              onAnalyzeClick={scrollToStudio}
              onDemoClick={handleLoadDemo}
            />

            <div ref={studioRef}>
              <UploadStudio
                onAnalyze={handleAnalyzePhoto}
                onLoadDemo={handleLoadDemo}
                isLoading={isLoading}
                error={apiError}
                onClearError={() => setApiError(null)}
              />
            </div>

            <HowItWorks />
            <AboutSection />
          </>
        ) : (
          /* RESULTS DASHBOARD VIEW */
          <div ref={resultsRef} className="py-6">
            <AnalysisDashboard
              report={currentReport}
              imageSrc={activeImageSrc!}
              imageBase64={activeImageBase64 || undefined}
              mimeType={activeMimeType || undefined}
              onReset={handleReset}
              onShowToast={(msg) => setToastMessage(msg)}
            />

            {/* Quick how-it-works footer preview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6 border-t border-[#181c26] mt-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
                <span>Want to test another lighting setup or composition?</span>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-[#141822] hover:bg-[#1a202d] text-neutral-200 hover:text-white border border-[#242b3b] transition-all"
                >
                  Return to Upload Studio
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateToStudio={scrollToStudio}
        onNavigateToHowItWorks={scrollToHowItWorks}
        onNavigateToAbout={scrollToAbout}
        onLoadDemo={handleLoadDemo}
      />

      {/* Global Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
