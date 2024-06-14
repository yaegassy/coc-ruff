import fs from 'fs';
import path from 'path';
import toml from 'toml';

type PyprojectToml = {
  tool: {
    poetry: {
      dependencies: {
        [name: string]: string;
      };
    };
  };
};

function getPackageVersion(name: string) {
  const rootDir = path.resolve(path.dirname(__filename), '..');
  const filePath = path.join(rootDir, 'pyproject.toml');
  const fileStr = fs.readFileSync(filePath);
  const data: PyprojectToml = toml.parse(fileStr.toString());
  const version = data.tool.poetry.dependencies[name];

  return version;
}

export const RUFF_LSP_VERSION = getPackageVersion('ruff-lsp');

export const RUFF_SERVER_CMD = 'server';
export const RUFF_SERVER_REQUIRED_ARGS = ['--preview'];
