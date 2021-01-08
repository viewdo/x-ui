### Embedded Data

The experience UI makes it easy to use route and query-string data directly in your content.

```html
<h1>Learn about <x-data-display text="{route:item}"></x-data-display></h1>
<x-data-display>
  <template> </template>
</x-data-display>
<p>
  {storage:name}, you picked one of my favorite things <span x-hide-when="!{query:with}"> AND you want a side of {query:with}.</span>
  Amazing.
</p>
```

> Did you notice the page title changed too?

```html
<x-view url="/data" page-title="Data Routes">
  <x-view url="/:item" page-title="Info on {route:item}"> ... this content ... </x-view>
</x-view>
```
