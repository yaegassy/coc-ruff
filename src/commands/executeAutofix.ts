import { commands, ExtensionContext, LanguageClient, window } from 'coc.nvim';
import { ExecuteAutofixType } from '../requestTypes';

export async function activate(context: ExtensionContext, client: LanguageClient) {
  await client.onReady();

  context.subscriptions.push(
    commands.registerCommand('ruff.executeAutofix', async () => {
      if (!client) {
        return;
      }

      const textEditor = window.activeTextEditor;
      if (!textEditor) {
        return;
      }

      const textDocument = {
        uri: textEditor.document.uri.toString(),
        version: textEditor.document.version,
      };
      const params = {
        command: `ruff.applyAutofix`,
        arguments: [textDocument],
      };

      await client.sendRequest(ExecuteAutofixType, params).then(undefined, async () => {
        await window.showErrorMessage(
          'Failed to apply Ruff fixes to the document. Please consider opening an issue with steps to reproduce.'
        );
      });
    })
  );
}
