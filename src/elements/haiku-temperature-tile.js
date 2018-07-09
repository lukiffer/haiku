import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';

export class HaikuTemperatureTile extends LitElement {

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
        <label>Temperature</label>
        <span class="stat-value" title$="${ entity.state + entity.attributes.unit_of_measurement }">
          ${ Math.round(entity.state) }°
          <span class="unit">
            ${ this.getUnit(entity) }
          </span>
        </span>
      </div>
    `;
  }

  getUnit(entity) {
    if (entity.attributes && entity.attributes.unit_of_measurement) {
      return entity.attributes.unit_of_measurement.replace(/°/, '');
    }
    return '';
  }
}

customElements.define('haiku-temperature-tile', HaikuTemperatureTile);
