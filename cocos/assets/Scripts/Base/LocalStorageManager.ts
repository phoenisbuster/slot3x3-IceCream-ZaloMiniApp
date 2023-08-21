// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export default class LocalStorageManager {
  public static internalGetString(key: string, defaultValue: string = ""): string {
    const isValue = sys.localStorage.getItem(key);

    return isValue == undefined ? defaultValue : isValue;
  }

  public static internalSaveString(key: string, strValue: string = ""): void {
    if (strValue == undefined) {
      sys.localStorage.removeItem(key);
    } else {
      sys.localStorage.setItem(key, strValue);
    }
  }

  public static internalSaveBoolean(key: string, defaultValue: boolean = true): void {
    if (defaultValue == undefined) {
      sys.localStorage.removeItem(key);
    } else {
      sys.localStorage.setItem(key, defaultValue.toString());
    }
  }

  public static internalGetBoolean(key: string, defaultValue: boolean = true): boolean {
    let isValue = sys.localStorage.getItem(key);
    if (isValue == undefined) {
      return defaultValue;
    }
    if (typeof isValue === "string") {
      return isValue === "true";
    } else {
      return isValue;
    }
  }

  public static internalSaveUserData(key: string, userData): void
  {
    if (userData == undefined) 
    {
        sys.localStorage.removeItem(key);
    } 
    else 
    {
        let userSaveData = JSON.stringify(userData);
        sys.localStorage.setItem(key, userSaveData);
    }
  }

  public static internalGetUserData(key: string, userData = null)
  {
    let isValue = JSON.parse(sys.localStorage.getItem(key));
    if (isValue == undefined) 
    {
        isValue = userData;
    }
    else 
    {
        return isValue;
    }
  }
}
