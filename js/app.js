// app.js
import '../css/calendar.css';
import '../css/web-crew.css';
import '../css/buttons.css';
import '../css/sidebar.css';
import '../css/flight-card.css';

import { startCalendar, initializeFlights } from './Main.js';
import loadSidebar from './load-sidebar.js';
import { getFlights, sendPeriod } from './api.js';


startCalendar();
loadSidebar();
// initializeFlights();


// document.addEventListener('DOMContentLoaded', () => {
//   generateCalendar();
//   loadSidebar();
// });

export { getFlights, sendPeriod };
