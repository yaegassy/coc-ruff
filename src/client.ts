import { LanguageClient, LanguageClientOptions, ServerOptions, workspace } from 'coc.nvim';

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

type RuffLspInitializationOptions = {
  settings: {
    logLevel: string;
    args: string[];
    path: string[];
    importStrategy: string;
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
      importStrategy: settings.get('importStrategy'),
      showNotifications: settings.get('showNotifications'),
      organizeImports: settings.get('organizeImports'),
      fixAll: settings.get('fixAll'),
    },
  };

  return initializationOptions;
}

function getInitializationOptions() {
  const initializationOptions = convertFromWorkspaceConfigToInitializationOptions();
  return initializationOptions;
}

function getLanguageClientDisabledFeatures() {
  const r: string[] = [];
  if (getConfigDisableDocumentFormatting()) r.push('documentFormatting');

  return r;
}

function getConfigDisableDocumentFormatting() {
  return workspace.getConfiguration('ruff').get<boolean>('disableDocumentFormatting', true);
}
