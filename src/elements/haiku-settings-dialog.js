import { html, LitElement } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
import { EventService } from '../services/event-service.js';
import 'https://unpkg.com/lodash@4.17.10/lodash.js?module';

export class HaikuSettingsDialog extends LitElement {

  constructor() {
    super();
  }

  static get properties() {
    return {
      hass: Object,
      entity: Object
    };
  }

  _render({ entity }) {
    return html`
      {{ css }}
      <app-toolbar>
        <paper-icon-button icon="hass:close" dialog-dismiss=""></paper-icon-button>
        <div main-title="">Haiku Customization</div>
      </app-toolbar>

      <div class="form">
        <paper-input id="label" value$="${ entity.attributes.haiku_label }" label="Label"></paper-input>
        <paper-dropdown-menu id="type" label="Entity Type">
          <paper-listbox slot="dropdown-content" attr-for-selected="value" selected$="${ entity.attributes.haiku_type }">
            <paper-item value="light">Light</paper-item>
            <paper-item value="temperature">Temperature</paper-item>
            <paper-item value="humidity">Humidity</paper-item>
            <paper-item value="smoke_binary">Smoke Status (Binary)</paper-item>
            <paper-item value="co_binary">Carbon Monoxide Status (Binary)</paper-item>
            <paper-item value="air_quality">Air Quality</paper-item>
            <paper-item value="motion_binary">Motion Detected (Binary)</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-button on-click="${ (e) => this.handleClick(e) }">Save</paper-button>
      </div>
    `;
  }

  handleClick() {
    const label = this.shadowRoot.querySelector('#label').value;

    const selectedItem = this.shadowRoot.querySelector('#type').selectedItem;
    let type = null;
    if (selectedItem) {
      type = selectedItem.getAttribute('value');
    }

    const url = `config/customize/config/${ this.entity.entity_id }`;

    const $this = this;
    this.hass.callApi('GET', url)
      .then((response) => {
        const data = _.merge(response.local, {
          'haiku_label': label,
          'haiku_type': type || undefined
        });
        this.hass.callApi('POST', url, data).then(() => {
          const eventService = new EventService();
          eventService.fire($this, 'haiku-customization-complete');
        });
      });
  }
}

customElements.define('haiku-settings-dialog', HaikuSettingsDialog);
