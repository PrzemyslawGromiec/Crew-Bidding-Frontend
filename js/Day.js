import {PeriodType} from "./PeriodType";
import {DayIcon} from "./DayIcon";
import {Controller} from "./Controller";

export class Day {


  /*
    todo day should change color based on current period
    if (this.selectedColor === 'work-selected') {
    dayElement.classList.add('temporary-work');
  }
    */

  constructor(date) {
    this.daysContainer = document.querySelector('.days-container');
    this.selected = false;
    this.hovered = false;
    this.element = null;
    this.activeIcons = []
    this.date = date;
    this.selectionType = PeriodType.NOT_DEFINED;
  }

  getDayNumber() {
    return this.date.getDate();
  }

  getMonthNumber() {
    return this.date.getMonth();
  }

  attachToDom() {
    throw new Error('Class must implement this function.');
  }


  hoverStart() {
    if (this.hovered) {
      return;
    }
    if (this.selected) {
      this.hoverEffectSelected();
    } else {
      this.hoverEffectNonSelected();
    }
  }

  hoverEffectNonSelected() {
    this.hovered = true;
    this.element.classList.add('held-down');
    this.element.innerHTML = '';
    this.addSelectionIcons();
    //todo controller is defined after!! to refactor
   //todo const emojiContainer = controller.createEmojiContainer(this);
   //todo this.element.appendChild(emojiContainer);
  }

  addSelectionIcons() {
    this.activeIcons.push(new DayIcon(PeriodType.OFF,this));
    this.activeIcons.push(new DayIcon(PeriodType.WORK,this));
    Controller.instance.addDayIconAction(this.activeIcons);
    this.attachIcons();
  }

  attachIcons() {
    //todo add class emoji-container to day div -> dodaje kółko wokoło ikon
    // this.element.classList.add("emoji-container")
    for (const icon of this.activeIcons)
      this.element.appendChild(icon.element);
    }

    removeIcons(){
      this.element.innerHTML = "";
      this.activeIcons = [];
    }

  hoverLeave() {
    this.hovered = false;
    this.element.textContent = this.getDayNumber();
    this.element.classList.remove('held-down');
  }

  select(periodType) {
    this.selected = true;
    this.selectionType = periodType;
    this.element.classList.add(PeriodType.getClass(this.selectionType));
  }

  unselect(){
    this.selected = false;
    this.element.classList.remove(PeriodType.getClass(this.selectionType));
    this.selectionType = PeriodType.NOT_DEFINED;
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
}
