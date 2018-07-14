import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import 'https://unpkg.com/lodash@4.17.10/lodash.js?module';
import '../elements/haiku-light-menu.js';
import '../elements/haiku-temperature-tile.js';
import '../elements/haiku-humidity-tile.js';
import '../elements/haiku-fan-tile.js';

/**
 * A card that summarizes a rooms entities.
 */
export class HaikuRoomCard extends LitElement {

  static get properties() {
    return {
      hass: Object,
      config: Object
    };
  }

  _render({ hass, config }) {
    return html`
      {{ css }}
      <div class="haiku-card-container">
        <ha-card class$="haiku-room-card ${ config.class }">
          <haiku-light-menu hass="${ hass }" entities="${ this.getEntitiesByDomain('light') }"></haiku-light-menu>
          <div class="tiles">
            ${ this.renderSensors() }
            ${ this.renderFans() }
          </div>
        </ha-card>
        <h1 class="haiku-room-card-title">${ config.name }</h1>
      </div>
    `;
  }

  getEntitiesByDomain(domain) {
    const states = [];
    _.each(this.config.entities, (key) => {
      const d = key.split('.')[0];
      if (d === domain) {
        states.push(this.hass.states[key]);
      }
      else if (d === 'group') {
        const state = this.hass.states[key];
        const hasDomainEntities = _.some(state.attributes.entity_id, (entityId) => {
          return entityId.split('.')[0] === domain;
        });
        if (hasDomainEntities) {
          states.push(state);
        }
      }
    });
    return states;
  }

  renderFans() {
    const fans = this.getEntitiesByDomain('fan');
    return html`
      ${_.map(fans, (fan) => html`<haiku-fan-tile hass="${this.hass}" entity="${fan}"></haiku-fan-tile>`)}
    `;
  }

  renderSensors() {
    const sensors = this.getEntitiesByDomain('sensor');
    return html`
      ${_.map(sensors, (sensor) => this.renderSensor(sensor))}
    `;
  }

  renderSensor(sensor) {
    switch (sensor.attributes.unit_of_measurement) {
      case '°F':
      case '°C':
        return this.renderTemperatureSensor(sensor);
      case '%':
        return this.renderHumiditySensor(sensor);
      case 'ppm':
        return this.renderAirQualitySensor(sensor);
      default:
        console.error(`Unknown sensor unit of measurement for sensor "${ sensor.entity_id }"`);
        return '';
    }
  }

  renderTemperatureSensor(sensor) {
    return html`<haiku-temperature-tile hass="${ this.hass }" entity="${ sensor }"></haiku-temperature-tile>`;
  }

  renderHumiditySensor(sensor) {
    return html`<haiku-humidity-tile hass="${ this.hass }" entity="${ sensor }"></haiku-humidity-tile>`;
  }

  renderAirQualitySensor(sensor) {
    return html`<haiku-humidity-tile hass="${ this.hass }" entity="${ sensor }"></haiku-humidity-tile>`;
  }

  getCardSize() {
    return 24;
  }
}

customElements.define('haiku-room-card', HaikuRoomCard);
