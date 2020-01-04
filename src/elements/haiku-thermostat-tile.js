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
    if (entity.attributes && entity.attributes.hvac_action) {
      return entity.attributes.hvac_action;
    }
    return 'Unknown';
  }

  getStatusClasses(entity) {
    const classList = [];
    if (entity.attributes) {
      if (entity.attributes.hvac_action === 'cooling') {
        classList.push('cool');
      }
      else if (entity.attributes.hvac_action === 'heating') {
        classList.push('heat');
      }
    }
    return classList.join(' ');
  }

  getTargetTemperature(entity) {
    if (entity.attributes) {
      if (entity.attributes.hvac_action === 'cooling') {
        return entity.attributes.temperature || entity.attributes.target_temp_high;
      }

      if (entity.attributes.hvac_action === 'heating') {
        return entity.attributes.temperature || entity.attributes.target_temp_low;
      }

      if (entity.attributes.hvac_action === 'idle') {
        return entity.attributes.temperature || entity.attributes.current_temperature;
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
}

customElements.define('haiku-thermostat-tile', HaikuThermostatTile);
