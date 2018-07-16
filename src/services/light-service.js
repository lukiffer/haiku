import 'https://unpkg.com/lodash@4.17.10/lodash.js?module';

export class LightService {
  constructor(hass) {
    this.hass = hass;
  }

  toggle(entityId, callback) {
    const entity = this.hass.states[entityId];
    const service = this.getService(entity.state);
    this.setState(entityId, service, callback);
  }

  toggleRoom(entities, callback) {
    const state = this.getState(entities);
    const service = this.getService(state);
    _.each(entities, (entity) => {
      if (this.needsToggle(service, entity)) {
        this.toggle(entity.entity_id, callback);
      }
    });
  }

  setState(entityIds, service, callback) {
    this.callService('light', service, entityIds, callback);
    this.callService('switch', service, entityIds, callback);
  }

  callService(domain, service, entityIds, callback) {
    let filteredEntityIds = null;
    if (Array.isArray(entityIds)) {
      filteredEntityIds = _.filter(entityIds, (entityId) => {
        return entityId.indexOf(`${domain}.`) === 0
          || entityId.indexOf('group.') === 0;
      });
    }
    else {
      filteredEntityIds = entityIds;
    }

    const body = {
      'entity_id': filteredEntityIds
    };

    this.hass.callService(domain, service, body)
      .then(() => {
        setTimeout(() => {
          if (callback && typeof callback === 'function') {
            callback();
          }
        }, 2000);
      });
  }

  getState(collection) {
    return _.some(collection, (item) => {
      return item.state === 'on';
    }) ? 'on' : 'off';
  }

  getService(state) {
    return state === 'on' ? 'turn_off' : 'turn_on';
  }

  needsToggle(service, entity) {
    if (service === 'turn_on' && entity.state !== 'on') {
      return true;
    }

    if (service === 'turn_off' && entity.state !== 'off') {
      return true;
    }

    return false;
  }
}
