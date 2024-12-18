import {PeriodType} from "./PeriodType";

export class DayIcon{

  constructor(periodType,day) {
    this.element = document.createElement('span');
    this.periodType = periodType;
    this.day = day;
    this.element.textContent = PeriodType.getEmojiFor(periodType);
  }
}
