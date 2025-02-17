import {SliderFilter} from "./SliderFilter";

export class SliderFilterUserValue {

  constructor() {
    this.sliderFilter = new SliderFilter()
  }

  getUserCurrentMinValue() {
    return this.sliderFilter.getCurrentMinVal();
  }

  getUserCurrentMaxValue() {
    return this.sliderFilter.getCurrentMaxVal();
  }
}
