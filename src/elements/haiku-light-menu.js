import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
import 'https://unpkg.com/lodash@4.17.10/lodash.js?module';
import './haiku-light-group.js';
import { LightService } from '../services/light-service.js';

export class HaikuLightMenu extends LitElement {
  constructor() {
    super();
    this.collapsed = true;
    this.state = 'unavailable';
  }

  static get properties() {
    return {
      hass: Object,
      entities: {
        type: Array,
        observer: 'entitiesChanged'
      },
      collapsed: Boolean
    };
  }

  _render({ hass, entities }) {
    this.entitiesChanged(entities);
    return html`
      {{ css }}
      <ul class$="haiku-light-menu ${ this.collapsed ? 'collapsed' : 'expanded' }">
        <li class="haiku-light-menu-placeholder">
          <a href="#" class="menu-toggle" on-click="${(e) => this.toggleMenuState(e)}">
            <ha-icon icon$="mdi:${ this.collapsed ? 'chevron-up' : 'chevron-down' }"></ha-icon> 
          </a>
          <a href="#" class="menu-label" on-click="${(e) => this.toggleMenuState(e)}">
            <ha-icon icon$="mdi:${ this.state === 'on' ? 'lightbulb-on' : 'lightbulb' }"></ha-icon>
            Lighting
          </a>
          <paper-toggle-button checked="${ this.state === 'on' }"
            on-change="${(e) => this.toggleChanged(e)}"></paper-toggle-button>
        </li>
        ${ _.map(entities, (entity) => html`<haiku-light-group hass="${hass}" entity="${entity}"></haiku-light-group>`)}
      </ul>
    `;
  }

  entitiesChanged(entities) {
    this.state = _.some(entities, (entity) => {
      return entity.state === 'on';
    }) ? 'on' : 'off';
  }

  toggleMenuState() {
    this.collapsed = !this.collapsed;
  }

  toggleChanged() {
    const service = new LightService(this.hass);
    service.toggleRoom(this.entities, this.state);
  }
}

customElements.define('haiku-light-menu', HaikuLightMenu);
