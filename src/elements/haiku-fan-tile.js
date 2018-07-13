import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';

export class HaikuFanTile extends LitElement {

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
        <label>${ entity.attributes.name }</label>
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
