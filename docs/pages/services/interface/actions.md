# Interface Actions

The default Interface Action Listener is configured to handle commands raised to the [Action Bus](/actions/event-bus).

Topic: `interface`

```html
<x-action-activator activate="...">
  <x-action topic="interface" command="<command>" ...> </x-action>
</x-action-activator>
```

## Commands

### `set-theme`

Sets the main page theme to dark or light.

Arguments:

- **theme** 'dark|light' (required)'

```html
<x-action-activator activate="...">
  <x-action topic="interface" command="set-theme" data-theme="dark"> </x-action>
</x-action-activator>
```

### `set-auto-play`

Sets wether or not videos and audio can automatically play when a new route is activated.

Arguments:

- **autoPlay** boolean (required)

```html
<x-action-activator activate="...">
  <x-action topic="interface" command="set-auto-play" data-auto-play="true"> </x-action>
</x-action-activator>
```

### `set-sound`

Sets wether or not audio is played globally for audio and videos.

Arguments:

- **muted** boolean (required)

```html
<x-action-activator activate="...">
  <x-action topic="interface" command="set-sound" data-muted="true"> </x-action>
</x-action-activator>
```

--

## DOM Commands

### `element-toggle-class`

Toggles a given class on or off.

Arguments:

- **selector** (required)
- **className** (required)

```html
<x-action-activator activate="...">
  <x-action topic="interface" command="element-toggle-class" selector="#el" class-name="hidden"></x-action>
</x-action-activator>
```

### `element-add-classes`

Add a class or classes to a specified element.

Arguments:

- **selector** (required)
- **classes** (required)

```html
<x-action-activator activate="...">
  <x-action topic="interface" command="element-add-class" selector="#el" classes="hidden red"></x-action>
</x-action-activator>
```

### element-remove-classes

Remove a class or classes to a specified element.

Arguments:

- **selector** (required)
- **classes** (required)

```html
<x-action-activator activate="...">
  <x-action topic="interface" command="element-remove-class" selector="#el" classes="hidden red"></x-action>
</x-action-activator>
```

### element-set-attribute

Add an attribute to a specified element.

Arguments:

- **selector** (required)
- **attribute** (required)
- **value**

```html
<x-action-activator activate="...">
  <x-action topic="interface" command="element-set-attribute" selector="#el" attribute="hidden" value="true"></x-action>
</x-action-activator>
```

### element-remove-attribute

Remove an attribute from the specified element.

Arguments:

- **selector** (required)
- **attribute** (required)

```html
<x-action-activator activate="...">
  <x-action topic="interface" command="element-remove-attribute" selector="#el" attribute="hidden"></x-action>
</x-action-activator>
```

### element-call-method

Call a method on an element with optional arguments.

Arguments:

- **selector** (required)
- **method** (required)
- **(args)**

```html
<x-action-activator activate="...">
  <x-action
    topic="interface"
    command="element-call-method"
    selector="x-action"
    method="sendAction"
    data-(arg)=""
  ></x-action>
</x-action-activator>
```
