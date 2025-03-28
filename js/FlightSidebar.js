import {FlightBarFlight} from "./FlightBarFlight";
import {Common} from "./Common";

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
    let flights = [...this._allFlightsData]
    return flights.filter(flight => {
      const flightReportTime = new Date(flight.reportTime);
      const flightClearTime = new Date(flight.clearTime);
      return this.filters.dates == null ||
        (flightReportTime >= this.filters.dates.start &&
          flightClearTime <= this.filters.dates.end);
    }).filter(flight => (this.filters.aircraftType === "" || this.filters.aircraftType === null)
      || this.filters.aircraftType === flight.aircraftType)
      .filter(flight => (this.filters.airportCode === "" || this.filters.airportCode === null)
        || flight.airportCode.includes(this.filters.airportCode))
      .filter(flight => {
        //DURATION IN DAYS
        const reportDate = new Date(flight.reportTime);
        const clearDate = new Date(flight.clearTime);
        reportDate.setHours(0, 0, 0, 0);
        clearDate.setHours(0, 0, 0, 0);
        const daySpan = (clearDate - reportDate) / (1000 * 60 * 60 * 24) + 1;
        return daySpan >= this.filters.minDuration && daySpan <= this.filters.maxDuration;
      })
      .filter(flight => {
        const flightReportTime = new Date(flight.reportTime);
        return (this.filters.reportTime === null
        || Common.isLaterThan(flightReportTime,this.filters.reportTime))
      })
      .filter(flight => {
        const flightClearTime = new Date(flight.clearTime);
        return (this.filters.clearTime === null
          || Common.isBefore(flightClearTime,this.filters.clearTime))
      });
  }

  showAllFlights() {
    this.showFlights(this._allFlightsData);
  }

  showFlights(flightsData) {
    flightsData.sort((a, b) => new Date(a.clearTime) - new Date(b.clearTime));
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
