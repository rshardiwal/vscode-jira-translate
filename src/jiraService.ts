import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export class JiraService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async searchIssue(issueId: string): Promise<JiraIssue | null> {
        try {
            const { stdout } = await execPromise(`jira issue view ${issueId} --output json`);
            const data = JSON.parse(stdout);
            return this.mapToJiraIssue(data);
        } catch (error) {
            console.error(`Error searching for issue ${issueId}:`, error);
            return null;
        }
    }

    public async getIssueDetails(issueId: string): Promise<JiraIssue | null> {
        return this.searchIssue(issueId);
    }

    public async addComment(issueId: string, comment: string): Promise<boolean> {
        try {
            await execPromise(`jira issue comment add ${issueId} --comment "${comment}"`);
            return true;
        } catch (error) {
            console.error(`Error adding comment to issue ${issueId}:`, error);
            return false;
        }
    }

    private mapToJiraIssue(data: any): JiraIssue {
        return {
            id: data.id,
            key: data.key,
            summary: data.fields.summary,
            description: data.fields.description,
            status: data.fields.status.name,
            assignee: data.fields.assignee?.displayName || 'Unassigned'
        };
    }
}

export interface JiraIssue {
    id: string;
    key: string;
    summary: string;
    description: string;
    status: string;
    assignee: string;
}
