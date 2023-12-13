// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.presenter = '';
    this.description = '';
    this.timecode = ''; 
    this.startTime = '';
    this.video = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      description: { type: String},
      presenter: { type: String },
      video: { type: String },
      timecode: {type: Number},
      startTime: {type: String},
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
     :host {
        text-rendering: optimizeLegibility;
        box-sizing: inherit;
        display: inline-block;
        line-height: 1.2;
        font-size: 1em;
        font-weight: 400;
        min-width: 300px;
        margin: 0;
        padding: 0;
        transition: all 0.25s ease-in-out;
        overflow: hidden;
        text-overflow: ellipsis;
      } 
      .wrapper {
        display: inline-flexblock;
        margin: .5rem;
        padding: .5rem;
        padding-left: 16px;
        padding-right: 16px;
        border-radius: 6px;
        border-color: #4a4a4a;
        box-shadow: 0px 0px 0px 1px #dbdbdb;
        background-color: #ffffff;
        vertical-align: top;
      } 
      p {
        font-size: 12px;
      }
      .time {
        width: 50px;
        text-align: center;
        padding: 12px;
        border-radius: 6px;
        height: 8px;
      }
      .startTime{
        display: inline-flex;
        vertical-align: top;
        text-align: center;
        padding: 12px;
        margin: 0;
        background-color: lightblue;
        border-color: #1620d7;
        border-radius: 8px;
      }
     /* .titles {
        display: inline-block;
        vertical-align: --tooltip-offset;
      } */ 
    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">
      <div class="startTime">
          ${this.startTime}</div>
  <h6>${this.timecode} min</h6>
      <h3>${this.title}</h3>
        <h4>${this.presenter}</h4>
        <slot></slot>
      </div>
  `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
