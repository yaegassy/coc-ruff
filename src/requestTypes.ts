import * as lc from 'coc.nvim';

interface ExecuteCommandRequestParams {
  command: string;
  arguments: any[];
}

export const ExecuteCommandRequestType = new lc.RequestType<ExecuteCommandRequestParams, any, never>(
  'workspace/executeCommand',
);
