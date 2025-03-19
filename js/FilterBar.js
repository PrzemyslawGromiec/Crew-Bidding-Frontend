import {Controller} from "./Controller";
import {Filters} from "./Filters";
import {SliderFilterUserValue} from "./SliderFilterUserValue";

export class FilterBar {

  constructor() {
    this.aircraftTypeSelect = document.getElementById('aircraftType');
    this.airportCodeInput = document.getElementById('airportCode');
    this.reportTimeInput = document.getElementById('reportTime');
    this.clearTimeInput = document.getElementById('clearTime');
    this.sliderUserValues = new SliderFilterUserValue();
    this.initializeSidebarEventListeners();
  }

  getFilters() {
    let selectedAircraftType = this.aircraftTypeSelect && this.aircraftTypeSelect.value !== "ALL TYPES" ?
      this.aircraftTypeSelect.value : '';
    const airportCodeValue = this.airportCodeInput ? this.airportCodeInput.value.toUpperCase() : '';
    const sliderUserValMin = this.sliderUserValues.getUserCurrentMinValue();
    const sliderUserValMax = this.sliderUserValues.getUserCurrentMaxValue();
    const reportTimeDate = this.getDateFromFilter(this.reportTimeInput);
    const clearTimeDate = this.getDateFromFilter(this.clearTimeInput);
    return new Filters(null, selectedAircraftType, airportCodeValue,sliderUserValMin, sliderUserValMax,
      reportTimeDate,clearTimeDate);
  }

  getDateFromFilter(inputElement) {
    if(inputElement.value === "") {
      return null;
    }
    const [hours, minutes] = inputElement.value.split(":").map(Number);
    const date = new Date();
    date.setHours(hours,minutes);
    return date;
  }

  initializeSidebarEventListeners() {
    this.aircraftTypeSelect.addEventListener('change', () => {
      Controller.instance.handleFilterChange(this.getFilters());
    });
    this.airportCodeInput.addEventListener('input', () => {
      Controller.instance.handleFilterChange(this.getFilters());
    });
    document.addEventListener('sliderValueChanged', () => {
      Controller.instance.handleFilterChange(this.getFilters());
    });
    this.reportTimeInput.addEventListener('change', () => {
      Controller.instance.handleFilterChange(this.getFilters());
    });
    this.clearTimeInput.addEventListener('change', () => {
      Controller.instance.handleFilterChange(this.getFilters());
    });
  }
}
