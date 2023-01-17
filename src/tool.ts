import { ExtensionContext, workspace } from 'coc.nvim';

import fs from 'fs';
import path from 'path';
import which from 'which';

export function getPythonPath(): string {
  let pythonPath = workspace.getConfiguration('ruff').get<string>('builtin.pythonPath', '');
  if (pythonPath) {
    return pythonPath;
  }

  pythonPath = which.sync('python3', { nothrow: true }) || '';
  if (pythonPath) {
    pythonPath = fs.realpathSync(pythonPath);
    return pythonPath;
  }

  pythonPath = which.sync('python', { nothrow: true }) || '';
  if (pythonPath) {
    pythonPath = fs.realpathSync(pythonPath);
    return pythonPath;
  }

  return pythonPath;
}

export function getRuffLspPath(context: ExtensionContext) {
  // MEMO: Priority to detect ruff-lsp
  //
  // 1. ruff.serverPath setting
  // 2. current python environment (e.g. global or virtual environment)
  // 3. built-in ruff-lsp

  // 1
  let ruffLspPath = workspace.getConfiguration('ruff').get('serverPath', '');
  if (!ruffLspPath) {
    // 2
    ruffLspPath = which.sync('ruff-lsp', { nothrow: true }) || '';
    if (!ruffLspPath) {
      if (
        fs.existsSync(path.join(context.storagePath, 'ruff-lsp', 'venv', 'Scripts', 'ruff-lsp.exe')) ||
        fs.existsSync(path.join(context.storagePath, 'ruff-lsp', 'venv', 'bin', 'ruff-lsp'))
      ) {
        // 3
        if (process.platform === 'win32') {
          ruffLspPath = path.join(context.storagePath, 'ruff-lsp', 'venv', 'Scripts', 'ruff-lsp.exe');
        } else {
          ruffLspPath = path.join(context.storagePath, 'ruff-lsp', 'venv', 'bin', 'ruff-lsp');
        }
      }
    }
  }

  return ruffLspPath;
}
