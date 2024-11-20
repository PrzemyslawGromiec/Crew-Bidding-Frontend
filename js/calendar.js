import {getFlightsForMonth} from "./api";
import {getSelectedPeriodId, selectPeriod, setSelectedPeriodId, updateFlights} from "./load-sidebar";
import {displayFlights, initializePeriodRadioButtons} from "./flight-card";


class DayType {
  static EMPTY = 'empty';
  static MONTH = 'month';
  static EXTRA = 'extra';
}


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

class Time{

  constructor() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    this.nextMonth = (currentMonth + 1) % 12;
    this.nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const firstDayOfMonth = new Date(this.nextMonthYear, this.nextMonth, 1);
    this.dayOfWeek = firstDayOfMonth.getDay();
    this.dayOfWeek = this.dayOfWeek === 0 ? 7 : this.dayOfWeek;
    this.extraMonth = (currentMonth + 2) % 12;
    this.extraMonthYear = this.extraMonth < currentMonth ? currentYear + 1 : currentYear;
    this.daysInMonth = new Date(this.nextMonthYear, this.nextMonth + 1, 0).getDate();
  }
}

class Day{

  constructor(number) {
    this.daysContainer = document.querySelector('.days-container');
    this.number = number;
    this.selected = false;
    this.hovered = false;
    this.element = null;
  }

  attachToDom() {
    throw new Error('Class must implement this function.');
  }


  hoverStart(){
    if(this.hovered){
      return;
    }
    if(this.selected ){
      this.hoverEffectSelected();
    }else{
      this.hoverEffectNonSelected();
    }
  }

  hoverEffectSelected() {
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

    this.element.innerHTML = '';
    this.element.appendChild(trashIcon);

    trashIcon.addEventListener('click', function () {
      deletePeriod(this.element.getAttribute('data-group-id'));
    });
  }

  hoverEffectNonSelected(){
    this.hovered = true;
    this.element.classList.add('held-down');
    this.element.innerHTML = '';
    const emojiContainer = createEmojiContainer(this.element);
    this.element.appendChild(emojiContainer);
  }

  hoverLeave(){

  }

  select(){

  }

}

class EmptyDay extends Day{

  constructor() {
    super(0);
  }

  attachToDom() {
      this.element = document.createElement('div');
      this.element.classList.add('day');
      this.daysContainer.appendChild(this.element);
    }
}

class MonthDay extends Day{

  constructor(number) {
    super(number);
  }


  attachToDom() {
    this.element = document.createElement('div');
    this.element.classList.add('day');
    this.daysContainer.appendChild(this.element);
    this.element.textContent = this.number.toString();
    this.element.setAttribute('data-day', this.number.toString());
    this.element.setAttribute('data-month', time.nextMonth.toString());
    this.element.setAttribute('data-year', time.nextMonthYear.toString());
    controller.addDayListeners(this);
  }
}

class ExtraDay extends Day{

  constructor(number) {
    super(number);
  }

  attachToDom() {
    this.element = document.createElement('div');
    this.element.classList.add('day', 'next-month-day');
    this.element.textContent = this.number.toString();
    this.element.style.opacity = '0.5';
    this.element.setAttribute('data-day', this.number.toString());
    this.element.setAttribute('data-month', time.extraMonth.toString());
    this.element.setAttribute('data-year', time.extraMonthYear.toString());
    this.daysContainer.appendChild(this.element);
    controller.addExtraDaysListeners(this.element);
  }
}

class Calendar{

  constructor() {
    this.days = []
  }

  createEmpty() {
    return new EmptyDay();
  }

  monthCurrent(number){
    return new MonthDay(number);
  }

  createExtra(number){
    return new ExtraDay(number);
  }

  createDays(daysByType) {
    for (let [key, value] of daysByType) {
      for (let i = 0; i < value; i++) {
        let day;
        switch (key){
          case DayType.EMPTY:
           day = this.createEmpty();
            break;
          case DayType.MONTH:
            day = this.monthCurrent(i+1);
            break;
          case DayType.EXTRA:
            day = this.createExtra(i+1);
            break;
        }
        this.days.push(day);
      }
    }
  }

  attachAll(){
    for (const day of this.days) {
      day.attachToDom();
    }
  }
}

class Controller{

  constructor() {
    this.isSelecting = false;
    this.startDayElement = null;
    this.selectedColor = '';
    this.firstSelectedElement = null;
    this.lastHoveredElement = null;
  }

  addDayListeners(day){
    const dayElement = day.element;

    dayElement.addEventListener('mouseenter', () => {
      day.hoverStart();
      if(!day.selected && this.isSelecting && this.startDayElement ){
        this.lastHoveredElement = dayElement;
        updateSelection();
      }
    });

    dayElement.addEventListener('mouseleave', () => {
      if (dayElement.classList.contains('final-selection')) {
        dayElement.textContent = dayElement.getAttribute('data-day');
      } else if (!this.isSelecting && dayElement !== this.firstSelectedElement) {
        dayElement.textContent = day.number.toString();
        dayElement.classList.remove('held-down');
      }
    });

    dayElement.addEventListener('mousedown', () => {
      if (!dayElement.classList.contains('final-selection')) {
        this.isSelecting = true;
        this.startDayElement = dayElement;
        this.firstSelectedElement = dayElement;
        this.lastHoveredElement = dayElement;
        if (this.selectedColor === 'work-selected') {
          dayElement.classList.add('temporary-work');
        }
      }
    });

    dayElement.addEventListener('mouseup', () => {
      if (this.isSelecting) {
        applyFinalSelection();
        this.isSelecting = false;
        this.startDayElement = null;
        clearTemporarySelection();
      }

      if (this.firstSelectedElement) {
        this.firstSelectedElement.textContent = this.firstSelectedElement.getAttribute('data-day');
        this.firstSelectedElement.classList.remove('held-down');
        this.firstSelectedElement = null;
      }
    });
  }

