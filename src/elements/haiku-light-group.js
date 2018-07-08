import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import { repeat } from 'https://unpkg.com/lit-html@0.10.2/lib/repeat.js?module';
import './haiku-light-control.js';
import { LightService } from '../services/light-service.js';

export class HaikuLightGroup extends LitElement {
  constructor() {
    super();
    this.collapsed = true;
  }

  static get properties() {
    return {
      hass: Object,
      group: Object,
      collapsed: Boolean
    };
  }

  _render({ hass, group }) {
    return html`
      {{ css }}
      <li class$="group-container ${ this.collapsed ? 'collapsed' : 'expanded'}">
        <span class="flex-container">
          <a href="#" class="menu-toggle" on-click="${(e) => this.toggleMenuState$(e)}">
            <ha-icon icon$="mdi:${ this.collapsed ? 'chevron-up' : 'chevron-down' }"></ha-icon> 
          </a>
          <a href="#" class="menu-label" on-click="${(e) => this.toggleMenuState$(e)}">
            <ha-icon icon$="mdi:${ group.state === 'on' ? 'lightbulb-on' : 'lightbulb' }"></ha-icon>
            ${ group.name }
          </a>
          <paper-toggle-button checked="${ group.state === 'on' }"
            on-change="${(e) => this.toggleChanged(e)}"></paper-toggle-button>
        </span>
        <ul>
          ${repeat(group.entities, (e) => e.name, (e) => html`
            <haiku-light-control hass="${hass}" entity="${e}"></haiku-light-control>
          `)}
        </ul>
      </li>
    `;
  }

  toggleMenuState$() {
    this.collapsed = !this.collapsed;
  }

  toggleChanged() {
    const service = new LightService(this.hass);
    service.toggleGroup(this.group.entities);
  }
}

customElements.define('haiku-light-group', HaikuLightGroup);
