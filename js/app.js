// app.js
import '../css/calendar.css';
import '../css/web-crew.css';
import '../css/buttons.css';
import '../css/sidebar.css';
import '../css/flight-card.css';

import { startCalendar, initializeFlights } from './Main.js';
import loadSidebar from './load-sidebar.js';
import { getFlights, sendPeriod } from './api.js';
// import {FlightBar} from "./FlightBar";

startCalendar();
loadSidebar();
initializeFlights();

export { getFlights, sendPeriod};
