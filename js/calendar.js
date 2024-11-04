import {getFlightsForMonth} from "./api";
import {updateFlights} from "./load-sidebar";

let isSelecting = false;
let startDayElement = null;
let selectedColor = '';
let firstSelectedElement = null;
let lastHoveredElement = null;
let currentGroupId = 0;
let nextMonth, nextMonthYear;
export let flights = [];
export let workPeriods = [];
export let offPeriods = [];
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];


class Period {

  constructor(start, end, id) {
    this.start = new Date(start.setHours(0, 0, 0, 0));
    this.end = new Date(end.setHours(23, 59, 59, 999));
    this.id = id;
  }

  isInPeriod(date) {
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0));
    return normalizedDate >= this.start && normalizedDate <= this.end;
  }

}


export function generateCalendar() {
  document.getElementById('calendar');
  const header = document.querySelector('.header');
  const daysContainer = document.querySelector('.days-container');

  header.innerHTML = '';
  daysContainer.innerHTML = '';

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const tooltip = document.getElementById('tooltip');

  nextMonth = (currentMonth + 1) % 12;
  nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const firstDayOfMonth = new Date(nextMonthYear, nextMonth, 1);
  let dayOfWeek = firstDayOfMonth.getDay();
  dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  const extraMonth = (currentMonth + 2) % 12;
  const extraMonthYear = extraMonth < currentMonth ? currentYear + 1 : currentYear;
  const firstDayOfExtraMonth = new Date(extraMonthYear, extraMonth, 1);
  firstDayOfExtraMonth.getDay();

  header.textContent = `${monthNames[nextMonth].toUpperCase()} ${nextMonthYear}`;
  const daysInMonth = new Date(nextMonthYear, nextMonth + 1, 0).getDate();
  for (let i = 0; i < dayOfWeek - 1; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.classList.add('day');
    daysContainer.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;
    dayElement.setAttribute('data-day', day);
    dayElement.setAttribute('data-month', nextMonth);
    dayElement.setAttribute('data-year', nextMonthYear);

    dayElement.addEventListener('mouseenter', () => {
      if (dayElement.classList.contains('final-selection')) {
        showDeleteIcon(dayElement);
      } else if (isSelecting && startDayElement) {
        lastHoveredElement = dayElement;
        updateSelection();
      } else {
        dayElement.classList.add('held-down');
        dayElement.innerHTML = '';
        const emojiContainer = createEmojiContainer(dayElement);
        dayElement.appendChild(emojiContainer);
      }
    });

    dayElement.addEventListener('mouseleave', () => {
      if (dayElement.classList.contains('final-selection')) {
        dayElement.textContent = dayElement.getAttribute('data-day');
      } else if (!isSelecting && dayElement !== firstSelectedElement) {
        dayElement.textContent = day;
        dayElement.classList.remove('held-down');
      }
    });

    dayElement.addEventListener('mousedown', () => {
      if (!dayElement.classList.contains('final-selection')) {
        isSelecting = true;
        startDayElement = dayElement;
        firstSelectedElement = dayElement;
        lastHoveredElement = dayElement;

        if (selectedColor === 'work-selected') {
          dayElement.classList.add('temporary-work');
        }
      }
    });

    dayElement.addEventListener('mouseup', () => {
      if (isSelecting) {
        applyFinalSelection();
        isSelecting = false;
        startDayElement = null;
        clearTemporarySelection();
      }

      if (firstSelectedElement) {
        firstSelectedElement.textContent = firstSelectedElement.getAttribute('data-day');
        firstSelectedElement.classList.remove('held-down');
        firstSelectedElement = null;
      }
    });

    daysContainer.appendChild(dayElement);
  }
  // Obliczenie liczby komórek, które zostały wypełnione w kalendarzu
  const totalCells = daysContainer.children.length;
  let nextMonthDay = 1;

// Obliczenie liczby brakujących dni do uzupełnienia ostatniego tygodnia i pełnego dodatkowego rzędu
  const extraDaysNeeded = (7 - (totalCells % 7)) % 7;
  const totalExtraDays = extraDaysNeeded + 7; // Liczba dni do dodania (brakujące dni + pełny dodatkowy rząd)

  for (let i = 0; i < totalExtraDays; i++) {
    const nextMonthDayElement = document.createElement('div');
    nextMonthDayElement.classList.add('day', 'next-month-day');
    nextMonthDayElement.textContent = nextMonthDay.toString();
    nextMonthDayElement.style.opacity = '0.5';
    nextMonthDayElement.setAttribute('data-day', nextMonthDay.toString());
    nextMonthDayElement.setAttribute('data-month', extraMonth.toString());
    nextMonthDayElement.setAttribute('data-year', extraMonthYear.toString());

    nextMonthDayElement.addEventListener('mouseenter', () => {
      if (nextMonthDayElement.classList.contains('final-selection')) {
        showDeleteIcon(nextMonthDayElement);
      }
      if (isSelecting && startDayElement) {
        lastHoveredElement = nextMonthDayElement;
        updateSelection();
      }
    });

    nextMonthDayElement.addEventListener('mouseleave', () => {
      if (nextMonthDayElement.classList.contains('final-selection')) {
        nextMonthDayElement.textContent = nextMonthDayElement.getAttribute('data-day');
      } else if (!isSelecting && nextMonthDayElement !== firstSelectedElement) {
        nextMonthDayElement.textContent = nextMonthDayElement.getAttribute('data-day');
        nextMonthDayElement.classList.remove('held-down');
      }
    });

    nextMonthDayElement.addEventListener('mouseup', () => {
      if (isSelecting) {
        applyFinalSelection();
        isSelecting = false;
        startDayElement = null;
        clearTemporarySelection();
      }

      /*    if (firstSelectedElement) {
            firstSelectedElement.textContent = firstSelectedElement.getAttribute('data-day');
            firstSelectedElement.classList.remove('held-down');
            firstSelectedElement = null;
          }*/
    });

    daysContainer.appendChild(nextMonthDayElement);
    nextMonthDay++;
  }
}

