import { Type } from '@google/genai';

export const photoAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.INTEGER,
      description: 'Calculated overall score 0 to 100 based on weighted rubric.',
    },
    overallTier: {
      type: Type.STRING,
      description: 'Exhibition Grade (90-100), Professional Standard (80-89), Advanced Practice (70-79), Developing Vision (55-69), or Foundational Study (<55)',
    },
    summary: {
      type: Type.STRING,
      description: 'A sharp, professional 2-3 sentence visual critique summarizing the photograph.',
    },
    professionalVerdict: {
      type: Type.STRING,
      description: 'An authoritative master verdict from the FAZLENZ artistic director.',
    },
    strongestAspect: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        explanation: { type: Type.STRING },
      },
      required: ['title', 'explanation'],
    },
    areasNeedingImprovement: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 3 specific areas where the image can be technically or creatively elevated.',
    },
    categories: {
      type: Type.OBJECT,
      properties: {
        exposure: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Exposure' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '15' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        focusAndSharpness: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Focus and sharpness' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '15' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        composition: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Composition' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '20' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        lighting: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Lighting' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '15' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        whiteBalance: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for White balance' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '10' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        contrast: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Contrast' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '10' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        colourAccuracy: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Colour accuracy' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '10' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        backgroundAndDistractions: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Background and distractions' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '5' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
      },
      required: [
        'exposure',
        'focusAndSharpness',
        'composition',
        'lighting',
        'whiteBalance',
        'contrast',
        'colourAccuracy',
        'backgroundAndDistractions',
      ],
    },
    composition: {
      type: Type.OBJECT,
      properties: {
        detectedRule: { type: Type.STRING },
        balance: { type: Type.STRING },
        eyeFlow: { type: Type.STRING },
        horizonNote: { type: Type.STRING },
      },
      required: ['detectedRule', 'balance', 'eyeFlow', 'horizonNote'],
    },
    lighting: {
      type: Type.OBJECT,
      properties: {
        lightQuality: { type: Type.STRING },
        dynamicRange: { type: Type.STRING },
        histogramImpression: { type: Type.STRING },
      },
      required: ['lightQuality', 'dynamicRange', 'histogramImpression'],
    },
    color: {
      type: Type.OBJECT,
      properties: {
        paletteType: { type: Type.STRING },
        dominantHexTones: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        whiteBalanceNote: { type: Type.STRING },
      },
      required: ['paletteType', 'dominantHexTones', 'whiteBalanceNote'],
    },
    technical: {
      type: Type.OBJECT,
      properties: {
        visibleDepthOfField: { type: Type.STRING },
        focalPlaneAccuracy: { type: Type.STRING },
        noiseAndArtifacts: { type: Type.STRING },
      },
      required: ['visibleDepthOfField', 'focalPlaneAccuracy', 'noiseAndArtifacts'],
    },
    practicalRecommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    editingSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    creativeDirections: {
      type: Type.OBJECT,
      properties: {
        cinematic: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            specializedTip: { type: Type.STRING },
          },
          required: ['headline', 'advice', 'specializedTip'],
        },
        editorial: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            specializedTip: { type: Type.STRING },
          },
          required: ['headline', 'advice', 'specializedTip'],
        },
        portrait: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            specializedTip: { type: Type.STRING },
          },
          required: ['headline', 'advice', 'specializedTip'],
        },
        documentary: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            specializedTip: { type: Type.STRING },
          },
          required: ['headline', 'advice', 'specializedTip'],
        },
        commercial: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            specializedTip: { type: Type.STRING },
          },
          required: ['headline', 'advice', 'specializedTip'],
        },
      },
      required: ['cinematic', 'editorial', 'portrait', 'documentary', 'commercial'],
    },
  },
  required: [
    'overallScore',
    'overallTier',
    'summary',
    'professionalVerdict',
    'strongestAspect',
    'areasNeedingImprovement',
    'categories',
    'composition',
    'lighting',
    'color',
    'technical',
    'practicalRecommendations',
    'editingSuggestions',
    'creativeDirections',
  ],
};

export interface AIAnalysisResult {
    overallScore: number;
    overallTier: string;
    summary: string;
    professionalVerdict: string;
    strongestAspect: { title: string; explanation: string };
    areasNeedingImprovement: string[];
    categories: any;
    composition: any;
    lighting: any;
    color: any;
    technical: any;
    practicalRecommendations: string[];
    editingSuggestions: string[];
    creativeDirections: any;
    engineMetadata: {
        providerName: string;
        modelIdentifier: string;
        modelVersion: string;
        promptVersion: string;
        rubricVersion: string;
        imageProcessingVersion: string;
        generationConfiguration: string;
        requestTimestamp: string;
        fallbackUsed: boolean;
        originalProvider: string;
        finalProvider: string;
    };
}

export interface AIProvider {
    name: string;
    analyzePhoto(imageBase64: string, mimeType: string, fileName: string, fileSizeKB: number, imageDimensions: any): Promise<AIAnalysisResult>;
    generateCreativeDirection(imageBase64: string, mimeType: string, genre: string, currentSummary: string): Promise<any>;
}
