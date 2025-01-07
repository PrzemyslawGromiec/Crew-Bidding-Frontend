import {Day} from "./Day";

export class ExtraDay extends Day {

  constructor(date) {
    super(date);
  }

  attachElement() {
    this.element = document.createElement('div');
    this.element.textContent = this.getDayNumber();
    this.element.style.opacity = '0.5';
    this.daysContainer.appendChild(this.element);
    //todo controller.addExtraDaysListeners(this.element);
  }

  addStartingStyle() {
    super.addStartingStyle();
    this.element.classList.add('next-month-day');
  }
}
