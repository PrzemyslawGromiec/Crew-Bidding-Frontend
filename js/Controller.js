import {Calendar} from "./Calendar";
import {PeriodType} from "./PeriodType";
import * as api from "./api";
import {displayFlightsForPeriod} from './flight-card';

export class Controller {

  static instance = new Controller()

  constructor() {
    if (Controller.instance) {
      throw new Error("Instance already created")
    }
  }

  start() {
    this.calendar = new Calendar();
    this.calendar.init();
    this.attachListeners();
  }

  attachListeners() {
    const days = this.calendar.getDays();
    for (const day of days) {
      day.element.addEventListener('mouseenter', () => {
        this.calendar.hoverEnter(day);
      });

      day.element.addEventListener('mouseleave', () => {
        this.calendar.hoverLeave(day);
      });

      /*day.element.addEventListener('mouseup', () => {
        if (this.calendar.isSelecting()) {
          const success = this.calendar.finishSelection();
          if (!success) {
            console.log('okresy sie nakladaja')
          }
        }
      });*/
    }

    //todo: 18.01 - listener added to document because of drag enter functionality
    document.addEventListener('mouseup', () => {
      if (this.calendar.isSelecting()) {
        const success = this.calendar.finishSelection();
        if (!success) {
          console.log('Okresy się nakładają.');
        }
      }
    });
  }

  addSelectionIconAction(activeIcons) {
    for (const icon of activeIcons) {
      icon.element.addEventListener('mousedown', () => {
        this.calendar.selectBy(icon.day,icon.type);
        icon.day.removeIcons()
      });
    }
  }

  addTrashIconAction(trashIcon) {
      trashIcon.element.addEventListener('mousedown', () => {
        this.calendar.deleteDutyBy(trashIcon.day);
        trashIcon.day.removeIcons()
      });
  }


  showFlights(dates) {
    // const flights = api.getFlightsForMonth();
    displayFlightsForPeriod(dates)
  }
}


/*todo plan
* pojawienie się ikonek i podpiecie do nich listenerów -> podobiekty w klasie day?
* select
* */
