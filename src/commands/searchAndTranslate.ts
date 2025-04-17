import * as vscode from 'vscode';
import { JiraService } from '../jiraService';
import TranslationService from '../translationService';
import { sanitizeJiraText } from '../utils/jiraFormatter';

export function registerSearchAndTranslateCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('vscodeJiraTranslate.searchAndTranslate', async () => {
        // Get configuration
        const config = vscode.workspace.getConfiguration('jiraTranslate');
        const jiraBaseUrl = config.get<string>('baseUrl') || '';
        const jiraUsername = config.get<string>('username') || '';
        const jiraApiToken = config.get<string>('apiToken') || '';
        const translationApiKey = config.get<string>('translationApiKey') || '';

        if (!jiraBaseUrl || !jiraUsername || !jiraApiToken) {
            vscode.window.showErrorMessage('Please configure Jira credentials in settings');
            return;
        }

        if (!translationApiKey) {
            vscode.window.showErrorMessage('Please configure the translation API key in settings');
            return;
        }

        const jiraService = new JiraService(jiraBaseUrl, jiraUsername, jiraApiToken);
        const issueId = await vscode.window.showInputBox({ prompt: 'Enter Jira Issue ID' });
        if (!issueId) {
            vscode.window.showErrorMessage('No issue ID provided');
            return;
        }

        const issue = await jiraService.searchIssue(issueId);
        if (!issue) {
            vscode.window.showErrorMessage(`Issue ${issueId} not found`);
            return;
        }

        const textToTranslate = issue.description; // Assuming the description needs translation
        const targetLanguage = await vscode.window.showInputBox({ prompt: 'Enter target language code (e.g., "fr" for French)' });
        if (!targetLanguage) {
            vscode.window.showErrorMessage('No target language provided');
            return;
        }

        const translationService = new TranslationService(translationApiKey);
        const translationResult = await translationService.translate(textToTranslate, 'en', 'ja'); // Translate from Japanese to English
        
        if (translationResult) {
            // Sanitize the translated text before adding as a comment
            await jiraService.addComment(issueId, sanitizeJiraText(translationResult.translatedText));
            vscode.window.showInformationMessage(`Translation added as comment to issue ${issueId}`);
        } else {
            vscode.window.showErrorMessage('Translation failed');
        }
    });

    context.subscriptions.push(disposable);
}
