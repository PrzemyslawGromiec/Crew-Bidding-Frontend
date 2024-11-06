const DOMAIN = "http://localhost:8080/";
export let originalFlights = [];

export async function getFlightsForMonth(criteria) {
  try {
    const params = new URLSearchParams(criteria);
    const url = `${DOMAIN}api/v0/flights?${params}`;

    if (originalFlights.length > 0) {
      return originalFlights;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    originalFlights = [...data];
    return originalFlights;
  } catch (error) {
    console.error(error);
    return [];
  }
}

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

    return data;
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
}

export async function sendPeriod(reportId, period) {

  const event = {
    startTime: period.startDate.toISOString(),
    endTime: period.endDate.toISOString(),
    stars: 3
  };

  try {
    const response = await fetch(`http://localhost:8080/api/v0/reports/${reportId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      throw new Error(`Failed to send period! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully sent period:', data);
    return data;
  } catch (error) {
    console.error('Error sending period:', error);
  }
}
