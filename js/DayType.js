export class DayType {
  static EMPTY = 'empty';
  static MONTH = 'month';
  static EXTRA = 'extra';

  static monthModifier(dayType) {
    if (this.EMPTY === dayType) {
      return -1;
    } else if (this.MONTH === dayType) {
      return 0;
    } else {
      return 1;
    }
  }
}
