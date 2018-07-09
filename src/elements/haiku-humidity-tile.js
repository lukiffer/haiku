import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';

export class HaikuHumidityTile extends LitElement {

  static get properties() {
    return {
      hass: Object,
      entity: Object
    };
  }

  _render({ entity }) {
    return html`
      {{ css }}
      <div class="stat-container">
        <label>Humidity</label>
        <span class="stat-value" title$="${ entity.state }%">
          ${ Math.round(entity.state) }
          <span class="unit">%</span>
        </span>
      </div>
    `;
  }
}

customElements.define('haiku-humidity-tile', HaikuHumidityTile);
