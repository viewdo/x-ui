import { Component, Prop, h } from '@stencil/core';
import '@vime/core/themes/default.css';

@Component({
  tag: 'dxp-video-scene',
  styleUrl: 'dxp-video-scene.css',
  shadow: false,
})
export class dxpVideoScene {

  @Prop() mainTitle: string;
  @Prop() subtitle: string;
  @Prop() videoUrl: string;
  @Prop() posterUrl: string;
  @Prop() ccUrl: string;
  @Prop() buttonLabel: string;

  render() {
    return (
      <div class="grid justify-items-stretch">
        <h1>{this.mainTitle}</h1>
        <h3>{this.subtitle}</h3>

        <x-spacer height="3rem"></x-spacer>

        <vm-player controls playsinline>
          <vm-video crossOrigin="" poster={this.posterUrl}>
          <source
            data-src={this.videoUrl}
            type="video/mp4"
          />
          <track
            default
            kind="subtitles"
            src={this.ccUrl}
            srclang="en"
            label="English" />
          </vm-video>
        </vm-player>

        <x-spacer height="3rem"></x-spacer>

        {/* Continue button */}
        <div class="justify-self-center">
          <button x-next class="transition-colors duration-500 ease-in-out hover:bg-red-700 hover:text-purple-600 m-auto py-1 px-5 flex rounded-md bg-black text-white" type="submit">
            {this.buttonLabel}
          </button>
        </div>

        <div class="x-nav-bottom">
          <button slot="start" x-back class="btn btn-light">
            <i class="ri-arrow-left-s-line"></i>
            Back
          </button>
          <button slot="end" x-next class="btn btn-primary">
            Next
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>
    );
  }

}
