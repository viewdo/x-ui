# view.DO Elements

![Pre-Release](https://via.placeholder.com/728x50/2d8dc9/FFFFFF?text=PREVIEW+RELEASE:ALPHA+0.3)

![MIT](https://badgen.net/github/license/viewdo/x-ui?icon=github)
![size](https://badgen.net/badgesize/normal/file-url/unpkg.com/@viewdo/x-ui/dist/x-ui/x-ui.esm.js?icon=sourcegraph&color=blue)
![Dependabot](https://badgen.net/badge/icon/dependabot?icon=dependabot&label)
![tree-shaking](https://badgen.net/badge/tree-shaking/enabled?icon=packagephobia)
![ts](https://badgen.net/badge/icon/typescript?icon=typescript&label)

[![NPM](https://badgen.net/npm/v/@viewdo/x-ui?icon&color=blue)](https://www.npmjs.com/package/@viewdo/x-ui)
[![CoveragStatus](https://badgen.net/coveralls/c/github/viewdo/x-ui?icon=codecov&color=blue)](https://coveralls.io/github/viewdo/x-ui)
[![Gitter](https://badgen.net/badge/chat/on%20gitter?icon=gitter)](https://gitter.im/viewdo/x-ui)
[![jsdelivr](https://badgen.net/badge/jsdelivr/CDN?icon=jsdelivr&color=blue)](https://cdn.jsdelivr.net/npm/@viewdo/x-ui/+esm)
[![unpkgd](https://badgen.net/badge/unpkg/CDN)](https://unpkg.com/browse/@viewdo/x-ui)

These elements encapsulate application functionality using HTML-like elements. This approach keeps the semantics of a web application declarative and 'semi-mono-linguistic'.

> The goal of this project is to empower the next generation of personalized, interactive web-experiences with less friction and less semantic-diversion.

## Application Functionality, Expressed in HTML

Declarative applications are more deterministic and easier to understand for more levels of expertise. These components are segmented into option sub-systems to only require what you need:

### Actions: `<x-action-*>`

- Declared Reactive Actions
- Async Functions

### Routing: `<x-app-view*>`

- URL/Hash-based Routing (within a single page!)
- Fast, SPA-like navigation between pages
- Guided navigation, wizards & workflows

### Navigation: `<x-app-view-do>`

- Guided Navigation
- Media-Timed Actions
- Interactive Video
- Reactive Audio

### Data: `<x-data>`

- Expression Evaluation & Binding
- Data-Template Rendering
- Data-driven Rule Evaluation for Navigation

### Content: `<x-content>`

- Dynamic Content Rendering
- Deferred Content
- Markdown Rendering
- Remote HTML

### UI: `<x-ui>`

- Interface Management
- Theme Management
- UI Component Integrations

### Elements: `<x-elements>`

- HTML Manipulation w/ Declared Actions
- "JQuery as an Async Tag"

## Installation

Add a single script-reference tag into your HTML page's head so the browser can figure out how to interpret our elements -- and that's it.

> This is a pre-release project and is subject to breaking-changes and incomplete features. Thank you for trying it out!

### CDN

```html
<head>
  ...
  <script
    type="module"
    src="https://unpkg.com/@viewdo/x-ui/dist/x-ui/x-ui.esm.js"
  ></script>
  ....
</head>
```

NPM

```bash
npm i @viewdo/x-ui
```

```html
<head>
  ...
  <script
    type="module"
    src="~/node_modules/@viewdo/x-ui/dist/x-ui/x-ui.esm.js"
  ></script>
  ....
</head>
```

### Learn More

The best way to see what these elements can do for your HTML is to take a look at the documentation/demo. The site is built using these elements as a single HTML file with partials pulled in, as-needed.

[![Take a Tour](https://badgen.net/badge/@viewdo/x-ui:%20demo?color=blue)](https://demo.x-ui.dev)

## Contact

If you like the idea, join us! Or give it a star.

[![github](https://badgen.net/badge/github/★?icon=github&color=blue)](https://github.com/viewdo/x-ui)

If you have requests, ideas or feedback, join the discussion on Gitter:

[![Gitter](https://badgen.net/badge/chat/with%20me%20on%20gitter?icon=gitter)](https://gitter.im/viewdo/x-ui)

Reach out to me personally:

[![Twitter](https://badgen.net/badge/tweet/me?icon=twitter&color=blue)](https://twitter.com/logrythmik)

## Contributions

### Built on the shoulders of giants!

Thank you to the Ionic team and their fabulous [**Stencil.js** SDK](https://stenciljs.com) for the best way to build lightening fast, native elements.

Also, thank you to the creators and contributors to all open-source efforts, but especially to the libraries we love and use in our plugin components:

#### Data `<x-data>`

- **SilentMatt**: [expression evaluator](https://github.com/silentmatt/expr-eval) for a declarative expression parser
- **JSONata**: [JSONata](https://jsonata.org/) another declarative approach for solving problems, this uses expressions to query JSON.

#### Audio `<x-audio>`

- **howler.js**: [howler-js](https://github.com/goldfire/howler.js) best audio library for managing audio files

#### Markdown `<x-content-markdown>`

- **remarkable**: [remarkable](https://jonschlinkert.github.io/remarkable/demo/) Ridiculously fast markdown to HTML processing.
