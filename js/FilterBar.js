import {workPeriods} from "./Main";
import {selectedPeriodId, updateFlights} from "./load-sidebar";
import {Controller} from "./Controller";
import {Filters} from "./Filters";

export class FilterBar {

  constructor() {
    this.aircraftTypeSelect = document.getElementById('aircraftType');
    this.airportCodeInput = document.getElementById('airportCode');
  }

  getFilters(){
    let selectedAircraftType = this.aircraftTypeSelect ? this.aircraftTypeSelect.value : '';
    const airportCodeValue = this.airportCodeInput ? this.airportCodeInput.value.toUpperCase() : '';
    return new Filters(null,selectedAircraftType,airportCodeValue);
  }


  initializeSidebarEventListeners() {
    if (this.aircraftTypeSelect) {
      this.aircraftTypeSelect.addEventListener('change', () => {
        Controller.instance.handleFilterChange();
      });
    } else {
      console.error('Aircraft type select element not found.');
    }
    if (this.airportCodeInput) {
      this.airportCodeInput.addEventListener('input', () => {
        Controller.instance.handleFilterChange();
      });
    } else {
      console.error('Airport code input element not found.');
    }
  }

  delayHandleFilterChange() {
    debounce(this.handleFilterChange,300)
  }

  handleFilterChange() {
    const period = workPeriods.find(period => period.id === selectedPeriodId);
    if (!period) {
      document.querySelector('.extra-column').innerHTML = "Please select dates in the calendar.";
      displayFlights([]);
      return;
    }

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
