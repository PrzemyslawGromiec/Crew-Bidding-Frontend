let isSelecting = false;
let startDayElement = null;
let selectedColor = '';
let firstSelectedElement = null;
let lastHoveredElement = null;
let currentGroupId = 0;
let nextMonth, nextMonthYear;
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function generateCalendar() {
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

  const daysInNextMonth = new Date(nextMonthYear, nextMonth + 1, 0).getDate();

  // const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  header.textContent = `${monthNames[nextMonth]} ${nextMonthYear}`;

  for (let day = 1; day <= daysInNextMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;
    dayElement.setAttribute('data-day', day);

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
}

generateCalendar();

function updateSelection() {
  const days = document.querySelectorAll('.day');
  let startDay = parseInt(startDayElement.getAttribute('data-day'));
  let endDay = parseInt(lastHoveredElement.getAttribute('data-day'));

  days.forEach(day => {
    let dayNumber = parseInt(day.getAttribute('data-day'));
    if ((dayNumber >= startDay && dayNumber <= endDay) || (dayNumber <= startDay && dayNumber >= endDay)) {
      day.classList.add('temporary-highlight');
      day.classList.add(selectedColor);
    } else if (!day.classList.contains('final-selection')){
      day.classList.remove('temporary-highlight', 'work-selected', 'off-selected');
    }
  });
}

function applyFinalSelection() {
  const days = document.querySelectorAll('.day.temporary-highlight');
  currentGroupId++;

  days.forEach(day => {
    day.classList.add('final-selection');
    day.classList.add(selectedColor);
    day.setAttribute('data-group-id', currentGroupId);
    day.classList.remove('temporary-highlight');
  });

  updateFlights();
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
    parentDayElement.classList.add('work-selected');
    isSelecting = true;

    parentDayElement.innerHTML = '💼';
    firstSelectedElement = parentDayElement;
  });

  emoji2.addEventListener('mousedown', (event) => {
    const parentDayElement = event.target.closest('.day');
    selectedColor = 'off-selected';
    parentDayElement.classList.add('off-selected');
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
  const deleteIcon = dayElement.querySelector('.delete-icon')

  if (deleteIcon) {
    deleteIcon.remove();
  }
  updateFlights();
}


function hideDeleteIcon(dayElement) {
  const deleteIcon = dayElement.querySelector('.delete-icon');
  if (deleteIcon) {
    deleteIcon.remove();
  }
}

function updateFlights() {
  const allSelectedWorkDays = document.querySelectorAll('.day.final-selection.work-selected');
  let workDates = [];

  allSelectedWorkDays.forEach(day => {
    const dayNumber = day.getAttribute('data-day');
    const headerText = day.closest('.calendar-container').querySelector('.header').textContent;
    const [monthName, year] = headerText.split(' ');
    const monthIndex = monthNames.indexOf(monthName);

    const date = new Date(year, monthIndex, dayNumber);
    workDates.push(date);
  });

  if (workDates.length > 0) {
    workDates.sort((a, b) => a - b);

    const reportDate = new Date(workDates[0]);
    const clearDate = new Date(workDates[workDates.length - 1]);

    reportDate.setHours(0, 0, 0, 0);
    clearDate.setHours(23, 59, 0, 0);

    const reportTime = formatDateTimeForCriteria(reportDate);
    const clearTime = formatDateTimeForCriteria(clearDate);

    const aircraftTypeSelect = document.getElementById('aircraftType');
    const selectedAircraftType = aircraftTypeSelect ? aircraftTypeSelect.value : '';

    const criteria = {
      reportTime: reportTime,
      clearTime: clearTime
    };

    if (selectedAircraftType && selectedAircraftType !== '') {
      criteria.aircraftType = selectedAircraftType;
    }

    getFlights(criteria);
  } else {
    const flightsContainer = document.querySelector('.extra-column');
    flightsContainer.innerHTML = "FLIGHTS";
  }
}


function deleteGroup(groupId) {
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

function formatDateTimeForCriteria(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące od 0 do 11
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
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
  *
  *
  * */

