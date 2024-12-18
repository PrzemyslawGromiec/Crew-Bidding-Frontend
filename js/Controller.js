import {Calendar} from "./Calendar";

export class Controller {

  constructor() {
    this.isSelecting = false;
  }

  start() {
    this.calendar = new Calendar();
    this.calendar.init();
    this.attachListeners();
  }

  attachListeners(){
    const days = this.calendar.getDays();
    for(const day of days){
      //HOVER -> ew. create icons
      day.element.addEventListener('mouseenter', () => {
        if(this.isSelecting){
          this.calendar.daySelected(day);
        }else{
          this.calendar.dayHovered(day);
          //ustawić działanie ikonek?
        }
      });

      day.element.addEventListener('mouseleave', () => {
        this.calendar.hoverLeave(day);
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
  }


  //todo extra days and icons?
/*
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

      /!*    if (firstSelectedElement) {
            firstSelectedElement.textContent = firstSelectedElement.getAttribute('data-day');
            firstSelectedElement.classList.remove('held-down');
            firstSelectedElement = null;
          }*!/
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
  }*/
}


/*todo plan
* pojawienie się ikonek i podpiecie do nich listenerów -> podobiekty w klasie day?
* select
* */
