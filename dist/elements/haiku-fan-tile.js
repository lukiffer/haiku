import { html } from 'https://unpkg.com/@polymer/lit-element@0.5.2/lit-element.js?module';
import { HaikuTileBase } from './haiku-tile-base.js';

export class HaikuFanTile extends HaikuTileBase {

  static get properties() {
    return {
      hass: Object,
      entity: Object
    };
  }

  _render({ entity }) {
    return html`
      <style>.stat-container {
  background: rgba(33, 33, 33, 0.7);
  margin-top: 2px;
  margin-right: 2px;
  height: 120px;
  cursor: pointer; }
  .stat-container > label {
    color: white;
    text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
    display: block;
    padding: 1.25rem 0 0 16px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer; }
  .stat-container > .stat-value {
    color: white;
    text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
    font-size: 48px;
    font-weight: 400;
    display: block;
    margin-top: 1.5rem;
    margin-left: 16px;
    letter-spacing: -1px; }
    .stat-container > .stat-value.unavailable {
      font-size: 18px;
      letter-spacing: 0;
      color: #555;
      text-transform: uppercase; }
    .stat-container > .stat-value > .unit {
      color: white;
      text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
      font-size: 24px;
      font-weight: 400;
      margin-left: -8px; }

.status-value {
  border: solid 4px #ccc;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  padding: 3px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.85); }
  .status-value.status-normal {
    border-color: #bada55; }
  .status-value.status-warning {
    border-color: #ffc800; }
  .status-value.status-critical {
    border-color: #d20c0c; }
  .status-value > ha-icon {
    font-size: 24px;
    display: block;
    margin: 0 auto;
    margin-bottom: 8px;
    margin-top: 6px; }
  .status-value > span {
    color: white;
    text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
    font-size: 11px;
    display: block;
    margin: 0 auto;
    line-height: 14px;
    text-transform: uppercase;
    margin-bottom: 0;
    margin-top: 16px; }
    .status-value > span.multiline {
      margin-bottom: 0;
      margin-top: 7px; }
  .status-value > label {
    color: white;
    text-shadow: 0px 0px 9px rgba(0, 0, 0, 0.9);
    font-size: 32px;
    text-transform: uppercase;
    letter-spacing: -1px; }

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg); }
  100% {
    -webkit-transform: rotate(359deg); } }

ha-icon {
  color: white;
  width: 52px;
  height: 52px;
  margin-left: 16px;
  margin-top: 3px; }

.fan-icon.high ha-icon {
  animation: spin .75s infinite linear; }

.fan-icon.medium ha-icon {
  animation: spin .85s infinite linear; }

.fan-icon.low ha-icon {
  animation: spin 1s infinite linear; }
</style>
      <div class="stat-container" on-click="${ (e) => this.handleClick(e) }">
        <label title$="${ entity.attributes.friendly_name }">${ entity.attributes.haiku_label || 'Fan' }</label>
        <div class$="${ this.getCssClass(entity) }">
          <ha-icon icon$="mdi:${ entity.state === 'on' ? 'fan' : 'fan-off' }"></ha-icon>
        </div>
      </div>
    `;
  }

  getCssClass(entity) {
    let result = 'fan-icon';
    result += entity.state === 'on' ? ' on' : ' off';
    if (entity.attributes && entity.attributes.speed) {
      result += ` ${ entity.attributes.speed }`;
    }
    return result;
  }
}

customElements.define('haiku-fan-tile', HaikuFanTile);
