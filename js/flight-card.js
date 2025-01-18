// flight-card.js
import {flights} from './Main.js';
import {selectPeriod} from './load-sidebar';

export function createFlightCard(flight) {
  const card = document.createElement('div');
  card.classList.add('flight-card');
  card.setAttribute('tabindex', '0');

  card.innerHTML = `
    <div class="flight-card-content">
      <h3 class="flight-number">${flight.flightNumber}</h3>
      <p class="airport-code"> ${flight.airportCode}</p>
    </div>
    <div class="flight-card-tooltip">
      <p><strong>AIRCRAFT:</strong> ${flight.aircraftType}</p>
      <p><strong>REPORT:</strong><br> ${formatDateTime(flight.reportTime)}</p>
      <p><strong>CLEAR:</strong><br> ${formatDateTime(flight.clearTime)}</p>
    </div>
  `;

  card.addEventListener('mouseenter', () => {
    const tooltip = card.querySelector('.flight-card-tooltip');
    const tooltipRect = tooltip.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    if (cardRect.top - tooltipRect.height - 10 < 0) {
      tooltip.classList.remove('tooltip-top');
    } else {
      tooltip.classList.add('tooltip-top');
    }

    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
  });

  card.addEventListener('mouseleave', () => {
    const tooltip = card.querySelector('.flight-card-tooltip');
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
  });

  return card;
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

export function initializePeriodRadioButtons(workPeriods) {
  const radioInputContainer = document.querySelector('.radio-input');
  radioInputContainer.innerHTML = '';

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('periods-title');
  titleDiv.innerHTML = '<p class="periods">SELECT PERIOD</p>';

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('radio-buttons-container');

  if (workPeriods.length === 0) {
    buttonsDiv.innerHTML = '<p>No periods available</p>';
  } else {
    workPeriods.forEach((period, index) => {
      const radioButton = createPeriodRadioButton(period, index);
      buttonsDiv.appendChild(radioButton);
    });
  }

  radioInputContainer.appendChild(titleDiv);
  radioInputContainer.appendChild(buttonsDiv);
}

function createPeriodRadioButton(period, index) {
  const label = document.createElement('label');
  label.classList.add('label');

  const input = document.createElement('input');
  input.type = 'radio';
  input.name = 'periodRadio';
  input.value = index;

  input.addEventListener('change', () => {
    selectPeriod(index);
  });

  const span = document.createElement('span');
  span.classList.add('check');

  label.appendChild(input);
  label.appendChild(span);

  return label;
}

function handlePeriodSelection(period) {
  displayFlightsForPeriod(period);
}

export function displayFlightsForPeriod(period) {

  const filteredFlights = flights.filter(flight => {
    const flightReportTime = new Date(flight.reportTime);
    const flightClearTime = new Date(flight.clearTime);

    return flightReportTime >= period.start && flightClearTime <= period.end;
  });

  displayFlights(filteredFlights);
}

export function displayFlights(flights) {
  const flightsContainer = document.querySelector('.extra-column');
  flightsContainer.innerHTML = "";

  if (flights.length === 0) {
    flightsContainer.innerHTML = "<p>No flights found for the selected criteria.</p>";
    return;
  }

  flights.forEach(flight => {
    const flightCard = createFlightCard(flight);
    flightsContainer.appendChild(flightCard);
  });
}
