import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'content-scene',
  styleUrl: 'content-scene.css',
  shadow: true,
})
export class ContentScene {

  render() {
    return (
      <Host>

        <ion-content>
          <ion-grid>
            <ion-row text-center class="ion-align-items-center">
              <ion-col>
                <h2>Glad you are here <x-data-display text="{storage:name?Friend}"></x-data-display>!</h2>
                <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</h3>
              </ion-col>
            </ion-row>

            <ion-row class="ion-align-items-center">
              <ion-col size="6">
                <ion-button>
                  Get Started
                </ion-button>
              </ion-col>
              <ion-col size="6">
                <ion-button>
                  Explore Now
                </ion-button>
              </ion-col>
            </ion-row>

            <ion-row class="ion-align-items-center">
              <ion-col size="12" class="ion-text-center">
                <div class="background-box">
                  <center>
                    <img src="https://via.placeholder.com/150" />
                  </center>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
              </ion-col>
            </ion-row>

            <ion-row class="ion-align-items-center">
              <ion-col>
                <div>
                  1 of 4
                </div>
              </ion-col>
              <ion-col>
                <div>
                  2 of 4
                </div>
              </ion-col>
              <ion-col>
                <div>
                  3 of 4
                </div>
              </ion-col>
              <ion-col>
                <div>
                  4 of 4 <br/>
                  # <br/>
                  # <br/>
                  #
                </div>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="12" class="ion-text-center">
                <div class="background-box">
                  <h1>Is view.DO for you?</h1>
                  <h2 color="primary">Trusted by clients in 7 different countries</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <blockquote>
                    <p>"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                    <p class="large">– A very important person</p>
                  </blockquote>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>

          <ion-toolbar class="x-nav-bottom">
            <x-link slot="start" href="/home">
              <ion-button color="light">
                <ion-icon slot="start" name="caret-back-outline"></ion-icon>
                Home
              </ion-button>
            </x-link>
            <x-link slot="end" href="/video">
              <ion-button>
                Next: Video Scene
                <ion-icon slot="end" name="caret-forward-outline"></ion-icon>
              </ion-button>
            </x-link>
          </ion-toolbar>

        </ion-content>
      </Host>
    );
  }
}
