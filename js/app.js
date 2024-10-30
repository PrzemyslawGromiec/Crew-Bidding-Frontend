// app.js
import '../css/calendar.css';
import '../css/web-crew.css';
import '../css/buttons.css';
import '../css/sidebar.css';
import '../css/flight-card.css';

import { generateCalendar, initializeFlights } from './calendar.js';
import loadSidebar from './load-sidebar.js';
import { getFlights, sendPeriod } from './api.js';

generateCalendar();
loadSidebar();
initializeFlights();


// document.addEventListener('DOMContentLoaded', () => {
//   generateCalendar();
//   loadSidebar();
// });

export { getFlights, sendPeriod };
