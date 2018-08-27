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
      <div class="stat-container" title$="${ this.getName(entity) }" on-click="${ (e) => this.handleClick(e) }">
        ${ this.renderSensorContent(entity) }
      </div>
    `;
  }

  renderSensorContent(entity) {
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
          <span class="multiline">Air<br />Quality</span>
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

  getName(entity) {
    if (entity.attributes && entity.attributes.friendly_name) {
      return entity.attributes.friendly_name;
    }

    return entity.entity_id;
  }
}

customElements.define('haiku-sensor-tile', HaikuSensorTile);
