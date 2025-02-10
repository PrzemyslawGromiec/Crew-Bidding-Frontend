import {flights, startCalendar} from "./Main";
import {FlightBarFlight} from "./FlightBarFlight";

export class FlightSidebar {
  constructor() {
    this._allFlightsData = [];
    this.filters = null;
  }

  set allFlightsData(value) {
    this._allFlightsData = value;
  }

  get allFlightsData() {
    return this._allFlightsData;
  }

  applyFilters(filters) {
    if (this.filters == null) {
      this.filters = filters;
    } else {
      this.filters.update(filters);
    }
    const flights = this.filterFlights();
    this.showFlights(flights);
  }

  filterFlights() {
    const flights = [...this._allFlightsData]
    if (this.filters.dates == null) {
      return flights;
    }
    return flights.filter(flight => {
      const flightReportTime = new Date(flight.reportTime);
      const flightClearTime = new Date(flight.clearTime);
      return flightReportTime >= this.filters.dates.start && flightClearTime <= this.filters.dates.end;
    });
  }

  showAllFlights() {
    this.showFlights(this._allFlightsData);
  }

  showFlights(flightsData) {
    const flightsContainer = document.querySelector('.extra-column');
    flightsContainer.innerHTML = "";
    if (flightsData.length === 0) {
      flightsContainer.innerHTML = "<p>No flights found for the selected criteria.</p>";
      return;
    }
    this.flights = []
    for (const flightData of flightsData) {
      const flight = new FlightBarFlight(flightData)
      this.flights.push(flight);
      flightsContainer.appendChild(flight.element)
    }
  }
}
