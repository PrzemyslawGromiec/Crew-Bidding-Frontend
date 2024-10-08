// flight-card.js

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

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}
