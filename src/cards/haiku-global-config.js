import { StorageService } from '../services/storage-service.js';
import { CustomizationService } from '../services/customization-service.js';
import '../elements/haiku-global-config-dialog.js';
import 'https://unpkg.com/lodash@4.17.10/lodash.js?module';

/**
 * Haiku global config UI
 */
export class HaikuGlobalConfig extends HTMLElement {

  constructor() {
    super();
    this.customizationService = new CustomizationService(this);
  }

  set hass(hass) {
    this.ha = hass;

    if (!this.initialized) {
      this.setAttribute('style', 'margin:0;');
      this.initStylesheet();
      this.initTheme();
      this.initConfigButton();
      this.initScrollListener();
      this.initialized = true;
    }
  }

  initStylesheet() {
    if (!document.getElementById('haiku_global_css')) {
      const globalCss = document.createElement('link');
      globalCss.setAttribute('id', 'haiku_global_css');
      globalCss.setAttribute('href', '/local/haiku/haiku.css');
      globalCss.setAttribute('rel', 'stylesheet');
      document.head.appendChild(globalCss);
    }
  }

  initTheme() {
    const storageService = new StorageService();
    let theme = storageService.getItem('theme');
    if (!theme) {
      theme = 'haiku-dark';
      storageService.setItem('theme', 'haiku-dark');
    }
    const existingCssClasses = document.body.getAttribute('class');
    if (!existingCssClasses) {
      document.body.setAttribute('class', theme);
    }
    else {
      let cssClasses = existingCssClasses.split(' ');
      cssClasses = _.filter(cssClasses, (cssClass) => {
        return cssClass.indexOf('haiku-') === -1;
      });
      document.body.setAttribute('class', `${cssClasses.join(' ')} ${theme}`);
    }
  }

  initConfigButton() {
    if (!document.getElementById('haiku_config_button')) {
      const configButton = document.createElement('button');
      configButton.setAttribute('id', 'haiku_config_button');
      configButton.setAttribute('class', 'haiku-config-button');
      const icon = document.createElement('ha-icon');
      icon.setAttribute('icon', 'mdi:settings');
      configButton.appendChild(icon);
      configButton.onclick = () => {
        this._openGlobalConfigDialog();
      };
      document.body.appendChild(configButton);
    }
  }

  initScrollListener() {
    window.addEventListener('scroll', () => {
      let position = 'absolute';
      let top = 88;

      if (window.scrollY >= 64) {
        position = 'fixed';
        top = 21;
      }

      const button = document.getElementById('haiku_config_button');
      const style = `position:${position};top:${top}px;`;

      if (button && button.getAttribute('style') !== style) {
        button.setAttribute('style', style);
      }
    });
  }

  _openGlobalConfigDialog() {
    const $this = this;
    this.customizationService.openGlobalConfigDialog(() => {
      $this.initTheme();
    });
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 0;
  }
}

customElements.define('haiku-global-config', HaikuGlobalConfig);
