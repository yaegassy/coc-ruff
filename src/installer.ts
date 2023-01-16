import { ExtensionContext, window } from 'coc.nvim';

import child_process from 'child_process';
import path from 'path';
import rimraf from 'rimraf';
import util from 'util';

import { RUFF_LSP_VERSION } from './constant';

const exec = util.promisify(child_process.exec);

export async function ruffLspInstall(pythonCommand: string, context: ExtensionContext): Promise<void> {
  const pathVenv = path.join(context.storagePath, 'ruff-lsp', 'venv');

  let pathVenvPython = path.join(context.storagePath, 'ruff-lsp', 'venv', 'bin', 'python');
  if (process.platform === 'win32') {
    pathVenvPython = path.join(context.storagePath, 'ruff-lsp', 'venv', 'Scripts', 'python');
  }

  const statusItem = window.createStatusBarItem(0, { progress: true });
  statusItem.text = `Installing ruff-lsp in progress...`;
  statusItem.show();

  const installCmd =
    `${pythonCommand} -m venv ${pathVenv} && ` +
    `${pathVenvPython} -m pip install -U pip ruff-lsp==${RUFF_LSP_VERSION}`;

  rimraf.sync(pathVenv);
  try {
    window.showInformationMessage(`Installing ruff-lsp in progress...`);
    await exec(installCmd);
    statusItem.hide();
    window.showInformationMessage(`Installation of ruff-lsp is now complete!`);
  } catch (error) {
    statusItem.hide();
    window.showErrorMessage(`Installation of ruff-lsp failed. | ${error}`);
    throw new Error();
  }
}

export async function installWrapper(pythonCommand: string, context: ExtensionContext) {
  const msg = 'Install/Upgrade ruff-lsp?';
  const ret = await window.showPrompt(msg);
  if (ret) {
    try {
      await ruffLspInstall(pythonCommand, context);
    } catch (e) {
      return;
    }
  } else {
    return;
  }
}
