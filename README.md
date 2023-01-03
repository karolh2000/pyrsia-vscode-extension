# Pyrsia VS Code Extension

## Overview

Pyrsia support for Microsoft VS Code (extension).**This is an early prototype and proof of concept, it’s not "production" ready.**

## Requirements

- VS Code 1.7
- Node 19.x required

## How to run and debug the extension

- Open the repo folder in VS Code.
- Install the dependencies and compile the extension.

    ```sh
    npm install
    npm run watch
    ```

- Press F5 to run the extension, a new VS Code instance will appear and should have the extension installed.

## How to test the project (TBD)

```sh
npm run test
```

## Before merging or creating PR

- Run the tests and linter.

    ```sh
    npm run lint
    npm run test
    ```

## How to package, install and uninstall Pyrsia extension in the IDE

### Package and Install (side-load extension)

- Install [Visual Studio Code Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce) with the following command.

    ```sh
    npm install -g @vscode/vsce
    ```

- In the repository folder compile and package the extension as follows.

    ```sh
    vsce package
    ```

- If the packaging was successful the last line of the VSCE logs should contain the `vsix` file path, for example:

    ```sh
    DONE  Packaged: /home/john/repositories/pyrsia-vscode-extension/pyrsia-integration-0.0.1.vsix (960 files, 2.2MB)
    ```

- Copy the `vsix` file path and install the extension as follows.

    ```sh
    code --install-extension <PYRSIA_VSIX_FILE_PATH>
    ```

### Uninstall (side-load)

- Find the extension in the list of the extensions (look for "pyrsia", for example `undefined_publisher.pyrsia-integration`).

    ```sh
    code --list-extensions
    ```

- Use the extension name from the list to uninstall the extension.

    ```sh
    code --uninstall-extension <PYRSIA_EXTENSION_NAME>
    ```
