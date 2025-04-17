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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const searchAndTranslate_1 = require("./commands/searchAndTranslate");
const searchAndDisplay_1 = require("./commands/searchAndDisplay");
const jiraService_1 = require("./jiraService");
const jiraFormatter_1 = require("./utils/jiraFormatter");
function activate(context) {
    // Register the command to search and translate Jira issues
    (0, searchAndTranslate_1.registerSearchAndTranslateCommand)(context);
    // Register the command to search and display Jira tickets
    (0, searchAndDisplay_1.registerSearchAndDisplayCommand)(context);
    let addCommentToJira = vscode.commands.registerCommand('vscodeJiraTranslate.addCommentToJira', () => __awaiter(this, void 0, void 0, function* () {
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
            const baseUrl = config.get('baseUrl');
            const username = config.get('username');
            const apiToken = config.get('apiToken');
            if (!baseUrl || !username || !apiToken) {
                vscode.window.showErrorMessage('Please configure Jira settings in extension settings');
                return;
            }
            // Prompt for Jira issue key
            const issueKey = yield vscode.window.showInputBox({
                placeHolder: 'Enter Jira issue key (e.g., PROJECT-123)',
                prompt: 'Enter the Jira issue key where you want to add the comment'
            });
            if (!issueKey) {
                vscode.window.showInformationMessage('Operation cancelled');
                return;
            }
            // Use our own JiraService instead of jira-client
            const jiraService = new jiraService_1.JiraService(baseUrl, username, apiToken);
            // Convert text to Jira markup format to preserve formatting
            const formattedComment = (0, jiraFormatter_1.textToJiraMarkup)(selectedText);
            // Add comment
            yield jiraService.addComment(issueKey, formattedComment);
            vscode.window.showInformationMessage(`Comment added to ${issueKey} successfully!`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Error adding comment to Jira: ${errorMessage}`);
        }
    }));
    context.subscriptions.push(addCommentToJira);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
