import {FlightBarFlight} from "./FlightBarFlight";
import {flights} from "./Main";
import {createFlightCard} from "./flight-card";

export class FlightBar{

  constructor() {
    this._allFlightsData = []
    this.flights = []
  }

  set allFlightsData(value) {
    this._allFlightsData = value;
  }


  get allFlightsData() {
    return this._allFlightsData;
  }

  showFlightsForPeriod(period) {
    const filteredFlights = flights.filter(flight => {
      const flightReportTime = new Date(flight.reportTime);
      const flightClearTime = new Date(flight.clearTime);

      return flightReportTime >= period.start && flightClearTime <= period.end;
    });
    this.showFlights(filteredFlights);
  }

  showAllFlights(){
    this.showFlights(this._allFlightsData);
  }

  showFlights(flightsData){
   const flightsContainer = document.querySelector('.extra-column');
   flightsContainer.innerHTML = "";
    if (flightsData.length === 0) {
      flightsContainer.innerHTML = "<p>No flights found for the selected criteria.</p>";
      return;
    }
   this.flights = []
    for (const flightData of flightsData) {
      const flight =new FlightBarFlight(flightData)
      this.flights.push(flight);
      flightsContainer.appendChild(flight.element)
    }
  }
}
