import { ExtensionContext, LanguageClient, services, window, workspace } from 'coc.nvim';

import fs from 'fs';

import { createLanguageClient } from './client';
import * as builtinInstallServerCommandFeature from './commands/builtinInstallServer';
import { getPythonPath, getRuffLspPath } from './tool';

let client: LanguageClient;

export async function activate(context: ExtensionContext): Promise<void> {
  if (!workspace.getConfiguration('ruff').get('enable')) return;

  const extensionStoragePath = context.storagePath;
  if (!fs.existsSync(extensionStoragePath)) {
    fs.mkdirSync(extensionStoragePath, { recursive: true });
  }

  const ruffLspPath = getRuffLspPath(context);
  const pythonCommand = getPythonPath();

  builtinInstallServerCommandFeature.activate(context, pythonCommand, client);

  if (!ruffLspPath || !fs.existsSync(ruffLspPath)) {
    window.showWarningMessage(
      'coc-ruff | "ruff-lsp" does not exist. please execute `:CocCommand ruff.builtin.installServer`'
    );
    return;
  }

  client = createLanguageClient(ruffLspPath);
  context.subscriptions.push(services.registLanguageClient(client));
}
