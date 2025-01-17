import {Calendar} from "./Calendar";
import {PeriodType} from "./PeriodType";

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

      day.element.addEventListener('mouseup', () => {
        if (this.calendar.isSelecting()) {
          const success = this.calendar.finishSelection();
          if (!success) {
            console.log('okresy sie nakladaja')
          }
        }
      });
    }
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
    console.log(dates)
  }
}


/*todo plan
* pojawienie się ikonek i podpiecie do nich listenerów -> podobiekty w klasie day?
* select
* */
