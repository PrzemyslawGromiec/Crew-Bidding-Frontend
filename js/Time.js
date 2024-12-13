export class Time {

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
