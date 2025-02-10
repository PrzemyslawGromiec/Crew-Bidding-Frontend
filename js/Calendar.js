import {Time} from "./Time";
import {CurrentPeriod} from "./CurrentPeriod";
import {Period} from "./Period"
import {PeriodType} from "./PeriodType";
import {DayFactory} from "./DayFactory";
import {Controller} from "./Controller";
import {Common} from "./Common";

export class Calendar {

  constructor() {
    this.days = [];
    this.dutyPeriods = [];
    this.time = new Time();
    this.currentSelection = new CurrentPeriod();
    this.monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
  }



  //DAYS CREATION
  init() {
    this.setupHeader();
    this.setupDays();
    console.log("starting app");
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
    const period = this.dutyPeriods.find(period => period.isInPeriod(day.date));
    const periodIndex = this.dutyPeriods.indexOf(period)
    if (periodIndex === -1) {
      return
    }
    this.dutyPeriods.splice(periodIndex,1)
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
      this.createDuty();
      this.currentSelection.clear();
    } else if (this.currentSelection.type === PeriodType.WORK) {
      this.currentSelection.stop();
      //console.log(this.currentSelection.getAsDates());
      Controller.instance.showFlights(this.currentSelection.getAsDates());
    }
    return true;
  }

  createDuty(flightData = null) {
    const newPeriod = Period.createByPeriod(this.currentSelection);
    if (flightData != null) {
      newPeriod.flightData = flightData
    }
    this.dutyPeriods.push(newPeriod);
    newPeriod.applyDuty();
    console.log(this.dutyPeriods);
  }

  createWorkDuty(dates,flightData){
    const days =this.getDaysByDates(dates);
    this.selectBy(days[0],PeriodType.WORK);
    this.currentSelection.updateDays(days);
    this.createDuty(flightData);
    this.currentSelection.clear();
  }

  isSelecting() {
    return this.currentSelection.active;
  }

  setHighlighted(dates,highlighted){
    this.getDaysByDates(dates).forEach(day => day.setHighlighted(highlighted))
  }

  getDaysByDates(dates){
    return this.days.filter(day =>
      dates.filter(date => day.sameAs(date)).length !== 0
    )
  }

  //GETTERS

  getDays() {
    return this.days;
  }
}
