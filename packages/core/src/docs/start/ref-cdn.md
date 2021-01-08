 ````html
<head>
  ...
  <script type="module" src="https://unpkg.com/@viewdo/x-ui/dist/x-ui/x-ui.esm.js">
  <script nomodule src="https://unpkg.com/@viewdo/x-ui/dist/x-ui/x-ui.js">
  ...
</head>
````

> Only one of these scripts are imported. Which depends on the browser's support for ESM modules.
