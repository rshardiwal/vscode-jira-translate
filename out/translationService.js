"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class TranslationService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    translate(text, targetLanguage, sourceLanguage = 'auto') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Use Google Translation API
                const response = yield axios_1.default.post('https://translation.googleapis.com/language/translate/v2', {
                    q: text,
                    target: targetLanguage,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`,
                    },
                });
                const data = response.data.data.translations[0];
                return {
                    translatedText: data.translatedText,
                    sourceLanguage: data.detectedSourceLanguage,
                    targetLanguage,
                };
            }
            catch (error) {
                console.error('Translation API error:', error);
                throw new Error('Failed to translate text');
            }
        });
    }
}
exports.default = TranslationService;
