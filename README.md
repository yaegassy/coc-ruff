# coc-ruff

[ruff-lsp](https://github.com/charliermarsh/ruff-lsp) extension for [coc.nvim](https://github.com/neoclide/coc.nvim).

## Install

**e.g. vim-plug**:

```vim
Plug 'yaegassy/coc-ruff', {'do': 'yarn install --frozen-lockfile'}
```

## Note

The `ruff` command used by `ruff-lsp` uses the `ruff` command installed with the `ruff-lsp` dependency.

To use the `ruff` command installed in the virtual environment of a project created by `venv`, `poetry`, etc., `ruff.path` must be set to an absolute path.

`coc-ruff` adds the feature to automatically detect ruff commands in the execution environment and use them in `ruff-lsp`.

If you do not need this feature, set `ruff.useDetectRuffCommand` to `false`.

**coc-settings.json**:

```jsonc
{
  "ruff.useDetectRuffCommand": false
}
```

## Bult-in install

`coc-ruff` allows you to create an extension-only "venv" and install `ruff-lsp`.

When using `coc-ruff` for the first time, if `ruff-lsp` is not present in the runtime environment, you will be prompted to do a built-in install.

To use the built-in installation feature, execute the following command.

```vim
:CocCommand ruff.builtin.installServer
```

## Configuration options

- `ruff.enable`: Enable coc-ruff-lsp extension, default: `true`
- `ruff.useDetectRuffCommand`: Automatically detects the ruff command in the execution environment and sets `ruff.path`, default: `true`
- `ruff.serverPath`: Custom path to the `ruff-lsp` command. If not set, the `ruff-lsp` command found in the current Python environment or in the venv environment created for the extension will be used, default: `""`
- `ruff.builtin.pythonPath`: Python 3.x path (Absolute path) to be used for built-in install, default: `""`
- `ruff.trace.server`: Traces the communication between coc.nvim and the ruff-lsp, default: `"off"`

Other settings have the same configuration as [ruff-vscode](https://github.com/charliermarsh/ruff-vscode).

## Commands

## Thanks

- [charliermarsh/ruff](https://github.com/charliermarsh/ruff)
- [charliermarsh/ruff-lsp](https://github.com/charliermarsh/ruff-lsp)
- [charliermarsh/ruff-vscode](https://github.com/charliermarsh/ruff-vscode)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
