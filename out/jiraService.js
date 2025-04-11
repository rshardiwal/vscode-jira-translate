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
exports.JiraService = void 0;
const axios_1 = __importDefault(require("axios"));
class JiraService {
    constructor(baseUrl, username, apiToken) {
        this.baseUrl = baseUrl;
        this.auth = 'Basic ' + Buffer.from(`${username}:${apiToken}`).toString('base64');
    }
    searchIssue(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.baseUrl}/rest/api/2/issue/${issueId}`, {
                    headers: {
                        'Authorization': this.auth,
                        'Accept': 'application/json'
                    }
                });
                return response.data;
            }
            catch (error) {
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${this.baseUrl}/rest/api/2/issue/${issueId}/comment`, { body: comment }, {
                    headers: {
                        'Authorization': this.auth,
                        'Content-Type': 'application/json'
                    }
                });
                return true;
            }
            catch (error) {
                console.error(`Error adding comment to issue ${issueId}:`, error);
                return false;
            }
        });
    }
    mapToJiraIssue(data) {
        var _a;
        return {
            id: data.id,
            key: data.key,
            summary: data.fields.summary,
            description: data.fields.description,
            status: data.fields.status.name,
            assignee: ((_a = data.fields.assignee) === null || _a === void 0 ? void 0 : _a.displayName) || 'Unassigned'
        };
    }
}
exports.JiraService = JiraService;
