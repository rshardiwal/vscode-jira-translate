import * as vscode from 'vscode';
import { registerSearchAndTranslateCommand } from './commands/searchAndTranslate';
import { registerSearchAndDisplayCommand } from './commands/searchAndDisplay';
import { JiraService } from './jiraService';
import { sanitizeJiraText, textToJiraMarkup } from './utils/jiraFormatter';

export function activate(context: vscode.ExtensionContext) {
    // Register the command to search and translate Jira issues
    registerSearchAndTranslateCommand(context);
    
    // Register the command to search and display Jira tickets
    registerSearchAndDisplayCommand(context);

    let addCommentToJira = vscode.commands.registerCommand('vscodeJiraTranslate.addCommentToJira', async () => {
        try {
            // Get the active text editor
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }

            // Get the selected text
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            if (!selectedText) {
                vscode.window.showErrorMessage('No text selected');
                return;
            }

            // Get Jira configuration
            const config = vscode.workspace.getConfiguration('jiraTranslate');
            const baseUrl = config.get<string>('baseUrl');
            const username = config.get<string>('username');
            const apiToken = config.get<string>('apiToken');

            if (!baseUrl || !username || !apiToken) {
                vscode.window.showErrorMessage('Please configure Jira settings in extension settings');
                return;
            }

            // Prompt for Jira issue key
            const issueKey = await vscode.window.showInputBox({
                placeHolder: 'Enter Jira issue key (e.g., PROJECT-123)',
                prompt: 'Enter the Jira issue key where you want to add the comment'
            });

            if (!issueKey) {
                vscode.window.showInformationMessage('Operation cancelled');
                return;
            }

            // Use our own JiraService instead of jira-client
            const jiraService = new JiraService(baseUrl, username, apiToken);
            
            // Convert text to Jira markup format to preserve formatting
            const formattedComment = textToJiraMarkup(selectedText);
            
            // Add comment
            await jiraService.addComment(issueKey, formattedComment);
            vscode.window.showInformationMessage(`Comment added to ${issueKey} successfully!`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Error adding comment to Jira: ${errorMessage}`);
        }
    });

    context.subscriptions.push(addCommentToJira);
}

export function deactivate() {}
