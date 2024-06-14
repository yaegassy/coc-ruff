import { LanguageClient, LanguageClientOptions, ServerOptions, workspace } from 'coc.nvim';
import { RUFF_SERVER_CMD, RUFF_SERVER_REQUIRED_ARGS } from './constant';

import which from 'which';

export function createNativeServerClient(command: string) {
  const settings = workspace.getConfiguration('ruff');
  const newEnv = { ...process.env };
  const args = [RUFF_SERVER_CMD, ...RUFF_SERVER_REQUIRED_ARGS];

  const serverOptions: ServerOptions = {
    command,
    args,
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

  const client = new LanguageClient('ruff', 'ruff native server', serverOptions, clientOptions);
  return client;
}

export function createLanguageClient(command: string) {
  const settings = workspace.getConfiguration('ruff');
  const newEnv = { ...process.env };

  const serverOptions: ServerOptions = {
    command,
    options: { env: newEnv },
  };

  // MEMO: Used in ruff-lsp v0.0.41 and earlier. This item will be removed in the future
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

type CodeAction = {
  disableRuleComment?: {
    enable?: boolean;
  };
  fixViolation?: {
    enable?: boolean;
  };
};

type Lint = {
  enable?: boolean;
  args?: string[];
  run?: Run;
};

type Format = {
  args?: string[];
};

type RuffLspInitializationOptions = {
  settings: {
    args: string[];
    path: string[];
    run: Run;
    ignoreStandardLibrary: boolean;
    interpreter: string[];
    importStrategy: ImportStrategy;
    codeAction: CodeAction;
    enableExperimentalFormatter: boolean;
    showNotifications: string;
    organizeImports: boolean;
    fixAll: boolean;
    lint: Lint;
    format: Format;
  };
};

function convertFromWorkspaceConfigToInitializationOptions() {
  const settings = workspace.getConfiguration('ruff');

  const initializationOptions = <RuffLspInitializationOptions>{
    settings: {
      args: settings.get<string[]>('args'),
      path: settings.get<string[]>('path'),
      ignoreStandardLibrary: settings.get<boolean>('ignoreStandardLibrary') ?? true,
      interpreter: settings.get('interpreter'),
      importStrategy: settings.get<ImportStrategy>(`importStrategy`) ?? 'fromEnvironment',
      run: settings.get<Run>(`run`) ?? 'onType',
      organizeImports: settings.get<boolean>('organizeImports') ?? true,
      fixAll: settings.get<boolean>('fixAll') ?? true,
      codeAction: {
        fixViolation: {
          enable: settings.get('codeAction.fixViolation.enable'),
        },
        disableRuleComment: {
          enable: settings.get('codeAction.disableRuleComment.enable'),
        },
      },
      lint: {
        enable: settings.get<boolean>('lint.enable') ?? true,
        run: getLintRunSetting(),
        args: getLintArgsSetting(),
      },
      format: {
        args: settings.get<string[]>('format.args'),
      },
      showNotifications: settings.get<string>('showNotifications') ?? 'off',
      // MEMO: Used in ruff-lsp v0.0.41 and earlier. This item will be removed in the future
      enableExperimentalFormatter: settings.get<boolean>('enableExperimentalFormatter') ?? false,
    },
  };

  return initializationOptions;
}

// MEMO: Temporary compatibility support for old and new settings
function getLintArgsSetting() {
  const settings = workspace.getConfiguration('ruff');

  if (settings.get<string[]>('lint.args', []).length > 0) {
    return settings.get<string[]>('lint.args', []);
  } else if (settings.get<string[]>('args', []).length > 0) {
    return settings.get<string[]>('args', []);
  }

  return [];
}

// MEMO: Temporary compatibility support for old and new settings
function getLintRunSetting(): Run {
  const settings = workspace.getConfiguration('ruff');
  const defaultValue = 'onType';

  if (settings.get<Run | null>('run') != null) {
    return settings.get<Run>('run', defaultValue);
  }

  return settings.get<Run>('lint.run', defaultValue);
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
  return workspace.getConfiguration('ruff').get<boolean>('disableDocumentFormatting', false);
}

function getConfigDisableHover() {
  return workspace.getConfiguration('ruff').get<boolean>('disableHover', false);
}
