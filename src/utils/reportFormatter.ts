import { PhotoAnalysisReport } from '../types/analysis';

export function formatReportAsMarkdown(report: PhotoAnalysisReport): string {
  const isDemoTag = report.isDemo ? ' [DEMO SAMPLE ANALYSIS]' : '';
  const dateStr = new Date(report.timestamp).toLocaleString();
  const cats = report.categories || {};

  return `================================================================
FRAMEIQ by FAZLENZ — PHOTOGRAPHY ANALYSIS REPORT${isDemoTag}
"See beyond the frame."
================================================================

IMAGE DETAILS:
- File Name: ${report.imageFileName || 'Photograph'}
- File Size: ${report.imageSizeKB ? `${report.imageSizeKB} KB` : 'N/A'}
- Resolution: ${report.imageDimensions ? `${report.imageDimensions.width} x ${report.imageDimensions.height} px` : 'N/A'}
- Analysis Date: ${dateStr}
- Engine: ${report.engineMetadata?.modelIdentifier || 'gemini-3.8-flash'} (${report.engineMetadata?.promptVersion || 'v2.1'})

----------------------------------------------------------------
OVERALL WEIGHTED SCORE: ${report.overallScore} / 100  [${report.overallTier}]
----------------------------------------------------------------

EXECUTIVE SUMMARY:
${report.summary}

PROFESSIONAL VERDICT:
${report.professionalVerdict || 'N/A'}

STRONGEST ASPECT:
• ${report.strongestAspect?.title}
  ${report.strongestAspect?.explanation}

AREAS NEEDING IMPROVEMENT:
${(report.areasNeedingImprovement || []).map((area, i) => `${i + 1}. ${area}`).join('\n')}

================================================================
CENTRALIZED 8-CATEGORY RUBRIC BREAKDOWN (WEIGHTED)
================================================================

1. COMPOSITION & FRAMING (Weight 20%): ${cats.composition?.score ?? 0} / 100 pts (${cats.composition?.rating || 'Strong'})
   - Observations: ${cats.composition?.keyObservations}
   - Direction:    ${cats.composition?.advice}

2. EXPOSURE & TONAL BALANCE (Weight 15%): ${cats.exposure?.score ?? 0} / 100 pts (${cats.exposure?.rating || 'Strong'})
   - Observations: ${cats.exposure?.keyObservations}
   - Direction:    ${cats.exposure?.advice}

3. FOCUS & SHARPNESS (Weight 15%): ${cats.focusAndSharpness?.score ?? 0} / 100 pts (${cats.focusAndSharpness?.rating || 'Strong'})
   - Observations: ${cats.focusAndSharpness?.keyObservations}
   - Direction:    ${cats.focusAndSharpness?.advice}

4. LIGHTING & SHADOWS (Weight 15%): ${cats.lighting?.score ?? 0} / 100 pts (${cats.lighting?.rating || 'Strong'})
   - Observations: ${cats.lighting?.keyObservations}
   - Direction:    ${cats.lighting?.advice}

5. WHITE BALANCE (Weight 10%): ${cats.whiteBalance?.score ?? 0} / 100 pts (${cats.whiteBalance?.rating || 'Strong'})
   - Observations: ${cats.whiteBalance?.keyObservations}
   - Direction:    ${cats.whiteBalance?.advice}

6. TONE CONTRAST (Weight 10%): ${cats.contrast?.score ?? 0} / 100 pts (${cats.contrast?.rating || 'Strong'})
   - Observations: ${cats.contrast?.keyObservations}
   - Direction:    ${cats.contrast?.advice}

7. COLOUR ACCURACY (Weight 10%): ${cats.colourAccuracy?.score ?? 0} / 100 pts (${cats.colourAccuracy?.rating || 'Strong'})
   - Observations: ${cats.colourAccuracy?.keyObservations}
   - Direction:    ${cats.colourAccuracy?.advice}

8. BACKGROUND & DISTRACTIONS (Weight 5%): ${cats.backgroundAndDistractions?.score ?? 0} / 100 pts (${cats.backgroundAndDistractions?.rating || 'Strong'})
   - Observations: ${cats.backgroundAndDistractions?.keyObservations}
   - Direction:    ${cats.backgroundAndDistractions?.advice}

================================================================
TECHNICAL & SCENE GEOMETRY
================================================================
- Composition Rule:   ${report.composition?.detectedRule}
- Visual Balance:     ${report.composition?.balance}
- Eye Flow:           ${report.composition?.eyeFlow}
- Horizon & Lines:    ${report.composition?.horizonNote}
- Light Quality:      ${report.lighting?.lightQuality}
- Dynamic Range:      ${report.lighting?.dynamicRange}
- Color Palette Type: ${report.color?.paletteType}
- Extracted Palette:  ${report.color?.dominantHexTones?.join(', ')}
- White Balance:      ${report.color?.whiteBalanceNote}
- Depth of Field:     ${report.technical?.visibleDepthOfField}
- Focus Accuracy:     ${report.technical?.focalPlaneAccuracy}
- Noise & Artifacts:  ${report.technical?.noiseAndArtifacts}

================================================================
PRACTICAL RECOMMENDATIONS FOR YOUR NEXT SHOOT
================================================================
${(report.practicalRecommendations || []).map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

================================================================
DIGITAL DARKROOM & EDITING SUGGESTIONS
================================================================
${(report.editingSuggestions || []).map((sug, i) => `• ${sug}`).join('\n')}

================================================================
CREATIVE DIRECTION EXPANSIONS
================================================================
- CINEMATIC:
  ${report.creativeDirections?.cinematic?.headline}
  ${report.creativeDirections?.cinematic?.advice}
  Tip: ${report.creativeDirections?.cinematic?.specializedTip}

- EDITORIAL:
  ${report.creativeDirections?.editorial?.headline}
  ${report.creativeDirections?.editorial?.advice}
  Tip: ${report.creativeDirections?.editorial?.specializedTip}

- PORTRAIT:
  ${report.creativeDirections?.portrait?.headline}
  ${report.creativeDirections?.portrait?.advice}
  Tip: ${report.creativeDirections?.portrait?.specializedTip}

- DOCUMENTARY:
  ${report.creativeDirections?.documentary?.headline}
  ${report.creativeDirections?.documentary?.advice}
  Tip: ${report.creativeDirections?.documentary?.specializedTip}

- COMMERCIAL:
  ${report.creativeDirections?.commercial?.headline}
  ${report.creativeDirections?.commercial?.advice}
  Tip: ${report.creativeDirections?.commercial?.specializedTip}

================================================================
Curated by FRAMEIQ by FAZLENZ | Intelligent Photography Studio
================================================================
`;
}

export function downloadTextFile(filename: string, content: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
