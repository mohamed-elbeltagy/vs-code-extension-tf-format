const vscode = require('vscode');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

// Validate file path to prevent command injection
function isValidFilePath(filePath) {
    try {
        // Check if path contains suspicious characters
        if (/[;&|`$]/.test(filePath)) {
            return false;
        }
        
        // Ensure the path is absolute and normalized
        const normalizedPath = path.normalize(filePath);
        const absolutePath = path.resolve(filePath);
        
        // Verify file extension
        const validExtensions = ['.tf', '.tfvars'];
        if (!validExtensions.includes(path.extname(filePath))) {
            return false;
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

function activate(context) {
    // Create a map to track formatting status
    const formattingInProgress = new Map();

    let disposable = vscode.workspace.onWillSaveTextDocument(async (event) => {
        if (event.document.languageId === 'terraform') {
            const filePath = event.document.uri.fsPath;
            
            // Check if formatting is already in progress for this file
            if (formattingInProgress.get(filePath)) {
                return;
            }

            // Mark formatting as in progress
            formattingInProgress.set(filePath, true);
            
            try {
                // Add delay before formatting
                await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay

                // Validate file path before processing
                if (!isValidFilePath(filePath)) {
                    vscode.window.showErrorMessage('Invalid file path detected');
                    return;
                }
                
                // Use shell: false for security and escape the file path
                const options = {
                    shell: false,
                    timeout: 10000, // 10 second timeout
                    maxBuffer: 1024 * 1024 // 1MB buffer
                };
                
                await execAsync(`terraform fmt "${filePath}"`, options);
            } catch (error) {
                const errorStr = error.message || '';
                
                if (error.code === 'ENOENT') {
                    vscode.window.showErrorMessage('Terraform not found. Please ensure it is installed and added to PATH.');
                } else if (errorStr.includes('Error: Invalid expression')) {
                    vscode.window.showErrorMessage('Invalid Terraform syntax: The file contains invalid expressions or incomplete blocks.');
                } else if (errorStr.includes('Error: Missing name for block')) {
                    vscode.window.showErrorMessage('Invalid Terraform syntax: Block is missing a name or label.');
                } else if (errorStr.includes('Error: Argument or block definition required')) {
                    vscode.window.showErrorMessage('Invalid Terraform syntax: Empty blocks are not allowed.');
                } else if (errorStr.includes('Error: Invalid block definition')) {
                    vscode.window.showErrorMessage('Invalid Terraform syntax: The file contains malformed block definitions.');
                } else {
                    vscode.window.showErrorMessage('Failed to format Terraform file: The file contains invalid HCL syntax.');
                }
            } finally {
                // Clear the formatting status regardless of success or failure
                formattingInProgress.delete(filePath);
            }
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
} 