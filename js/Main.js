import {getFlightsForMonth} from "./api";

import {Controller} from "./Controller";
export let flights = [];
export let workPeriods = []; //todo

const controller = Controller.instance;

export function startCalendar() {
  controller.start();
}

export async function initializeFlights() {
  flights = await getFlightsForMonth();
}
