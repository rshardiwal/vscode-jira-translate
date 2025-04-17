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
exports.JiraService = void 0;
const axios_1 = __importDefault(require("axios"));
const vscode = __importStar(require("vscode"));
class JiraService {
    constructor(baseUrl, username, apiToken) {
        this.baseUrl = baseUrl;
        this.username = username;
        this.apiToken = apiToken;
        this.outputChannel = vscode.window.createOutputChannel('Jira Translate');
    }
    searchIssue(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.outputChannel.appendLine(`Searching for issue: ${issueId}`);
                const response = yield axios_1.default.get(`${this.baseUrl}/rest/api/2/issue/${issueId}`, {
                    auth: {
                        username: this.username,
                        password: this.apiToken
                    }
                });
                const data = response.data;
                this.outputChannel.appendLine(`Successfully retrieved issue: ${issueId}`);
                return this.mapToJiraIssue(data);
            }
            catch (error) {
                this.outputChannel.appendLine(`Error searching for issue ${issueId}: ${error}`);
                console.error(`Error searching for issue ${issueId}:`, error);
                return null;
            }
        });
    }
    getIssueDetails(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.searchIssue(issueId);
        });
    }
    addComment(issueId, comment) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Note: We're no longer sanitizing here since textToJiraMarkup already does that
                // and we want to preserve the Jira markup formatting
                this.outputChannel.appendLine(`Adding comment to issue ${issueId}`);
                const response = yield axios_1.default.post(`${this.baseUrl}/rest/api/2/issue/${issueId}/comment`, { body: comment }, {
                    auth: {
                        username: this.username,
                        password: this.apiToken
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                this.outputChannel.appendLine(`Successfully added comment to issue ${issueId}`);
                return true;
            }
            catch (error) {
                const errorMessage = ((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.errorMessages) === null || _c === void 0 ? void 0 : _c.join(', ')) ||
                    ((_f = (_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.errors) === null || _f === void 0 ? void 0 : _f.comment) ||
                    error.message ||
                    'Unknown error';
                this.outputChannel.appendLine(`Error adding comment to issue ${issueId}: ${errorMessage}`);
                console.error(`Error adding comment to issue ${issueId}:`, error);
                throw new Error(`Failed to add comment: ${errorMessage}`);
            }
        });
    }
    mapToJiraIssue(data) {
        var _a, _b;
        return {
            id: data.id,
            key: data.key,
            summary: data.fields.summary,
            description: data.fields.description || '',
            status: ((_a = data.fields.status) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
            assignee: ((_b = data.fields.assignee) === null || _b === void 0 ? void 0 : _b.displayName) || 'Unassigned'
        };
    }
}
exports.JiraService = JiraService;
