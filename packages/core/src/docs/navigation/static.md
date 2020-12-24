# Static Routing

Static content routing uses a simple declarative approach. Just put the content for your route within a **`<x-view>`** tag and set the url.

> Content won't be displayed until the URL path matches the path set in the **`<x-view>`**.

````html
<x-view url="/home"
  page-title="Home">
  ... home content ...
</x-view>
````

### Nested Routes

Routes go as deep as you need.

<x-link custom="button" anchor-class="btn btn-info text-white "
  href="/navigation/static/nesting">
  Go Deeper on Nested Routes
</x-link>


### Data Routes

Using routes to provide data to views is also possible.

<x-link custom="button" anchor-class="btn btn-info text-white "
  href="/navigation/static/data">
  Using Data Routes
</x-link>
