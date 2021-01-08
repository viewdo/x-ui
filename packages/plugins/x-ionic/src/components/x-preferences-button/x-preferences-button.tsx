import { Component, h, Prop, Host, Element } from '@stencil/core'
import { popoverController } from '@ionic/core'

@Component({
  tag: 'x-preferences-button',
  styleUrl: 'x-preferences-button.scss',
  shadow: true,
})
export class XPreferencesButton {
  @Element() el: HTMLXPreferencesButtonElement
  private popover: HTMLIonPopoverElement
  /**
   *
   *
   */
  @Prop() icon = 'settings-outline'

  componentWillLoad() {
    // If (!state.theme) {
    //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    //   document.body.classList.toggle('dark', prefersDark.matches);
    //   this.presentToast('Dark mode preference was detected. Use the preferences icon to change modes.');
    // } else {
    //   document.body.classList.toggle('dark', state.theme === 'dark');
    // }
  }

  // Private async presentToast(message) {
  //  const toast = await toastController.create({
  //    message,
  //    duration: 3000,
  //    position: 'middle',
  //  });
  //  toast.present();
  // }

  private async presentPopover(ev: Event, component: string) {
    this.popover = await popoverController.create({
      component,
      cssClass: 'popover',
      event: ev,
      translucent: true,
    })
    await this.popover.present()
  }

  render() {
    return (
      <Host>
        <ion-button onClick={async (e) => this.presentPopover(e, 'x-preferences-list')}>
          <ion-icon name={this.icon}></ion-icon>
        </ion-button>
      </Host>
    )
  }
}
