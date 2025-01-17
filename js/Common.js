export class Common{

  static getEmoji(name){
    const emojisMap = new Map();
    emojisMap.set("work","💼");
    emojisMap.set("off","🌴");
    emojisMap.set("trash","🗑️");
    return emojisMap.get(name) || "❓";
  }
}
