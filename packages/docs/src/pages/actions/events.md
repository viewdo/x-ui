## Submitting Event-Actions

### Using Element Event

Event Name: **actionEvent**

### Custom Event

```typescript
const action = new CustomEvent('x:actions', {
  detail: {
    topic: "<topic",
    command: "<command>",
    data: {
      ...
    }
  }
});

const xui = document.querySelector('x-ui');
xui.dispatchEvent(action, {
  bubbles: true,
  composed: true,
});

```

## Using the ActionBus

```typescript

import { ActionBus } from '@viewdo/x-ui';

ActionBus.emit('<topic>', {
  command: "<command>",
  data: {
    ...command args...
  }
})

```