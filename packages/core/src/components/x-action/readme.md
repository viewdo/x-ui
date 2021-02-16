# X-ACTION

This element holds the data that **is** the Event Action submitted through [Actions Bus](/actions).

## Usage

This element should only ever exists within a parent **`<x-action-activator>`** tag. The parent tag defines how and when the child actions are submitted through [Actions Bus](/actions).

### In-Attribute Data

```html
<x-action-activator ...>
  <x-action topic="<topic>" command="<command>" data='{"arg": "Hello world!"}'></x-action>
</x-action-activator>
```

#### Child Script Data

Alternatively, you define the data parameter in a child script tag.

```html
<x-action-activator ...>
  <x-action topic="<topic>" command="<command>">
    <script type="application/json">
      {
        "arg": "Hello world!"
      }
    </script>
  </x-action>
</x-action-activator>
```

## Dependencies

### Depends on

- x-action-activator

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
