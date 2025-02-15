export class SliderFilter{

  constructor() {
    const minSliderBall = document.querySelector(".min-val");
    const maxSliderBall = document.querySelector(".max-val");
    this.minValue =minSliderBall.value;
    this.maxValue =maxSliderBall.value;
    const minInput = document.querySelector(".min-input");
    const maxInput = document.querySelector(".max-input");
    console.log(this.minValue, this.maxValue);
    this.initListeners();
  }

  initListeners() {

  }




}
