# dxp-video-scene



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type     | Default     |
| ----------- | ------------ | ----------- | -------- | ----------- |
| `youtubeId` | `youtube-id` |             | `string` | `undefined` |


## Dependencies

### Depends on

- vm-player
- vm-youtube

### Graph
```mermaid
graph TD;
  dxp-video-player --> vm-player
  dxp-video-player --> vm-youtube
  vm-youtube --> vm-embed
  style dxp-video-player fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
