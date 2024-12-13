import {getFlightsForMonth} from "./api";
import {getSelectedPeriodId, selectPeriod, setSelectedPeriodId, updateFlights} from "./load-sidebar";
import {displayFlights, initializePeriodRadioButtons} from "./flight-card";
import {TestClass} from "./my-object";

let currentSelection = new CurrentPeriod();

//modyfikuję gdy:
//zaczynam zaznaczenie (klik down)
//rozciągam zaznaczenie (hover)
//kończe zaznaczenie (klik up)




/*
* Interakcje:
* - podświetlenie pustego dnia
* - zaznaczanie perioda
* - zatwierdzanie perioda
* - kasowanie perioda
*
* - listener elementu -> Controller -> Calendar -> Periody -> Day
*
*
*
*
*
*
*
* */





let currentGroupId = 0;

export let flights = [];
export let workPeriods = [];
export let offPeriods = [];

const time = new Time();
const controller = new Controller();
const main = new Calendar(time);

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];


export function startCalendar() {
  controller.initCalendar();
  let testObject = new TestClass();
}




function howManyDaysByType() {
  const emptyCount = time.dayOfWeek - 1;
  const monthCount = time.daysInMonth;
  const totalCells = emptyCount + monthCount;
  const extraDaysNeeded = (7 - (totalCells % 7)) % 7;
  const extraCount = extraDaysNeeded + 7;
  const result = new Map();
  result.set(DayType.EMPTY, emptyCount);
  result.set(DayType.MONTH, monthCount);
  result.set(DayType.EXTRA, extraCount);
  return result;
}

function applyFinalSelection() {
  const selectedPeriod = getSelectedPeriods();  //wszystkie zaznaczone

  //todo remove if not needed -> CONFLICT approach
 /* let conflictingPeriods = controller.selectedColor === 'work-selected' ? offPeriods : workPeriods;
  let hasConflict = conflictingPeriods.some(period =>
    (selectedPeriod.start <= period.end && selectedPeriod.end >= period.start)
  );

  if (hasConflict) {
    const daysToWarn = document.querySelectorAll('.day.temporary-work, .day.temporary-off');
    daysToWarn.forEach(day => day.classList.add('overlap-warning'));

    setTimeout(() => {
      daysToWarn.forEach(day => {
        day.classList.remove('overlap-warning', 'temporary-work', 'temporary-off');
        day.textContent = day.getAttribute('data-day');
      });
    }, 3000);

    console.log("This period overlaps with another period.");
    return;
  }*/

  //dodać period do zbioru periodów i posortować
 /* currentGroupId++;
  let periodsToUpdate = controller.selectedColor === 'work-selected' ? workPeriods : offPeriods;
  addNewPeriod(selectedPeriod, periodsToUpdate);*/


  //łączymy periody obok siebie razem
  const gapInMillis = 24 * 60 * 60 * 1000;
  const newPeriods = mergePeriods(periodsToUpdate, gapInMillis);

  if (controller.selectedColor === 'work-selected') {
    workPeriods = newPeriods;
  } else {
    offPeriods = newPeriods;
  }

  updateCalendarDisplay(newPeriods);
  console.log('Updated work periods:', workPeriods);
  console.log('Updated off periods:', offPeriods);

  if (controller.selectedColor === 'work-selected') {
    updateFlights(selectedPeriod.start, selectedPeriod.end);
    initializePeriodRadioButtons(workPeriods);
    selectPeriod(workPeriods.length - 1);
  }
}

function addNewPeriod(selectedPeriod, periodsToUpdate) {
  periodsToUpdate.push(selectedPeriod);
  periodsToUpdate.sort((a, b) => a.start - b.start);
}

