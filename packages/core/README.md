# view.DO Experience UI

![Pre-Release](https://via.placeholder.com/728x90/333333/FFFFFF?text=PREVIEW+RELEASE:ALPHA+0.1)

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


## Experience UI is a suite of custom HTML elements that turns a static HTML file into single-page web-experiences

### HTML-Only Applications

Add features once only possible with JavaScript and complex frameworks to static HTML. These utility components (elements) allow HTML to perform heroic tasks, like remote content, re-usable partials, URL routing (within a single page!), smooth refresh-less navigation between pages, animated transitions, guided navigation, workflows, data-binding, dynamic content, declarative actions and more!

All with no complex build or generation process, and most of the time, no scripting.

### Installation

Throw this reference tag into your HTML page's head so the browser can figure out how to interpret our elements -- and that's it.

```html
<head>
  ...
  <script type="module" src="https://unpkg.com/@viewdo/x-ui/dist/x-ui/x-ui.esm.js">
  </script>
  ....
</head>
```

Now you can use any of the application components we built to make your pages function like an application.

### No Scripting Skills Needed

Expressing functionality declaratively has been the vision for most frameworks for years now. Frameworks like Blazor and React edge closer towards that goal, but much of the setup and decisions around tooling is complex on its own. This can be a huge barrier for many that just want to make a website.

> These components strive to enable creators from diverse backgrounds and technical and non-technical skill-sets to easily create robust web-experiences, quickly. Without a ton of tooling decisions or an opinionated frameworks.

HTML and CSS, declarative in nature are both much more approachable for non-developers. In fact, we have watched designers do things developers never thought possible with just these two languages. So why bring JavaScript into it?

Functionality is easier to express _and_ understand when it's format is declarative. Conversely, scripting languages like JavaScript are imperative by nature and take more time to grok and more systems to learn.

If you like it, give it a star on GitHub:

[![github](https://badgen.net/badge/github/★?icon=github&color=blue)](https://github.com/viewdo/x-ui)

If you hate it, or just want to send feedback use the discussion in github or send me a direct message:

[![Twitter](https://badgen.net/badge/tweet/me?icon=twitter&color=blue)](https://twitter.com/logrythmik)
[![Gitter](https://badgen.net/badge/chat/with%20me%20on%20gitter?icon=gitter)](https://gitter.im/viewdo/x-ui)

> DISCLAIMER: This is a prerelease project and is subject to breaking changes and incomplete features.

## Learn More

The best way to see what these components can do for your HTML is taking a look at the documentation/demo pages. The site is built using these components as a single HTML file with partials pulled in as-needed.

[![Take a Tour](https://badgen.net/badge/@viewdo/x-ui:%20demo?color=blue)](https://demo.x-ui.dev)

### Built on the shoulders of giants!

Thank you to the Ionic team and their fabulous [**Stencil.js** SDK](https://stenciljs.com) for the best way to build lightening fast, native web-components. Also, shout-out to the creators and contributors to all open-source efforts, but especially to the libraries we love and used:

* **howler.js**: [howler-js](https://github.com/goldfire/howler.js) best audio library for managing audio files
* **SilentMatt**: [expression evaluator](https://github.com/silentmatt/expr-eval) for a declarative expression parser
* **JSONata**: [JSONata](https://jsonata.org/) another declarative approach for solving problems, this uses expressions to query JSON.
* **remarkable**: [remarkable](https://jonschlinkert.github.io/remarkable/demo/) Ridiculously fast markdown to HTML processing.
