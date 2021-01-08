/* eslint-disable @stencil/render-returns-host */
import { Component, State, h, Listen } from '@stencil/core'
import { Namespace } from '../../models/namespace'

@Component({
  tag: 'dxp-experience-demo',
  styleUrl: 'dxp-experience-demo.scss',
  shadow: false,
})
export class ExperienceDemo {
  // Private experienceEl: HTMLDxpExperienceElement;

  @State() width: number
  @State() shouldRender: boolean
  @State() configType: 'namespace' | 'xapiUrl' = 'namespace'
  @State() namespace: Namespace = 'local'
  @State() xapiUrl = 'https://dxp-xapi.local.viewdo.run/v4'
  @State() storyKey = 'tech-sample'
  @State() userKey: string
  @State() experienceData: string
  @State() debug: boolean
  @State() preview: boolean
  @State() loadAssets: boolean
  @State() display: 'logo' | 'debug' | 'none' = 'debug'

  @Listen('dxp:reset')
  onDXPReset() {
    this.shouldRender = false
  }

  private _handleShouldRender(shouldRender) {
    this.shouldRender = shouldRender
  }

  private _handleExperienceDataChanged(e) {
    const json = e.target.value
    if (json && json != '' && json[0] == '{') {
      try {
        const parsed = JSON.parse(json)
        this.storyKey = parsed?.story?.key
        this.experienceData = json
      } catch {}
    }
  }

  private _getOpts() {
    const options = {
      display: this.display,
    }
    if (this.storyKey) {
      options.storyKey = this.storyKey
    }

    if (this.configType == 'namespace') {
      options.namespace = this.namespace
    } else {
      options.xapiUrl = this.xapiUrl
    }

    if (this.userKey) {
      options.userKey = this.userKey
    }

    if (this.loadAssets) {
      options.loadAssets = this.loadAssets
    }

    if (this.debug) {
      options.debug = true
    }

    if (this.preview) {
      options.preview = true
    }

    if (this.experienceData) {
      options.experienceData = this.experienceData
    }

    return options
  }

