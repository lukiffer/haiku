import { html } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
import { HaikuTileBase } from './haiku-tile-base.js';

export class HaikuFanTile extends HaikuTileBase {

  static get properties() {
    return {
      hass: Object,
      entity: Object
    };
  }

  _render({ entity }) {
    return html`
      {{ css }}
      <div class="stat-container" on-click="${ (e) => this.handleClick(e) }">
        <label title$="${ entity.attributes.friendly_name }">${ entity.attributes.haiku_label || 'Fan' }</label>
        <div class$="${ this.getCssClass(entity) }">
          <ha-icon icon$="mdi:${ entity.state === 'on' ? 'fan' : 'fan-off' }"></ha-icon>
        </div>
      </div>
    `;
  }

  getCssClass(entity) {
    let result = 'fan-icon';
    result += entity.state === 'on' ? ' on' : ' off';
    if (entity.attributes && entity.attributes.speed) {
      result += ` ${ entity.attributes.speed }`;
    }
    return result;
  }
}

customElements.define('haiku-fan-tile', HaikuFanTile);
