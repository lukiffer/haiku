import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import { LightService } from '../services/light-service.js';
import { CustomizationService } from '../services/customization-service.js';
import './haiku-light-control.js';
import './haiku-settings-dialog.js';

export class HaikuLightGroup extends LitElement {
  constructor() {
    super();
    this.collapsed = true;
    this.customizationService = new CustomizationService(this);
  }

  static get properties() {
    return {
      hass: Object,
      entity: Object,
      collapsed: Boolean
    };
  }

  _render({ entity }) {
    return html`
      {{ css }}
      <li class$="group-container ${ this.collapsed ? 'collapsed' : 'expanded'}">
        <span class="flex-container">
          <a href="#" class$="menu-toggle ${this.isGroup() ? 'group' : 'entity'}" on-click="${(e) => this.toggleMenuState(e)}">
            <ha-icon icon$="mdi:${ this.collapsed ? 'chevron-up' : 'chevron-down' }"></ha-icon> 
          </a>
          <a href="javascript:void(0);" class="menu-label" on-click="${(e) => this.handleClick(e)}">
            <ha-icon icon$="mdi:${ entity.state === 'on' ? 'lightbulb-on' : 'lightbulb' }"></ha-icon>
            <span title$="${ entity.attributes.friendly_name }">
              ${ entity.attributes.haiku_label || entity.attributes.friendly_name }
            </span>
          </a>
          <paper-toggle-button checked="${ entity.state === 'on' }"
            on-change="${(e) => this.toggleChanged(e)}"></paper-toggle-button>
        </span>
        <ul>
          ${_.map(entity.attributes.entity_id, (entityId) => this.renderLightControl(entityId))}
        </ul>
      </li>
    `;
  }

  handleClick(event) {
    event.stopPropagation();
    if (event.altKey) {
      this.customizationService.openSettingsDialog(this.hass, this.entity);
    }
    else {
      this.toggleMenuState();
    }
  }

  toggleMenuState() {
    this.collapsed = !this.collapsed;
  }

  toggleChanged() {
    const service = new LightService(this.hass);
    service.toggle(this.entity.entity_id);
  }

  isGroup() {
    return this.entity.entity_id.indexOf('group.') === 0;
  }

  renderLightControl(key) {
    return html`<haiku-light-control hass="${this.hass}" entity="${this.hass.states[key]}"></haiku-light-control>`;
  }
}

customElements.define('haiku-light-group', HaikuLightGroup);
