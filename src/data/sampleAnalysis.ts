import { PhotoAnalysisReport } from '../types/analysis';

// High-fidelity demo photograph (Urban cinematic portrait in neon twilight)
export const DEMO_PHOTO_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85';

export const SAMPLE_ANALYSIS_REPORT: PhotoAnalysisReport = {
  id: 'demo_sample_fazlenz_01',
  timestamp: new Date().toISOString(),
  isDemo: true,
  imageFileName: 'FAZLENZ_Cinematic_Study_01.jpg',
  imageSizeKB: 2840,
  imageDimensions: {
    width: 2400,
    height: 3000,
  },
  overallScore: 88,
  overallTier: 'Professional Standard (80-89)',
  summary:
    'A commanding editorial portrait with arresting micro-contrast, directional key lighting, and cinematic teal-amber atmospheric tones. The focal plane on the subject’s leading eye is razor sharp, delivering immediate emotional intimacy and sophisticated negative space.',
  professionalVerdict: 'A masterclass in portrait lighting and subject isolation, representing exceptional technical execution.',
  strongestAspect: {
    title: 'Controlled Key Falloff & Micro-Contrast',
    explanation:
      'The transition between the soft directional key light on the model’s cheekbones and the deep velvet shadow on the camera-left cheek creates sculptural three-dimensional volume without crushing shadow texture.',
  },
  areasNeedingImprovement: [
    'Slight highlight hot spot on the forehead that borders on luminance clipping.',
    'Background highlight speculars in the upper-right corner compete mildly for visual dominance with the subject’s gaze.',
    'Foreground bottom edge could benefit from a gentle 0.3EV vignette to prevent eye spill.',
  ],
  categories: {
    exposure: {
      score: 88,
      maxScore: 100,
      weight: 15,
      rating: 'Strong',
      keyObservations: 'Excellent tonal distribution throughout zone V (skin mid-tones) and zone III (garment textures). Highlights crest around zone VIII.',
      advice: 'Pull down specular highlights by -10 in post-production to preserve subtle skin pore gradients.',
    },
    focusAndSharpness: {
      score: 92,
      maxScore: 100,
      weight: 15,
      rating: 'Masterful',
      keyObservations: 'Pin-sharp resolution across the subject’s iris, eyelashes, and lip texture. Falloff into the ears and hair is smooth and organic.',
      advice: 'Maintain this critical eye-autofocus lock; depth of field is optimized perfectly for 85mm optical rendering.',
    },
    composition: {
      score: 85,
      maxScore: 100,
      weight: 20,
      rating: 'Strong',
      keyObservations: 'Framed with intentional off-center placement adhering to the golden ratio. The subject’s eyes align along the upper third guideline.',
      advice: 'Give approximately 5% more breathing room at the top of the crown to prevent an abrupt hair crop.',
    },
    lighting: {
      score: 90,
      maxScore: 100,
      weight: 15,
      rating: 'Masterful',
      keyObservations: 'Single large soft light source situated roughly 45 degrees camera-right and slightly elevated, producing classic modified Rembrandt triangle illumination.',
      advice: 'Add a dark flag (negative fill) camera-left to further deepen jawline definition if aiming for high-drama low-key.',
    },
    whiteBalance: {
      score: 86,
      maxScore: 100,
      weight: 10,
      rating: 'Strong',
      keyObservations: 'Custom calibrated to 5400K daylight with slight +4 magenta tint to flatter natural skin redness.',
      advice: 'Warm the shadows slightly (+2 tint) to avoid cyan contamination in darker hair strands.',
    },
    contrast: {
      score: 87,
      maxScore: 100,
      weight: 10,
      rating: 'Strong',
      keyObservations: 'Rich micro-contrast in foreground features with smooth S-curve tonal roll-off in the shadows.',
      advice: 'Ensure deep blacks are not clipped at zero; lift blacks by +2 for maximum filmic fidelity.',
    },
    colourAccuracy: {
      score: 88,
      maxScore: 100,
      weight: 10,
      rating: 'Strong',
      keyObservations: 'Sophisticated complementary color balance between warm 3200K skin warmth and 5600K cool slate-blue background ambiance.',
      advice: 'Maintain hue separation between teal shadows and warm skin highlights.',
    },
    backgroundAndDistractions: {
      score: 84,
      maxScore: 100,
      weight: 5,
      rating: 'Good',
      keyObservations: 'Smooth optical bokeh separates the subject cleanly from the urban backdrop, augmented by subtle edge rim illumination.',
      advice: 'A subtle kicker or hair light placed behind the subject would guarantee total isolation in moody print reproduction.',
    },
  },
  composition: {
    detectedRule: 'Golden Ratio (Phi Grid) & Leading Eye Alignment',
    balance: 'Dynamic asymmetrical equilibrium with dominant left-leaning subject mass counterbalanced by atmospheric bokeh on the right.',
    eyeFlow: 'Viewer enters through the high-contrast leading eye, cascades down the diagonal jawline, and returns through the negative space.',
    horizonNote: 'Clean vertical perspective lines in the background architecture with zero noticeable keystoning.',
  },
  lighting: {
    lightQuality: 'Directional diffused soft key (estimated 48" octabox or large diffused window) with natural ambient fill.',
    dynamicRange: 'Extensive dynamic range (~12.5 stops visible) with clean shadow detail and controlled tonal roll-off.',
    histogramImpression: 'Classic bell curve skewed slightly toward the shadow-quarter tones with healthy midtone density and no clipped true blacks.',
  },
  color: {
    paletteType: 'Cinematic Complementary (Amber & Slate Teal)',
    dominantHexTones: ['#D97736', '#2A363B', '#E5A67C', '#12161A', '#8E9AAF'],
    whiteBalanceNote: 'Custom calibrated to 5400K daylight with slight +4 magenta tint to flatter natural skin redness.',
  },
  technical: {
    visibleDepthOfField: 'Extremely shallow (characteristic of 85mm f/1.4 or 105mm f/1.8 wide-open capture).',
    focalPlaneAccuracy: 'Absolute dead-center lock on the subject’s right cornea and lash line.',
    noiseAndArtifacts: 'Silky smooth base-ISO grain structure with negligible chroma noise in the shadow depths.',
  },
  practicalRecommendations: [
    'Position a subtle white foam core reflector just below chest level to bounce a whisper of fill into the lower eye socket.',
    'Step back 1.5 feet and use an 85mm prime lens to yield more proportional facial compression and eliminate wide-angle distortion.',
    'Turn off ambient overhead fluorescent or mixed tungsten sources that might introduce conflicting green or yellow color casts.',
    'Have the model angle their chin 3 degrees toward the light source to catch a secondary pinpoint catchlight.',
  ],
  editingSuggestions: [
    'Linear Gradient Filter from top right: Exposure -0.25 EV to temper background specular glare.',
    'Color Grading Wheels: Add +3 Teal hue (210°) into Shadows and +4 Warm Honey (45°) into Highlights.',
    'Texture slider +8, Clarity +3 applied via local brush exclusively over iris and brow.',
    'Highlights slider -12 to soften the peak forehead sheen into a velvety filmic roll-off.',
  ],
  creativeDirections: {
    cinematic: {
      headline: 'Anamorphic Neo-Noir Mood',
      advice: 'Crop to 2.39:1 widescreen, lift black levels by 5% with a soft film curve, and introduce a gentle halation bloom around high-contrast edges.',
      specializedTip: 'Pair with an oval bokeh simulation or optical mist filter to replicate vintage Panavision lenses.',
    },
    editorial: {
      headline: 'Vogue Haute Minimalist',
      advice: 'Emphasize high micro-contrast, desaturate background cool tones to near-monochrome, and sharpen garment textures for textile richness.',
      specializedTip: 'Ensure ample negative space above the subject to allow bold editorial mastheads or typographics.',
    },
    portrait: {
      headline: 'Fine Art Classical Reminiscence',
      advice: 'Smooth shadow transitions using frequency separation, soften the jawline contrast, and warm mid-tones to honor painterly Caravaggio lighting.',
      specializedTip: 'Print on textured cotton rag matte paper to give shadow transitions a physical tactile presence.',
    },
    documentary: {
      headline: 'Raw Humanist Chronicle',
      advice: 'Preserve all unretouched skin textures, avoid saturation boosts, and present in a timeless uncropped 3:2 ratio.',
      specializedTip: 'Keep ambient street light reflections uncorrected to anchor the photograph in raw authentic reality.',
    },
    commercial: {
      headline: 'Luxury Beauty & Brand Campaign',
      advice: 'Standardize skin tones, balance bilateral catchlights in both pupils, and sharpen product-facing elements for maximum clarity.',
      specializedTip: 'Isolate subject on a clean vector mask for multi-channel digital billboard deployment.',
    },
  },
  engineMetadata: {
    modelIdentifier: 'gemini-3.8-flash',
    modelVersion: 'v3.8',
    promptVersion: 'v2.1-deterministic',
    generationConfig: 'temperature=0.1, topP=0.95, seed=42',
    imageProcessingVersion: 'v1.2-optimized',
  },
};