  addExtraDaysListeners(dayElement){
    dayElement.addEventListener('mouseenter', () => {
      if (dayElement.classList.contains('final-selection')) {
        showDeleteIcon(dayElement);
      }
      if (controller.isSelecting && controller.startDayElement) {
        controller.lastHoveredElement = dayElement;
        updateSelection();
      }
    });

    dayElement.addEventListener('mouseleave', () => {
      if (dayElement.classList.contains('final-selection')) {
        dayElement.textContent = dayElement.getAttribute('data-day');
      } else if (!controller.isSelecting && dayElement !== controller.firstSelectedElement) {
        dayElement.textContent = dayElement.getAttribute('data-day');
        dayElement.classList.remove('held-down');
      }
    });

    dayElement.addEventListener('mouseup', () => {
      if (controller.isSelecting) {
        applyFinalSelection();
        controller.isSelecting = false;
        controller.startDayElement = null;
        clearTemporarySelection();
      }

      /*    if (firstSelectedElement) {
            firstSelectedElement.textContent = firstSelectedElement.getAttribute('data-day');
            firstSelectedElement.classList.remove('held-down');
            firstSelectedElement = null;
          }*/
    });
  }

}



let currentGroupId = 0;

export let flights = [];
export let workPeriods = [];
export let offPeriods = [];

const time = new Time();
const controller = new Controller();
const calendar = new Calendar();

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function setupHeader() {
  const header = document.querySelector('.header');
  header.innerHTML = '';
  header.textContent = `${monthNames[time.nextMonth].toUpperCase()} ${time.nextMonthYear}`;
}



function howManyDaysByType(){
  const emptyCount = time.dayOfWeek - 1;
  const monthCount = time.daysInMonth;
  const totalCells =emptyCount + monthCount;
  const extraDaysNeeded = (7 - (totalCells % 7)) % 7;
  const extraCount = extraDaysNeeded + 7;
  const result = new Map();
  result.set(DayType.EMPTY,emptyCount );
  result.set(DayType.MONTH,monthCount );
  result.set(DayType.EXTRA,extraCount );
  return result;
}

function setupDays() {
  const daysContainer = document.querySelector('.days-container');
  daysContainer.innerHTML = '';
  calendar.createDays(howManyDaysByType());
  calendar.attachAll();
}

export function generateCalendar() {
  setupHeader();
  setupDays();
}


function updateSelection() {
  const days = document.querySelectorAll('.day');

  const startDate = new Date(
    parseInt(controller.startDayElement.getAttribute('data-year')),
    parseInt(controller.startDayElement.getAttribute('data-month')),
    parseInt(controller.startDayElement.getAttribute('data-day'))
  );

  const endDate = new Date(
    parseInt(controller.lastHoveredElement.getAttribute('data-year')),
    parseInt(controller.lastHoveredElement.getAttribute('data-month')),
    parseInt(controller.lastHoveredElement.getAttribute('data-day'))
  );

  let [minDate, maxDate] = startDate <= endDate ? [startDate, endDate] : [endDate, startDate];

  days.forEach(day => {
    const dayDate = new Date(
      parseInt(day.getAttribute('data-year')),
      parseInt(day.getAttribute('data-month')),
      parseInt(day.getAttribute('data-day'))
    );

    if (controller.selectedColor === 'work-selected') {
      if (dayDate >= minDate && dayDate <= maxDate) {
        day.classList.add('temporary-work');
      } else if (!day.classList.contains('final-selection')) {
        day.classList.remove('temporary-work');
      }
    }

    if (controller.selectedColor === 'off-selected') {
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
  const selectedPeriod = getSelectedPeriods();

  let conflictingPeriods = controller.selectedColor === 'work-selected' ? offPeriods : workPeriods;
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
  }

  currentGroupId++;
  let periodsToUpdate = controller.selectedColor === 'work-selected' ? workPeriods : offPeriods;
  addNewPeriod(selectedPeriod, periodsToUpdate);

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

function createEmojiContainer(dayElement) {
  const emojiContainer = document.createElement('div');
  emojiContainer.classList.add('emoji-container');

  const emoji1 = document.createElement('span');
  emoji1.textContent = '💼';

  const emoji2 = document.createElement('span');
  emoji2.innerText = '🌴';

  emoji1.addEventListener('mousedown', (event) => {
    const parentDayElement = event.target.closest('.day');
    controller.selectedColor = 'work-selected';
    parentDayElement.classList.add('temporary-work');
    controller.isSelecting = true;

    parentDayElement.innerHTML = '💼';
    controller.firstSelectedElement = parentDayElement;
  });

  emoji2.addEventListener('mousedown', (event) => {
    const parentDayElement = event.target.closest('.day');
    controller.selectedColor = 'off-selected';
    parentDayElement.classList.add('temporary-off');
    controller.isSelecting = true;

    parentDayElement.innerHTML = '🌴';
    controller.firstSelectedElement = parentDayElement;
  });

  emojiContainer.appendChild(emoji1);
  emojiContainer.appendChild(emoji2);
  return emojiContainer;
}