function mergePeriods(periodsToUpdate, gapInMillis) {
  let newPeriods = [];
  let lastPeriod = periodsToUpdate[0]; // ustawiamy początkowy okres
  let groupId = lastPeriod.id;

  for (let i = 1; i < periodsToUpdate.length; i++) {
    const currentPeriod = periodsToUpdate[i];
    const timeDifferenceToLast = currentPeriod.start - lastPeriod.end;

    if (timeDifferenceToLast <= gapInMillis) {
      // Jeśli przerwa między okresami jest mniejsza niż `gapInMillis`, scalamy okresy
      lastPeriod.end = new Date(Math.max(lastPeriod.end.getTime(), currentPeriod.end));
      lastPeriod.id = groupId;
    } else {
      // Jeśli przerwa jest większa niż `gapInMillis`, dodajemy `lastPeriod` jako nowy, samodzielny okres
      newPeriods.push(lastPeriod);
      lastPeriod = currentPeriod; // ustawiamy `currentPeriod` jako `lastPeriod` do dalszej analizy
      groupId = currentPeriod.id; // przypisujemy nowe `groupId` do nowego okresu
    }
  }

  newPeriods.push(lastPeriod);
  return newPeriods;
}

function updateCalendarDisplay(newPeriods) {
  updateDaysWithPeriods(newPeriods);
  const days = document.querySelectorAll('.day.temporary-work, .day.temporary-off');
  days.forEach(day => {
    day.classList.remove('temporary-work', 'temporary-off');
    day.classList.add('final-selection');
    day.classList.add(controller.selectedColor);
  });
}

function updateDaysWithPeriods(periods) {
  const days = document.querySelectorAll('.day');

  days.forEach(day => {
    const dayDate = new Date(
      parseInt(day.getAttribute('data-year')),
      parseInt(day.getAttribute('data-month')),
      parseInt(day.getAttribute('data-day'))
    );

    let assignedGroupId = 0;
    for (const period of periods) {
      if (period.isInPeriod(dayDate)) {
        assignedGroupId = period.id;
        break;
      }
    }

    day.setAttribute('data-group-id', assignedGroupId.toString());
  });
}

function deletePeriod(groupId) {
  const daysToRemove = document.querySelectorAll(`.day[data-group-id="${groupId}"]`);

  const firstDay = daysToRemove[0];
  let isWorkPeriod = firstDay.classList.contains('work-selected');

  daysToRemove.forEach(day => {
    day.classList.remove('final-selection', 'work-selected', 'off-selected', 'held-down');
    day.removeAttribute('data-group-id');
    day.textContent = day.getAttribute('data-day');
  });

  if (isWorkPeriod) {
    workPeriods = workPeriods.filter(period => period.id !== parseInt(groupId));
  } else {
    offPeriods = offPeriods.filter(period => period.id !== parseInt(groupId));
  }

  console.log('workPeriods after deleting:', workPeriods);
  console.log('offPeriods after deleting:', offPeriods);

  initializePeriodRadioButtons(workPeriods);

  const currentSelectedPeriodId = getSelectedPeriodId();
  if (parseInt(groupId) === currentSelectedPeriodId) {
    if (workPeriods.length > 0) {
      setSelectedPeriodId(workPeriods[0].id);
      selectPeriod(0);
    } else {
      setSelectedPeriodId(null);
      displayFlights([]);
    }
  }
}

export function getSelectedPeriods() {
  const days = document.querySelectorAll('.day.temporary-work, .day.temporary-off');

  if (days.length === 0) {
    return null;
  }
  let startDate = null;
  let endDate = null;

  days.forEach(day => {
    const dayDate = new Date(
      parseInt(day.getAttribute('data-year')),
      parseInt(day.getAttribute('data-month')),
      parseInt(day.getAttribute('data-day'))
    );

    if (startDate === null) {
      startDate = new Date(dayDate);
      //startDate.setHours(6, 0, 1, 0);
    }

    endDate = new Date(dayDate);
    //endDate.setHours(21, 59, 0, 0);

  });
  return new Period(startDate, endDate, currentGroupId);
}

function clearTemporarySelection() {
  const days = document.querySelectorAll('.day.temporary-highlight');
  days.forEach(day => {
    day.classList.remove('temporary-highlight');
  });
}

export async function initializeFlights() {
  flights = await getFlightsForMonth();
}


