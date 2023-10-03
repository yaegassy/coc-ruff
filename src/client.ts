import { LanguageClient, LanguageClientOptions, ServerOptions, workspace } from 'coc.nvim';

import which from 'which';

export function createLanguageClient(command: string) {
  const settings = workspace.getConfiguration('ruff');
  const newEnv = { ...process.env };

  const serverOptions: ServerOptions = {
    command,
    options: { env: newEnv },
  };

  if (settings.enableExperimentalFormatter) {
    newEnv.RUFF_EXPERIMENTAL_FORMATTER = '1';
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: ['python'],
    initializationOptions: getInitializationOptions(),
    disabledFeatures: getLanguageClientDisabledFeatures(),
  };

  const client = new LanguageClient('ruff', 'ruff-lsp', serverOptions, clientOptions);
  return client;
}

type ImportStrategy = 'fromEnvironment' | 'useBundled';

type Run = 'onType' | 'onSave';

type RuffLspInitializationOptions = {
  settings: {
    logLevel: string;
    args: string[];
    path: string[];
    importStrategy: ImportStrategy;
    run: Run;
    interpreter: string[];
    organizeImports: boolean;
    fixAll: boolean;
    codeAction: {
      fixViolation: {
        enable: boolean;
      };
      disableRuleComment: {
        enable: boolean;
      };
    };
    enableExperimentalFormatter: boolean;
    showNotifications: string;
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
      importStrategy: settings.get<ImportStrategy>(`importStrategy`) ?? 'fromEnvironment',
      run: settings.get<Run>(`run`) ?? 'onType',
      organizeImports: settings.get('organizeImports'),
      fixAll: settings.get('fixAll'),
      codeAction: {
        fixViolation: {
          enable: settings.get('codeAction.fixViolation.enable'),
        },
        disableRuleComment: {
          enable: settings.get('codeAction.disableRuleComment.enable'),
        },
      },
      showNotifications: settings.get<string>('showNotifications') ?? 'off',
      enableExperimentalFormatter: settings.get('enableExperimentalFormatter'),
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
  if (getConfigDisableHover()) r.push('hover');

  return r;
}

function getConfigDisableHover() {
  return workspace.getConfiguration('ruff').get<boolean>('disableHover', false);
}
