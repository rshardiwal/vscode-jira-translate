# README.md

# VSCode Jira Translate Extension

This extension allows you to search for Jira issues and translate the text, adding the translation as a comment directly in your Jira issue.

## Features

- Search for Jira issues by ID.
- Translate text into a specified language.
- Add translations as comments to Jira issues.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/vscode-jira-translate.git
   ```
2. Navigate to the project directory:
   ```
   cd vscode-jira-translate
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Packaging and Distribution

To create a .vsix file for installation:

1. Install the vsce packaging tool:
   ```
   npm install -g @vscode/vsce
   ```
2. Package the extension:
   ```
   vsce package
   ```
3. This will create a .vsix file in your current directory.

### Installing the Extension from .vsix

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X)
3. Click on the "..." at the top-right of the Extensions view
4. Select "Install from VSIX..."
5. Navigate to and select your .vsix file

## Usage

1. Open the command palette (Ctrl+Shift+P).
2. Type `Search and Translate` to initiate the command.
3. Enter the Jira issue ID you want to search for.
4. Provide the text you want to translate and the target language.
5. The translation will be added as a comment to the Jira issue.

## Contributing

Feel free to submit issues or pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.
