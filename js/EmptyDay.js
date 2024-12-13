import {Day} from "./Day";

export class EmptyDay extends Day {

  constructor(date) {
    super(date);
  }

  attachToDom() {
    this.element = document.createElement('div');
    this.element.classList.add('day');
    this.daysContainer.appendChild(this.element);
  }
}
