export type RatingTier = 'Masterful' | 'Strong' | 'Good' | 'Needs Attention' | 'Critical Focus';

export interface CategoryScore {
  score: number; // 0-100 score
  maxScore: number; // 100
  weight: number; // percentage weight (e.g. 15 for 15%)
  rating: RatingTier;
  keyObservations: string;
  advice: string;
}

export interface CategoryBreakdown {
  exposure: CategoryScore;             // weight 15%
  focusAndSharpness: CategoryScore;    // weight 15%
  composition: CategoryScore;          // weight 20%
  lighting: CategoryScore;             // weight 15%
  whiteBalance: CategoryScore;         // weight 10%
  contrast: CategoryScore;             // weight 10%
  colourAccuracy: CategoryScore;       // weight 10%
  backgroundAndDistractions: CategoryScore; // weight 5%
}

export interface CompositionDetails {
  detectedRule: string;
  balance: string;
  eyeFlow: string;
  horizonNote: string;
}

export interface LightingDetails {
  lightQuality: string;
  dynamicRange: string;
  histogramImpression: string;
}

export interface ColorDetails {
  paletteType: string;
  dominantHexTones: string[];
  whiteBalanceNote: string;
}

export interface TechnicalDetails {
  visibleDepthOfField: string;
  focalPlaneAccuracy: string;
  noiseAndArtifacts: string;
}

export interface CreativeDirectionItem {
  headline: string;
  advice: string;
  specializedTip: string;
}

export interface CreativeDirectionsMap {
  cinematic: CreativeDirectionItem;
  editorial: CreativeDirectionItem;
  portrait: CreativeDirectionItem;
  documentary: CreativeDirectionItem;
  commercial: CreativeDirectionItem;
}

export interface DeepCreativeDirection {
  genre: 'cinematic' | 'editorial' | 'portrait' | 'documentary' | 'commercial';
  title: string;
  artisticVision: string;
  lightingSetup: string;
  recommendedLenses: string;
  colorGradingRecipe: {
    shadows: string;
    midtones: string;
    highlights: string;
    contrastAndSaturation: string;
  };
  compositionReframe: string;
  editorialStoryline: string;
  keyTakeaways: string[];
}

export interface EngineMetadata {
  modelIdentifier: string;
  modelVersion: string;
  promptVersion: string;
  generationConfig: string;
  imageProcessingVersion: string;
}

export interface PhotoAnalysisReport {
  id: string;
  timestamp: string;
  isDemo?: boolean;
  imageFileName?: string;
  imageSizeKB?: number;
  imageDimensions?: { width: number; height: number };
  
  overallScore: number; // 0-100 weighted calculation
  overallTier: string;  // e.g. "Exhibition Grade"
  summary: string;
  professionalVerdict: string;
  strongestAspect: {
    title: string;
    explanation: string;
  };
  areasNeedingImprovement: string[];

  categories: CategoryBreakdown;
  composition: CompositionDetails;
  lighting: LightingDetails;
  color: ColorDetails;
  technical: TechnicalDetails;
  
  practicalRecommendations: string[];
  editingSuggestions: string[];
  creativeDirections: CreativeDirectionsMap;
  engineMetadata: EngineMetadata;
}
