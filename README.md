# coc-ruff

[Ruff](https://github.com/astral-sh/ruff) Language Server extension for [coc.nvim](https://github.com/neoclide/coc.nvim).

<img width="791" alt="coc-ruff-demo" src="https://user-images.githubusercontent.com/188642/212628682-82b1f97d-f349-427f-95a0-f53c46c9854b.png">

## Install

**CocInstall**:

```vim
:CocInstall @yaegassy/coc-ruff
```

> scoped packages

**e.g. vim-plug**:

```vim
Plug 'yaegassy/coc-ruff', {'do': 'yarn install --frozen-lockfile'}
```

## Configuration options

- `ruff.enable`: Enable coc-ruff extension, default: `true`
- `ruff.nativeServer`: Use the integrated Rust-based language server, available now in Beta, default: `true`
- `ruff.nativeBinaryPath`: Custom path for the `ruff` binary when using the native server. If no value is set, the `ruff` command will be detected from the runtime environment, default: `""`
- `ruff.disableDocumentFormatting`: Disable document formatting only, default: `false`
- `ruff.disableHover`: Disable hover only, default: `false`
- `ruff.useDetectRuffCommand`: Automatically detects the ruff command in the execution environment and sets `ruff.path`, default: `true`
- `ruff.client.codeAction.showDocumantaion.enable`: Whether to display the code action for open the Ruff rule documentation web page included in the diagnostic information, default: `false`
- `ruff.trace.server`: Traces the communication between coc.nvim and the ruff-lsp, default: `"off"`

Other settings have the same configuration as [ruff-vscode](https://github.com/astral-sh/ruff-vscode).

## Commands

- `ruff.executeAutofix`: Fix all auto-fixable problems
- `ruff.executeFormat`: Format document
- `ruff.executeOrganizeImports`: Format imports
- `ruff.debugInformation`: Print debug information (native server only)
- `ruff.showLogs`: Show logs
- `ruff.restart`: Restart Server

## Thanks

- [astral-sh/ruff](https://github.com/astral-sh/ruff)
- [astral-sh/ruff-vscode](https://github.com/astral-sh/ruff-vscode)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
