import { LitElement } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import { EventService } from '../services/event-service.js';
import './haiku-tile-settings-dialog.js';

export class HaikuTileBase extends LitElement {
  constructor() {
    super();
    this.settingsDialog = this._findMoreInfoDialog();
    this.settingsDialogContent = null;
    this.handleDialogCancel = (event) => this._handleDialogCancel(event);
    this.handleCustomizationComplete = (event) => this._handleCustomizationComplete(event);
  }

  handleClick(event) {
    event.stopPropagation();
    if (event.altKey) {
      this._openSettingsDialog();
    }
    else {
      const eventService = new EventService();
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

  _openSettingsDialog() {
    this.settingsDialog.fire('more-info-page', { page: 'haiku_settings' });
    this.settingsDialogContent = document.createElement('haiku-tile-settings-dialog');
    this.settingsDialogContent.entity = this.entity;
    this.settingsDialogContent.hass = this.hass;
    this.settingsDialogContent.addEventListener('haiku-customization-complete', this.handleCustomizationComplete);
    this.settingsDialog.shadowRoot.appendChild(this.settingsDialogContent);
    this.settingsDialog.addEventListener('iron-overlay-canceled', this.handleDialogCancel);
    this.settingsDialog.open();
  }

  _handleDialogCancel() {
    const el = this.settingsDialog.shadowRoot.querySelector('haiku-tile-settings-dialog');
    this.settingsDialog.shadowRoot.removeChild(el);
    this.settingsDialog.fire('more-info-page', { page: null });
    this.settingsDialog.removeEventListener('iron-overlay-canceled', this.handleDialogCancel);
  }

  _handleCustomizationComplete() {
    this._handleDialogCancel();
    this.settingsDialog.close();
  }
}
