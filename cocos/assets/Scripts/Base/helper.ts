export const APP_NAME = "Slot-Carem"
export const OA_ID = "3327045134763932455"
export const DEV_VER = "&env=DEVELOPMENT&version=zdev-83a0872d"

export const IFRAME_PARENT = "RLGR_PARENT"
export const IFRAME_CHILD = "RLGR_CHILD"
export const FROM = "from"
export const EVENT = "event"
export const DATA = "data"

export const LOGIN = "LOGIN"
export const GET_APP_INFO = "GET_APP_INFO"
export const GET_USER_INFO = "GET_USER_INFO"
export const SCAN_QR_CODE = "SCAN_QR_CODE"
export const FOLLOW_OA = "FOLLOW_OA"
export const GET_HREF = "GET_HREF"
export const SHARE_LINK = "SHARE_LINK"
export const ACCESS_TOKEN = "ACCESS_TOKEN"

export const GET = "data"

export const GAME_URL = "https://phoenis.itch.io/slot-zalominiapp"
export function createParentMessage(event = null, data = null){
  return {
    [FROM]:IFRAME_PARENT,
    [EVENT]:event,
    [DATA]:data
  }
}

export function createChildMessage(event = null, data = null){
  return {
    [FROM]:IFRAME_CHILD,
    [EVENT]:event,
    [DATA]:data
  }
}

export function isParentMessage(msg){
  return msg!=null && msg[FROM]==IFRAME_PARENT;
}

export function isChildMessage(msg){
  return msg!=null && msg[FROM]==IFRAME_CHILD;
}

export function getUrl(endPoint, roomId, userAppId, userName, userAvatar){
  let url = endPoint + "/hubs/game"
  + "?roomId=" + roomId
  + "&userAppId=" + userAppId
  + "&userName=" + userName
  + "&userAvatar=" + userAvatar;
  return url;
}