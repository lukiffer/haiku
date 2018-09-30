import { LitElement } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import { EventService } from '../services/event-service.js';
import { CustomizationService } from '../services/customization-service.js';
import './haiku-settings-dialog.js';

export class HaikuTileBase extends LitElement {
  constructor() {
    super();
    this.customizationService = new CustomizationService(this);
  }

  handleClick(event) {
    event.stopPropagation();
    if (event.altKey) {
      this.customizationService.openSettingsDialog(this.hass, this.entity);
    }
    else {
      const eventService = new EventService();
      eventService.fire(event.target, 'hass-more-info', {
        entityId: this.entity.entity_id
      });
    }
  }

  getName(entity) {
    if (entity.attributes && entity.attributes.friendly_name) {
      return entity.attributes.friendly_name;
    }

    return entity.entity_id;
  }
}
