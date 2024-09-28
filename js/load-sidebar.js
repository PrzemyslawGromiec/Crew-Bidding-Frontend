function loadSidebar() {
  fetch('../html/sidebar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('sidebar').innerHTML = data;
      initializeSidebarEventListeners();

    })
    .catch(error => console.error('Error loading sidebar:', error));
}

function initializeSidebarEventListeners() {
  const aircraftTypeSelect = document.getElementById('aircraftType');

  aircraftTypeSelect.addEventListener('change', () => {
    updateFlights();
  });
}

document.addEventListener('DOMContentLoaded', loadSidebar);