function updateSelection() {
  const days = document.querySelectorAll('.day');

  const startDate = new Date(
    parseInt(startDayElement.getAttribute('data-year')),
    parseInt(startDayElement.getAttribute('data-month')),
    parseInt(startDayElement.getAttribute('data-day'))
  );

  const endDate = new Date(
    parseInt(lastHoveredElement.getAttribute('data-year')),
    parseInt(lastHoveredElement.getAttribute('data-month')),
    parseInt(lastHoveredElement.getAttribute('data-day'))
  );

  let [minDate, maxDate] = startDate <= endDate ? [startDate, endDate] : [endDate, startDate];

  days.forEach(day => {
    const dayDate = new Date(
      parseInt(day.getAttribute('data-year')),
      parseInt(day.getAttribute('data-month')),
      parseInt(day.getAttribute('data-day'))
    );

    if (selectedColor === 'work-selected') {
      if (dayDate >= minDate && dayDate <= maxDate) {
        day.classList.add('temporary-work');
      } else if (!day.classList.contains('final-selection')) {
        day.classList.remove('temporary-work');
      }
    }

    if (selectedColor === 'off-selected') {
      if (
        dayDate >= minDate &&
        dayDate <= maxDate &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear()
      ) {
        day.classList.add('temporary-off');
      } else if (!day.classList.contains('final-selection')) {
        day.classList.remove('temporary-off');
      }
    }
  });
}

