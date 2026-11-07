import { AIProvider, AIAnalysisResult } from './types';
import { GeminiProvider } from './GeminiProvider';
import { OpenAIProvider } from './OpenAIProvider';

export class AIGateway {
    private primary: AIProvider;
    private secondary: AIProvider;

    constructor() {
        this.primary = new GeminiProvider();
        this.secondary = new OpenAIProvider();
    }

    async analyzePhoto(imageBase64: string, mimeType: string, fileName: string, fileSizeKB: number, imageDimensions: any): Promise<AIAnalysisResult> {
        let lastError: any;
        try {
            console.log('Attempting primary provider...');
            return await this.primary.analyzePhoto(imageBase64, mimeType, fileName, fileSizeKB, imageDimensions);
        } catch (error: any) {
            lastError = error;
            console.warn(`Primary provider ${this.primary.name} failed:`, error.message);
            
            // Failover condition: Quota exhaustion or major service failure
            if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Quota exceeded') || error?.message?.includes('503')) {
                console.log('Attempting secondary provider due to primary failure...');
                try {
                    const result = await this.secondary.analyzePhoto(imageBase64, mimeType, fileName, fileSizeKB, imageDimensions);
                    result.engineMetadata.fallbackUsed = true;
                    return result;
                } catch (secondaryError) {
                    console.error(`Secondary provider ${this.secondary.name} also failed:`, secondaryError);
                }
            }
        }
        throw lastError || new Error('All AI providers failed.');
    }

    async generateCreativeDirection(imageBase64: string, mimeType: string, genre: string, currentSummary: string): Promise<any> {
        // Implement similar failover for creative direction
        return await this.primary.generateCreativeDirection(imageBase64, mimeType, genre, currentSummary);
    }
}
