import {PeriodType} from "./PeriodType";
import {Common} from "./Common";

export class DayIcon{

  constructor(day,emoji,periodType = PeriodType.NOT_DEFINED) {
    this.element = document.createElement('span');
    this.type = periodType;
    if(this.type === PeriodType.NOT_DEFINED){
      this.type = day.type
    }
    this.day = day;
    this.element.textContent = emoji;
  }

}
