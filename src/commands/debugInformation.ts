import { commands, ExtensionContext, LanguageClient, window, workspace } from 'coc.nvim';
import { ExecuteCommandRequestType } from '../requestTypes';

export async function register(context: ExtensionContext, client: LanguageClient) {
  await client.onReady();

  context.subscriptions.push(
    commands.registerCommand('ruff.debugInformation', async () => {
      if (!client || !workspace.getConfiguration('ruff').get<boolean>('nativeServer')) {
        return;
      }

      const params = {
        command: `ruff.printDebugInformation`,
      };

      await client.sendRequest(ExecuteCommandRequestType, params).then(undefined, async () => {
        await window.showErrorMessage('Failed to print debug information.');
      });

      client.outputChannel.show();
    }),
  );
}
