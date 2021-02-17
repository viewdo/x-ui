# X-ACTION

This element holds the data that **is** the Event Action submitted through [Actions Bus](/actions).

## Usage

This element does not activate these actions automatically. They need to be activated through script, or by wrapping them in an **`<x-action-activator>`** tag. The parent tag defines how and when the child actions are submitted through [Actions](/actions).

### Attribute Data

For most action-argument data, it is easies to specify them as key-value pairs using the `data-*` attributes within the **`x-action`** tag. The name of the argument should be prefixed with `data-`. A

```html
<x-action topic="<topic>" 
  command="<command>" 
  data-(key)="value">
</x-action>
```

> NOTE: If a listener declares an argument using 'camelCase', it should be converted to 'kebab-case' in HTML, (words separated by dashes, all lowercase). It will be converted to 'camelCase' automatically when activated.

### Nested Input Data

For most data, it is easy to specify key-value pairs using the `data-*` attributes within the **`x-action`** tag.

```html
<x-action topic="<topic>" 
  command="<command>">
  <input type="hidden" 
    name="arg1" 
    value="Hello World">
</x-action>
```

#### JSON Data

For more complex data shapes, you can define the data parameters as JSON in a child script tag.

```html
<x-action topic="<topic>" command="<command>">
  <script type="application/json">
    {
      "arg1": "Hello world!"
    }
  </script>
</x-action>
```

## Dependencies

### Depends on

* **`<x-action-activator>`**

### Graph

```mermaid
graph TD;
  x-view-do --> x-action-activator
  x-action-activator --> x-action

  style x-action fill:#f9f,stroke:#333,stroke-width:1px

```

<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                   | Type                                                                   | Default     |
| --------- | --------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------- |
| `command` | `command` | The command to execute.                                       | `string \| undefined`                                                  | `undefined` |
| `data`    | --        | Data binding for JSX binding                                  | `undefined \| { [x: string]: any; }`                                   | `undefined` |
| `topic`   | `topic`   | This is the topic this action-command is targeting.  data: [] | `"audio" \| "data" \| "document" \| "routing" \| "video" \| undefined` | `undefined` |


## Methods

### `getAction() => Promise<EventAction<any> | null>`

Get the underlying actionEvent instance. Used by the x-action-activator element.

#### Returns

Type: `Promise<EventAction<any> | null>`



### `sendAction(data?: Record<string, any> | undefined) => Promise<void>`

Send this action to the the Action Bus.

#### Returns

Type: `Promise<void>`




----------------------------------------------

view.DO : Experience Platform