  render() {
    const NewlineText = (props: { text: any }) => {
      const text = props.text
      const newText = text.split('\n').map((string) => <div>{string}</div>)
      return newText
    }

    const DXPSample = () => {
      const camelToSnakeCase = (string: string) => string.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
      const attributes = this._getOpts()
      let attributeString = ''
      Object.keys(attributes).forEach((attr) => {
        const value = attr != 'experienceData' ? attributes[attr] : '{...}'
        attributeString += ` ${camelToSnakeCase(attr)}="${value}"`
      })
      return (
        <pre>
          <code>
            <NewlineText text={`<dxp-experience${attributeString}></dxp-experience>`} />
          </code>
        </pre>
      )
    }

    const DXPConfigure = () => [
      <ion-header>
        <h2>&#x3C;dxp-experience&#x3E;</h2>
      </ion-header>,
      <ion-list>
        <ion-list-header>
          <h5>Configure Tag:</h5>
        </ion-list-header>
        <ion-item-group>
          <ion-radio-group id="configType" value={this.configType} onIonChange={(e) => (this.configType = e.target.value)}>
            <ion-item>
              <ion-label>namespace:</ion-label>
              <ion-radio slot="start" value="namespace"></ion-radio>
              <ion-select id="configNamespace" value={this.namespace} disabled={this.configType != 'namespace'} onIonChange={(e) => (this.namespace = e.target.value)}>
                <ion-select-option>local</ion-select-option>
                <ion-select-option>develop</ion-select-option>
                <ion-select-option>stage</ion-select-option>
                <ion-select-option>master</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label>xapi-url:</ion-label>
              <ion-radio slot="start" value="xapiUrl"></ion-radio>
              <ion-input id="configXapi" slot="end" value={this.xapiUrl} disabled={this.configType != 'xapiUrl'} onIonBlur={(e) => (this.xapiUrl = e.target.value)}></ion-input>
            </ion-item>
          </ion-radio-group>
        </ion-item-group>
        <ion-item>
          <ion-label>experience-data:</ion-label>
          <ion-textarea
            id="configExperienceData"
            slot="end"
            value={this.experienceData}
            onIonChange={(e) => {
              this._handleExperienceDataChanged(e)
            }}
          ></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-label slot="start">story-key:</ion-label>
          <ion-input id="configStoryKey" slot="end" value={this.storyKey} onIonChange={(e) => (this.storyKey = e.target.value)}></ion-input>
        </ion-item>
        <ion-item>
          <ion-label slot="start">user-key:</ion-label>
          <ion-input id="configUserKey" slot="end" value={this.userKey} onIonChange={(e) => (this.userKey = e.target.value)}></ion-input>
        </ion-item>
        <ion-item>
          <ion-label slot="start">width:</ion-label>
          <ion-input id="configWidth" slot="end" value={this.width} onIonChange={(e) => (this.width = e.target.value)}></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>display:</ion-label>
          <ion-select id="configDisplay" slot="end" value={this.display} onIonChange={(e) => (this.display = e.target.value)}>
            <ion-select-option>logo</ion-select-option>
            <ion-select-option>debug</ion-select-option>
            <ion-select-option>none</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>debug:</ion-label>
          <ion-checkbox id="configDebug" slot="end" checked={this.debug} onIonChange={(e) => (this.debug = e.target.checked)}></ion-checkbox>
        </ion-item>
        <ion-item>
          <ion-label>preview:</ion-label>
          <ion-checkbox id="configPreview" slot="end" checked={this.preview} onIonChange={(e) => (this.preview = e.target.checked)}></ion-checkbox>
        </ion-item>
        <ion-item>
          <ion-label>load-assets:</ion-label>
          <ion-checkbox id="configLoadAssets" slot="end" checked={this.loadAssets} onIonChange={(e) => (this.loadAssets = e.target.checked)}></ion-checkbox>
        </ion-item>
      </ion-list>,
      <ion-button
        onClick={() => {
          this._handleShouldRender(true)
        }}
      >
        Render
      </ion-button>,
    ]

    const DXPResults = () => {
      const cdnPath = ['https://unpkg.com/@viewdo/dxp-x-host/dist/x-host/x-host.esm.js', 'https://unpkg.com/@viewdo/dxp-x-host/dist/x-host/x-host.js']

      return [
        <ion-button
          onClick={() => {
            this._handleShouldRender(false)
          }}
        >
          Reconfigure
        </ion-button>,
        <div>
          <h3>&#x3C;head&#x3E;</h3>
          <pre>
            <code>
              <NewlineText text={`<script type="module" src="${cdnPath[0]}" ></script>`}></NewlineText>
              <NewlineText text={`<script nomodule src="${cdnPath[1]}" ></script>`}></NewlineText>
            </code>
          </pre>
          <h3>&#x3C;body&#x3E;</h3>
          <DXPSample></DXPSample>
          <h3>Results:</h3>
          <dxp-experience
            /** Ref={el => this.experienceEl = el} */
            {...this._getOpts()}
            style={{ '--dxp-width': `${this.width}px` }}
          ></dxp-experience>
          <h3>Then use in script:</h3>
          <pre>
            <code>
              <NewlineText text={'<script>'}></NewlineText>
              <NewlineText text={'const body = document.querySelector("body");'}></NewlineText>
              <NewlineText text={'body.addEventListener("dxp:initialized", async event => {'}></NewlineText>
              <NewlineText text={'  let experience = event.detail;'}></NewlineText>
              <NewlineText text={'  console.dir(experience);'}></NewlineText>
              <NewlineText text={'  // await experience.setData("color", "red");'}></NewlineText>
              <NewlineText text={'}'}></NewlineText>
              <NewlineText text={'</script>'}></NewlineText>
            </code>
          </pre>
        </div>,
      ]
    }

    const stack = []

    if (this.shouldRender) {
      stack.push(...DXPResults())
    } else {
      stack.push(...DXPConfigure())
    }

    return stack
  }
}
