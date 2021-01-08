import { Component, Host, h } from '@stencil/core'

@Component({
  tag: 'x-theme-toggle',
  styleUrl: 'x-theme-toggle.scss',
  shadow: false,
})
export class ThemeToggle {
  componentWillLoad() {
    // If (!state.theme) {
    //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    //   this.toggleDarkTheme(prefersDark.matches);
    //   prefersDark.addEventListener('change', (ev) => this.toggleDarkTheme(ev.matches));
    //   state.theme = prefersDark.matches ? 'dark' : 'light';
    // }
  }

  private toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd)
    // State.theme = shouldAdd ? 'dark' : 'light';
  }

  render() {
    // Checked={state.theme === 'dark'}
    return (
      <Host>
        <ion-buttons collapse slot="end">
          <ion-icon name="sunny"></ion-icon>
          <ion-toggle
            onIonChange={(e) => {
              this.toggleDarkTheme(e.detail.checked)
            }}
          ></ion-toggle>
          <ion-icon name="moon"></ion-icon>
        </ion-buttons>
      </Host>
    )
  }
}
