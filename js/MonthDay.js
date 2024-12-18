import {Day} from "./Day";

export class MonthDay extends Day {

  constructor(date) {
    super(date);
  }


  attachToDom() {
    this.element = document.createElement('div');
    this.element.classList.add('day');
    this.daysContainer.appendChild(this.element);
    this.element.textContent = this.getDayNumber();
   //todo controller.addDayListeners(this);
  }
}
