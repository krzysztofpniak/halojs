'use strict';

const {join} = require(`path`);
const normalizePath = require(`normalize-path`);

module.exports = {
  OPTION_DEFAULT_LINK_TEXT: `REPL`,
  OPTION_DEFAULT_HTML: `
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <style type="text/tailwindcss">
      @layer utilities {
        button {
          @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
        }
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
  OPTION_DEFAULT_REDIRECT_TEMPLATE_PATH: normalizePath(
    join(__dirname, `default-redirect-template.js`)
  ),
  PROTOCOL_BABEL: `babel://`,
  PROTOCOL_CODEPEN: `codepen://`,
  PROTOCOL_CODE_SANDBOX: `codesandbox://`,
  PROTOCOL_RAMDA: `ramda://`,
};
