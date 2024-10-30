import { workPeriods, flights} from './calendar.js';
import {slideMin} from './range-slider';
import {displayFlights} from "./flight-card";

export default function loadSidebar() {
  fetch('html/sidebar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('sidebar').innerHTML = data;
      initializeSidebarEventListeners();
    })
    .catch(error => console.error('Error loading sidebar:', error));
}

function initializeSidebarEventListeners() {
  const aircraftTypeSelect = document.getElementById('aircraftType');
  const airportCode = document.getElementById('airportCode');

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const handleFilterChange = debounce(() => {
    if (workPeriods.length === 0) {
      console.warn('Please select dates in the calendar.');
      document.querySelector('.extra-column').innerHTML = "Please select dates in the calendar.";
      return;
    }

    workPeriods.forEach((period) => {
      console.log('Updating flights for period:', period.startDate, period.endDate);

      let selectedAircraftType = aircraftTypeSelect ? aircraftTypeSelect.value : '';
      const airportCodeValue = airportCode ? airportCode.value.toUpperCase() : '';

      if (selectedAircraftType === '') {
        updateFlights(period.startDate, period.endDate);
      }

      updateFlights(period.startDate, period.endDate, {
        aircraftType: selectedAircraftType,
        airportCode: airportCodeValue
      });
    });
  }, 300);

  if (aircraftTypeSelect) {
    aircraftTypeSelect.addEventListener('change', () => {
      console.log('Aircraft Type changed to:', aircraftTypeSelect.value);
      handleFilterChange();
    });
  } else {
    console.error('');
  }

  if (airportCode) {
    airportCode.addEventListener('input', () => {
      handleFilterChange();
    });
  } else {
    console.error('Element airportCode nie został znaleziony.');
  }
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

    console.log('updateFlights function:', filteredFlights.length);
    displayFlights(filteredFlights);
    console.log(filteredFlights);
  } else {
    console.warn('Missing startDate or endDate');
  }
}



