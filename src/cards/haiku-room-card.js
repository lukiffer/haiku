import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import 'https://unpkg.com/lodash@4.17.10/lodash.js?module';
import '../elements/haiku-light-menu.js';

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

    return html`
      {{ css }}
      <div class="haiku-card-container">
        <ha-card class="haiku-room-card">
          <haiku-light-menu hass="${ hass }" groups="${ lightingGroups }"></haiku-light-menu>
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

  getCardSize() {
    return 24;
  }
}

customElements.define('haiku-room-card', HaikuRoomCard);
