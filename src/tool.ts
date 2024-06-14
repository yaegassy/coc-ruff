import { ExtensionContext, workspace } from 'coc.nvim';

import fs from 'fs';
import path from 'path';
import which from 'which';

import child_process from 'child_process';
import util from 'util';
import semver from 'semver';

const exec = util.promisify(child_process.exec);

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

export async function getRuffBinaryPath() {
  // MEMO: Priority to detect ruff binary
  //
  // 1. ruff.nativeBinaryPath setting
  // 2. current environment

  // 1
  let rufrBinaryPath = workspace.getConfiguration('ruff').get('nativeBinaryPath', '');
  if (!rufrBinaryPath) {
    // 2
    rufrBinaryPath = which.sync('ruff', { nothrow: true }) || '';
  }

  // check supported version
  //if (rufrBinaryPath) {
  //  const versionStr = await getToolVersion(rufrBinaryPath);

  //  if (!versionStr) return '';
  //  if (!isRuffNativeServerSupported(versionStr)) return '';
  //}

  return rufrBinaryPath;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getToolVersion(command: string): Promise<string | undefined> {
  const versionCmd = `${command} --version`;

  try {
    const { stdout } = await exec(versionCmd);
    return stdout;
  } catch (error) {
    return undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isRuffNativeServerSupported(versionStr: string): boolean {
  const parsedSemver = semver.parse(versionStr);
  if (parsedSemver) {
    return semver.gte(parsedSemver.version, '0.4.8');
  }
  return true;
}
