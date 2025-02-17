import {Controller} from "./Controller";
import {Filters} from "./Filters";
import {SliderFilterUserValue} from "./SliderFilterUserValue";

export class FilterBar {

  constructor() {
    this.aircraftTypeSelect = document.getElementById('aircraftType');
    this.airportCodeInput = document.getElementById('airportCode');
    this.sliderUserValues = new SliderFilterUserValue();
    this.initializeSidebarEventListeners();
  }

  getFilters() {
    let selectedAircraftType = this.aircraftTypeSelect && this.aircraftTypeSelect.value !== "ALL TYPES" ?
      this.aircraftTypeSelect.value : '';
    const airportCodeValue = this.airportCodeInput ? this.airportCodeInput.value.toUpperCase() : '';
    const sliderUserValMin = this.sliderUserValues.getUserCurrentMinValue();
    const sliderUserValMax = this.sliderUserValues.getUserCurrentMaxValue();
    return new Filters(null, selectedAircraftType, airportCodeValue,sliderUserValMin, sliderUserValMax);
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
  }
}
