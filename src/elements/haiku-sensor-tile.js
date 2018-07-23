import { html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import { HaikuTileBase } from './haiku-tile-base.js';

export class HaikuSensorTile extends HaikuTileBase {

  constructor() {
    super();
  }

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
        <label>${ this.getTitle(entity) }</label>
        <span class="stat-value" title$="${ this.getLongValue(entity) }">
          ${ this.getShortValue(entity) }
          <span class="unit">
            ${ this.getUnit(entity) }
          </span>
        </span>
      </div>
    `;
  }

  getTitle(entity) {
    if (entity.attributes && entity.attributes.haiku_label) {
      return entity.attributes.haiku_label;
    }

    if (this._hasUnit(entity)) {
      switch (entity.attributes.unit_of_measurement) {
        case '°F':
        case '°C':
          return 'Temperature';
        case '%':
          return 'Humidity';
        case 'ppm':
          return 'Air Quality';
        default:
          return 'Unknown Sensor';
      }
    }

    return 'Unknown Sensor';
  }

  getShortValue(entity) {
    if (this._hasUnit(entity)) {
      if (entity.attributes.unit_of_measurement.match(/°/)) {
        return `${ Math.round(entity.state) }°`;
      }
    }

    if (isNaN(entity.state)) {
      return entity.state;
    }

    return Math.round(entity.state).toString();
  }

  getLongValue(entity) {
    if (this._hasUnit(entity)) {
      return entity.state + entity.attributes.unit_of_measurement;
    }
    return entity.state;
  }

  getUnit(entity) {
    if (this._hasUnit(entity)) {
      return entity.attributes.unit_of_measurement.replace(/°/, '');
    }
    return '';
  }

  _hasUnit(entity) {
    return entity.attributes && entity.attributes.unit_of_measurement;
  }
}

customElements.define('haiku-sensor-tile', HaikuSensorTile);
