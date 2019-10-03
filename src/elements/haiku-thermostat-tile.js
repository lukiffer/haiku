import { html } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
import { HaikuTileBase } from './haiku-tile-base.js';

export class HaikuThermostatTile extends HaikuTileBase {

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
      <div class="stat-container"
        title$="${ this.getName(entity) }"
        on-click="${ (e) => this.handleClick(e) }">
        <div class="status-container" title$="0° F">
          <div class$="status-value ${ this.getStatusClasses(entity) }">
            <span>${ this.getModeLabel(entity) }</span>
            <label>
              ${ this.getTargetTemperature(entity) }°
              <span class="unit">${ this.getUnit(entity) }</span>
            </label>
          </div>
        </div>
      </div>
    `;
  }

  getModeLabel(entity) {
    if (entity.attributes && entity.attributes.operation_mode) {
      if (entity.attributes.fan_mode === 'on') {
        return entity.attributes.operation_mode + 'ing';
      }
      return 'Set to';
    }
    return 'Unknown';
  }

  getStatusClasses(entity) {
    const classList = [];
    if (entity.attributes) {
      if (entity.attributes.operation_mode === 'cool') {
        classList.push('cool');
      }
      else if (entity.attributes.operation_mode === 'heat') {
        classList.push('heat');
      }

      if (entity.attributes.fan_mode === 'on') {
        classList.push('on');
      }
    }
    return classList.join(' ');
  }

  getTargetTemperature(entity) {
    if (entity.attributes) {
      if (entity.attributes.operation_mode === 'cool') {
        return entity.attributes.temperature || entity.attributes.target_temp_high;
      }

      if (entity.attributes.operation_mode === 'heat') {
        return entity.attributes.temperature || entity.attributes.target_temp_low;
      }
    }
    return 'Off';
  }

  getUnit(entity) {
    // TODO: Climate domain doesn't appear to return unit_of_measurement.
    //       Need to find out how to reliably get this information.
    if (entity.attributes) {
      let value = this.getTargetTemperature(entity);
      if (value === 'Off') {
        value = entity.attributes.current_temperature;
      }

      if (value > 45) {
        return 'F';
      }
      return 'C';
    }
    return '';
  }

  // getShortValue(entity) {
  //   if (this._hasUnit(entity)) {
  //     if (entity.attributes.unit_of_measurement.match(/°/)) {
  //       return `${ Math.round(entity.state) }°`;
  //     }
  //   }

  //   if (isNaN(entity.state)) {
  //     return entity.state;
  //   }

  //   return Math.round(entity.state).toString();
  // }

  // getLongValue(entity) {
  //   if (this._hasUnit(entity)) {
  //     return entity.state + entity.attributes.unit_of_measurement;
  //   }
  //   return entity.state;
  // }

  // getUnit(entity) {
  //   if (this._hasUnit(entity)) {
  //     return entity.attributes.unit_of_measurement.replace(/°/, '');
  //   }
  //   return '';
  // }

  // _hasUnit(entity) {
  //   return entity.attributes && entity.attributes.unit_of_measurement;
  // }
}

customElements.define('haiku-thermostat-tile', HaikuThermostatTile);
