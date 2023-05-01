import { commands, LanguageClient, TextEdit, workspace } from 'coc.nvim';

type RuffDiagnosticsDataType = {
  fix: {
    message: string;
    edit: TextEdit;
  } | null;
  noqa_row: any | null;
};

export async function register(client: LanguageClient) {
  await client.onReady();

  if (!workspace.getConfiguration('ruff').get<boolean>('autoFixOnSave', false)) return;

  workspace.registerAutocmd({
    request: true,
    event: 'BufWritePre',
    arglist: [`+expand('<abuf>')`],
    callback: async () => {
      const { document } = await workspace.getCurrentState();

      if (!client.diagnostics) return;

      const currentDiags = client.diagnostics.get(document.uri);
      if (!currentDiags) return;

      let existsFix = false;

      for (const d of currentDiags) {
        if (d.source !== 'Ruff') continue;
        if (!('data' in d)) continue;

        const data = d.data as RuffDiagnosticsDataType;
        if (typeof data.fix === 'object') {
          existsFix = true;
          break;
        }
      }

      if (existsFix) {
        commands.executeCommand('ruff.executeAutofix');
      }
    },
  });
}
