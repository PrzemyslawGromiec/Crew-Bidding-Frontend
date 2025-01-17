import {PeriodType} from "./PeriodType";
import {DayIcon} from "./DayIcon";
import {Controller} from "./Controller";
import {Common} from "./Common";

export class Day {

  constructor(date) {
    this.daysContainer = document.querySelector('.days-container');
    this.selected = false;
    this.hovered = false;
    this.duty = false;
    this.element = null;
    this.activeIcons = []
    this.date = date;
    this.type = PeriodType.NOT_DEFINED;
  }

  getDayNumber() {
    return this.date.getDate();
  }

  attachToDom() {
    this.attachElement();
    this.addStartingStyle();
  }

  attachElement() {
    throw new Error('Class must implement this function.');
  }

  addStartingStyle() {
    this.element.classList.add('day');
  }

  hoverStart() {
    if (this.hovered) {
      return;
    }
    if (this.duty) {
      this.hoverEffectDuty();
    } else {
      this.hoverEffectNonDuty();
    }
  }

  hoverEffectDuty() {
    this.hovered = true;
    this.element.innerHTML = '';
    this.addTrashIcon();
  }

  hoverEffectNonDuty() {
    this.hovered = true;
    this.element.classList.add('held-down');
    this.element.innerHTML = '';
    this.addSelectionIcons();
  }

  //todo: dodane 08.01
  addSelectionIcons() {
    this.activeIcons.push(new DayIcon(PeriodType.OFF, this, Common.getEmoji("off")));
    this.activeIcons.push(new DayIcon(PeriodType.WORK, this, Common.getEmoji("work")));

    Controller.instance.addDayIconAction(this.activeIcons);
    this.attachIcons();
  }

  //todo: dodane 08.01
  addTrashIcon() {
    const trashIcon = Common.getEmoji("trash");
    this.activeIcons.push(new DayIcon(this.type,this,trashIcon));
    this.attachIcons();

 /*   this.element.appendChild(trashIcon);

    trashIcon.addEventListener('click', function () {
      deletePeriod(this.element.getAttribute('data-group-id'));
    });*/
  }

  attachIcons() {
    //todo add class emoji-container to day div -> dodaje kółko wokoło ikon
    // this.element.classList.add("emoji-container")
    for (const icon of this.activeIcons)
      this.element.appendChild(icon.element);
  }

  removeIcons() {
    this.element.innerHTML = "";
    this.activeIcons = [];
  }

  hoverLeave() {
    this.hovered = false;
    this.element.textContent = this.getDayNumber();
    this.element.classList.remove('held-down');
  }

  select(periodType) {
    if (this.duty) {
      return;
    }
    this.selected = true;
    this.type = periodType;
    this.element.classList.add("selected");
    this.element.classList.add(PeriodType.getClass(this.type));
  }

  unselect() {
    if (this.duty) {
      return;
    }
    this.reset();
  }

  reset() {
    this.selected = false;
    this.element.classList = "";
    this.addStartingStyle();
    this.type = PeriodType.NOT_DEFINED;
  }

  //to make duty must be in selected state

  makeDuty() {
    if (this.duty || !this.selected) {
      return;
    }
    let type = this.type;
    this.reset();
    this.type = type
    this.element.classList.add("duty");
    this.element.classList.add(PeriodType.getClass(type));
    this.duty = true;
  }

  getDate() {
    return this.date;
  }
}
