import { commands, ExtensionContext, LanguageClient, services, ServiceStat, window } from 'coc.nvim';

import { createLanguageClient } from '../client';
import { installWrapper } from '../installer';
import { getRuffLspPath } from '../tool';

export function activate(context: ExtensionContext, pythonCommand: string, client: LanguageClient) {
  context.subscriptions.push(
    commands.registerCommand('ruff.builtin.installServer', async () => {
      if (pythonCommand) {
        if (client) {
          if (client.serviceState !== ServiceStat.Stopped) {
            await client.stop();
          }
        }
        await installWrapper(pythonCommand, context);

        const ruffLspPath = getRuffLspPath(context);

        if (!client) {
          client = createLanguageClient(ruffLspPath);
          context.subscriptions.push(services.registLanguageClient(client));
        } else {
          client.start();
        }
      } else {
        window.showErrorMessage('python3/python command not found');
      }
    })
  );
}
