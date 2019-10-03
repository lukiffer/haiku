import { html, LitElement } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
import { StorageService } from '../services/storage-service.js';
import { EventService } from '../services/event-service.js';
import 'https://unpkg.com/lodash@4.17.10/lodash.js?module';

export class HaikuGlobalConfigDialog extends LitElement {

  constructor() {
    super();
  }

  static get properties() {
    return {
      hass: Object
    };
  }

  _render() {
    return html`
      <style>.form {
  padding: 0 2rem; }
  .form > paper-button {
    float: right;
    margin: 1rem 0; }
  .form > paper-dropdown-menu {
    width: 100%; }
</style>
      <app-toolbar>
        <paper-icon-button icon="hass:close" dialog-dismiss=""></paper-icon-button>
        <div main-title="">Haiku Global Settings</div>
      </app-toolbar>

      <div class="form">
        <paper-dropdown-menu id="theme" label="Theme">
          <paper-listbox slot="dropdown-content" attr-for-selected="value" selected$="${ this._getCurrentTheme() }">
            <paper-item value="haiku-none">None</paper-item>
            <paper-item value="haiku-light">Haiku Light</paper-item>
            <paper-item value="haiku-dark">Haiku Dark</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-button on-click="${ (e) => this.handleClick(e) }">Save</paper-button>
      </div>
    `;
  }

  _getCurrentTheme() {
    const storageService = new StorageService();
    let theme = storageService.getItem('theme');
    if (!theme) {
      theme = 'haiku-none';
      storageService.setItem('theme', 'haiku-none');
    }
    return theme;
  }

  handleClick() {
    const storageService = new StorageService();
    const eventService = new EventService();
    const selectedItem = this.shadowRoot.querySelector('#theme').selectedItem;
    let theme = null;
    if (selectedItem) {
      theme = selectedItem.getAttribute('value');
    }
    storageService.setItem('theme', theme);
    eventService.fire(this, 'haiku-customization-complete');
  }
}

customElements.define('haiku-global-config-dialog', HaikuGlobalConfigDialog);
