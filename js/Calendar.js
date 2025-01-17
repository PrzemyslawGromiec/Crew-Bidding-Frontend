import {Time} from "./Time";
import {CurrentPeriod} from "./CurrentPeriod";
import {Period} from "./Period"
import {PeriodType} from "./PeriodType";
import {DayFactory} from "./DayFactory";
import {Controller} from "./Controller";

export class Calendar {

  constructor() {
    this.days = [];
    this.periods = [];
    this.time = new Time();
    this.currentSelection = new CurrentPeriod();
    this.monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
  }

  //DAYS CREATION
  init() {
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
    this.days = new DayFactory().createDays();
    this.attachAll();
  }

  attachAll() {
    for (const day of this.days) {
      day.attachToDom();
    }
  }

  //ACTIONS
  hoverEnter(day) {
    if (this.currentSelection.active) {
      const days = this.getDaysBetween(this.currentSelection.firstDate(), day.date)
      this.currentSelection.updateDays(days);
    } else {
      day.hoverStart();
    }
  }

  selectBy(day,type) {
    this.currentSelection.startNewSelection(day,type);
  }

  deleteDutyBy(day) {
    const period = this.periods.find(period => period.isInPeriod(day.date));
    const periodIndex = this.periods.indexOf(period)
    if (periodIndex === -1) {
      return
    }
    this.periods.splice(periodIndex,1)
    period.destroy()
  }


  hoverLeave(day) {
    day.removeIcons();
    day.hoverLeave();
  }

  getDaysBetween(date1, date2) {
    const [start, end] = [date1, date2].sort((a, b) => a - b);
    return this.days.filter((day) => {
      const normalizedDate = new Date(day.date);
      normalizedDate.setHours(0, 0, 0, 0);

      return normalizedDate >= start && normalizedDate <= end;
    });
  }

  finishSelection() {
    if (this.currentSelection.type === PeriodType.OFF) {
      this.createDuty(Period.createByPeriod(this.currentSelection));
      this.currentSelection.clear();
    } else if (this.currentSelection.type === PeriodType.WORK) {
      this.currentSelection.stop();
      Controller.instance.showFlights(this.currentSelection.getAsDates())
    }
    return true;
  }

  createDuty(period) {
    this.periods.push(period);
    period.applyDuty();
  }

  isSelecting() {
    return this.currentSelection.active;
  }

  //GETTERS

  getDays() {
    return this.days;
  }
}
