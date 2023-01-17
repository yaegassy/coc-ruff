import * as lc from 'coc.nvim';

interface ApplyAutofixParams {
  command: string;
  arguments: any[];
}

export const ExecuteAutofixType = new lc.RequestType<ApplyAutofixParams, any, never>('workspace/executeCommand');
