import {Controller} from "./Controller";
import {Filters} from "./Filters";
import {SliderFilter} from "./SliderFilter";

export class FilterBar {

  constructor() {
    this.aircraftTypeSelect = document.getElementById('aircraftType');
    this.airportCodeInput = document.getElementById('airportCode');
    this.slider = new SliderFilter();
    this.initializeSidebarEventListeners();
  }

  getFilters() {
    let selectedAircraftType = this.aircraftTypeSelect && this.aircraftTypeSelect.value !== "ALL TYPES" ?
      this.aircraftTypeSelect.value : '';
    const airportCodeValue = this.airportCodeInput ? this.airportCodeInput.value.toUpperCase() : '';
    return new Filters(null, selectedAircraftType, airportCodeValue);
  }

  initializeSidebarEventListeners() {
    this.aircraftTypeSelect.addEventListener('change', () => {
      Controller.instance.handleFilterChange(this.getFilters());
    });
    this.airportCodeInput.addEventListener('input', () => {
      Controller.instance.handleFilterChange(this.getFilters());
    });
  }
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
