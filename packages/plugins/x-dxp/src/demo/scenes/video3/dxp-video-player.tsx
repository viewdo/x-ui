import { Component, Prop, h } from '@stencil/core';
import '@vime/core/themes/default.css';

@Component({
  tag: 'dxp-video-player',
  styleUrl: 'dxp-video-player.css',
  shadow: false,
})

export class dxpVideoPlayer {

    @Prop() youtubeId: string;

    // private player!: HTMLVmPlayerElement;

    // @State() currentTime = 0;

    // // Example method to showcase updating property.
    // private seekForward() {
    //   this.currentTime += 5;
    // };

    // // Example method to showcase calling player method.
    // private enterFullscreen() {
    //   this.player.enterFulllscreen();
    // };

    // private onTimeUpdate(event: CustomEvent<number>) {
    //   this.currentTime = event.detail;
    // };

    // private onFullscreenChange(event: CustomEvent<boolean>) {
    //   const isFullscreen = event.detail;
    //   // ...
    // };

    render() {
      return (
        <vm-player controls>

          <vm-youtube videoId={this.youtubeId} />

        </vm-player>
      );
    }
  }
