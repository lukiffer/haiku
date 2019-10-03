import { html } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
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
</style>
      <div class="stat-container" title$="${ this.getName(entity) }" on-click="${ (e) => this.handleClick(e) }">
        ${ this.renderSensorContent(entity) }
      </div>
    `;
  }

  renderSensorContent(entity) {
    if (!entity.state || entity.state === 'unavailable') {
      return html`
        <label>${ this.getTitle(entity) }</label>
        <span class="stat-value unavailable" title$="${ this.getLongValue(entity) }">
          Unavailable
        </span>
      `;
    }

    let sensorType = 'default';

    if (entity && entity.attributes && entity.attributes.haiku_type) {
      sensorType = entity.attributes.haiku_type;
    }

    switch (sensorType) {
      case 'smoke_binary':
        return this.renderSmokeSensorContent(entity);
      case 'co_binary':
        return this.renderCarbonMonoxideSensorContent(entity);
      case 'air_quality':
        return this.renderAirQualitySensorContent(entity);
      case 'motion_binary':
        return this.renderMotionSensorContent(entity);
      case 'temperature':
      case 'humidity':
      case 'default':
      default:
        return this.renderDefaultSensorContent(entity);
    }
  }

  renderSmokeSensorContent(entity) {
    return html`
      <div class="status-container">
        <div class$="status-value ${ this.getStatusClass(entity.state) }">
          <span>Smoke</span>
          <label>${ this.getShortValue(entity) }</label>
        </div>
      </div>
    `;
  }

  renderCarbonMonoxideSensorContent(entity) {
    return html`
      <div class="status-container">
        <div class$="status-value ${ this.getStatusClass(entity.state) }">
          <span class="multiline">Carbon<br />Monoxide</span>
          <label>${ this.getShortValue(entity) }</label>
        </div>
      </div>
    `;
  }

  renderAirQualitySensorContent(entity) {
    return html`
      <div class="status-container">
        <div class="status-value">
          <span>AQI</span>
          <label>${ this.getShortValue(entity) }</label>
        </div>
      </div>
    `;
  }

  renderMotionSensorContent(entity) {
    return html`
      <label>Motion Sensor</label>
      <span>${ entity }</span>
    `;
  }

  renderDefaultSensorContent(entity) {
    return html`
      <label>${ this.getTitle(entity) }</label>
      <span class="stat-value" title$="${ this.getLongValue(entity) }">
        ${ this.getShortValue(entity) }
        <span class="unit">
          ${ this.getUnit(entity) }
        </span>
      </span>
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
        case 'aqi':
          return 'AQI';
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

  getStatusClass(state) {
    const NORMAL_STATES = [
      'ok'
    ];

    const WARNING_STATES = [
      'warning'
    ];

    const CRITICAL_STATES = [
      'emergency'
    ];
    if (NORMAL_STATES.includes(state.toLowerCase())) {
      return 'status-normal';
    }

    if (WARNING_STATES.includes(state.toLowerCase())) {
      return 'status-warning';
    }

    if (CRITICAL_STATES.includes(state.toLowerCase())) {
      return 'status-critical';
    }

    return 'status-unknown';
  }
}

customElements.define('haiku-sensor-tile', HaikuSensorTile);
