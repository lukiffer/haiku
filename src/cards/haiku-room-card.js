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

  // renderLights() {
  //   const lights = this.getEntitiesByDomain('light');
  //   console.log('lights', lights);
  //   const sensors = this.getEntitiesByDomain('sensor');
  //   console.log('sensors', sensors);
  //   console.log(this.config.entities);
  //   console.log(this.hass);
  // }

  // renderTemperature(sensors) {

  // }

  // renderHumidity() {

  // }

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

  // getLightingGroups(hass, groups) {
  //   return _.map(_.filter(groups, (group) => {
  //     return group.type === 'lighting';
  //   }), (group) => {
  //     const entities = this.getLightingEntities(hass, group.entities);
  //     return {
  //       name: group.name,
  //       entities,
  //       state: _.some(entities, (entity) => {
  //         return entity.state === 'on';
  //       }) ? 'on' : 'off'
  //     };
  //   });
  // }

  // getLightingEntities(hass, entities) {
  //   return _.map(entities, (entity) => {
  //     const state = hass.states[entity];
  //     return {
  //       key: entity,
  //       name: state && state.attributes ? state.attributes.friendly_name : entity,
  //       state: state ? state.state : 'unavailable'
  //     };
  //   });
  // }

  // getSingleEntityByType(hass, groups, type) {
  //   const group = _.filter(groups, (g) => {
  //     return g.type === type;
  //   })[0];

  //   if (!group) {
  //     return undefined;
  //   }

  //   const result = hass.states[group.entity];
  //   result.attributes.name = group.name;
  //   return result;
  // }

  // renderTile(type) {
  //   const TILE_GENERATOR_MAP = {
  //     'temperature': (entity) => {
  //       return html`<haiku-temperature-tile hass="${ this.hass }" entity="${ entity }"></haiku-temperature-tile>`;
  //     },
  //     'humidity': (entity) => {
  //       return html`<haiku-humidity-tile hass="${ this.hass }" entity="${ entity }"></haiku-humidity-tile>`;
  //     }
  //   };

  //   const entity = this.getSingleEntityByType(this.hass, this.config.groups, type);
  //   return entity ? TILE_GENERATOR_MAP[type](entity) : '';
  // }

  getCardSize() {
    return 24;
  }
}

customElements.define('haiku-room-card', HaikuRoomCard);
