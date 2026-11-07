import { GoogleGenAI } from '@google/genai';
import { AIProvider, AIAnalysisResult, photoAnalysisSchema } from './types';

export class GeminiProvider implements AIProvider {
    name = 'Google Gemini';
    private ai: GoogleGenAI;
    private model: string;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        this.model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
        if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');
        this.ai = new GoogleGenAI({
            apiKey,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
    }

    async analyzePhoto(imageBase64: string, mimeType: string, fileName: string, fileSizeKB: number, imageDimensions: any): Promise<AIAnalysisResult> {
        const promptText = `
You are the master photography director, technical colorist, and visual curator for FRAMEIQ by FAZLENZ (Prompt Version v2.1-deterministic).
Analyze this uploaded photograph with deep professional expertise, absolute analytical consistency, and meticulous visual perception.

CENTRALIZED 8-CATEGORY RUBRIC (Each category scored strictly 0 to 100):
1. Exposure (Weight: 15%) - Highlight retention, shadow detail, luminance balance.
2. Focus and sharpness (Weight: 15%) - Focal plane sharpness, micro-contrast, optical acutance.
3. Composition (Weight: 20%) - Framing geometry, rule of thirds, golden ratio, balance, visual flow.
4. Lighting (Weight: 15%) - Key-to-fill ratio, shadow depth, specular highlight handling, directional falloff.
5. White balance (Weight: 10%) - Color temperature accuracy, tint neutrality, atmospheric fidelity.
6. Contrast (Weight: 10%) - Tonal separation, micro-contrast, black/white point anchorage.
7. Colour accuracy (Weight: 10%) - Harmonic color palette, saturation balance, skin tone rendition.
8. Background and distractions (Weight: 5%) - Background isolation, bokeh quality, avoidance of distracting elements.

SCORING STANDARDS & WEIGHTED CALCULATION:
- Evaluate each of the 8 categories strictly from 0 to 100 based on visible visual evidence.
- The server will calculate the exact overall weighted score:
  Overall = (Exposure * 0.15) + (Focus * 0.15) + (Composition * 0.20) + (Lighting * 0.15) + (WhiteBalance * 0.10) + (Contrast * 0.10) + (ColourAccuracy * 0.10) + (Background * 0.05).
- Tiers: 90-100 (Exhibition Grade), 80-89 (Professional Standard), 70-79 (Advanced Practice), 55-69 (Developing Vision), <55 (Foundational Study).

CRITICAL INSTRUCTIONS:
- Ground your analysis in what is ACTUALLY VISIBLE in this specific image.
- Do NOT fabricate camera EXIF metadata as facts; describe visible optical characteristics.
- Provide 5 representative hex color codes (#RRGGBB).
- Provide a professionalVerdict string summarizing the director's ultimate critique.
`;

        const response = await this.ai.models.generateContent({
            model: this.model,
            contents: {
                parts: [
                    { inlineData: { mimeType, data: imageBase64 } },
                    { text: promptText },
                ],
            },
            config: {
                systemInstruction: 'You are the lead photography critique master and artistic director at FRAMEIQ by FAZLENZ. Evaluate images with surgical precision and absolute consistency.',
                responseMimeType: 'application/json',
                responseSchema: photoAnalysisSchema,
                temperature: 0.1,
                topP: 0.95,
                seed: 42,
            },
        });

        if (!response.text) throw new Error('Gemini returned empty response.');
        
        const parsed = JSON.parse(response.text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim());

        // This is a placeholder for the full structure that AIGateway/Normalizer will complete
        return { 
            ...parsed,
            engineMetadata: {
                providerName: this.name,
                modelIdentifier: this.model,
                modelVersion: 'v3.8',
                promptVersion: 'v2.1-deterministic',
                rubricVersion: 'v1.0',
                imageProcessingVersion: 'v1.2-optimized',
                generationConfiguration: 'temperature=0.1, topP=0.95, seed=42',
                requestTimestamp: new Date().toISOString(),
                fallbackUsed: false,
                originalProvider: this.name,
                finalProvider: this.name
            }
        };
    }

    async generateCreativeDirection(imageBase64: string, mimeType: string, genre: string, currentSummary: string): Promise<any> {
        const promptText = `
You are an expert creative director specializing in the photographic genre: "${genre.toUpperCase()}".
Based on the attached photograph and its existing assessment (${currentSummary || 'visual study'}), provide an exhaustive, high-end master creative direction roadmap.

Deliver JSON formatted with:
- title: string
- artisticVision: string
- lightingSetup: string
- recommendedLenses: string
- colorGradingRecipe: object with shadows (string), midtones (string), highlights (string), contrastAndSaturation (string)
- compositionReframe: string
- editorialStoryline: string
- keyTakeaways: array of 4 concise bulleted action points
`;

        const response = await this.ai.models.generateContent({
            model: this.model,
            contents: {
                parts: [
                    { inlineData: { mimeType, data: imageBase64 } },
                    { text: promptText },
                ],
            },
            config: {
                systemInstruction: `You are the master creative mentor for ${genre} photography at FAZLENZ.`,
                responseMimeType: 'application/json',
                temperature: 0.1,
                seed: 42,
            },
        });

        if (!response.text) throw new Error('Creative direction generation returned empty response.');
        
        return JSON.parse(response.text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim());
    }
}
