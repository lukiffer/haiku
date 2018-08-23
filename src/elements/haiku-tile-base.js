import { LitElement } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import { EventService } from '../services/event-service.js';
import '../elements/haiku-sensor-settings-dialog.js';

export class HaikuTileBase extends LitElement {
  constructor() {
    super();
    this.dialog = this._findMoreInfoDialog();
  }

  handleClick(event) {
    event.stopPropagation();
    const eventService = new EventService();
    if (event.altKey) {
      this.dialog = this._findMoreInfoDialog();
      this.dialog.fire('more-info-page', { page: 'haiku_settings' });
      const sensorSettingsDialog = document.createElement('haiku-sensor-settings-dialog');
      sensorSettingsDialog.entity = this.entity;
      this.dialog.shadowRoot.appendChild(sensorSettingsDialog);
      this.dialog.open();
      // debugger; // eslint-disable-line no-debugger
      this.dialog.addEventListener('iron-overlay-canceled', () => {
        this._handleDialogCancel();
        this.dialog.removeEventListener(this._handleDialogCancel);
        this.dialog.removeEventListener('iron-overlay-canceled');
      });
    }
    else {
      eventService.fire(event.target, 'hass-more-info', {
        entityId: this.entity.entity_id
      });
    }
  }

  _findMoreInfoDialog() {
    const hassEl = document.getElementsByTagName('home-assistant')[0];
    const hassMainEl = hassEl.shadowRoot.querySelector('home-assistant-main');
    return hassMainEl.shadowRoot.querySelector('ha-more-info-dialog');
  }

  _handleDialogCancel() {
    const el = this.dialog.shadowRoot.querySelector('haiku-sensor-settings-dialog');
    this.dialog.fire('more-info-page', { page: null });
    this.dialog.shadowRoot.removeChild(el);
  }
}
