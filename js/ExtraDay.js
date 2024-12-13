export class ExtraDay extends Day {

  constructor(date) {
    super(date);
  }

  attachToDom() {
    this.element = document.createElement('div');
    this.element.classList.add('day', 'next-month-day');
    this.element.textContent = this.getDayNumber();
    this.element.style.opacity = '0.5';
    this.element.setAttribute('data-day', this.getDayNumber());
    this.element.setAttribute('data-month', time.extraMonth.toString());
    this.element.setAttribute('data-year', time.extraMonthYear.toString());
    this.daysContainer.appendChild(this.element);
    controller.addExtraDaysListeners(this.element);
  }
}
