import {getFlightsForMonth} from "./api";

import {Controller} from "./Controller";

/*
* Interakcje:
* - podświetlenie pustego dnia
* - zaznaczanie perioda
* - zatwierdzanie perioda
* - kasowanie perioda
*
* - listener elementu -> Controller -> Calendar -> Periody -> Day
* hierarchia aplikacji
* */


export let flights = [];
export let workPeriods = []; //todo

const controller = new Controller();

export function startCalendar() {
  controller.start();
}

export async function initializeFlights() {
  flights = await getFlightsForMonth();
}


