const DOMAIN = "http://localhost:8080/";

function getFlights(criteria) {
  const params = new URLSearchParams(criteria);

  const url = DOMAIN + "api/v0/flights?" + params.toString();

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayFlights(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


function displayFlights(flights) {
  const flightsContainer = document.querySelector('.extra-column');
  flightsContainer.innerHTML = "";

  flights.forEach(flight => {
    const flightCard = createFlightCard(flight);
    flightsContainer.appendChild(flightCard);
  })
}

function createFlightCard(flight) {
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
      // Brak miejsca powyżej - wyświetlamy tooltip pod kafelkiem
      tooltip.classList.remove('tooltip-top');
    } else {
      // Jest miejsce powyżej - wyświetlamy tooltip nad kafelkiem
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

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const day = String(date.getDate()).padStart(2, '0'); // Dzień z wiodącym zerem
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiąc z wiodącym zerem (miesiące od 0 do 11)
  const year = String(date.getFullYear()).slice(-2); // Ostatnie dwie cyfry roku
  const hours = String(date.getHours()).padStart(2, '0'); // Godziny z wiodącym zerem
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Minuty z wiodącym zerem

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}







