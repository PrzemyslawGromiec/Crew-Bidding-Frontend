export class SliderFilter{

  constructor() {
    this.sliderBar = document.getElementById('slider-bar');
    this.sliderRange = document.getElementById('slider-range');
    this.handleMin = document.getElementById('handle-min');
    this.handleMax = document.getElementById('handle-max');
    this.inputMin = document.getElementById('input-min');
    this.inputMax = document.getElementById('input-max');
    this.minLimit = 0;
    this.maxLimit = 100;
    this.currentMin = parseFloat(this.inputMin.value) || 25;
    this.currentMax = parseFloat(this.inputMax.value) || 75;
    this.activeHandle = null;
    this.startDrag = this.startDrag.bind(this);
    this.duringDrag = this.duringDrag.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.onInputMinChange = this.onInputMinChange.bind(this);
    this.onInputMaxChange = this.onInputMaxChange.bind(this);
    this.updateSliderPositions = this.updateSliderPositions.bind(this);
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

    // Similarly for touch events:
    this.handleMin.addEventListener('touchstart', (e) => {
      this.startDrag(this.handleMin, e);
    });
    this.handleMax.addEventListener('touchstart', (e) => {
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
    // Now you already know which handle is being dragged.
    this.activeHandle = handle;
    // Capture initial pointer position if needed:
    this.startX = e.clientX || (e.touches && e.touches[0].clientX);
    // Capture the initial position of the handle (assuming a pixel-based left property)
    this.initialHandlePosition = parseFloat(this.activeHandle.style.left) || 0;
    // Provide visual feedback
    this.activeHandle.classList.add('dragging');
    e.preventDefault();
  }

  duringDrag(e) {
    if (!this.activeHandle) return;

    // Get the current pointer X coordinate (support both mouse and touch)
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
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

  endDrag(e) {
    if (this.activeHandle) {
      this.activeHandle.classList.remove('dragging');
      this.activeHandle = null;
    }
  }

  onInputMinChange(inputEl) {
    let val = parseFloat(inputEl.value);
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
    const sliderWidth = this.sliderBar.offsetWidth;
    const posMin = ((this.currentMin - this.minLimit) / (this.maxLimit - this.minLimit)) * sliderWidth;
    const posMax = ((this.currentMax - this.minLimit) / (this.maxLimit - this.minLimit)) * sliderWidth;

    this.handleMin.style.left = posMin + 'px';
    this.handleMax.style.left = posMax + 'px';
    this.sliderRange.style.left = posMin + 'px';
    this.sliderRange.style.width = (posMax - posMin) + 'px';

    // Update input values (rounded)
    this.inputMin.value = Math.round(this.currentMin);
    this.inputMax.value = Math.round(this.currentMax);
  }
}


/*const minSliderBall = document.querySelector(".min-val");
const maxSliderBall = document.querySelector(".max-val");
this.minValue =minSliderBall.value;
this.maxValue =maxSliderBall.value;
const minInput = document.querySelector(".min-input");
const maxInput = document.querySelector(".max-input");*/
