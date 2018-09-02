import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import 'https://unpkg.com/lodash@4.17.10/lodash.js?module';
import '../elements/haiku-light-menu.js';
import '../elements/haiku-sensor-tile.js';
import '../elements/haiku-fan-tile.js';
import '../elements/haiku-thermostat-tile.js';

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

  setConfig(config) {
    // TODO: config validation
    this.config = config;
  }

  _render({ hass, config }) {
    return html`
      <style include="paper-material-styles"></style>
      {{ css }}
      <div class="haiku-card-container">
        <ha-card class$="haiku-room-card ${ config.class || '' }" style$="${this.getCustomBackgroundStyle()}">
          <haiku-light-menu hass="${ hass }" entities="${ this.getEntitiesByDomain('light') }"></haiku-light-menu>
          <div class="tiles">
            ${ this.renderThermostats() }
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
      const state = this.hass.states[key];
      if (!state) {
        return;
      }

      const d = key.split('.')[0];
      const t = state.attributes.haiku_type;
      if (d === domain || t === domain) {
        states.push(state);
      }
      else if (d === 'group') {
        const hasDomainEntities = _.some(state.attributes.entity_id, (entityId) => {
          const entityState = this.hass.states[entityId];
          const entityType = entityState.attributes.haiku_type;
          const entityDomain = entityId.split('.')[0];
          return entityDomain === domain || entityDomain === entityType;
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

  renderThermostats() {
    const thermostats = this.getEntitiesByDomain('climate');
    return html`
      ${_.map(thermostats, (thermostat) => this.renderThermostat(thermostat))}
    `;
  }

  renderThermostat(thermostat) {
    return html`<haiku-thermostat-tile hass="${ this.hass }" entity="${ thermostat }"></haiku-thermostat-tile>`;
  }

  renderSensors() {
    const sensors = this.getEntitiesByDomain('sensor');
    return html`
      ${_.map(sensors, (sensor) => this.renderSensor(sensor))}
    `;
  }

  renderSensor(sensor) {
    return html`<haiku-sensor-tile hass="${ this.hass }" entity="${ sensor }"></haiku-sensor-tile>`;
  }

  getCustomBackgroundStyle() {
    if (this.config.background_image) {
      return `background-image: ${this.config.background_image};`;
    }
    else {
      return '';
    }
  }

  getCardSize() {
    return 24;
  }
}

customElements.define('haiku-room-card', HaikuRoomCard);
