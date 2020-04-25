# WirvonHier Client
=========================

## Installation

Create a new directory:

`mkdir wirvonhier`

`cd wirvonhier`

Clone the repository:

`git clone https://github.com/wirvonhier/client`

Install all necessary node packages:

`npm install`

Copy the default environment file to make certain configurations locally available:

`cd client`

`cp .env.default .env`

Afterwards, install the server. See [https://github.com/wirvonhier/server](https://github.com/wirvonhier/server) for instructions.


## Start

To start the client run the following command:

`npm run start`

This starts a node server which has hot reloading enabled. By default, the client can be found at [0.0.0.0:8080](0.0.0.0:8080).

## Development

We strongly encourage to use *Visual Studio Code* with a couple of plugins that will automatically run linting processes after code changes and keep the code style clean. In the base folder `wirvonhier` create a new file called `wirvonhier.code-workspace` and add the following code to it:

```
{
  "folders": [
    {
      "path": "client"
    },
    {
      "path": "server"
    }
  ],
  "settings": {
    "css.validate": false,
    "less.validate": false,
    "scss.validate": false,
    "eslint.validate": [
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact"
    ],
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
      "source.fixAll.stylelint": true
    }
  }
}
```

Next open this file inside `Visual Studio Code` (or double click the workspace file) to open the whole workspace and load the linting settings.

## Deployment

Please run `npm run lint` before pushing any code changes or merges, especially to the branches `development` and `testing` otherwise the build process will fail.




