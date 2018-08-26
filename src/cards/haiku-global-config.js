import { StorageService } from '../services/storage-service.js';

/**
 * Haiku global config UI
 */
export class HaikuGlobalConfig extends HTMLElement {

  set hass(hass) {
    this.ha = hass;

    if (!this.initialized) {
      this.setAttribute('style', 'margin:0;');
      this.initStylesheet();
      this.initTheme();
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
    else if (existingCssClasses.indexOf(theme) === -1) {
      document.body.setAttribute('class', `${existingCssClasses} ${theme}`);
    }
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 0;
  }
}

customElements.define('haiku-global-config', HaikuGlobalConfig);
