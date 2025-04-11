export interface JiraIssue {
    id: string;
    key: string;
    summary: string;
    description: string;
    status: string;
    assignee: string;
}

export interface TranslationResult {
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
}