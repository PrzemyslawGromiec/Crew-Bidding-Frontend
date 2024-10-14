import { updateFlights, workPeriods} from './calendar.js';

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

  // Funkcja do obsługi zmiany filtrów
  const handleFilterChange = debounce(() => {
    if (workPeriods.length === 0) {
      console.warn('Please select dates in the calendar.');
      document.querySelector('.extra-column').innerHTML = "Please select dates in the calendar.";
      return;
    }

    workPeriods.forEach((period) => {
      console.log('Updating flights for period:', period.startDate, period.endDate);

      const selectedAircraftType = aircraftTypeSelect ? aircraftTypeSelect.value : '';
      const airportCodeValue = airportCode ? airportCode.value.toUpperCase() : '';

      updateFlights(period.startDate, period.endDate, {
        aircraftType: selectedAircraftType,
        airportCode: airportCodeValue
      });
    });
  }, 300);

  // Nasłuchiwanie na zmianę typu samolotu
  if (aircraftTypeSelect) {
    aircraftTypeSelect.addEventListener('change', () => {
      console.log('Aircraft Type changed to:', aircraftTypeSelect.value);
      handleFilterChange();
    });
  } else {
    console.error('Element aircraftTypeSelect nie został znaleziony.');
  }

  // Nasłuchiwanie na zmianę kodu lotniska
  if (airportCode) {
    airportCode.addEventListener('input', () => {
      handleFilterChange();
    });
  } else {
    console.error('Element airportCode nie został znaleziony.');
  }
}



