# Data Provider Specification

Data Providers must expose a key-value system interface for getting and settings data-values.

**Provider Interface:**

    get(key:string) : Promise<string>
    set(key: string, value: string) : Promise<void>

## Sample Registration Component

The following is a sample component.

    ````tsx
    import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';

    @Component({
      tag: 'x-data-provider-firebase',
      shadow: false,
    })
    export class XDataProviderFirebase {
      private customProvider = new MyFirebaseProvider();

      /**
       * This event is raised when the component loads.
       * The data-provider system should capture this event
       * and register the provider for use in expressions.
       */
      @Event({
        eventName: 'xui:action-events:data',
      }) raiseAction: EventEmitter<any>;

      @State() keys = [];

      componentDidLoad() {
        this.raiseAction.emit({
          command: 'register-provider',
          data: {
            name: this.name,
            provider: this.customProvider,
          },
        });
      }
    }
    ````

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description                                                  | Type      | Default    |
| -------- | --------- | ------------------------------------------------------------ | --------- | ---------- |
| `debug`  | `debug`   | When debug is true, a reactive table of values is displayed. | `boolean` | `false`    |
| `name`   | `name`    | Customize the name used for this sample data provider.       | `string`  | `'memory'` |

## Events

| Event      | Description                                                                                                                                         | Type                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `register` | This event is raised when the component loads. The data-provider system should capture this event and register the provider for use in expressions. | `CustomEvent<ActionEvent<DataProviderRegistration>>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
