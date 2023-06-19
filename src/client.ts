import { LanguageClient, LanguageClientOptions, ServerOptions, workspace } from 'coc.nvim';

import which from 'which';

export function createLanguageClient(command: string) {
  const serverOptions: ServerOptions = {
    command,
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: ['python'],
    initializationOptions: getInitializationOptions(),
    disabledFeatures: getLanguageClientDisabledFeatures(),
  };

  const client = new LanguageClient('ruff', 'ruff-lsp', serverOptions, clientOptions);
  return client;
}

type Run = 'onType' | 'onSave';

type RuffLspInitializationOptions = {
  settings: {
    logLevel: string;
    args: string[];
    path: string[];
    importStrategy: string;
    run: Run;
    interpreter: string[];
    showNotifications: string;
    organizeImports: boolean;
    fixAll: boolean;
  };
};

function convertFromWorkspaceConfigToInitializationOptions() {
  const settings = workspace.getConfiguration('ruff');

  const initializationOptions = <RuffLspInitializationOptions>{
    settings: {
      logLevel: settings.get('logLevel'),
      args: settings.get('args'),
      path: settings.get('path'),
      interpreter: settings.get('interpreter'),
      importStrategy: settings.get('importStrategy'),
      run: settings.get<Run>(`run`) ?? 'onType',
      showNotifications: settings.get('showNotifications'),
      organizeImports: settings.get('organizeImports'),
      fixAll: settings.get('fixAll'),
    },
  };

  return initializationOptions;
}

function getInitializationOptions() {
  const initializationOptions = convertFromWorkspaceConfigToInitializationOptions();

  // MEMO: Custom Feature
  if (workspace.getConfiguration('ruff').get<boolean>('useDetectRuffCommand')) {
    const envRuffCommandPath = which.sync('ruff', { nothrow: true });
    if (envRuffCommandPath) {
      initializationOptions.settings.path = [envRuffCommandPath];
    }
  }

  return initializationOptions;
}

function getLanguageClientDisabledFeatures() {
  const r: string[] = [];
  if (getConfigDisableDocumentFormatting()) r.push('documentFormatting');
  if (getConfigDisableHover()) r.push('hover');

  return r;
}

function getConfigDisableDocumentFormatting() {
  return workspace.getConfiguration('ruff').get<boolean>('disableDocumentFormatting', true);
}

function getConfigDisableHover() {
  return workspace.getConfiguration('ruff').get<boolean>('disableHover', false);
}