function applyFinalSelection() {
  currentGroupId++;
  const selectedPeriod = getSelectedPeriods();
  let periodsToUpdate = selectedColor === 'work-selected' ? workPeriods : offPeriods;
  const gapInMillis = 24 * 60 * 60 * 1000;

  addNewPeriod(selectedPeriod, periodsToUpdate);

  //do tego momentu dziala poprawnie
  console.log('wyswietlenie dodawanych periodow:')
  console.log(periodsToUpdate);

  const newPeriods = mergePeriods(periodsToUpdate, gapInMillis);

  if (selectedColor === 'work-selected') {
    workPeriods = newPeriods;
  } else {
    offPeriods = newPeriods;
  }

  updateCalendarDisplay(newPeriods);

  console.log('Updated work periods:', workPeriods);
  console.log('Updated off periods:', offPeriods);

  if (selectedColor === 'work-selected') {
    updateFlights(selectedPeriod.start, selectedPeriod.end);
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

  // Dodaj ostatni okres do `newPeriods`, aby uwzględnić go w wynikach
  newPeriods.push(lastPeriod);

  return newPeriods;
}

function updateCalendarDisplay(newPeriods) {
  updateDaysWithPeriods(newPeriods);
  const days = document.querySelectorAll('.day.temporary-work, .day.temporary-off');
  days.forEach(day => {
    day.classList.remove('temporary-work', 'temporary-off');
    day.classList.add('final-selection');
    day.classList.add(selectedColor);
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


function displayPeriodGroupIds(periods) {
  const days = document.querySelectorAll('.day');

  periods.forEach(period => {
    console.log(`Okres ID: ${period.id} - od ${period.start} do ${period.end}`);

    days.forEach(day => {
      const groupId = day.getAttribute('data-group-id');

      if (parseInt(groupId) === period.id) {
        console.log(`Dzień: ${day.getAttribute('data-day')}, Miesiąc: ${day.getAttribute('data-month')}, Rok: ${day.getAttribute('data-year')}, Group ID: ${groupId}`);
      }
    });
  });
}

function showDeleteIcon(dayElement) {
  const trashIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  trashIcon.setAttribute("width", "40");  // Możesz dostosować szerokość
  trashIcon.setAttribute("height", "40");  // Możesz dostosować wysokość
  trashIcon.setAttribute("viewBox", "0 0 24 24");
  trashIcon.setAttribute("fill", "none");
  trashIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  trashIcon.classList.add('trash-icon');


  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute("clip-rule", "evenodd");
  path.setAttribute("d", "M7.10002 5H3C2.44772 5 2 5.44772 2 6C2 6.55228 2.44772 7 3 7H4.06055L4.88474 20.1871C4.98356 21.7682 6.29471 23 7.8789 23H16.1211C17.7053 23 19.0164 21.7682 19.1153 20.1871L19.9395 7H21C21.5523 7 22 6.55228 22 6C22 5.44772 21.5523 5 21 5H19.0073C19.0018 4.99995 18.9963 4.99995 18.9908 5H16.9C16.4367 2.71776 14.419 1 12 1C9.58104 1 7.56329 2.71776 7.10002 5ZM9.17071 5H14.8293C14.4175 3.83481 13.3062 3 12 3C10.6938 3 9.58254 3.83481 9.17071 5ZM17.9355 7H6.06445L6.88085 20.0624C6.91379 20.5894 7.35084 21 7.8789 21H16.1211C16.6492 21 17.0862 20.5894 17.1192 20.0624L17.9355 7ZM14.279 10.0097C14.83 10.0483 15.2454 10.5261 15.2068 11.0771L14.7883 17.0624C14.7498 17.6134 14.2719 18.0288 13.721 17.9903C13.17 17.9517 12.7546 17.4739 12.7932 16.9229L13.2117 10.9376C13.2502 10.3866 13.7281 9.97122 14.279 10.0097ZM9.721 10.0098C10.2719 9.97125 10.7498 10.3866 10.7883 10.9376L11.2069 16.923C11.2454 17.4739 10.83 17.9518 10.2791 17.9903C9.72811 18.0288 9.25026 17.6134 9.21173 17.0625L8.79319 11.0771C8.75467 10.5262 9.17006 10.0483 9.721 10.0098Z");
  path.setAttribute("fill", "#0F1729");

  trashIcon.appendChild(path);

  dayElement.innerHTML = '';
  dayElement.appendChild(trashIcon);

// Usuń okresy


  trashIcon.addEventListener('click', function () {
    deletePeriod(dayElement.getAttribute('data-group-id'));
  });

}

function deletePeriod(groupId) {
  const daysToRemove = document.querySelectorAll(`.day[data-group-id="${groupId}"]`);

  console.log(`Usuwam dni dla groupId ${groupId}:`, Array.from(daysToRemove).map(day => day.getAttribute('data-day')));
  daysToRemove.forEach(day => {
    console.log('removig day: ' + day.getAttribute('data-group-id'))
    day.classList.remove('final-selection', 'work-selected', 'off-selected', 'held-down');
    day.removeAttribute('data-group-id');
    day.textContent = day.getAttribute('data-day');

    const deleteIcon = day.querySelector('.delete-icon');
    if (deleteIcon) {
      deleteIcon.remove();
    }
  });

  if (selectedColor === 'work-selected') {
    console.log("Przed filtrowaniem:", workPeriods.map(period => period.id));
    workPeriods = workPeriods.filter(period => period.id !== parseInt(groupId));
    console.log("Po filtrowaniem:", workPeriods.map(period => period.id));

  } else {
    offPeriods = offPeriods.filter(period => period.id !== parseInt(groupId));
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

function createEmojiContainer(dayElement) {
  const emojiContainer = document.createElement('div');
  emojiContainer.classList.add('emoji-container');

  const emoji1 = document.createElement('span');
  emoji1.textContent = '💼';

  const emoji2 = document.createElement('span');
  emoji2.innerText = '🌴';

  emoji1.addEventListener('mousedown', (event) => {
    const parentDayElement = event.target.closest('.day');
    selectedColor = 'work-selected';
    parentDayElement.classList.add('temporary-work');
    isSelecting = true;

    parentDayElement.innerHTML = '💼';
    firstSelectedElement = parentDayElement;
  });

  emoji2.addEventListener('mousedown', (event) => {
    const parentDayElement = event.target.closest('.day');
    selectedColor = 'off-selected';
    parentDayElement.classList.add('temporary-off');
    isSelecting = true;

    parentDayElement.innerHTML = '🌴';
    firstSelectedElement = parentDayElement;
  });

  emojiContainer.appendChild(emoji1);
  emojiContainer.appendChild(emoji2);
  return emojiContainer;
}

//todo
export function getSelectedWorkPeriod() {
  const allSelectedWorkDays = document.querySelectorAll('.day.final-selection.work-selected');
  let workDates = [];

  allSelectedWorkDays.forEach(day => {
    const dayNumber = parseInt(day.getAttribute('data-day'));
    const dayMonth = parseInt(day.getAttribute('data-month'));
    const dayYear = parseInt(day.getAttribute('data-year'));

    const date = new Date(dayYear, dayMonth, dayNumber);
    workDates.push(date);
  });

}

/*
* click - klinkniecie przyciskiem na danym elemencie
* dbclikc - podwojne klikniecie
* mousedown - mysz wcisnaka na danym elemencie
* mouseup - zwolnienie przycisku po wczesniejszym wcisnieciu
* mousemove - gdy kursor myszy jest przesuwany nad danym elementem
* mouseenter - kursor wchodzi na obszar danego elementu
* mouseleave - kursor opuszcza obszar danego elementu
* mouseover - kursor porusza sie nad elementem lub jego podrzednym elementem
*
* */

