import { workPeriods, flights } from './Main.js';
export let selectedPeriodId = null;

let aircraftTypeSelect;
let airportCode;

function initializeSidebarEventListeners() {
  aircraftTypeSelect = document.getElementById('aircraftType');
  airportCode = document.getElementById('airportCode');

  if (aircraftTypeSelect) {
    aircraftTypeSelect.addEventListener('change', () => {
      handleFilterChange();
    });
  } else {
    console.error('Aircraft type select element not found.');
  }

  if (airportCode) {
    airportCode.addEventListener('input', () => {
      handleFilterChange();
    });
  } else {
    console.error('Airport code input element not found.');
  }
}

/*export function selectPeriod(index) {
  if (index === null || !workPeriods[index]) {
    selectedPeriodIndex = null;
    displayFlights([]);
    return;
  }

  setSelectedPeriodIndex(index);
  handleFilterChange();
}*/

export function selectPeriod(index) {
  const period = workPeriods[index];
  if (!period) {
    setSelectedPeriodId(null);
    displayFlights([]);
    return;
  }

  setSelectedPeriodId(period.id);
  console.log(`Selected period id: ${period.id}`);
  handleFilterChange();
}

export function updateFlights(startDate, endDate, filters = {}) {
  if (startDate && endDate) {
    const reportTime = new Date(startDate);
    const clearTime = new Date(endDate);

    const filteredFlights = flights.filter(flight => {
      const flightReportTime = new Date(flight.reportTime);
      const flightClearTime = new Date(flight.clearTime);

      const isWithinDateRange = flightReportTime >= reportTime && flightClearTime <= clearTime;
      const matchesAircraftType = filters.aircraftType ? flight.aircraftType === filters.aircraftType : true;
      const matchesAirportCode = filters.airportCode ? flight.airportCode === filters.airportCode : true;

      return isWithinDateRange && matchesAircraftType && matchesAirportCode;
    });

    displayFlights(filteredFlights);
  } else {
    console.warn('Missing startDate or endDate');
  }
}

