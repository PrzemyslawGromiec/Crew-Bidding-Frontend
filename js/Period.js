import {PeriodType} from "./PeriodType";
import {Dates} from "./Dates";

export class Period {

  constructor( type = PeriodType.NOT_DEFINED,days=[]) {
    this.type = type;
    this.days = days;
    this.flightData = null;
  }

  static createByPeriod(period){
    return new Period(period.type,[...period.days])
  }

  _startHours(date) {
    const copy = new Date(date.getTime());
    return new Date(copy.setHours(0, 0, 0, 0));
  }


  _endHours(date) {
    const copy = new Date(date.getTime());
    return new Date(copy.setHours(23, 59, 59, 999));
  }

  startDate(){
    return this._startHours(this.days.at(0).date);
  }

  endDate() {
    return this._endHours(this.days.at(-1).date);
  }

  applyDuty(){
    for(const day of this.days){
      day.makeDuty()
    }
  }

  destroy(){
    for(const day of this.days){
      day.resetDay();
    }
  }

  isInPeriod(date) {
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0));
    return normalizedDate >= this.startDate() && normalizedDate <= this.endDate();
  }

  getAsDates(){
    if (!this.days || this.days.length === 0) {
      console.warn('Empty array.');
      return null;
    }
    if (this.days.length === 1) {
      return new Dates(this._startHours(this.days[0].date),this._endHours(this.days[0].date))
    }
    return new Dates(this._startHours(this.days[0].date), this._endHours(this.days[this.days.length - 1].date))
  }
}
