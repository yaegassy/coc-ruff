import { ExtensionContext, LanguageClient, services, window, workspace } from 'coc.nvim';

import fs from 'fs';

import { createLanguageClient, createNativeServerClient } from './client';
import * as builtinInstallServerCommandFeature from './commands/builtinInstallServer';
import * as executeAutofixCommandFeature from './commands/executeAutofix';
import * as executeFormatCommandFeature from './commands/executeFormat';
import * as executeOrganizeImportsCommandFeature from './commands/executeOrganizeImports';
import * as restartCommandFeature from './commands/restart';
import * as showOutputCommandFeature from './commands/showOutput';
import * as autoFixOnSaveFeature from './features/autoFixOnSave';
import * as showDocumentationCodeActionFeature from './features/showDocumentation';
import { getRuffLspPath, getRuffBinaryPath } from './tool';

let client: LanguageClient | undefined;

export async function activate(context: ExtensionContext): Promise<void> {
  if (!workspace.getConfiguration('ruff').get('enable')) return;

  const extensionStoragePath = context.storagePath;
  if (!fs.existsSync(extensionStoragePath)) {
    fs.mkdirSync(extensionStoragePath, { recursive: true });
  }

  if (workspace.getConfiguration('ruff').get('nativeServer')) {
    const command = await getRuffBinaryPath();

    if (command) {
      client = createNativeServerClient(command);
    } else {
      window.showWarningMessage('coc-ruff | "ruff" binary does not exist.`');
      return;
    }
  } else {
    const ruffLspPath = getRuffLspPath(context);
    if (!ruffLspPath || !fs.existsSync(ruffLspPath)) {
      builtinInstallServerCommandFeature.register(context, client);
      window.showWarningMessage(
        'coc-ruff | "ruff-lsp" does not exist. please execute `:CocCommand ruff.builtin.installServer`',
      );
      return;
    }
    client = createLanguageClient(ruffLspPath);
  }

  context.subscriptions.push(services.registLanguageClient(client));

  builtinInstallServerCommandFeature.register(context, client);
  showOutputCommandFeature.register(context, client);
  executeAutofixCommandFeature.register(context, client);
  executeOrganizeImportsCommandFeature.register(context, client);
  executeFormatCommandFeature.register(context, client);
  restartCommandFeature.register(context, client);
  autoFixOnSaveFeature.register(client);
  showDocumentationCodeActionFeature.register(context, client);
}
