import { html, LitElement } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';

export class HaikuSensorSettingsDialog extends LitElement {

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
        <div main-title="">Sensor Settings</div>
        <paper-button on-click="_save">Save</paper-button>
      </app-toolbar>

      <div class="form">
        <paper-input value$="${ entity.attributes.haiku_label }" label="Label"></paper-input>
        <paper-input value$="${ entity.attributes.haiku_type }" label="Sensor Type"></paper-input>
      </div>
    `;
  }
}

customElements.define('haiku-sensor-settings-dialog', HaikuSensorSettingsDialog);
