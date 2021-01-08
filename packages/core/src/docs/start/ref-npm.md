````html
<head>
  ...
  <script type="module" src="/node_modules/@viewdo/x-ui/dist/x-ui.esm.js">
  <script nomodule src="/node_modules/@viewdo/x-ui/dist/x-ui.js">
  ...
</head>
````

> Only one of these scripts are imported. Which depends on the browser's support for ESM modules.
