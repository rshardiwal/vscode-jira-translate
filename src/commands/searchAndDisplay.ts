import * as vscode from 'vscode';
import { JiraService } from '../jiraService';

export function registerSearchAndDisplayCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('vscodeJiraTranslate.searchAndDisplay', async () => {
        // Get configuration
        const config = vscode.workspace.getConfiguration('jiraTranslate');
        const jiraBaseUrl = config.get<string>('baseUrl') || '';
        const jiraUsername = config.get<string>('username') || '';
        const jiraApiToken = config.get<string>('apiToken') || '';

        if (!jiraBaseUrl || !jiraUsername || !jiraApiToken) {
            vscode.window.showErrorMessage('Please configure Jira credentials in settings');
            return;
        }

        const jiraService = new JiraService(jiraBaseUrl, jiraUsername, jiraApiToken);
        const issueId = await vscode.window.showInputBox({ prompt: 'Enter Jira Issue ID' });
        if (!issueId) {
            vscode.window.showErrorMessage('No issue ID provided');
            return;
        }

        try {
            vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: `Fetching JIRA ticket ${issueId}...`,
                    cancellable: false
                },
                async () => {
                    const issue = await jiraService.getIssueDetails(issueId);
                    if (!issue) {
                        vscode.window.showErrorMessage(`Issue ${issueId} not found`);
                        return;
                    }

                    // Create a new untitled document with ticket content
                    const document = await vscode.workspace.openTextDocument({
                        content: formatJiraIssue(issue),
                        language: 'markdown'
                    });
                    await vscode.window.showTextDocument(document);
                    vscode.window.showInformationMessage(`JIRA ticket ${issueId} displayed`);
                }
            );
        } catch (error) {
            vscode.window.showErrorMessage(`Error fetching JIRA ticket: ${error}`);
        }
    });

    context.subscriptions.push(disposable);
}

function formatJiraIssue(issue: any): string {
    return `# ${issue.key}: ${issue.summary}

## Details
- **Status:** ${issue.status}
- **Assignee:** ${issue.assignee}
- **ID:** ${issue.id}

## Description
${issue.description || "No description provided."}
`;
}
