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
    this.element.setAttribute('data-day', this.getDayNumber());
    this.element.setAttribute('data-month', time.nextMonth.toString());
    this.element.setAttribute('data-year', time.nextMonthYear.toString());
    controller.addDayListeners(this);
  }
}
