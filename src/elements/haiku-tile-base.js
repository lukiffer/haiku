import { LitElement } from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';
import { EventService } from '../services/event-service.js';

export class HaikuTileBase extends LitElement {
  handleClick(event) {
    event.stopPropagation();
    if (event.altKey) {
      console.log('TODO: show input dialog...');
    }
    else {
      const eventService = new EventService();
      eventService.fire(event.target, 'hass-more-info', {
        entityId: this.entity.entity_id
      });
    }
  }
}
