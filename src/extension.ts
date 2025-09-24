// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'extension.toggleCopilotAutocomplete';
  context.subscriptions.push(statusBarItem);

  const updateStatusBar = () => {
    const config = vscode.workspace.getConfiguration();
    const current = config.get<boolean>('github.copilot.editor.enableAutoCompletions', true);
    statusBarItem.text = current ? '🤖 Copilot Auto: On' : '❌ Copilot Auto: Off';
    statusBarItem.tooltip = 'Toggle Copilot Autocomplete';
    statusBarItem.show();
  };

  const disposable = vscode.commands.registerCommand('extension.toggleCopilotAutocomplete', async () => {
    const config = vscode.workspace.getConfiguration();
    const current = config.get<boolean>('github.copilot.editor.enableAutoCompletions', true);

    await config.update(
      'github.copilot.editor.enableAutoCompletions',
      !current,
      vscode.ConfigurationTarget.Global
    );

    vscode.window.showInformationMessage(
      `Copilot autocomplete ${!current ? 'enabled ✅' : 'disabled ❌'}`
    );

    updateStatusBar();
  });

  context.subscriptions.push(disposable);
  updateStatusBar();

  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('github.copilot.editor.enableAutoCompletions')) {
      updateStatusBar();
    }
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
