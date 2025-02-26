export class Common {

  static getEmoji(name) {
    const emojisMap = new Map();
    emojisMap.set("work", "💼");
    emojisMap.set("off", "🌴");
    emojisMap.set("trash", "🗑️");
    return emojisMap.get(name) || "❓";
  }

  static sameAs(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  static isLaterThan(time1, time2) {
    return (
      time1.getHours() > time2.getHours() ||
      (time1.getHours() === time2.getHours() &&
        time1.getMinutes() >= time2.getMinutes())
    );
  }

  static isBefore(time1, time2) {
    return (
      time1.getHours() < time2.getHours() ||
      (time1.getHours() === time2.getHours() &&
        time1.getMinutes() <= time2.getMinutes())
    );
  }
}
