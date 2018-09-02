import { EventService } from './event-service.js';

export class CustomizationService {
  constructor(node) {
    this.node = node;
    this.eventService = new EventService();
    this.settingsDialogContent = null;
    this.handleDialogCancel = (event) => this._handleDialogCancel(event);
    this.handleCustomizationComplete = (event) => this._handleCustomizationComplete(event);
  }

  openSettingsDialog(hass, entity) {
    this.settingsDialog = this._findMoreInfoDialog(entity);
    this.settingsDialog.fire('more-info-page', { page: 'haiku_settings' });
    this.settingsDialogContent = document.createElement('haiku-settings-dialog');
    this.settingsDialogContent.entity = entity;
    this.settingsDialogContent.hass = hass;
    this.settingsDialogContent.addEventListener('haiku-customization-complete', this.handleCustomizationComplete);
    this.settingsDialog.shadowRoot.appendChild(this.settingsDialogContent);
    this.settingsDialog.addEventListener('iron-overlay-canceled', this.handleDialogCancel);
    this.settingsDialog.addEventListener('iron-overlay-closed', this.handleDialogCancel);
    this.settingsDialog.open();
  }

  _findMoreInfoDialog(entity) {
    const hassEl = document.getElementsByTagName('home-assistant')[0];
    let dialog = hassEl.shadowRoot.querySelector('ha-more-info-dialog');

    // TODO: ha-more-info-dialog is now created on demand. As a quick fix, we'll call the standard
    //       hass-more-info to bootstrap the dialog, then close it. Should figure out a better way.
    if (!dialog) {
      this.eventService.fire(this.node, 'hass-more-info', {
        entityId: entity.entity_id
      });
      dialog = hassEl.shadowRoot.querySelector('ha-more-info-dialog');
      dialog.close();
    }

    return dialog;
  }

  _handleDialogCancel(event) {
    if (event && event.path[0].nodeName !== 'HA-MORE-INFO-DIALOG') {
      return;
    }
    const el = this.settingsDialog.shadowRoot.querySelector('haiku-settings-dialog');
    this.settingsDialog.shadowRoot.removeChild(el);
    this.settingsDialog.fire('more-info-page', { page: null });
    this.settingsDialog.removeEventListener('iron-overlay-canceled', this.handleDialogCancel);
    this.settingsDialog.removeEventListener('iron-overlay-closed', this.handleDialogCancel);
  }

  _handleCustomizationComplete() {
    this._handleDialogCancel();
    this.settingsDialog.close();
  }
}
