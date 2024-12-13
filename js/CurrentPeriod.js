import {Period} from "./Period";
import {PeriodType} from "./PeriodType";

export class CurrentPeriod extends Period {

  constructor(start = new Date(), end = new Date(), id = 0, type = PeriodType.NOT_DEFINED) {
    super(start, end, id, type);
    this.active = false;
  }

  clear() {
    this.start = new Date();
    this.end = new Date();
    this.type = PeriodType.NOT_DEFINED;
    this.active = false;
  }

  startNewSelection(date, type) {
    this.start = this._startHours(date);
    this.end = this._endHours(date);
    this.active = true;
    this.type = type;
  }

  updateSelection(endDate) {
    //dni jako elementy
    const days = document.querySelectorAll('.day');

    let [minDate, maxDate] = this.start <= endDate ? [this.start, endDate] : [endDate, this.start];
    this.start = minDate;
    this.end = maxDate;

    /*  days.forEach(day => {
        const dayDate = new Date(
          parseInt(day.getAttribute('data-year')),
          parseInt(day.getAttribute('data-month')),
          parseInt(day.getAttribute('data-day'))
        );

        if (controller.selectedColor === 'work-selected') {
          if (dayDate >= minDate && dayDate <= maxDate) {
            day.classList.add('temporary-work');
          } else if (!day.classList.contains('final-selection')) {
            day.classList.remove('temporary-work');
          }
        }

        if (controller.selectedColor === 'off-selected') {
          if (
            dayDate >= minDate &&
            dayDate <= maxDate &&
            startDate.getMonth() === endDate.getMonth() &&
            startDate.getFullYear() === endDate.getFullYear()
          ) {
            day.classList.add('temporary-off');
          } else if (!day.classList.contains('final-selection')) {
            day.classList.remove('temporary-off');
          }
        }
      });*/
  }

  endSelection() {
    this.clear();
  }


}
