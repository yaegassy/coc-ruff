import { commands, ExtensionContext, LanguageClient, services, ServiceStat } from 'coc.nvim';

import { createLanguageClient } from '../client';
import { installWrapper } from '../installer';
import { getPythonPath, getRuffLspPath } from '../tool';

export function register(context: ExtensionContext, client?: LanguageClient) {
  context.subscriptions.push(
    commands.registerCommand('ruff.builtin.installServer', async () => {
      const pythonCommand = getPythonPath();
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
    })
  );
}
