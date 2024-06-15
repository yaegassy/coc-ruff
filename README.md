# coc-ruff

[ruff-lsp](https://github.com/astral-sh/ruff-lsp) extension for [coc.nvim](https://github.com/neoclide/coc.nvim).

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

## Note

### Detecting the "ruff" command from the execution environment

The `ruff` command used by `ruff-lsp` uses the `ruff` command installed with the `ruff-lsp` dependency.

To use the `ruff` command installed in the virtual environment of a project created by `venv`, `poetry`, etc., `ruff.path` must be set to an absolute path.

[coc-ruff](https://github.com/yaegassy/coc-ruff/) adds the feature to automatically detect ruff commands in the execution environment and use them in `ruff-lsp`.

If you do not need this feature, set `ruff.useDetectRuffCommand` to `false`.

**coc-settings.json**:

```jsonc
{
  "ruff.useDetectRuffCommand": false
}
```

### [EXPERIMENTAL] Enabling the Rust-based language server

To use the new Rust-based language server (ruff server), you'll need to enable the `ruff.nativeServer` setting in the coc-settings.json:

```jsonc
{
  "ruff.nativeServer": true
}
```

In coc-ruff, the ruff binary is detected from the runtime environment (PATH) by default to start the native server. If you want to specify a custom ruff binary path, please set ruff.nativeBinaryPath.

```jsonc
{
  "ruff.nativeBinaryPath": "/path/to/ruff"
}
```

### Format (DocumentFormatting)

The [black](https://github.com/psf/black) equivalent formatting feature has been added to `ruff`. This feature is enabled by default in `ruff-lsp` "v0.0.42" and later.

If you want to disable this feature, set the `ruff.disableDocumentFormatting` setting to `true`.

**coc-settings.json**:

```jsonc
{
  "ruff.disableDocumentFormatting": true
}
```

---

If you are using `ruff-lsp` "v0.4.1" or earlier and want to use this feature, please follow these steps.

1. Please set `ruff.enableExperimentalFormatter` to `true`.
1. If you are using other Python-related coc-extensions alongside` coc-ruff`, please disable the formatting feature of those coc-extensions.
   - e.g. `coc-pyright`: 
     - Please set `python.formatting.provider` to `none`.

**coc-settings.json**:

```jsonc
{
  "ruff.enableExperimentalFormatter": true,
  "python.formatting.provider": "none"
}
```

### Auto-fixing

Auto-fixing can be executed via the `ruff.executeAutofix` command or CodeAction.

Set `ruff.autoFixOnSave` setting to `true` if you also want auto-fixing to be performed when the file is saved.

**coc-settings.json**:

```jsonc
{
  "ruff.autoFixOnSave": true
}
```

## Order of detection of ruff-lsp used by extensions

[coc-ruff](https://github.com/yaegassy/coc-ruff/) detects and starts `ruff-lsp` in the following priority order.

1. `ruff.serverPath` (If there is a setting)
1. current python3/python environment (e.g. ruff-lsp in global or virtual environment)
1. built-in ruff-lsp (Installation commands are also provided)

## Bult-in install

[coc-ruff](https://github.com/yaegassy/coc-ruff/) allows you to create an extension-only "venv" and install `ruff-lsp`.

When using [coc-ruff](https://github.com/yaegassy/coc-ruff/) for the first time, if `ruff-lsp` is not present in the runtime environment, you will be prompted to do a built-in install.

To use the built-in installation feature, execute the following command.

```vim
:CocCommand ruff.builtin.installServer
```

## Configuration options

- `ruff.enable`: Enable coc-ruff extension, default: `true`
- `ruff.nativeServer`: Use the integrated Rust-based language server, available now in Beta, default: `false`
- `ruff.nativeBinaryPath`: Custom path for the `ruff` binary when using the native server. If no value is set, the `ruff` command will be detected from the runtime environment, default: `""`
- `ruff.disableDocumentFormatting`: Disable document formatting only, default: `false`
- `ruff.disableHover`: Disable hover only, default: `false`
- `ruff.useDetectRuffCommand`: Automatically detects the ruff command in the execution environment and sets `ruff.path`, default: `true`
- `ruff.autoFixOnSave`: Turns auto fix on save on or off, default: `false`
- `ruff.client.codeAction.showDocumantaion.enable`: Whether to display the code action for open the Ruff rule documentation web page included in the diagnostic information, default: `false`
- `ruff.serverPath`: Custom path to the `ruff-lsp` command. If not set, the `ruff-lsp` command found in the current Python environment or in the venv environment created for the extension will be used, default: `""`
- `ruff.builtin.pythonPath`: Python 3.x path (Absolute path) to be used for built-in install, default: `""`
- `ruff.trace.server`: Traces the communication between coc.nvim and the ruff-lsp, default: `"off"`

Other settings have the same configuration as [ruff-vscode](https://github.com/astral-sh/ruff-vscode).

## Commands

- `ruff.executeAutofix`: Fix all auto-fixable problems
- `ruff.executeFormat`: Format document
- `ruff.executeOrganizeImports`: Format imports
- `ruff.showOutput`: Show ruff output channel
- `ruff.restart`: Restart Server
- `ruff.builtin.installServer`: Install ruff-lsp
  - It will be installed in this path:
    - Mac/Linux:
      - `~/.config/coc/extensions/@yaegassy/coc-ruff-data/ruff-lsp/venv/bin/ruff-lsp`
    - Windows:
      - `~\AppData\Local\coc\extensions\@yaegassy\coc-ruff-data\ruff-lsp\venv\Scripts\ruff-lsp.exe`

## Thanks

- [astral-sh/ruff](https://github.com/astral-sh/ruff)
- [astral-sh/ruff-lsp](https://github.com/astral-sh/ruff-lsp)
- [astral-sh/ruff-vscode](https://github.com/astral-sh/ruff-vscode)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
