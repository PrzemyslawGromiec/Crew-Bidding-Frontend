import { workPeriods, flights } from './Main.js';
import { displayFlights } from "./flight-card";
export let selectedPeriodIndex = null;
export let selectedPeriodId = null;

let aircraftTypeSelect;
let airportCode;

export function setSelectedPeriodIndex(index) {
  selectedPeriodIndex = index;
}

export function getSelectedPeriodIndex() {
  return selectedPeriodIndex;
}

export function setSelectedPeriodId(id) {
  selectedPeriodId = id;
}

export function getSelectedPeriodId() {
  return selectedPeriodId;
}

export default function loadSidebar() {
  fetch('html/sidebar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('sidebar').innerHTML = data;
      initializeSidebarEventListeners();
    })
    .catch(error => console.error('Error loading sidebar:', error));
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/*export const handleFilterChange = debounce(() => {
  if (selectedPeriodIndex === null || !workPeriods[selectedPeriodIndex]) {
    document.querySelector('.extra-column').innerHTML = "Please select dates in the calendar.";
    displayFlights([]);
    return;
  }

  const selectedPeriod = workPeriods[selectedPeriodIndex];
  console.log('Updating flights for period:', selectedPeriod.start, selectedPeriod.end);

  let selectedAircraftType = aircraftTypeSelect ? aircraftTypeSelect.value : '';
  const airportCodeValue = airportCode ? airportCode.value.toUpperCase() : '';

  updateFlights(selectedPeriod.start, selectedPeriod.end, {
    aircraftType: selectedAircraftType,
    airportCode: airportCodeValue
  });
}, 300);*/

const handleFilterChange = debounce(() => {
  const period = workPeriods.find(period => period.id === selectedPeriodId);
  if (!period) {
    document.querySelector('.extra-column').innerHTML = "Please select dates in the calendar.";
    displayFlights([]);
    return;
  }

  console.log('Updating flights for period:', period.start, period.end);

  let selectedAircraftType = aircraftTypeSelect ? aircraftTypeSelect.value : '';
  const airportCodeValue = airportCode ? airportCode.value.toUpperCase() : '';

  updateFlights(period.start, period.end, {
    aircraftType: selectedAircraftType,
    airportCode: airportCodeValue
  });
}, 300);


function initializeSidebarEventListeners() {
  aircraftTypeSelect = document.getElementById('aircraftType');
  airportCode = document.getElementById('airportCode');

  if (aircraftTypeSelect) {
    aircraftTypeSelect.addEventListener('change', () => {
      console.log('Aircraft Type changed to:', aircraftTypeSelect.value);
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

