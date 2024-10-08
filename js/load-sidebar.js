import { updateFlights } from './calendar.js';

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
  const minTimeSlider = document.getElementById('minTimeSlider');
  const airportCode = document.getElementById('airportCode');
  const sliderValue = document.getElementById('slider-value');


  if (aircraftTypeSelect) {
    aircraftTypeSelect.addEventListener('change', updateFlights);
  } else {
    console.error('Element aircraftTypeSelect nie został znaleziony.');
  }
  if (minTimeSlider) {
    minTimeSlider.addEventListener('input', () => {
      sliderValue.textContent = `${minTimeSlider.value} hours`;
      updateFlights();
    });
  }else {
    console.error('Element minTimeSlider nie został znaleziony.');
  }

  if (airportCode) {
    airportCode.addEventListener('input', updateFlights);
  } else {
    console.error('Element airportCode nie został znaleziony.');
  }
}

