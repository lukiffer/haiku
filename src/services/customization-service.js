export class CustomizationService {
  constructor() {
    this.settingsDialog = this._findMoreInfoDialog();
    this.settingsDialogContent = null;
    this.handleDialogCancel = (event) => this._handleDialogCancel(event);
    this.handleCustomizationComplete = (event) => this._handleCustomizationComplete(event);
  }

  openSettingsDialog(hass, entity) {
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

  _findMoreInfoDialog() {
    const hassEl = document.getElementsByTagName('home-assistant')[0];
    const hassMainEl = hassEl.shadowRoot.querySelector('home-assistant-main');
    return hassMainEl.shadowRoot.querySelector('ha-more-info-dialog');
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
