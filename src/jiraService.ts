import axios from 'axios';
import { JiraIssue } from './types';
import * as vscode from 'vscode';
import { sanitizeJiraText } from './utils/jiraFormatter';

export class JiraService {
    private baseUrl: string;
    private username: string;
    private apiToken: string;
    private outputChannel: vscode.OutputChannel;

    constructor(baseUrl: string, username: string, apiToken: string) {
        this.baseUrl = baseUrl;
        this.username = username;
        this.apiToken = apiToken;
        this.outputChannel = vscode.window.createOutputChannel('Jira Translate');
    }

    public async searchIssue(issueId: string): Promise<JiraIssue | null> {
        try {
            this.outputChannel.appendLine(`Searching for issue: ${issueId}`);
            
            const response = await axios.get(`${this.baseUrl}/rest/api/2/issue/${issueId}`, {
                auth: {
                    username: this.username,
                    password: this.apiToken
                }
            });
            
            const data = response.data;
            this.outputChannel.appendLine(`Successfully retrieved issue: ${issueId}`);
            return this.mapToJiraIssue(data);
        } catch (error) {
            this.outputChannel.appendLine(`Error searching for issue ${issueId}: ${error}`);
            console.error(`Error searching for issue ${issueId}:`, error);
            return null;
        }
    }

    public async getIssueDetails(issueId: string): Promise<JiraIssue | null> {
        return this.searchIssue(issueId);
    }

    public async addComment(issueId: string, comment: string): Promise<boolean> {
        try {
            // Note: We're no longer sanitizing here since textToJiraMarkup already does that
            // and we want to preserve the Jira markup formatting
            this.outputChannel.appendLine(`Adding comment to issue ${issueId}`);
            
            const response = await axios.post(
                `${this.baseUrl}/rest/api/2/issue/${issueId}/comment`, 
                { body: comment },
                {
                    auth: {
                        username: this.username,
                        password: this.apiToken
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            this.outputChannel.appendLine(`Successfully added comment to issue ${issueId}`);
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.errorMessages?.join(', ') || 
                               error.response?.data?.errors?.comment || 
                               error.message || 
                               'Unknown error';
                               
            this.outputChannel.appendLine(`Error adding comment to issue ${issueId}: ${errorMessage}`);
            console.error(`Error adding comment to issue ${issueId}:`, error);
            throw new Error(`Failed to add comment: ${errorMessage}`);
        }
    }

    private mapToJiraIssue(data: any): JiraIssue {
        return {
            id: data.id,
            key: data.key,
            summary: data.fields.summary,
            description: data.fields.description || '',
            status: data.fields.status?.name || 'Unknown',
            assignee: data.fields.assignee?.displayName || 'Unassigned'
        };
    }
}
