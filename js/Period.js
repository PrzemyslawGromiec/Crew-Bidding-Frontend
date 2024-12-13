export class Period {

  constructor(start, end, id, type = PeriodType.NOT_DEFINED) {
    this.start = this._startHours(start);
    this.end = this._endHours(end);
    this.id = id;
    this.type = type;
  }

  _startHours(date) {
    return new Date(date.setHours(0, 0, 0, 0));
  }

  _endHours(date) {
    return new Date(date.setHours(23, 59, 59, 999));
  }

  isInPeriod(date) {
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0));
    return normalizedDate >= this.start && normalizedDate <= this.end;
  }
}
