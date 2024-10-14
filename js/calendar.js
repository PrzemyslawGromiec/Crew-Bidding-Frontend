// import { DateTime } from 'luxon';
import { getFlights } from './app.js';

let isSelecting = false;
let startDayElement = null;
let selectedColor = '';
let firstSelectedElement = null;
let lastHoveredElement = null;
let currentGroupId = 0;
let nextMonth, nextMonthYear;
export let workPeriods =[];
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export function generateCalendar() {
  const calendarContainer = document.getElementById('calendar');
  const header = document.querySelector('.header');
  const daysContainer = document.querySelector('.days-container');

  header.innerHTML = '';
  daysContainer.innerHTML = '';

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  nextMonth = (currentMonth + 1) % 12;
  nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const firstDayOfMonth = new Date(nextMonthYear, nextMonth, 1);
  let dayOfWeek = firstDayOfMonth.getDay();
  dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  const extraMonth = (currentMonth +2) % 12;
  console.log(extraMonth)
  const extraMonthYear = extraMonth < currentMonth ? currentYear + 1 : currentYear;
  const firstDayOfExtraMonth = new Date(extraMonthYear,extraMonth, 1);
  let dayOfWeekExtraMonth = firstDayOfExtraMonth.getDay();

  header.textContent = `${monthNames[nextMonth].toUpperCase()} ${nextMonthYear}`;
  const daysInMonth = new Date(nextMonthYear, nextMonth + 1, 0).getDate();
  for(let i = 0; i < dayOfWeek-1; i++) {
    const emptyDay = document.createElement('div');
    // dayElement.textContent = "";
    emptyDay.classList.add('day');
    daysContainer.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;
   /* dayElement.setAttribute('data-day', day);
    dayElement.setAttribute('data-month', currentMonth);
    dayElement.setAttribute('data-year', currentYear);*/
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
        hideDeleteIcon(dayElement);
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
    nextMonthDayElement.textContent = nextMonthDay;
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
    }});

    nextMonthDayElement.addEventListener('mouseleave', () => {
      if (nextMonthDayElement.classList.contains('final-selection')) {
        hideDeleteIcon(nextMonthDayElement);
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

      if (firstSelectedElement) {
        firstSelectedElement.textContent = firstSelectedElement.getAttribute('data-day');
        firstSelectedElement.classList.remove('held-down');
        firstSelectedElement = null;
      }
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

//todo:
function applyFinalSelection() {

  currentGroupId++;
  const selectedPeriod = getSelectedPeriods();

  if (selectedPeriod === null) {
    console.error('No days selected for the period');
    return; // Jeśli nie ma zaznaczonych dni, wychodzimy z funkcji
  }

  workPeriods.push({
    startDate: selectedPeriod.startDate,
    endDate: selectedPeriod.endDate,
    groupId: currentGroupId
  });

  // Aktualizujemy style dla zaznaczonych dni
  const days = document.querySelectorAll('.day.temporary-work, .day.temporary-off');
  days.forEach(day => {
    day.classList.remove('temporary-work', 'temporary-off');
    day.classList.add('final-selection');
    day.classList.add(selectedColor);
    day.setAttribute('data-group-id', currentGroupId);
  });

  console.log(workPeriods);
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
      startDate = new Date(dayDate); // Kopiujemy datę
      startDate.setHours(0, 0, 0, 0); // Ustawiamy początek dnia na 00:00:00
    }

    endDate = new Date(dayDate); // Kopiujemy datę
    endDate.setHours(23, 59, 59, 999);
  });
    return {
      startDate: startDate,
      endDate: endDate
    };
}


function clearTemporarySelection() {
  const days = document.querySelectorAll('.day.temporary-highlight');
  days.forEach(day => {
    day.classList.remove('temporary-highlight');
  });
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

function showDeleteIcon(dayElement) {
  dayElement.innerHTML = '';
  const deleteIcon = document.createElement('span');
  deleteIcon.textContent = '🗑️';
  deleteIcon.classList.add('delete-icon');

  deleteIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    deleteDay(dayElement);
  });

  dayElement.appendChild(deleteIcon);
}

