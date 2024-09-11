function loadSidebar() {
  fetch('../html/sidebar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('sidebar').innerHTML = data;

      const form = document.getElementById('flight-filter-form');
      if (form) {
        form.addEventListener('submit', async function(event) {
          event.preventDefault();

          const aircraftType = document.getElementById('aircraftType').value;
          const reportTime = document.getElementById('reportTime').value;
          const clearTime = document.getElementById('clearTime').value;

          fetchFlights(aircraftType, reportTime, clearTime);
        });
      } else {
        console.error('');
      }
    })
    .catch(error => console.error('Error loading sidebar:', error));
}

document.addEventListener('DOMContentLoaded', loadSidebar);
