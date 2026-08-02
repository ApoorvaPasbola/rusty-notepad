# Rusty Notepad

Rusty-notepad is a desktop application developed using Rust and Tauri, with an Angular front-end. 
The objective of Rusty-notepad is to create a compact, lightweight, and high-performance notepad. 
This application extends the functionality of traditional desktop notepad software by enabling 
image storage, all while maintaining exceptional performance and minimal resource consumption.



# Development

## Pre-requisites 
- Check node version is `v20.13.1`. 
  - `node --version`
- Rust Compiler version `rustc 1.78.0 (9b00956e5 2024-04-29)`
  - `rustc --version`
- `Python 3.12.4` (optional) is installed for build pipelines. 
  - `py --version`
  - pydoit is installed. Install pydoit using `pip install pydoit` | `py -m pip install pydoit`

## Running the application
- To start dev server of tauri.
  - `py -m doit start` This would start the development server. If python `doit` is not installed then  
    - Run `npm run tauri dev`.

## Building the Application 
- To build the application.
  - `py -m doit build`. Or run `npm run tauri build`

## Code Quality

- `npm run format` — Prettier auto-format every `src/**/*.{ts,html,scss,json}` and `plan/**/*.md` file.
- `npm run format:check` — fail-fast variant used in CI.
- Rust: `cargo fmt --manifest-path src-tauri/Cargo.toml` and `cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings`.

## Logging

- The Rust backend uses `tracing`. The default filter is `info,rusty=debug`; override via the
  `RUSTY_LOG` environment variable (same syntax as `RUST_LOG`).
- In **debug** builds, logs go to stdout only.
- In **release** builds, logs additionally roll daily to
  `<data_local_dir>/rusty-notepad/logs/rusty.log.<YYYY-MM-DD>`
  (e.g. `%LOCALAPPDATA%\rusty-notepad\logs\` on Windows).

## Drafts (auto-persistence)

- Any unsaved tab is auto-saved to `<app_local_data_dir>/drafts/<uuid>.json` after a 1 s debounce.
- On startup all drafts are re-hydrated as tabs, most-recently-edited first.
- Explicit Save-As to a real file path automatically evicts the matching draft.
- Closing a draft tab deletes the draft. Quitting the app preserves it.

## Theming

- `Ctrl + T` toggles between the bundled **dark** and **light** themes.
- The active theme is persisted in `localStorage` under `rusty.theme`.
- On first run the OS `prefers-color-scheme` is honoured.
- Adding a new theme = create `src/styles/themes/_theme-<name>.scss` with the same semantic-token
  mixin shape, register it in `_index.scss`, and extend the `ThemeName` union in
  `theme.service.ts`. No component changes required.

## Path aliases

The project ships TypeScript path aliases for clean imports. Prefer these in new code:

| Alias            | Maps to                              |
| ---------------- | ------------------------------------ |
| `@core/*`        | `src/app/modules/services/*`         |
| `@shared/*`      | `src/app/modules/utilities/*`        |
| `@state/*`       | `src/app/state/*`                    |
| `@features/*`    | `src/app/modules/ui-elements/*`      |
| `@environments`  | `src/environments/environment`       |


# Storybook
- To start story book run 
  - `npm run storybook`
- While creating new components, rember to add stories for the required ui-components which makes easier to use in the other parts 
  - Create a [componenent-name].story.ts inside `src\stories\[component-name]\`
  - Give example for all possible scenarios 


## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) + [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).
