import * as vscode from 'vscode';
import { registerSearchAndTranslateCommand } from './commands/searchAndTranslate';

export function activate(context: vscode.ExtensionContext) {
    // Register the command to search and translate Jira issues
    registerSearchAndTranslateCommand(context);
}

export function deactivate() {}