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
    console.log(entity);
    return html`
      <style>.stat-container {
  background: rgba(33, 33, 33, 0.7);
  margin-top: 2px;
  margin-right: 2px;
  height: 120px;
  cursor: pointer; }
  .stat-container > label {
    color: white;
    text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
    display: block;
    padding: 1.25rem 0 0 16px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer; }
  .stat-container > .stat-value {
    color: white;
    text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
    font-size: 48px;
    font-weight: 400;
    display: block;
    margin-top: 1.5rem;
    margin-left: 16px;
    letter-spacing: -1px; }
    .stat-container > .stat-value.unavailable {
      font-size: 18px;
      letter-spacing: 0;
      color: #555;
      text-transform: uppercase; }
    .stat-container > .stat-value > .unit {
      color: white;
      text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
      font-size: 24px;
      font-weight: 400;
      margin-left: -8px; }

.status-value {
  border: solid 4px #ccc;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  padding: 3px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.85); }
  .status-value.status-normal {
    border-color: #bada55; }
  .status-value.status-warning {
    border-color: #ffc800; }
  .status-value.status-critical {
    border-color: #d20c0c; }
  .status-value > ha-icon {
    font-size: 24px;
    display: block;
    margin: 0 auto;
    margin-bottom: 8px;
    margin-top: 6px; }
  .status-value > span {
    color: white;
    text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
    font-size: 11px;
    display: block;
    margin: 0 auto;
    line-height: 14px;
    text-transform: uppercase;
    margin-bottom: 0;
    margin-top: 16px; }
    .status-value > span.multiline {
      margin-bottom: 0;
      margin-top: 7px; }
  .status-value > label {
    color: white;
    text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
    font-size: 32px;
    text-transform: uppercase;
    letter-spacing: -1px; }

.status-container {
  padding: 12px 0; }

.status-value {
  cursor: pointer; }
  .status-value > * {
    cursor: pointer; }
  .status-value.cool {
    border-color: #00c6fb; }
  .status-value.heat {
    border-color: #ff6600; }
  .status-value .unit {
    font-size: 15px;
    margin-left: -15px;
    color: #999; }
</style>
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
