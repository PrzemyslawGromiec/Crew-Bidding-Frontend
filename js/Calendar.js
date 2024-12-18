import {Time} from "./Time";
import {CurrentPeriod} from "./CurrentPeriod";
import {EmptyDay} from "./EmptyDay";
import {MonthDay} from "./MonthDay";
import {ExtraDay} from "./ExtraDay";
import {DayType} from "./DayType";

export class Calendar {


  constructor() {
    this.days = [];
    this.time = new Time();
    this.currentSelection = new CurrentPeriod();
    this.monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
  }

  //DAYS CREATION
  init(){
    this.setupHeader();
    this.setupDays();
  }

  setupHeader() {
    const header = document.querySelector('.header');
    header.innerHTML = '';
    header.textContent = `${this.monthNames[this.time.nextMonth].toUpperCase()} ${this.time.nextMonthYear}`;
  }

  setupDays() {
    const daysContainer = document.querySelector('.days-container');
    daysContainer.innerHTML = '';
    this.createDays(this.howManyDaysByType());
    this.attachAll();
  }

  attachAll() {
    for (const day of this.days) {
      day.attachToDom();
    }
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

  getDays() {
    return this.days;
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

  createDays(daysByType) {
    for (let [key, value] of daysByType) {
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
        this.days.push(day);
      }
    }
  }

  _getReverseDay(date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const day = date.getDate();
    return new Date(year, month, lastDayOfMonth - day + 1);
  }

  //ACTIONS
  dayHovered(day){
    if (this.currentSelection.active) {
      const days = this.getDaysBetween(this.currentSelection.firstDate(),day.date)
      this.currentSelection.updateDays(days)
    } else { //bez zaznaczania
      day.hoverStart();
    }
  }

  iconClicked(icon) {
    icon.day.removeIcons()
    this.currentSelection.startNewSelection(icon.day,icon.periodType);
  }

  hoverLeave(day) {

  }


  getDaysBetween(date1, date2) {
    console.log("between:")
    console.log(date1)
    console.log(date2)
    let start = date1;
    let end = date2;
    if (date1 > date2) {
      start = date2;
      end = date1;
    }
    const days = [];
    for (const day of this.days) {
      const normalizedDate = new Date(day.date.setHours(0, 0, 0, 0));
      if (normalizedDate >= start && normalizedDate <= end) {
        days.push(day);
      }
    }
    return days;
  }
}
