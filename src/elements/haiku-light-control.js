import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import { LightService } from '../services/light-service.js';
import { EventService } from '../services/event-service.js';
import { CustomizationService } from '../services/customization-service.js';
import './haiku-settings-dialog.js';

export class HaikuLightControl extends LitElement {
  constructor() {
    super();
    this.collapsed = true;
    this.customizationService = new CustomizationService(this);
  }

  static get properties() {
    return {
      hass: Object,
      entity: Object
    };
  }

  _render({ entity }) {
    return html`
      <style include="iron-flex"></style>
      {{ css }}
      <li>
        <span class="menu-label" on-click="${(e) => this.handleClick(e)}">
          <ha-icon icon$="mdi:${entity.state === 'on' ? 'lightbulb-on' : 'lightbulb'}"></ha-icon>
          <span title$="${entity.attributes.friendly_name}">
            ${entity.attributes.haiku_label || entity.attributes.friendly_name}
          </span>
        </span>
        <paper-toggle-button checked="${entity.state === 'on'}"
          on-change="${(e) => this.toggleChanged(e)}"></paper-toggle-button>
      </li>
    `;
  }

  toggleChanged() {
    const service = new LightService(this.hass);
    service.toggle(this.entity.entity_id);
  }

  handleClick(event) {
    event.stopPropagation();
    if (event.altKey) {
      this.customizationService.openSettingsDialog(this.hass, this.entity);
    }
    else {
      const eventService = new EventService();
      eventService.fire(event.target, 'hass-more-info', {
        entityId: this.entity.entity_id
      });
    }
  }
}

customElements.define('haiku-light-control', HaikuLightControl);
