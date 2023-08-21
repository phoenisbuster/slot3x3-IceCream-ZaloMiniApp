export const APP_NAME = "red-light-green-light"
export const IFRAME_PARENT = "RLGR_PARENT"
export const IFRAME_CHILD = "RLGR_CHILD"
export const FROM = "from"
export const DATA = "data"

export const GET = "data"

export const GAME_URL = "https://cocos.incubator.inspirelab.io/web-mobile-19/"

export function createParentMessage(data){
  return {
    [FROM]:IFRAME_PARENT,
    [DATA]:data
  }
}

export function createChildMessage(data){
  return {
    [FROM]:IFRAME_CHILD,
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