import {PeriodType} from "./PeriodType";
import {Common} from "./Common";

export class DayIcon{

  constructor(periodType,day,emoji) {
    this.element = document.createElement('span');
    this.periodType = periodType;
    this.day = day;
    this.element.textContent = emoji;
  }

}
