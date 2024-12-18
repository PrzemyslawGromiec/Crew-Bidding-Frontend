import {Period} from "./Period";
import {PeriodType} from "./PeriodType";

export class CurrentPeriod extends Period {

  constructor( id = 0, type = PeriodType.NOT_DEFINED) {
    super(id, type);
    this.active = false;
    this.firstDay = null;
  }

  clear() {
    this.days = []
    this.type = PeriodType.NOT_DEFINED;
    this.active = false;
    this.firstDay = null;
  }

  startNewSelection(day, type) {
    this.active = true;
    this.type = type;
    this.days = [day];
    this.firstDay = day;
    for(const day of this.days){
      day.select(type);
    }
  }

  firstDate() {
    return this.firstDay.date;
  }

  updateDays(days) {
    for(const day of this.days){ //todo copy
      day.unselect(this.type);
    }
    this.days = days;
    this.days.sort((day1, day2) => day1.date - day2.date);
    for(const day of this.days){ //todo copy
      day.select(this.type);
    }
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
