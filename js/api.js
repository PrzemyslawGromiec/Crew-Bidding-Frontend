// api.js
const DOMAIN = "http://localhost:8080/";

export async function getFlights(criteria) {
  try {
    const params = new URLSearchParams(criteria);
    const url = `${DOMAIN}api/v0/flights?${params}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Received flights:', data);

    const { displayFlights } = await import('./flight-card.js');
    displayFlights(data);
  } catch (error) {
    console.error('Error fetching flights:', error);
  }
}
