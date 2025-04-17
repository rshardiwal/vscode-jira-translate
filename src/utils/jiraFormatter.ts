/**
 * Utility functions for formatting text for Jira
 */

/**
 * Sanitizes text to be used in Jira comments
 * Jira has specific requirements for comment formatting
 * 
 * @param text The text to sanitize
 * @returns Sanitized text that can be safely sent to Jira API
 */
export function sanitizeJiraText(text: string): string {
    if (!text) {
        return '';
    }

    // Replace any potentially problematic characters or sequences
    // that might cause Jira to reject the comment
    
    // Remove or escape control characters
    let sanitized = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

    // Handle potential JIRA markup issues
    // Ensure proper formatting for code blocks, etc.
    
    // Limit comment length if necessary (Jira has limits)
    const MAX_COMMENT_LENGTH = 32000; // Adjust based on your Jira instance limits
    if (sanitized.length > MAX_COMMENT_LENGTH) {
        sanitized = sanitized.substring(0, MAX_COMMENT_LENGTH) + '... (comment truncated due to size limitations)';
    }

    return sanitized;
}

/**
 * Converts plain text to Jira markup format when needed
 * 
 * @param text The text to convert
 * @returns Text formatted with Jira markup
 */
export function textToJiraMarkup(text: string): string {
    if (!text) {
        return '';
    }
    
    // Sanitize the text first
    let formatted = sanitizeJiraText(text);
    
    // Convert common markdown/formatting to Jira markup
    
    // Headers
    formatted = formatted.replace(/^# (.+)$/gm, 'h1. $1');
    formatted = formatted.replace(/^## (.+)$/gm, 'h2. $1');
    formatted = formatted.replace(/^### (.+)$/gm, 'h3. $1');
    formatted = formatted.replace(/^#### (.+)$/gm, 'h4. $1');
    formatted = formatted.replace(/^##### (.+)$/gm, 'h5. $1');
    formatted = formatted.replace(/^###### (.+)$/gm, 'h6. $1');
    
    // Bold
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '*$1*');
    formatted = formatted.replace(/\_\_(.+?)\_\_/g, '*$1*');
    
    // Italic
    formatted = formatted.replace(/\*(.+?)\*/g, '_$1_');
    formatted = formatted.replace(/\_(.+?)\_/g, '_$1_');
    
    // Lists
    formatted = formatted.replace(/^(\s*)\- (.+)$/gm, '$1* $2');
    formatted = formatted.replace(/^(\s*)\+ (.+)$/gm, '$1* $2');
    formatted = formatted.replace(/^(\s*)[0-9]+\. (.+)$/gm, '$1# $2');
    
    // Code blocks
    formatted = formatted.replace(/```([a-z]*)\n([\s\S]*?)\n```/gm, '{code:$1}\n$2\n{code}');
    formatted = formatted.replace(/`([^`]+)`/g, '{{$1}}');
    
    // Links - simple case
    formatted = formatted.replace(/\[(.+?)\]\((.+?)\)/g, '[$1|$2]');
    
    // Tables - basic support
    // More complex table conversions would need more sophisticated parsing
    
    return formatted;
}
