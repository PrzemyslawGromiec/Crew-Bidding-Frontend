import {flights} from "./Main";
import {Controller} from "./Controller";

export class FlightBarFlight {

  constructor(flightData) {
    this.flightData = flightData
    this.element = this.createElement();
    Controller.instance.attachFlightBarListeners(this);
  }

  createElement(){
    const element = document.createElement('div');
    element.classList.add('flight-card');
    element.setAttribute('tabindex', '0');

    element.innerHTML = `
    <div class="flight-card-content">

      <h3 class="flight-number">${this.flightData.flightNumber}</h3>
      <p class="airport-code"> ${this.flightData.airportCode}</p>
    </div>

    <div class="flight-card-tooltip">
      <p><strong>AIRCRAFT:</strong> ${this.flightData.aircraftType}</p>
      <p><strong>REPORT:</strong><br> ${this.formatDateTime(this.flightData.reportTime)}</p>
      <p><strong>CLEAR:</strong><br> ${this.formatDateTime(this.flightData.clearTime)}</p>
    </div>`;
    return element;
  }

  formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  getCoveredDays() {
    const start = new Date(this.flightData.reportTime);
    const end = new Date(this.flightData.clearTime);
    const coveredDays = [];

    const current = new Date(start);
    while (current <= end) {
      coveredDays.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    coveredDays.push(end);
    return coveredDays;
  }

  showTooltip(){
    const tooltip = this.element.querySelector('.flight-card-tooltip');
    const tooltipRect = tooltip.getBoundingClientRect();
    const cardRect = this.element.getBoundingClientRect();

    if (cardRect.top - tooltipRect.height - 10 < 0) {
      tooltip.classList.remove('tooltip-top');
    } else {
      tooltip.classList.add('tooltip-top');
    }

    tooltip.classList.add('tooltip-visible');
    tooltip.classList.remove('tooltip-hidden');
  }

  hideTooltip(){
    const tooltip = this.element.querySelector('.flight-card-tooltip');
    tooltip.classList.add('tooltip-hidden');
    tooltip.classList.remove('tooltip-visible');
  }

  highlightHoveredFlight() {
    this.element.classList.add('shine-container');
  }

  removeHighlightFromHoveredFlight() {
    this.element.classList.remove('shine-container');
  }
}
