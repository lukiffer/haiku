import { html } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
import { HaikuTileBase } from './haiku-tile-base.js';

export const SUCCESS_STATES = [
  'ready'
];

export const WARNING_STATES = [];

export const ERROR_STATES = [];

export class HaikuStatusTile extends HaikuTileBase {

  static get properties() {
    return {
      hass: Object,
      entity: Object
    };
  }

  _render({ entity }) {
    if (!entity) {
      return '';
    }

    return html`
      {{ css }}
      <div class="status-container" on-click="${ (e) => this.handleClick(e) }">
        <label title$="${ entity.attributes.friendly_name }">${ entity.attributes.friendly_name }</label>
        <span class$="${ this.getStatusCssClass(entity.state) }">${ entity.state }</span>
      </div>
    `;
  }

  getStatusCssClass(state) {
    if (SUCCESS_STATES.includes(state)) {
      return 'success';
    }

    if (WARNING_STATES.includes(state)) {
      return 'warning';
    }

    if (ERROR_STATES.includes(state)) {
      return 'error';
    }

    return 'unknown';
  }
}

customElements.define('haiku-status-tile', HaikuStatusTile);
