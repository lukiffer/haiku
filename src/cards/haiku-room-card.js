import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import 'https://unpkg.com/lodash@4.17.10/lodash.js?module';
import '../elements/haiku-light-menu.js';
import '../elements/haiku-temperature-tile.js';
import '../elements/haiku-humidity-tile.js';

/**
 * A card that summarizes a rooms entities.
 */
class HaikuRoomCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object
    };
  }

  _render({ hass, config }) {
    const lightingGroups = this.getLightingGroups(hass, config.groups);
    const temperatureEntity = this.getSingleEntityByType(hass, config.groups, 'temperature');
    const humidityEntity = this.getSingleEntityByType(hass, config.groups, 'humidity');

    return html`
      {{ css }}
      <div class="haiku-card-container">
        <ha-card class$="haiku-room-card ${ config.class }">
          <haiku-light-menu hass="${ hass }" groups="${ lightingGroups }"></haiku-light-menu>
          <div class="tiles">
            <haiku-temperature-tile hass="${ hass }" entity="${ temperatureEntity }"></haiku-temperature-tile>
            <haiku-humidity-tile hass="${ hass }" entity="${ humidityEntity }"></haiku-humidity-tile>
          </div>
        </ha-card>
        <h1 class="haiku-room-card-title">${ config.name }</h1>
      </div>
    `;
  }

  getLightingGroups(hass, groups) {
    return _.map(_.filter(groups, (group) => {
      return group.type === 'lighting';
    }), (group) => {
      const entities = this.getLightingEntities(hass, group.entities);
      return {
        name: group.name,
        entities,
        state: _.some(entities, (entity) => {
          return entity.state === 'on';
        }) ? 'on' : 'off'
      };
    });
  }

  getLightingEntities(hass, entities) {
    return _.map(entities, (entity) => {
      const state = hass.states[entity];
      return {
        key: entity,
        name: state && state.attributes ? state.attributes.friendly_name : entity,
        state: state ? state.state : 'unavailable'
      };
    });
  }

  getSingleEntityByType(hass, groups, type) {
    const group = _.filter(groups, (g) => {
      return g.type === type;
    })[0];

    return hass.states[group.entity];
  }

  getCardSize() {
    return 24;
  }
}

customElements.define('haiku-room-card', HaikuRoomCard);
