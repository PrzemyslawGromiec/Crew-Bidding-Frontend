import {Calendar} from "./Calendar";
import {getFlights} from './api.js';
import {FlightSidebar} from "./FlightSidebar";
import {FilterBar} from "./FilterBar";
import {Filters} from "./Filters";

export class Controller {

  static instance = new Controller()

  constructor() {
    if (Controller.instance) {
      throw new Error("Instance already created")
    }
    //RIGHT SIDE FLIGHT BAR CREATED
    this.flightSidebar = new FlightSidebar();
    //BOTTOM FILTER BAR
    this.filterBar = new FilterBar();
    getFlights().then(data => {
      this.flightSidebar.allFlightsData = data;
      this.handleFilterChange(this.filterBar.getFilters());
    });
  }

  start() {
    this.calendar = new Calendar();
    this.calendar.init();
    this.attachDayListeners();
    this.addModalListener();
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
      // flightBar.highlightHoveredFlight();
      this.calendar.setHighlighted(flightBar.getCoveredDays(), true);
    });

    element.addEventListener('mouseleave', () => {
      flightBar.hideTooltip();
      flightBar.removeHighlightFromHoveredFlight();
      this.calendar.setHighlighted(flightBar.getCoveredDays(), false);
    });

    element.addEventListener('click', () => {
      this.calendar.createWorkDuty(flightBar.getCoveredDays(), flightBar.flightData);
    })
  }

  addTrashIconAction(trashIcon) {
    trashIcon.element.addEventListener('mousedown', () => {
      this.calendar.deleteDutyBy(trashIcon.day);
      trashIcon.day.removeIcons()
    });
  }

  showFlights(dates) {
    this.flightSidebar.applyFilters(new Filters(dates));
  }

  handleFilterChange(filters) {
    this.flightSidebar.applyFilters(filters);
  }

  addModalListener() {
    const openModalButton = document.getElementById('open-modal-button');
    const modal = document.getElementById('modal');
    const backdrop = document.getElementById('backdrop');

    function openModal() {
      modal.style.display = 'block';
      backdrop.style.display = 'block';
    }

    function closeModal() {
      modal.style.display = 'none';
      backdrop.style.display = 'none';
    }

    openModalButton.addEventListener('click', openModal);

    backdrop.addEventListener('click', closeModal);
    document.querySelector('.cancel-button').addEventListener('click', closeModal);
    document.querySelector('.save-button').addEventListener('click', closeModal);
  }
}
