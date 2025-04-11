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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSearchAndTranslateCommand = void 0;
const vscode = __importStar(require("vscode"));
const jiraService_1 = require("../jiraService");
const translationService_1 = __importDefault(require("../translationService"));
function registerSearchAndTranslateCommand(context) {
    const disposable = vscode.commands.registerCommand('vscodeJiraTranslate.searchAndTranslate', () => __awaiter(this, void 0, void 0, function* () {
        // Get configuration
        const config = vscode.workspace.getConfiguration('jiraTranslate');
        const jiraBaseUrl = config.get('baseUrl') || '';
        const jiraUsername = config.get('username') || '';
        const jiraApiToken = config.get('apiToken') || '';
        const translationApiKey = config.get('translationApiKey') || '';
        if (!jiraBaseUrl || !jiraUsername || !jiraApiToken) {
            vscode.window.showErrorMessage('Please configure Jira credentials in settings');
            return;
        }
        if (!translationApiKey) {
            vscode.window.showErrorMessage('Please configure the translation API key in settings');
            return;
        }
        const jiraService = new jiraService_1.JiraService(jiraBaseUrl, jiraUsername, jiraApiToken);
        const issueId = yield vscode.window.showInputBox({ prompt: 'Enter Jira Issue ID' });
        if (!issueId) {
            vscode.window.showErrorMessage('No issue ID provided');
            return;
        }
        const issue = yield jiraService.searchIssue(issueId);
        if (!issue) {
            vscode.window.showErrorMessage(`Issue ${issueId} not found`);
            return;
        }
        const textToTranslate = issue.description; // Assuming the description needs translation
        const targetLanguage = yield vscode.window.showInputBox({ prompt: 'Enter target language code (e.g., "fr" for French)' });
        if (!targetLanguage) {
            vscode.window.showErrorMessage('No target language provided');
            return;
        }
        const translationService = new translationService_1.default(translationApiKey);
        const translationResult = yield translationService.translate(textToTranslate, targetLanguage);
        if (translationResult) {
            yield jiraService.addComment(issueId, translationResult.translatedText);
            vscode.window.showInformationMessage(`Translation added as comment to issue ${issueId}`);
        }
        else {
            vscode.window.showErrorMessage('Translation failed');
        }
    }));
    context.subscriptions.push(disposable);
}
exports.registerSearchAndTranslateCommand = registerSearchAndTranslateCommand;
