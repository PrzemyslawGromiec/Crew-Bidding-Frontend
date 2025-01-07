import {PeriodType} from "./PeriodType";

export class Period {

  constructor( type = PeriodType.NOT_DEFINED,days=[]) {
    this.type = type;
    this.days = days;
  }

  static createByPeriod(period){
    return new Period(period.type,[...period.days])
  }

  _startHours(date) {
    return new Date( date.setHours(0, 0, 0, 0));
  }

  _endHours(date) {
    return new Date(date.setHours(23, 59, 59, 999));
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

  isInPeriod(date) {
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0));
    return normalizedDate >= this.startDate() && normalizedDate <= this.endDate();
  }
}
