import axios from 'axios';
import { TranslationResult } from './types';

export default class TranslationService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async translate(text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<TranslationResult> {
        try {
            // Use Google Translation API
            const response = await axios.post(
                'https://translation.googleapis.com/language/translate/v2',
                {
                    q: text,
                    target: targetLanguage,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`,
                    },
                }
            );

            const data = response.data.data.translations[0];
            return {
                translatedText: data.translatedText,
                sourceLanguage: data.detectedSourceLanguage,
                targetLanguage,
            };
        } catch (error) {
            console.error('Translation API error:', error);
            throw new Error('Failed to translate text');
        }
    }
}
