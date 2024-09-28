async function fetchFlights(aircraftType, reportTime, clearTime) {
  try {
    const specificationInput = {
      aircraftType: aircraftType,
      reportTime: reportTime,
      clearTime: clearTime
    };

    const response = await fetch('http://localhost:8080/api/v0/flights/all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(specificationInput)
    });

    console.log('Data being sent:', specificationInput);
    console.log('Response status:', response.status);
    console.log('Response:', response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const flights = await response.json();
    console.log('Received flights:', flights);

    const flightContainer = document.querySelector('.extra-column');
    flightContainer.innerHTML = '';

    flights.forEach(flight => {
      const flightCard = `
        <div class="flight-card">
          <div class="flight-info">
            <h4>Flight ${flight.id}</h4>
            <p>${flight.reportTime} → ${flight.clearTime}</p>
            <p>Aircraft Type: ${flight.aircraftType}</p>
          </div>
          <button class="accept-flight-button">Accept Flight</button>
        </div>`;
      flightContainer.insertAdjacentHTML('beforeend', flightCard);
    });

  } catch (error) {
    console.error("Error fetching flights: ", error);
  }
}
