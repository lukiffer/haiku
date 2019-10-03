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
      <style>.menu-label {
  color: white;
  text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
  display: flex;
  flex: 8 0 0;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  padding: 1rem 1.5rem 1rem 0.5rem; }
  .menu-label > ha-icon {
    margin-right: 0.5rem;
    margin-top: -5px; }

.menu-toggle {
  color: rgba(255, 255, 255, 0.5);
  flex: 1 0 0;
  text-align: right; }
  .menu-toggle > ha-icon {
    margin-top: 12px;
    margin-left: 13px; }

ul, li {
  list-style: none; }

.haiku-light-menu {
  display: block;
  background: rgba(33, 33, 33, 0.7);
  margin: 0;
  padding: 0; }
  .haiku-light-menu > li {
    margin: 0;
    padding: 0; }
  .haiku-light-menu > haiku-light-group {
    display: flex;
    transition: max-height 0.5s;
    overflow: hidden; }
  .haiku-light-menu.collapsed > haiku-light-group {
    max-height: 0; }
  .haiku-light-menu.expanded > haiku-light-group {
    max-height: 40rem; }
  .haiku-light-menu > li.haiku-light-menu-placeholder {
    display: flex; }

paper-toggle-button {
  margin-right: 12px; }
</style>
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
