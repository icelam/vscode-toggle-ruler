import * as vscode from 'vscode';

/** Key of VS Code setting which enables rulers. */
const RULER_VSCODE_SETTING_KEY = 'editor.rulers';
/**
 * Key of extension setting that set the number of monospace characters at which
 * this editor ruler will render.
 */
const RULER_POSITION_SETTING_KEY = 'toggleRuler.rulerPosition';
/** Whether this extension should modify VS Code globally. */
const IS_SETTING_GLOBAL = true;

async function toggleSetting() {
  try {
    const config = vscode.workspace.getConfiguration();

    const rulerPosition = config.get(RULER_POSITION_SETTING_KEY);
    if (!rulerPosition) {
      throw new Error('Ruler position is not set');
    }

    const currentRulerSetting = config.get(RULER_VSCODE_SETTING_KEY);
    if (
      !currentRulerSetting
      || !Array.isArray(currentRulerSetting)
      || currentRulerSetting.length === 0
    ) {
      await config.update(RULER_VSCODE_SETTING_KEY, [rulerPosition], IS_SETTING_GLOBAL);
    } else {
      await config.update(RULER_VSCODE_SETTING_KEY, [], IS_SETTING_GLOBAL);
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to toggle editor ruler. Reason: ${(error as Error).message}`,
    );
  }
}

async function updateRulerPosition() {
  try {
    const config = vscode.workspace.getConfiguration();

    const rulerPosition = config.get(RULER_POSITION_SETTING_KEY);
    if (!rulerPosition) {
      throw new Error('Ruler position is not set');
    }

    const currentRulerSetting = config.get(RULER_VSCODE_SETTING_KEY);
    if (Array.isArray(currentRulerSetting) && currentRulerSetting.length > 0) {
      await config.update(RULER_VSCODE_SETTING_KEY, [rulerPosition], IS_SETTING_GLOBAL);
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to update position of editor ruler. Reason: ${(error as Error).message}`,
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "Toggle Ruler" is activated.');
  const commandDisposable = vscode.commands.registerCommand('toggleRuler.toggle', toggleSetting);
  context.subscriptions.push(commandDisposable);

  const cofigChangeDisposable = vscode.workspace.onDidChangeConfiguration(() => {
    vscode.workspace.onDidChangeConfiguration(updateRulerPosition);
  });

  context.subscriptions.push(cofigChangeDisposable);
}

export function deactivate() {
  console.log('Extension "Toggle Ruler" is deactivated.');
}
