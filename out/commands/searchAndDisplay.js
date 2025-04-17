"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSearchAndDisplayCommand = void 0;
const vscode = __importStar(require("vscode"));
const jiraService_1 = require("../jiraService");
function registerSearchAndDisplayCommand(context) {
    const disposable = vscode.commands.registerCommand('vscodeJiraTranslate.searchAndDisplay', () => __awaiter(this, void 0, void 0, function* () {
        // Get configuration
        const config = vscode.workspace.getConfiguration('jiraTranslate');
        const jiraBaseUrl = config.get('baseUrl') || '';
        const jiraUsername = config.get('username') || '';
        const jiraApiToken = config.get('apiToken') || '';
        if (!jiraBaseUrl || !jiraUsername || !jiraApiToken) {
            vscode.window.showErrorMessage('Please configure Jira credentials in settings');
            return;
        }
        const jiraService = new jiraService_1.JiraService(jiraBaseUrl, jiraUsername, jiraApiToken);
        const issueId = yield vscode.window.showInputBox({ prompt: 'Enter Jira Issue ID' });
        if (!issueId) {
            vscode.window.showErrorMessage('No issue ID provided');
            return;
        }
        try {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `Fetching JIRA ticket ${issueId}...`,
                cancellable: false
            }, () => __awaiter(this, void 0, void 0, function* () {
                const issue = yield jiraService.getIssueDetails(issueId);
                if (!issue) {
                    vscode.window.showErrorMessage(`Issue ${issueId} not found`);
                    return;
                }
                // Create a new untitled document with ticket content
                const document = yield vscode.workspace.openTextDocument({
                    content: formatJiraIssue(issue),
                    language: 'markdown'
                });
                yield vscode.window.showTextDocument(document);
                vscode.window.showInformationMessage(`JIRA ticket ${issueId} displayed`);
            }));
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error fetching JIRA ticket: ${error}`);
        }
    }));
    context.subscriptions.push(disposable);
}
exports.registerSearchAndDisplayCommand = registerSearchAndDisplayCommand;
function formatJiraIssue(issue) {
    return `# ${issue.key}: ${issue.summary}

## Details
- **Status:** ${issue.status}
- **Assignee:** ${issue.assignee}
- **ID:** ${issue.id}

## Description
${issue.description || "No description provided."}
`;
}
