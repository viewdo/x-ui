import { Component, h } from '@stencil/core'

@Component({
  tag: 'x-preferences-list',
  styleUrl: 'x-preferences-list.scss',
  shadow: false,
})
export class PreferencesList {
  render() {
    return (
      <ion-list>
        <ion-item>
          <ion-label>Theme</ion-label>
          <x-theme-toggle></x-theme-toggle>
        </ion-item>
        <ion-item>
          <ion-label>Sound</ion-label>
          <x-sound-toggle></x-sound-toggle>
        </ion-item>
        <ion-item>
          <ion-label>Auto Play</ion-label>
          <x-autoplay-toggle></x-autoplay-toggle>
        </ion-item>
      </ion-list>
    )
  }
}
