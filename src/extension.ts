import * as vscode from 'vscode';
import { registerSearchAndTranslateCommand } from './commands/searchAndTranslate';
import { registerSearchAndDisplayCommand } from './commands/searchAndDisplay';

export function activate(context: vscode.ExtensionContext) {
    // Register the command to search and translate Jira issues
    registerSearchAndTranslateCommand(context);
    
    // Register the command to search and display Jira tickets
    registerSearchAndDisplayCommand(context);
}

export function deactivate() {}
