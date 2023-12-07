// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "@lrnwebcomponents/video-player/video-player.js";
import "./tv-channel.js";


export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.activeItem = {
      title: null,
      id: null,
      description: null,
    };
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object }
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }
      .listing-container{
        justify-self: center;
        max-width: 1344px;
        justify-items: left;
        display: flex;
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
        // height: 100%
        // font-size: 1 em;
      }
      .timecode-container {
        position: absolute;
        top: 0;
        left: 0;
        margin: 10px;
        padding: 5px;
        color: white;
        background-color: #384194;
        border-radius: 5px;
        z-index: 1;
      }
      //.title-container{
      //  position: relative;
      //  align-self: center;
      //  margin: 20px;
      //}
      p{
        font-size: 12px;
      }
      video-player{
        width: 750px;
        height: auto;
        max-width: 100px;
        border: 1px solid #cccccc;
        border-radius: 8px;
      }
      //h5 {
      //  font-weight: 400;
      //}
      //.discord {
      //  display: inline-flex;
      //}
      //.middle-page {
      //  display: inline-flex;
      //}
      //.
      `,
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <h2>${this.name}</h2>
      <div class="listing-container">
      ${
        this.listings.map(
          (item) => html`
            <tv-channel 
              id="${item.id}"
              timecode="${item.metadata.timecode}"
              title="${item.title}"
              presenter="${item.metadata.author}"
              description="${item.description}"
              video="${item.metadata.source}"
              @click="${this.itemClick}"
            >
            </tv-channel>
          `
        )
      }
      </div>
      <div>
        <h1 class="title-container">
      ${this.activeItem.title}

    </h1>
    <div style="display: inline-flex">
        <!-- video -->
        <iframe id="video-player" style="margin: 30px;"
        width="750"
        height="400"
        src="https://www.youtube.com/embed/9MT-BNuUCpM"
        frameborder="0"
        allowfullscreen
        ></iframe>
        <video-player id="video-player" source="https://www.hide-youtube-link.com/embed/9MT-BNuUCpM" accent-color="blue" dark track="https://haxtheweb.org/files/HAXshort.vtt"
        >
    </video-player>


      <div>
        <iframe style=""
        src="https://discord.com/widget?id=YOUR_DISCORD_SERVER_ID&theme=dark"
        width="400"
        height="500"
        allowtransparency="true"
        frameborder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe>
    </div>
    </div>

      <tv-channel style="height= " title=${this.activeItem.title} presenter="${this.activeItem.author}">
      <p id ="description">${this.activeItem.description} </p>
    </tv-channel>

    </div>
    <sl-dialog label="${this.activeItem.title}" class="dialog">
      ${this.activeItem.description}
      <sl-button slot="footer" variant="primary" @click="${this.watchButtonClick}">WATCH</sl-button>
    </sl-dialog>

    `;
  }

  watchButtonClick() {
    this.changeVideo();
    const dialog = this.shadowRoot.querySelector('dialog');
    dialog.hidden();
  }

  changeVideo() {
    const videoPlayer = this.shadowRoot.querySelector('video-player');
    videoPlayer.source = this.createSource();
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play()
  }

  extractVideoID(link) {
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
    return "https://www.youtube.com/embed/" + this.extractVideoID(this.activeItem.video);
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    //console.log(e.target);
    this.activeItem = {
      title: e.target.title,
      id: e.target.id,
      description: e.target.description,
      video: e.target.video, // Set the source on the active Item
    };

    this.changeVideo(); // Call the changeVideo method
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();

    this.dispatchEvent (
      new CustomEvent('active-item-changed', {
        bubbles: true,
        composed: true,
        detail: { activeItem: this.activeItem },
      })
    );
  }
  
  
  
  /* <div class="middle-page">
        ${this.activeItem.name}
        ${this.activeItem.description}
        <!-- video -->
        <figure id="player-figure" class="image is-16by9">
        <iframe id="player" class="has-ratio box p-0" width="560" height="315" src="https://www.youtube.com/embed/QJMBhXjtaYU?enablejsapi=1" title="Teaching for Now and Planning for Later - Reclaim Open Online" frameborder="0" allow="accelerometer; autoplay; clipbaord-write; encrypted-media; gyroscope, picture-in-picture" allowfullscreen=""></iframe>
    </figure>
        <!-- discord / chat - optional -->
        <div class="discord">
          <widgetbot server="954008116800938044" channel="1106691466274803723" width="100%" height="100%" style="display: inline-block; overflow: hidden; background-color: rgb(54, 57, 62); border-radius: 7px; vertical-align: top; width: 100%; height: 100%;"><iframe title="WidgetBot Discord chat embed" allow="clipboard-write; fullscreen" src="https://e.widgetbot.io/channels/954008116800938044/1106691466274803723?api=a45a80a7-e7cf-4a79-8414-49ca31324752" style="border: none; width: 100%; height: 100%;"></iframe></widgetbot>
            <script src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed"></script>
          </div>
      </div>
      <!-- dialog -->
      <sl-dialog label="Wiener: TV" class="dialog">
      ${this.activeItem.title}
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Watch</sl-button>
      </sl-dialog>
    `;
  }
*/






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
        console.log(this.liftings);
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
