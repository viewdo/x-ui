import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'dxp-toc-scene',
  styleUrl: 'dxp-toc-scene.css',
  shadow: false,
})
export class dxpTocScene {

  @Prop() tocOptions: object =
    {
      Option1: {
        'label': 'Option 1',
        'link': '/affirm1',
        'image': 'https://via.placeholder.com/250',
      },
      Option2: {
        'label': 'Option 2',
        'link': '/affirm2',
        'image': 'https://via.placeholder.com/250',
      },
      Option3: {
        'label': 'Option 3',
        'link': '/affirm3',
        'image': 'https://via.placeholder.com/250',
      }
    }

  // @Prop() tocImages: Array = [
  //   'https://via.placeholder.com/250',
  //   'https://via.placeholder.com/250',
  //   'https://via.placeholder.com/250'
  // ];
  // @Prop() tocLinks: Array = [
  //   '/affirm1',
  //   '/affirm2',
  //   '/affirm3'
  // ];
  // @Prop() tocLabels: Array = [
  //   'Option 1',
  //   'Option 2',
  //   'Optino 3'
  // ];

  componentWillLoad() {
  }

  componentDidRender() {
  }

  render() {
    return (
      <div class="grid justify-items-stretch">

        {/* Continue button */}
        {/* <div class="justify-self-center">
          <button x-next class="transition-colors duration-500 ease-in-out hover:bg-red-700 hover:text-purple-600 py-1 px-5 flex items-center justify-self-center rounded-md bg-black text-white" type="submit">
            {this.}
          </button>
        </div> */}

{/*
        <x-data-repeat items-src={this.tocOptions} debug>
          <template>
            <div class="viewdo-toc-thumb">
              <div x-next='{data:link}'>
                  <div class="label">data:label</div>
                  <div class="background" style="background-image: url({data:image});"></div>
              </div>
            </div>
          </template>
        </x-data-repeat> */}

        <div class="viewdo-toc-grid-{{experience.data.states.toc.links.length}}"
            ng-class="{'viewdo-toc-{{experience.data.states.toc.style}}': experience.data.states.toc.style}">
            <div ng-repeat="item in experience.data.states.toc.links" class="viewdo-toc-thumb">
                <div ivx-go-to-state="{{item.route}}">
                    {/* <div class="label">{{item.label}}</div> */}
                    <div class="background" style="background-image: url({{item.image}});"></div>
                </div>
            </div>
        </div>

      </div>
    );
  }

}
