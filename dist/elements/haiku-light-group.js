import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
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

.flex-container {
  display: flex; }

.group-container {
  width: 100%;
  border-top: solid 1px rgba(0, 0, 0, 0.2); }
  .group-container > ul {
    transition: max-height 0.5s;
    overflow: hidden;
    padding: 0 0 0 10.5%;
    margin: 0; }
  .group-container.collapsed > ul {
    max-height: 0; }
  .group-container.expanded > ul {
    max-height: 40rem; }

mwc-switch {
  margin-right: 12px;
  margin-top: 15px; }

.menu-toggle.entity {
  visibility: hidden; }
</style>
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
          <mwc-switch checked="${ entity.state === 'on' }"
            on-change="${(e) => this.toggleChanged(e)}"></mwc-switch>
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
