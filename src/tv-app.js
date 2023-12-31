import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";
import "@lrnwebcomponents/video-player/video-player.js";

export class TvApp extends LitElement {
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.activeItem = {
      title: '',
      id: '',
      description: '',
      startTime: '',
      timecode: ''
    };
  }
  static get tag() {
    return 'tv-app';
  }
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object }
    };
  }
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }
      .listing-container {
        justify-self: center;
        max-width: 1344px;
        justify-items: left;
        display: inline-flex;
        flex-direction: row;
        flex-grow: 1;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: auto;
        padding-left: .5rem;
        padding-right: .5rem;
        text-rendering: optimizeLegibility;
        width: 100%;
        margin: 0 auto;
        position: relative;
        animation-delay: 1s;
        animation-duration: 1s;
        line-height: 1.5;
        font-size: 1em;
      }
      .title-container{
        position: relative;
        align-self: center;
        margin: 10px;
      }
      .wrapper {
        display: inline-block;
        padding: 20px;
        width: 650px;
        vertical-align: top;
      }
      .discord {
        display: inline-block;
        height: 440px;
        vertical-align: top;
        padding: 20px;
      }
      `
    ];
  }
  render() {
    return html`
      <h2>${this.name}</h2>
      <div class="listing-container">
      ${
        this.listings.map(
          (item) => html`
            <tv-channel 
              id="${item.id}"
              title="${item.title}"
              presenter="${item.metadata.author}"
              description="${item.description}"
              @click="${this.itemClick}"
              video="${item.metadata.source}"
              timecode="${item.metadata.timecode}"
              startTime="${item.metadata.startTime}"
            >
            </tv-channel>
          `
        )
      }
      </div>

      <div>
      <div class="wrapper">
      <video-player 
        source="https://www.youtube.com/watch?v=bdVxbD41lV4" 
        accent-color="red" 
        dark track="https://haxtheweb.org/files/HAXshort.vtt">
     </video-player>
    </div>
        
        <div class="discord">
          <widgetbot server="954008116800938044" 
          channel="1106691466274803723" 
          width="100%" 
          height="100%" 
          style="overflow: hidden; background-color: rgb(54, 57, 62); border-radius: 7px; vertical-align: top; width: 100%; height: 100%;">
          <iframe title="WidgetBot Discord chat embed" allow="clipboard-write; fullscreen" src="https://e.widgetbot.io/channels/954008116800938044/1106691466274803723?api=a45a80a7-e7cf-4a79-8414-49ca31324752" 
            style="border: none; width: 100%; height: 100%;">
          </iframe>
          </widgetbot>
            <script src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed"></script>
          </div>
    </div>
    
      <tv-channel title="${this.activeItem.title}" 
      style="display: block;"
      presenter="${this.activeItem.author}"
      startTime="${this.activeItem.startTime}">
        <p id="description">${this.activeItem.description}</p>
        <div class ="descriptionWrapper">
    </div>
      </tv-channel>


      <sl-dialog label="${this.activeItem.title}" class="dialog">
          ${this.activeItem.description}
        <sl-button slot="footer" variant="primary" @click="${this.buttonClick}">Watch</sl-button>
      </sl-dialog>
    `;
  }

  changeChannel() {
    const vid = this.shadowRoot.querySelector('video-player');
    vid.source = this.createSource();
  }

  extractVideoId(link) {
    try {
      const url = new URL(link);
      const searchParams = new URLSearchParams(url.search);
      return searchParams.get("v");
    } catch (error) {
      console.error("Invalid URL:", link);
      return null;
    }
  }
  createSource() {
    return "https://www.youtube.com/embed/" + this.extractVideoId(this.activeItem.video);
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    this.activeItem = {
      title: e.target.title,
      id: e.target.id,
      description: e.target.description,
      video: e.target.video,
    }; 
    //this.changeChannel();
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  buttonClick(e) {
    this.changeChannel();
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);