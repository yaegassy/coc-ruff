import { LanguageClient, TextEdit, workspace } from 'coc.nvim';

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
    pattern: '*.py',
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
        // When executing `commands.executeCommand('ruff.executeAutofix')`
        // within the "BufWritePre" event, it does not behave as expected.
        //
        // We have changed it to be executed from the CocAction function using
        // "workspace.nvim.call".
        await workspace.nvim.call('CocAction', ['runCommand', 'ruff.executeAutofix']);
      }
    },
  });
}
