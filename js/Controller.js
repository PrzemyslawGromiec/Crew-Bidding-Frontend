export class Controller {

  constructor() {
    this.isSelecting = false;
  }

  initCalendar() {
    this.setupHeader();
    this.setupDays();
  }

  setupHeader() {
    const header = document.querySelector('.header');
    header.innerHTML = '';
    header.textContent = `${monthNames[time.nextMonth].toUpperCase()} ${time.nextMonthYear}`;
  }

  setupDays() {
    const daysContainer = document.querySelector('.days-container');
    daysContainer.innerHTML = '';
    calendar.createDays(howManyDaysByType());
    calendar.attachAll();
  }

  addDayListeners(day) {
    const dayElement = day.element;

    // NAJECHANIE
    dayElement.addEventListener('mouseenter', () => {
      if (currentSelection.active) {
        currentSelection.updateSelection(day.date);
        calendar.updateSelected(currentSelection);
      }else{
        day.hoverStart();
      }
    });

    dayElement.addEventListener('mouseleave', () => {
      day.hoverLeave();
      /* if (dayElement.classList.contains('final-selection')) {
         dayElement.textContent = dayElement.getAttribute('data-day');
       } else if (!this.isSelecting && dayElement !== this.firstSelectedElement) {
         dayElement.textContent =this.getDayNumber();
         dayElement.classList.remove('held-down');
       }*/
    });

    /*  dayElement.addEventListener('mouseup', () => {
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
      });*/
  }

  addExtraDaysListeners(dayElement) {
    dayElement.addEventListener('mouseenter', () => {
      if (dayElement.classList.contains('final-selection')) {
        showDeleteIcon(dayElement);
      }
      if (controller.isSelecting && controller.startDayElement) {
        controller.lastHoveredElement = dayElement;
        //todo update selection call
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
      if (currentSelection.active) {
        calendar.finishSelection();
        // applyFinalSelection();
        // clearTemporarySelection();
      }

      /*    if (firstSelectedElement) {
            firstSelectedElement.textContent = firstSelectedElement.getAttribute('data-day');
            firstSelectedElement.classList.remove('held-down');
            firstSelectedElement = null;
          }*/
    });
  }


  createEmojiContainer(day) {
    const dayElement = day.element;
    const emojiContainer = document.createElement('div');
    emojiContainer.classList.add('emoji-container');

    const emoji1 = document.createElement('span');
    emoji1.textContent = '💼';

    const emoji2 = document.createElement('span');
    emoji2.innerText = '🌴';

    emoji1.addEventListener('mousedown', (event) => {
      console.log('mousedown - starting new selection for work')
      this.isSelecting = true;
      day.select(PeriodType.WORK);//skoro robimy na sekcji to nie musimy docelowo bezposrednio na dniu - może przez kalendarz?
      currentSelection.startNewSelection(day.date, PeriodType.WORK); //todo update


      const parentDayElement = event.target.closest('.day');
      parentDayElement.innerHTML = '💼';
    });

    emoji2.addEventListener('mousedown', (event) => {
      console.log('mousedown - starting new selection for work')
      this.isSelecting = true;
      day.select(PeriodType.OFF);
      currentSelection.startNewSelection(day.date, PeriodType.OFF);
      const parentDayElement = event.target.closest('.day');

      parentDayElement.innerHTML = '🌴';
    });

    emojiContainer.appendChild(emoji1);
    emojiContainer.appendChild(emoji2);
    return emojiContainer;
  }
}
