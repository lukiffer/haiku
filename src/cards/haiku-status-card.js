import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
import 'https://unpkg.com/lodash@4.17.10/lodash.js?module';
import '../elements/haiku-status-tile.js';

export class HaikuStatusCard extends LitElement {

  static get properties() {
    return {
      hass: Object,
      config: Object
    };
  }

  setConfig(config) {
    // TODO: config validation
    this.config = config;
  }

  _render({ config }) {
    return html`
      <style include="paper-material-styles"></style>
      {{ css }}
      <div class="haiku-card-container">
        <ha-card class$="haiku-status-card">
          <div class="tiles">
            ${_.map(this.config.entities, (key) => this.renderStatusTile(key))}
          </div>
        </ha-card>
        <h1 class="haiku-status-card-title">${ config.title }</h1>
      </div>
    `;
  }

  renderStatusTile(key) {
    const state = this.hass.states[key];
    return html`<haiku-status-tile hass="${ this.hass }" entity="${ state }"></haiku-status-tile>`;
  }
}

customElements.define('haiku-status-card', HaikuStatusCard);
