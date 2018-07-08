import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import { repeat } from 'https://unpkg.com/lit-html@0.10.2/lib/repeat.js?module';
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
      groups: {
        type: Array,
        observer: 'groupsChanged'
      },
      collapsed: Boolean,
      state: String
    };
  }

  _render({ hass, groups }) {
    this.groupsChanged(groups);
    return html`
      {{ css }}
      <ul class$="haiku-light-menu ${ this.collapsed ? 'collapsed' : 'expanded' }">
        <li class="haiku-light-menu-placeholder">
          <a href="#" class="menu-toggle" on-click="${(e) => this.toggleMenuState$(e)}">
            <ha-icon icon$="mdi:${ this.collapsed ? 'chevron-up' : 'chevron-down' }"></ha-icon> 
          </a>
          <a href="#" class="menu-label" on-click="${(e) => this.toggleMenuState$(e)}">
            <ha-icon icon$="mdi:${ this.state === 'on' ? 'lightbulb-on' : 'lightbulb' }"></ha-icon>
            Lighting
          </a>
          <paper-toggle-button checked="${ this.state === 'on' }"
            on-change="${(e) => this.toggleChanged(e)}"></paper-toggle-button>
        </li>
      ${repeat(groups, (g) => g.name, (g) => html`
        <haiku-light-group hass="${hass}" group="${g}"></haiku-light-group>
      `)}
      </ul>
    `;
  }

  groupsChanged(groups) {
    this.state = _.some(groups, (group) => {
      return group.state === 'on';
    }) ? 'on' : 'off';
  }

  toggleMenuState$() {
    this.collapsed = !this.collapsed;
  }

  toggleChanged() {
    const service = new LightService(this.hass);
    service.toggleRoom(this.groups, this.state);
  }
}

customElements.define('haiku-light-menu', HaikuLightMenu);
