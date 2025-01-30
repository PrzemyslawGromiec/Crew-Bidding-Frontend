import {Calendar} from "./Calendar";
import {getFlights} from './api.js';
import {FlightSidebar} from "./FlightSidebar";

export class Controller {

  static instance = new Controller()

  constructor() {
    if (Controller.instance) {
      throw new Error("Instance already created")
    }
    this.flightSidebar = new FlightSidebar();
    getFlights().then(data => {
      this.flightSidebar.allFlightsData = data;
      this.flightSidebar.showAllFlights();
    });
  }

  start() {
    this.calendar = new Calendar();
    this.calendar.init();
    this.attachDayListeners();
  }

  attachDayListeners() {
    const days = this.calendar.getDays();
    for (const day of days) {
      day.element.addEventListener('mouseenter', () => {
        this.calendar.hoverEnter(day);
      });

      day.element.addEventListener('mouseleave', () => {
        this.calendar.hoverLeave(day);
      });
    }

    document.addEventListener('mouseup', () => {
      if (this.calendar.isSelecting()) {
        const success = this.calendar.finishSelection();
        if (!success) {
          console.log('Periods overlap.');
        }
      }
    });
  }

  addSelectionIconAction(activeIcons) {
    for (const icon of activeIcons) {
      icon.element.addEventListener('mousedown', () => {
        this.calendar.selectBy(icon.day, icon.type);
        icon.day.removeIcons()
      });
    }
  }

  attachFlightBarListeners(flightBar) {
    const element = flightBar.element;
    element.addEventListener('mouseenter', () => {
      flightBar.showTooltip();
      this.calendar.setHighlighted(flightBar.getCoveredDays(),true);
    });

    element.addEventListener('mouseleave', () => {
      flightBar.hideTooltip();
      this.calendar.setHighlighted(flightBar.getCoveredDays(),false);
    });

    element.addEventListener('click',()=>{
      this.calendar.createWorkDuty(flightBar.getCoveredDays());
    })
  }

  addTrashIconAction(trashIcon) {
    trashIcon.element.addEventListener('mousedown', () => {
      this.calendar.deleteDutyBy(trashIcon.day);
      trashIcon.day.removeIcons()
    });
  }

  showFlights(dates) {
    // const flights = api.getFlightsForMonth();
    this.flightSidebar.showFlightsForPeriod(dates)
  }
}
