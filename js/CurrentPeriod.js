import {Period} from "./Period";
import {PeriodType} from "./PeriodType";

export class CurrentPeriod extends Period {

  constructor(type = PeriodType.NOT_DEFINED) {
    super(type);
    this.active = false;
    this.firstDay = null;
  }

  clear() {
    this.updateDays([]);
    this.type = PeriodType.NOT_DEFINED;
    this.active = false;
    this.firstDay = null;
  }

  stop() {
    this.active = false;
  }

  startNewSelection(day, type) {
    this.clear()
    this.active = true;
    this.type = type;
    this.days = [day];
    this.firstDay = day;
    for (const day of this.days) {
      day.select(type);
    }
  }

  firstDate() {
    return this.firstDay.date;
  }

  updateDays(days) {
    for (const day of this.days) {
      day.unselect(this.type);
    }
    this.days = days;
    this.days.sort((day1, day2) => day1.date - day2.date);
    for (const day of this.days) {
      day.select(this.type);

    }
  }
}
