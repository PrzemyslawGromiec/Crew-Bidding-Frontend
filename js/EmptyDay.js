import {Day} from "./Day";

export class EmptyDay extends Day {

  constructor(date) {
    super(date);
  }

  attachElement() {
    this.element = document.createElement('div');
    this.daysContainer.appendChild(this.element);
  }
}
