import OpenAI from 'openai';
import { AIProvider, AIAnalysisResult, photoAnalysisSchema } from './types';

export class OpenAIProvider implements AIProvider {
    name = 'OpenAI';
    private openai: OpenAI;
    private model: string;

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        this.model = process.env.OPENAI_VISION_MODEL || 'gpt-4o';
        if (!apiKey) throw new Error('OPENAI_API_KEY is not configured.');
        this.openai = new OpenAI({ apiKey });
    }

    async analyzePhoto(imageBase64: string, mimeType: string, fileName: string, fileSizeKB: number, imageDimensions: any): Promise<AIAnalysisResult> {
        const promptText = `
Analyze this uploaded photograph based on the following 8 categories (0-100 score each) and return the output in the strict JSON format expected for photo analysis (8 categories, weights, etc). 
The output MUST be a JSON object conforming exactly to the FAZLENZ rubrics.
`;

        const response = await this.openai.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: promptText },
                        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
                    ]
                }
            ],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error('OpenAI returned empty response.');

        const parsed = JSON.parse(content);

        return { 
            ...parsed,
            engineMetadata: {
                providerName: this.name,
                modelIdentifier: this.model,
                modelVersion: 'v1',
                promptVersion: 'v1.0',
                rubricVersion: 'v1.0',
                imageProcessingVersion: 'v1.0',
                generationConfiguration: 'temperature=0.7',
                requestTimestamp: new Date().toISOString(),
                fallbackUsed: true,
                originalProvider: 'Google Gemini',
                finalProvider: this.name
            }
        };
    }

    async generateCreativeDirection(imageBase64: string, mimeType: string, genre: string, currentSummary: string): Promise<any> {
        const promptText = `Provide a detailed creative direction roadmap for ${genre} photography for this image. Output in strict JSON format.`;

        const response = await this.openai.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: promptText },
                        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
                    ]
                }
            ],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error('OpenAI creative direction returned empty response.');
        
        return JSON.parse(content);
    }
}
