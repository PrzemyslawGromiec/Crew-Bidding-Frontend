import {Day} from "./Day";
import {PeriodType} from "./PeriodType";

export class EmptyDay extends Day {

  constructor(date) {
    super(date);
  }


  getSelectableTypes() {
    return [];
  }

  canStartSelection(){
    return false
  }

  attachElement() {
    this.element = document.createElement('div');
    this.daysContainer.appendChild(this.element);
  }
}
