import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
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
      <style>.haiku-card-container {
  position: relative;
  overflow: hidden;
  -webkit-overflow-scrolling: touch; }

.haiku-room-card {
  height: 30rem;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 1rem 1.5rem;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.45) 100%), radial-gradient(at top center, rgba(255, 255, 255, 0.4) 0%, rgba(0, 0, 0, 0.4) 120%) #989898;
  background-blend-mode: multiply,multiply;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center center; }

.haiku-room-card-title {
  color: white;
  text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-family: "Roboto", "Noto", sans-serif;
  font-weight: 400;
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.7);
  margin-bottom: 0; }

.tiles {
  display: block;
  margin: 0 -3px; }
  .tiles > * {
    display: block;
    float: left;
    margin: 6px 3px 0; }
    @media only screen and (max-width: 599px) {
      .tiles > * {
        width: 32%; }
        .tiles > *:nth-child(3n+3) {
          margin-right: -1px; } }
    @media only screen and (min-width: 600px) and (max-width: 849px) {
      .tiles > * {
        width: 48%; }
        .tiles > *:nth-child(odd) {
          margin-right: -1px; } }
    @media only screen and (min-width: 850px) and (max-width: 899px) {
      .tiles > * {
        width: 32%; }
        .tiles > *:nth-child(3n+3) {
          margin-right: -1px; } }
    @media only screen and (min-width: 900px) and (max-width: 1599px) {
      .tiles > * {
        width: 48%; }
        .tiles > *:nth-child(odd) {
          margin-right: -1px; } }
    @media only screen and (min-width: 1600px) {
      .tiles > * {
        width: 32%; }
        .tiles > *:nth-child(3n+3) {
          margin-right: -1px; } }
</style>
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
