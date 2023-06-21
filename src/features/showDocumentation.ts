import {
  CodeAction,
  CodeActionContext,
  CodeActionProvider,
  Diagnostic,
  DocumentSelector,
  ExtensionContext,
  LanguageClient,
  languages,
  Range,
  TextDocument,
  workspace,
} from 'coc.nvim';

type AdditionalDiagnostic = {
  codeDescription?: {
    href?: string;
  };
};

type RuffDiagnostic = Diagnostic & AdditionalDiagnostic;

type RuffRuleContents = {
  id: string | number;
  href: string;
};

export async function register(context: ExtensionContext, client: LanguageClient) {
  await client.onReady();

  if (!workspace.getConfiguration('ruff').get<boolean>('client.codeAction.showDocumantaion.enable', false)) return;

  const documentSelector: DocumentSelector = [{ scheme: 'file', language: 'python' }];

  context.subscriptions.push(
    languages.registerCodeActionProvider(documentSelector, new ShowDocumentationCodeActionProvider(client), 'ruff')
  );
}

class ShowDocumentationCodeActionProvider implements CodeActionProvider {
  private readonly source = 'Ruff';
  private client: LanguageClient;

  constructor(client: LanguageClient) {
    this.client = client;
  }

  public async provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext) {
    const doc = workspace.getDocument(document.uri);
    const wholeRange = Range.create(0, 0, doc.lineCount, 0);
    let whole = false;
    if (
      range.start.line === wholeRange.start.line &&
      range.start.character === wholeRange.start.character &&
      range.end.line === wholeRange.end.line &&
      range.end.character === wholeRange.end.character
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      whole = true;
    }
    const codeActions: CodeAction[] = [];

    /** Show web documentation for [ruleId] */
    if (this.lineRange(range) && context.diagnostics.length > 0) {
      const line = doc.getline(range.start.line);
      if (line && line.length) {
        const ruffRuleContents: RuffRuleContents[] = [];
        context.diagnostics.forEach((d) => {
          if (d.source === this.source) {
            if ('codeDescription' in d) {
              const ruffDiagnostic = d as RuffDiagnostic;
              if (ruffDiagnostic.codeDescription?.href) {
                if (ruffDiagnostic.code) {
                  ruffRuleContents.push({
                    id: ruffDiagnostic.code,
                    href: ruffDiagnostic.codeDescription.href,
                  });
                }
              }
            }
          }
        });

        if (ruffRuleContents) {
          ruffRuleContents.forEach((r) => {
            const title = `Ruff (${r.id}): Show documentation [coc-ruff]`;

            const command = {
              title: '',
              command: 'vscode.open',
              arguments: [r.href],
            };

            const action: CodeAction = {
              title,
              command,
            };

            codeActions.push(action);
          });
        }
      }
    }

    return codeActions;
  }

  private lineRange(r: Range): boolean {
    return (
      (r.start.line + 1 === r.end.line && r.start.character === 0 && r.end.character === 0) ||
      (r.start.line === r.end.line && r.start.character === 0)
    );
  }
}
