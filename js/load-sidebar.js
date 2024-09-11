function loadSidebar() {
  fetch('../html/sidebar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('sidebar').innerHTML = data;

      // Dodanie nasłuchiwania na formularz po załadowaniu sidebaru
      const form = document.getElementById('flight-filter-form');
      if (form) {
        form.addEventListener('submit', async function(event) {
          event.preventDefault();

          // Pobieranie danych z formularza
          const aircraftType = document.getElementById('aircraftType').value;
          const reportTime = document.getElementById('reportTime').value;
          const clearTime = document.getElementById('clearTime').value;

          // Przekazanie danych do funkcji pobierającej loty (która jest w flight-card.js)
          fetchFlights(aircraftType, reportTime, clearTime);
        });
      } else {
        console.error('Formularz flight-filter-form nie został załadowany.');
      }
    })
    .catch(error => console.error('Error loading sidebar:', error));
}

document.addEventListener('DOMContentLoaded', loadSidebar);
