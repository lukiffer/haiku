import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
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

li {
  display: flex; }

.menu-label {
  font-size: 15px;
  padding: 8px 0; }
  .menu-label > ha-icon {
    height: 20px;
    margin-top: -3px; }

mwc-switch {
  display: flex;
  flex: 1 0 0;
  margin-top: 4px;
  margin-right: 12px; }
</style>
      <li>
        <span class="menu-label" on-click="${(e) => this.handleClick(e)}">
          <ha-icon icon$="mdi:${entity.state === 'on' ? 'lightbulb-on' : 'lightbulb'}"></ha-icon>
          <span title$="${entity.attributes.friendly_name}">
            ${entity.attributes.haiku_label || entity.attributes.friendly_name}
          </span>
        </span>
        <mwc-switch checked="${entity.state === 'on'}"
          on-change="${(e) => this.toggleChanged(e)}"></mwc-switch>
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
