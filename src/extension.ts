import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.command = 'copilot-toggle.toggle';
    context.subscriptions.push(statusBar);

    const updateStatus = (enabled: boolean) => {
        statusBar.text = enabled ? 'Copilot: On' : 'Copilot: Off';
        statusBar.show();
    };

    const disposable = vscode.commands.registerCommand('copilot-toggle.toggle', async () => {
        const config = vscode.workspace.getConfiguration('github.copilot');
        const current = config.get<{ [key: string]: boolean }>('enable') || {};
        const currentAll = current['*'] ?? true; // default is true if not set

        // Flip the global "*" value
        current['*'] = !currentAll;

        await config.update('enable', current, vscode.ConfigurationTarget.Global);
        updateStatus(!currentAll);

        vscode.window.showInformationMessage(
            `Copilot autocompletions ${!currentAll ? 'enabled' : 'disabled'}`
        );
    });

    context.subscriptions.push(disposable);

    // Initialize status bar based on current value
    const config = vscode.workspace.getConfiguration('github.copilot');
    const current = config.get<{ [key: string]: boolean }>('enable') || {};
    updateStatus(current['*'] ?? true);
}

export function deactivate() {}
