import {PeriodType} from "./PeriodType";

export class DayIcon{

  constructor(periodType,day) {
    this.element = document.createElement('span');
    this.periodType = periodType;
    this.day = day;
    this.element.textContent = PeriodType.getEmojiFor(periodType);
  }

  show() {
  /*  emoji1.addEventListener('mousedown', (event) => {
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
    });*/

  }
}
