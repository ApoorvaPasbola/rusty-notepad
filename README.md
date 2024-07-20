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


# Storybook
- To start story book run 
  - `npm run storybook`
- While creating new components, rember to add stories for the required ui-components which makes easier to use in the other parts 
  - Create a [componenent-name].story.ts inside `src\stories\[component-name]\`
  - Give example for all possible scenarios 


## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) + [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).