function deleteDay(dayElement) {
  dayElement.classList.remove('final-selection', 'work-selected', 'off-selected', 'held-down', 'fixed-size');
  dayElement.removeAttribute('data-group-id');
  dayElement.textContent = dayElement.getAttribute('data-day');
  const deleteIcon = dayElement.querySelector('.delete-icon');

  if (deleteIcon) {
    deleteIcon.remove();
  }

  const workPeriod = getSelectedWorkPeriod();
  updateFlights(workPeriod ? workPeriod.startDate : null, workPeriod ? workPeriod.endDate : null);
}

function hideDeleteIcon(dayElement) {
  const deleteIcon = dayElement.querySelector('.delete-icon');
  if (deleteIcon) {
    deleteIcon.remove();
  }
}

export function deleteGroup(groupId) {
  const days = document.querySelectorAll(`.day[data-group-id="${groupId}"]`);
  days.forEach(day => {
    day.classList.remove('final-selection', 'work-selected', 'off-selected', 'held-down', 'fixed-size');
    day.removeAttribute('data-group-id');
    day.textContent = day.getAttribute('data-day');
    const deleteIcon = day.querySelector('.delete-icon');
    if (deleteIcon) {
      deleteIcon.remove();
    }
  });

  const remainingSelectedDays = document.querySelectorAll('.day.final-selection');
  if (remainingSelectedDays.length === 0) {
    const flightsContainer = document.querySelector('.extra-column');
    flightsContainer.innerHTML = "FLIGHTS";
  }
}

document.getElementById('delete-selected-days').addEventListener('click', () => {
  document.querySelectorAll('.day').forEach(day => {
    day.classList.remove('off-selected', 'work-selected', 'held-down', 'fixed-size', 'final-selection');
    day.textContent = day.getAttribute('data-day');
    day.removeAttribute('data-group-id');
    const deleteIcon = day.querySelector('.delete-confirm');
    if (deleteIcon) {
      deleteIcon.remove();
    }
  });

  const flightsContainer = document.querySelector('.extra-column');
  flightsContainer.innerHTML = "FLIGHTS";
});


export function updateFlights(startDate, endDate, filters = {}) {
  if (startDate && endDate) {
    const reportDate = new Date(startDate);
    const clearDate = new Date(endDate);

    const reportTime = formatDateTimeForCriteria(reportDate);
    const clearTime = formatDateTimeForCriteria(clearDate);

    const criteria = {
      reportTime: reportTime,
      clearTime: clearTime
    };

    if (filters.aircraftType && filters.aircraftType !== '') {
      criteria.aircraftType = filters.aircraftType;
    }

    if (filters.airportCode && filters.airportCode !== '') {
      criteria.airportCode = filters.airportCode;
    }

    console.log('Fetching flights with criteria:', criteria);
    getFlights(criteria);
  } else {
    const flightsContainer = document.querySelector('.extra-column');
    // flightsContainer.innerHTML = "FLIGHTS";
    flightsContainer.innerHTML += `<div>Flights from ${reportTime} to ${clearTime}</div>`;
  }
}

function formatDateTimeForCriteria(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


//todo
export function getSelectedWorkPeriod() {
  const allSelectedWorkDays = document.querySelectorAll('.day.final-selection.work-selected');
  let workDates = [];

  //to musi byc tablicaa przechowujaca okresy

  allSelectedWorkDays.forEach(day => {
    const dayNumber = parseInt(day.getAttribute('data-day'));
    const dayMonth = parseInt(day.getAttribute('data-month'));
    const dayYear = parseInt(day.getAttribute('data-year'));

    const date = new Date(dayYear, dayMonth, dayNumber);
    workDates.push(date);
  });

  console.log(workDates)


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

