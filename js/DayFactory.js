import {DayType} from "./DayType";
import {EmptyDay} from "./EmptyDay";
import {MonthDay} from "./MonthDay";
import {ExtraDay} from "./ExtraDay";
import {Time} from "./Time";

export class DayFactory{

  constructor() {
    this.time = new Time();
  }

  createDays() {
    const days = [];
    const daysByTypeMap = this.howManyDaysByType();
    for (let [key, value] of daysByTypeMap) {
      for (let i = 0; i < value; i++) {
        const monthModifier = DayType.monthModifier(key);
        const month = this.time.nextMonth + monthModifier;
        const year = this.time.nextMonthYear;
        let date = this._createDateFor(i+1, month, year);
        let day;
        switch (key) {
          case DayType.EMPTY:
            date = this._createDateFor(value - i + 1, month, year);
            date = this._getReverseDay(date);
            day = this.createEmpty(date);
            break;
          case DayType.MONTH:
            day = this.monthCurrent(date);
            break;
          case DayType.EXTRA:
            day = this.createExtra(date);
            break;
        }
        days.push(day);
      }
    }
    return days;
  }

  howManyDaysByType() {
    const emptyCount = this.time.dayOfWeek - 1;
    const monthCount = this.time.daysInMonth;
    const totalCells = emptyCount + monthCount;
    const extraDaysNeeded = (7 - (totalCells % 7)) % 7;
    const extraCount = extraDaysNeeded + 7;
    const result = new Map();
    result.set(DayType.EMPTY, emptyCount);
    result.set(DayType.MONTH, monthCount);
    result.set(DayType.EXTRA, extraCount);
    return result;
  }

  createEmpty(date) {
    return new EmptyDay(date);
  }

  monthCurrent(date) {
    return new MonthDay(date);
  }

  createExtra(date) {
    return new ExtraDay(date);
  }

  _createDateFor(day, month, year) {
    if (month < 0) {
      year--;
      month = 11;
    } else if (month > 11) {
      year++;
      month = 0;
    }
    return new Date(year, month, day, 0, 0, 0);
  }

  _getReverseDay(date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const day = date.getDate();
    return new Date(year, month, lastDayOfMonth - day + 1);
  }
}
