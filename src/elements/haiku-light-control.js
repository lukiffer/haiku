import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import { LightService } from '../services/light-service.js';

export class HaikuLightControl extends LitElement {
  constructor() {
    super();
    this.collapsed = true;
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
        <span class="menu-label">
          <ha-icon icon$="mdi:${ entity.state === 'on' ? 'lightbulb-on' : 'lightbulb' }"></ha-icon>
          ${ entity.name }
        </span>
        <paper-toggle-button checked="${ entity.state === 'on' }"
          on-change="${(e) => this.toggleChanged(e)}"></paper-toggle-button>
      </li>
    `;
  }

  toggleChanged() {
    const service = new LightService(this.hass);
    service.toggle(this.entity.key);
  }
}

customElements.define('haiku-light-control', HaikuLightControl);
