import { _decorator, Component, director, Node, EventTarget } from 'cc';
import { ConsoleHelper, consoleEvent, onReceivedMessageEvent } from '../Base/ConsoleHelper';
import { FOLLOW_OA, GET_APP_INFO, GET_HREF, GET_USER_INFO, LOGIN, SCAN_QR_CODE, SHARE_LINK, ACCESS_TOKEN } from '../Base/helper';
import { ChannelManager } from './ChannelManager';
import { UserInfo } from './UserInfo';
import { DebugMsgOnScreen } from '../Base/DebugMsgOnScreen';

const { ccclass, property } = _decorator;

@ccclass('ZaloConnection')
export class ZaloConnection extends Component 
{
    private static _instance: ZaloConnection = null;

    public static eventTarget = new EventTarget();
    private isLogin: boolean = false;
    
    static getInstance(): ZaloConnection 
    {
        return ZaloConnection._instance;
    }

    createInstance()
    {
        if(ZaloConnection._instance != null) 
        {
            console.log("Zalo connect has already loaded");
            this.destroy();
            return;
        };
        ZaloConnection._instance = this;
        
        if(!director.isPersistRootNode(this.node))
        {
            console.log("Add Zalo To Persisten Node");
            director.addPersistRootNode(this.node);
        }    
    }

    ZaloMsgLisstener: Function = (msg:any) => 
    {
        this.ZaloDataExecution(msg.data)
    }

    onLoad()
    {
        this.createInstance();
        
        let self = this;
        consoleEvent.on(onReceivedMessageEvent, msg => {self.ZaloDataExecution(msg.data)})
    }

    start()
    {     
        DebugMsgOnScreen.getInstance()?.setDebugMsg("Start Debug Session", true);
        this.onClickSendLogin();
    }

    onClose()
    {
        let self = this;
        consoleEvent.off(onReceivedMessageEvent, msg => {self.ZaloDataExecution(msg.data)})
    }

    onDestroy()
    {
        delete ZaloConnection._instance;
        ZaloConnection._instance = null;
    }

    getLoginInfo()
    {
        return this.isLogin;
    }

    ZaloDataExecution(data)
    {
        if(data != null)
        {
            switch(data.event)
            {
                case LOGIN:
                    console.log("LOG-IN ZALO");
                    DebugMsgOnScreen.getInstance()?.setDebugMsg("LOG-IN ZALO " + data.data);

                    this.onClickSendAppInfo();
                    this.onClickSendUserInfo();   
                    break;

                case GET_APP_INFO:
                    console.log("APPINFO ZALO " + data.data);
                    DebugMsgOnScreen.getInstance()?.setDebugMsg("APPINFO ZALO " + data.data);
                    break;

                case GET_USER_INFO:
                    console.log("USER INFO ZALO " + data.data);
                    DebugMsgOnScreen.getInstance()?.setDebugMsg("USER INFO ZALO " + data.data);
                    if(data.data)
                    {
                        // ServerConnect.USER_ID = data.data.userInfo.id;
                        let user = new UserInfo(
                                                data.data.userInfo.index,
                                                data.data.userInfo.name, 
                                                data.data.userInfo.id, 
                                                data.data.userInfo.avatar);
                        ChannelManager.setUserInfo(user);
                    }
                    this.onClickSendFLogWinHref(); 
                    this.onClickSendFollowOA();
                    break;
                    
                case SCAN_QR_CODE:
                    console.log("SCAN QR CODE " + data.data);
                    DebugMsgOnScreen.getInstance()?.setDebugMsg("SCAN QR CODE " + data.data);
                    return;
                    
                case FOLLOW_OA:
                    console.log("FOLLOW OA ZALO " + data.data);
                    DebugMsgOnScreen.getInstance()?.setDebugMsg("FOLLOW OA ZALO " + data.data);
                    return;

                case GET_HREF:
                    console.log("GET-HREF ZALO " + data.data);
                    DebugMsgOnScreen.getInstance()?.setDebugMsg("GET-HREF ZALO " + data.data);

                    let url = data.data
                    if(ChannelManager.isViewer()) 
                        url = window.location.search

                    let urlParams = new URLSearchParams(url);
                    let roomID = urlParams.get("roomId")
                    
                    if(roomID == null)
                    {
                        console.error("Zalo ROOM ID IS NULL");
                        return;
                    }
                    
                    ZaloConnection.eventTarget.emit("test");

                    break;

                case SHARE_LINK:
                    console.log("SHARE-LINK ZALO " + data.data);
                    DebugMsgOnScreen.getInstance()?.setDebugMsg("SHARE-LINK ZALO " + data.data);
                    break;

                case ACCESS_TOKEN:
                    console.log("ACCESS TOKEN ZALO " + data.data);
                    DebugMsgOnScreen.getInstance()?.setDebugMsg("ACCESS TOKEN ZALO " + data.data);
                    break;
                    
                default: return;
            }
        }     
        else
        {
            console.error("No Zalo Connection");
        }       
    }

    onClickSendLogin()
    {
        DebugMsgOnScreen.getInstance()?.setDebugMsg("SEND LOGIN");
        ConsoleHelper.Instance.sendMessageToParent(LOGIN)
    }

    onClickSendAppInfo()
    {
        DebugMsgOnScreen.getInstance()?.setDebugMsg("SEND GET_APP_INFO");
        ConsoleHelper.Instance.sendMessageToParent(GET_APP_INFO)
    }

    onClickSendUserInfo()
    {
        DebugMsgOnScreen.getInstance()?.setDebugMsg("SEND GET_USER_INFO");
        ConsoleHelper.Instance.sendMessageToParent(GET_USER_INFO)
    }

    onClickSendScanQR()
    {
        DebugMsgOnScreen.getInstance()?.setDebugMsg("SEND SCAN_QR_CODE");
        ConsoleHelper.Instance.sendMessageToParent(SCAN_QR_CODE)
    }

    onClickSendFollowOA()
    {
        DebugMsgOnScreen.getInstance()?.setDebugMsg("SEND FOLLOW_OA");
        ConsoleHelper.Instance.sendMessageToParent(FOLLOW_OA)
    }

    onClickSendFLogWinHref()
    {
        DebugMsgOnScreen.getInstance()?.setDebugMsg("SEND GET_HREF");
        ConsoleHelper.Instance.sendMessageToParent(GET_HREF)
    }

    onClickSendGetAccessToken()
    {
        DebugMsgOnScreen.getInstance()?.setDebugMsg("SEND ACCESS_TOKEN");
        ConsoleHelper.Instance.sendMessageToParent(ACCESS_TOKEN)
    }
}

