import {Day} from "./Day";

export class ExtraDay extends Day {

  constructor(date) {
    super(date);
  }

  attachToDom() {
    this.element = document.createElement('div');
    this.element.classList.add('day', 'next-month-day');
    this.element.textContent = this.getDayNumber();
    this.element.style.opacity = '0.5';
    this.daysContainer.appendChild(this.element);
    //todo controller.addExtraDaysListeners(this.element);
  }
}
