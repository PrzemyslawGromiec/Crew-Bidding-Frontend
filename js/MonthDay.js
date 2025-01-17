import {Day} from "./Day";

export class MonthDay extends Day {

  constructor(date) {
    super(date);
  }


  attachElement() {
    this.element = document.createElement('div');
    this.daysContainer.appendChild(this.element);
   //todo controller.addDayListeners(this);
  }

  getDefaultText(){
    return this.getDayNumber()
  }




}
