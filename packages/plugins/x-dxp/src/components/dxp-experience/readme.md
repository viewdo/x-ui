<!-- markdownlint-disable MD007 MD022 MD031 -->

# DXP-EXPERIENCE

## Usage

This component encapsulated all experience interactions. From retrieving by XID, funnel or you can configure it for a static story.

- Put a script tag in the head of your page:

````html
<script type='module' src='https://unpkg.com/@viewdo/dxp-experience-components/dist/dxp/dxp.esm.js'></script>
````

- Then you can use the element anywhere in your template, JSX, html etc

````html
<dxp-experience xapi-url="https://xapi.view.do/v4"></dxp-experience>
````

- Attach to the 'initialized' event to get a handle on the experience data.

```html
<script>
  const body = document.querySelector('body');
  experienceTag.addEventListener('initialized', async event => {
    let experience = event.detail;
    await experience.setData('color', 'red');
    console.dir(experience)
  })
</script>
````


<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                                                                       | Type                                                     | Default        |
| ---------------- | ----------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------- |
| `debug`          | `debug`           | Enable Debug mode to prevent API calls. (falls back to ?debug )                   | `boolean`                                                | `url.debug`    |
| `display`        | `display`         | Display mode for this element.                                                    | `"debug" \| "logo" \| "none"`                            | `'logo'`       |
| `experienceData` | `experience-data` | Experience data (bypasses XAPI to retrieve it)                                    | `string`                                                 | `undefined`    |
| `loadAssets`     | `load-assets`     | Enable Debug mode to prevent API calls.                                           | `boolean`                                                | `false`        |
| `namespace`      | `namespace`       | The platform environment target. (optional)                                       | `"develop" \| "local" \| "master" \| "other" \| "stage"` | `undefined`    |
| `preview`        | `preview`         | Enable preview mode to fake data and prevent API calls. (falls back to ?preview ) | `boolean`                                                | `url.preview`  |
| `storyKey`       | `story-key`       | Story Key (falls back to ?storyKey )                                              | `string`                                                 | `url.storyKey` |
| `userKey`        | `user-key`        | User Key (falls back to ?userKey )                                                | `string`                                                 | `url.userKey`  |
| `xapiUrl`        | `xapi-url`        | Experience API Url (optional)                                                     | `string`                                                 | `undefined`    |


## Events

| Event             | Description                                                                                                                                            | Type                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `dxp:errored`     | When an experience is unable to be retrieved, this event fires with 'event.detail' = error message.                                                    | `CustomEvent<string>`     |
| `dxp:initialized` | When an experience is retrieved, this event fires with 'event.detail' being the full experience, w/ data methods like 'setData()' and 'setComplete()'. | `CustomEvent<Experience>` |
| `dxp:reset`       | This event is raised when reset() is called.                                                                                                           | `CustomEvent<void>`       |


## Methods

### `getExperience(timeout: number) => Promise<Experience>`

This method gets waits for the experience.

#### Returns

Type: `Promise<Experience>`



### `reset() => Promise<void>`

This method resets the stored session-id & experience-key,
effectively resetting the current experience. Useful for testing
or dynamically switching experiences in-page.

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part          | Description |
| ------------- | ----------- |
| `"container"` |             |


## Dependencies

### Used by

 - [dxp-experience-demo](../dxp-experience-demo)

### Graph
```mermaid
graph TD;
  dxp-experience-demo --> dxp-experience
  style dxp-experience fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
