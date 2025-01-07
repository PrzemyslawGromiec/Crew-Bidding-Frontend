import {Time} from "./Time";
import {CurrentPeriod} from "./CurrentPeriod";
import {Period} from "./Period"
import {EmptyDay} from "./EmptyDay";
import {MonthDay} from "./MonthDay";
import {ExtraDay} from "./ExtraDay";
import {DayType} from "./DayType";
import {PeriodType} from "./PeriodType";
import {DayFactory} from "./DayFactory";

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
    this.days = new DayFactory().createDays();
    this.attachAll();
  }

  attachAll() {
    for (const day of this.days) {
      day.attachToDom();
    }
  }

  //ACTIONS
  hoverEnter(day){
    if (this.currentSelection.active) {
      //active gdy zaczynam zaznaczac okres w kalendarzu
      console.log('currentSelection is active')
      const days = this.getDaysBetween(this.currentSelection.firstDate(),day.date)
      this.currentSelection.updateDays(days);
    } else {
      //najechanie na dzien po raz pierwszy
      day.hoverStart();
    }
  }

  iconClicked(icon) {
    icon.day.removeIcons()
    this.currentSelection.startNewSelection(icon.day,icon.periodType);
  }

  hoverLeave(day) {
    day.removeIcons();
    day.hoverLeave();
  }


  getDaysBetween(date1, date2) {
    console.log("between:")
    console.log(date1)
    console.log(date2)
   /* let start = date1;
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
    return days;*/
    const [start, end] = [date1, date2].sort((a, b) => a - b);

    return this.days.filter((day) => {
      const normalizedDate = new Date(day.date);
      normalizedDate.setHours(0, 0, 0, 0);

      return normalizedDate >= start && normalizedDate <= end;
    });
  }

  finishSelection() {
    if(this.currentSelection.type == PeriodType.OFF){
      this.createDuty(Period.createByPeriod(this.currentSelection));
      this.currentSelection.clear();
      //endSelection method?
    }else if(this.currentSelection.type ==PeriodType.WORK){
      //todo unselect last one and refresh propositions
    }

    // //todo: tu by trzeba pomyslec nad odznaczaniem okresu ale bez tego pierwotnego
    // if (this.hasOverlap(newPeriod)) {
    //   console.log("Nachodzący zakres!");
    //   this.currentSelection.clearColorType(newPeriod.days);
    //   this.currentSelection.clear();
    //   return false;
    // }
    // this.periods.push();
    //
    // for (const period of this.periods) {
    //   console.log(period);
    // }
    // this.currentSelection.endSelection();
    return true;
  }

  createDuty(period){
    this.periods.push(period);
    period.applyDuty();
  }

  //todo: do sprawdzenia
  hasOverlap(newPeriod) {
    for (const existing of this.periods) {
      if (
        newPeriod.startDate() <= existing.endDate() &&
        newPeriod.endDate() >= existing.startDate()
      ) {
        this.currentSelection.endSelection();
        return true;
      }
    }
    return false;
  }

  isSelecting(){
    return this.currentSelection.active;
  }

  //GETTERS

  getDays() {
    return this.days;
  }
}
