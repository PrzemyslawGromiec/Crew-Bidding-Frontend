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

  getSelectableTypes(){
    return PeriodType.getAll()
  }

  canStartSelection(){
    return true
  }

  getDefaultText(){
    return ""
  }


  getDayNumber() {
    return this.date.getDate();
  }

  attachToDom() {
    this.attachElement();
    this.element.textContent = this.getDefaultText()
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
    if (!this.canStartSelection()) {
      return
    }
    this.hovered = true;
    console.log('is hovered? ' + this.hovered)
    this.element.classList.add('held-down');
    this.element.innerHTML = '';
    this.addSelectionIcons();
  }

  addSelectionIcons() {
    this.activeIcons.push(new DayIcon( this, Common.getEmoji("off"),PeriodType.OFF));
    this.activeIcons.push(new DayIcon(this, Common.getEmoji("work"),PeriodType.WORK));

    Controller.instance.addSelectionIconAction(this.activeIcons);
    this.attachIcons();
  }

  addTrashIcon() {
    const trashEmoji = Common.getEmoji("trash");
    const trashIcon = new DayIcon(this,trashEmoji);
    this.activeIcons.push(trashIcon);
    Controller.instance.addTrashIconAction(trashIcon)
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
    this.element.textContent = this.getDefaultText()
  }

  hoverLeave() {
    this.hovered = false;
    this.element.classList.remove('held-down');
    this.element.textContent = this.getDefaultText()
  }

  select(periodType) {
    if (!this.getSelectableTypes().includes(periodType)) {
      return;
    }
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
    this.resetDay();
  }

  resetDay() {
    this.selected = false;
    this.duty = false
    this.element.classList = "";
    this.addStartingStyle();
    this.type = PeriodType.NOT_DEFINED;
    this.element.textContent = this.getDefaultText()
  }

  makeDuty() {
    if (this.duty || !this.selected) {
      return;
    }
    let type = this.type;
    this.resetDay();
    this.type = type
    this.element.classList.add("duty");
    this.element.classList.add(PeriodType.getClass(type));
    this.duty = true;
  }

  getDate() {
    return this.date;
  }
}
