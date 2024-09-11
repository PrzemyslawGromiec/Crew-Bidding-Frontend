let isSelecting = false;
let startDayElement = null;
let selectedColor = '';
let firstSelectedElement = null;
let lastHoveredElement = null;
let currentGroupId = 0;

function generateCalendar() {
  const calendarContainer = document.getElementById('calendar');
  const header = document.querySelector('.header');
  const daysContainer = document.querySelector('.days-container');

  header.innerHTML = '';
  daysContainer.innerHTML = '';

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const nextMonth = (currentMonth + 1) % 12;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const daysInNextMonth = new Date(nextMonthYear, nextMonth + 1, 0).getDate();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
    const groupId = dayElement.getAttribute('data-group-id');
    deleteGroup(groupId);
  });

  dayElement.appendChild(deleteIcon);
}

function hideDeleteIcon(dayElement) {
  const deleteIcon = dayElement.querySelector('.delete-icon');
  if (deleteIcon) {
    deleteIcon.remove();
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
}

generateCalendar();

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
});



/*
let isSelecting = false;
let startDayElement = null;
let selectedColor = '';
let firstSelectedElement = null;
let lastHoveredElement = null;

function generateCalendar() {
  const calendarContainer = document.getElementById('calendar');
  const header = document.querySelector('.header');
  const daysContainer = document.querySelector('.days-container');

  header.innerHTML = '';
  daysContainer.innerHTML = '';

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const nextMonth = (currentMonth + 1) % 12;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const daysInNextMonth = new Date(nextMonthYear, nextMonth + 1, 0).getDate();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  header.textContent = `${monthNames[nextMonth]} ${nextMonthYear}`;

  for (let day = 1; day <= daysInNextMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;
    dayElement.setAttribute('data-day', day);

    dayElement.addEventListener('mouseenter', () => {
      if (isSelecting && startDayElement) {
        lastHoveredElement = dayElement;
        updateSelection(); // Aktualizuj dynamiczne zaznaczenie
      } else {
        dayElement.classList.add('held-down');
        dayElement.innerHTML = '';
        const emojiContainer = createEmojiContainer(dayElement);
        dayElement.appendChild(emojiContainer);
      }
    });

    dayElement.addEventListener('mousedown', () => {
      isSelecting = true;
      startDayElement = dayElement;
      firstSelectedElement = dayElement;
      lastHoveredElement = dayElement; // Zaczynamy od tego samego elementu
    });

    dayElement.addEventListener('mouseleave', () => {
      if (!isSelecting && dayElement !== firstSelectedElement) {
        dayElement.textContent = day;
        dayElement.classList.remove('held-down');
      }
    });

    dayElement.addEventListener('mouseup', () => {
      if (isSelecting) {
        applyFinalSelection(); // Zastosuj ostateczny wybór
        isSelecting = false;
        startDayElement = null;
        clearTemporarySelection(); // Usuń tylko tymczasowe zaznaczenia
      }

      // Przywróć pierwszy element do pierwotnego stanu
      if (firstSelectedElement) {
        firstSelectedElement.textContent = firstSelectedElement.getAttribute('data-day');
        firstSelectedElement.classList.remove('held-down', 'fixed-size');
        firstSelectedElement = null;
      }
    });

    daysContainer.appendChild(dayElement);
  }

  document.addEventListener('mouseup', () => {
    if (isSelecting) {
      applyFinalSelection(); // Zastosuj ostateczny wybór
      isSelecting = false;
      startDayElement = null;
      clearTemporarySelection(); // Usuń tylko tymczasowe zaznaczenia
    }

    // Przywróć pierwszy element do pierwotnego stanu
    if (firstSelectedElement) {
      firstSelectedElement.textContent = firstSelectedElement.getAttribute('data-day');
      firstSelectedElement.classList.remove('held-down', 'fixed-size');
      firstSelectedElement = null;
    }
  });
}

function updateSelection() {
  const days = document.querySelectorAll('.day');
  let startDay = parseInt(startDayElement.getAttribute('data-day'));
  let endDay = parseInt(lastHoveredElement.getAttribute('data-day'));

  days.forEach(day => {
    let dayNumber = parseInt(day.getAttribute('data-day'));
    if ((dayNumber >= startDay && dayNumber <= endDay) || (dayNumber <= startDay && dayNumber >= endDay)) {
      day.classList.add('temporary-highlight'); // Dodaj tymczasowe zaznaczenie
      day.classList.add(selectedColor); // Ustaw kolor na podstawie wybranego emoji
    } else if (!day.classList.contains('final-selection')) {
      day.classList.remove('temporary-highlight', 'work-selected', 'off-selected'); // Usuń zaznaczenie spoza zakresu, jeśli nie jest ostateczne
    }
  });
}

function applyFinalSelection() {
  const days = document.querySelectorAll('.day.temporary-highlight');
  days.forEach(day => {
    day.classList.add('final-selection'); // Zastosuj ostateczne zaznaczenie
    day.classList.add(selectedColor); // Ustaw odpowiedni kolor na podstawie wybranego emoji
    day.classList.remove('temporary-highlight'); // Usuń tymczasowe
  });
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
    selectedColor = 'work-selected'; // Ustawienie koloru dla wybranego emoji
    parentDayElement.classList.add('work-selected', 'fixed-size');
    isSelecting = true;

    parentDayElement.innerHTML = '💼'; // Tylko wybrane emoji
    firstSelectedElement = parentDayElement; // Zaznacz jako pierwszy element
  });

  emoji2.addEventListener('mousedown', (event) => {
    const parentDayElement = event.target.closest('.day');
    selectedColor = 'off-selected'; // Ustawienie koloru dla wybranego emoji
    parentDayElement.classList.add('off-selected', 'fixed-size');
    isSelecting = true;

    parentDayElement.innerHTML = '🌴'; // Tylko wybrane emoji
    firstSelectedElement = parentDayElement; // Zaznacz jako pierwszy element
  });

  emojiContainer.appendChild(emoji1);
  emojiContainer.appendChild(emoji2);
  return emojiContainer;
}

generateCalendar();

document.getElementById('deleteSelectedDays').addEventListener('click', () => {
  document.querySelectorAll('.day').forEach(day => {
    day.classList.remove('off-selected', 'work-selected', 'held-down', 'fixed-size', 'final-selection');
    day.textContent = day.getAttribute('data-day');
  });
});

*/



//document glowny obiekt reprezentujacy strukture dokumentu HTML
//innerHTML - pozwola na ustawianie lub uzyskiwanie calej zawartosci HTML wewnatrz elementu


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

