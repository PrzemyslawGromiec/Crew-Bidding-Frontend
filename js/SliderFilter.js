export class SliderFilter{

  constructor() {
    this.sliderBar = document.getElementById('slider-bar');
    this.sliderRange = document.getElementById('slider-range');
    this.handleMin = document.getElementById('handle-min');
    this.handleMax = document.getElementById('handle-max');
    this.inputMin = document.getElementById('input-min');
    this.inputMax = document.getElementById('input-max');
    this.minLimit = 0;
    this.maxLimit = 10;
    this.currentMin = parseFloat(this.inputMin.value) || 0;
    this.currentMax = parseFloat(this.inputMax.value) || 10;
    this.activeHandle = null;
    this.startDrag = this.startDrag.bind(this);
    this.duringDrag = this.duringDrag.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.onInputMinChange = this.onInputMinChange.bind(this);
    this.onInputMaxChange = this.onInputMaxChange.bind(this);
    this.initListeners();
    this.updateSliderPositions();
  }

  initListeners() {
    // Attach event listeners directly with a closure to pass the handle.
    this.handleMin.addEventListener('mousedown', (e) => {
      // Optionally capture the event coordinates too if needed
      this.startDrag(this.handleMin, e);
    });
    this.handleMax.addEventListener('mousedown', (e) => {
      this.startDrag(this.handleMax, e);
    });

    // Assuming this.inputMin and this.inputMax are already defined:
    this.inputMin.addEventListener('change', () => {
      this.onInputMinChange(this.inputMin);
    });
    this.inputMax.addEventListener('change', () => {
      this.onInputMaxChange(this.inputMax);
    });

    window.addEventListener('mousemove', this.duringDrag);
    window.addEventListener('mouseup', this.endDrag);
  }

  startDrag(handle, e) {
    this.activeHandle = handle;
    this.startX = e.clientX;
    this.initialHandlePosition = parseFloat(this.activeHandle.style.left) || 0;
    this.activeHandle.classList.add('dragging');
    e.preventDefault();
  }

  duringDrag(e) {
    if (!this.activeHandle) return;
    // Get the current pointer X coordinate (support both mouse and touch)
    const clientX = e.clientX;
    if (!clientX) return;

    // Calculate how much the pointer has moved from the initial position
    const deltaX = clientX - this.startX;

    // Calculate new position in pixels
    let newPos = this.initialHandlePosition + deltaX;

    // Constrain newPos to the slider's width
    const sliderWidth = this.sliderBar.offsetWidth;
    newPos = Math.max(0, Math.min(newPos, sliderWidth));

    // Determine the corresponding value based on newPos
    const newValue = (newPos / sliderWidth) * (this.maxLimit - this.minLimit) + this.minLimit;

    // Update either currentMin or currentMax depending on which handle is active.
    if (this.activeHandle === this.handleMin) {
      // Ensure it doesn't cross the max handle
      this.currentMin = Math.min(newValue, this.currentMax);
    } else if (this.activeHandle === this.handleMax) {
      // Ensure it doesn't cross the min handle
      this.currentMax = Math.max(newValue, this.currentMin);
    }

    // Update slider positions visually
    this.updateSliderPositions();
  }

  endDrag() {
    if (this.activeHandle) {
      this.activeHandle.classList.remove('dragging');
      this.activeHandle = null;
    }
  }

  onInputMinChange(inputEl) {
    let val = parseFloat(inputEl.value);
    console.log(inputEl.value)
    if (isNaN(val)) {
      val = this.minLimit;
    }
    this.currentMin = Math.min(Math.max(val, this.minLimit), this.currentMax);
    this.updateSliderPositions();
  }

  onInputMaxChange(inputEl) {
    let val = parseFloat(inputEl.value);
    if (isNaN(val)) {
      val = this.maxLimit;
    }
    this.currentMax = Math.max(Math.min(val, this.maxLimit), this.currentMin);
    this.updateSliderPositions();
  }

  updateSliderPositions() {
    //get the current width of the slider bar in pixels
    const sliderWidth = this.sliderBar.offsetWidth;
    //calculate the pixel position for the minimum handle
    const posMin = ((this.currentMin - this.minLimit) / (this.maxLimit - this.minLimit)) * sliderWidth;
    const posMax = ((this.currentMax - this.minLimit) / (this.maxLimit - this.minLimit)) * sliderWidth;

    this.handleMin.style.left = posMin + 'px';
    this.handleMax.style.left = posMax + 'px';
    this.sliderRange.style.left = posMin + 'px';
    this.sliderRange.style.width = (posMax - posMin) + 'px';

    //update input values (rounded)
    this.inputMin.value = Math.round(this.currentMin);
    this.inputMax.value = Math.round(this.currentMax);

    const event = new CustomEvent('sliderValueChanged', {
      detail: {
        min: this.getCurrentMinVal(),
        max: this.getCurrentMaxVal()
      }
    });
    document.dispatchEvent(event);
  }

  getCurrentMinVal() {
    return this.inputMin.value;
  }

  getCurrentMaxVal() {
    return this.inputMax.value;
  }
}


/*const minSliderBall = document.querySelector(".min-val");
const maxSliderBall = document.querySelector(".max-val");
this.minValue =minSliderBall.value;
this.maxValue =maxSliderBall.value;
const minInput = document.querySelector(".min-input");
const maxInput = document.querySelector(".max-input");*/
