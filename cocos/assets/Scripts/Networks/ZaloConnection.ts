import { _decorator, Component, director, Node } from 'cc';
import { GameMenu, ParticipateType } from '../UIScript/GameMenu';
import { ConsoleHelper, consoleEvent, onReceivedMessageEvent } from '../Base/ConsoleHelper';
import { FOLLOW_OA, GET_APP_INFO, GET_HREF, GET_USER_INFO, LOGIN, SCAN_QR_CODE, SHARE_LINK } from '../Base/helper';
import { WebsocketConnect } from './WebsocketConnect';
import { ChannelManager } from './ChannelManager';
import { ServerConnect } from './ServerConnect';
import { UserInfo } from './UserInfo';
import LocalStorageManager from '../Base/LocalStorageManager';
const { ccclass, property } = _decorator;

@ccclass('ZaloConnection')
export class ZaloConnection extends Component 
{
    private static _instance: ZaloConnection = null;

    public static eventTarget = new EventTarget();
    public static isLogin: boolean = false;

    @property(Node)
    GameMenuNode: Node = null;

    public GameMenu: GameMenu = null;
    
    static getInstance(): ZaloConnection 
    {
        return ZaloConnection._instance;
    }

    createInstance()
    {
        if(ZaloConnection._instance != null) 
        {
            console.log("TEST");
            this.destroy();
            return;
        };
        ZaloConnection._instance = this;
        
        if(!director.isPersistRootNode(this.node))
        {
            console.log("ADD PErsisten Node 2");
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
        this.GameMenu = this.GameMenuNode.getComponent(GameMenu);
        console.log("TEST 2 " + this.GameMenu.enabled);
        if(!ZaloConnection.isLogin)
        {
            this.GameMenu.enabled = false;
        }
        else
        {
            console.log("CHECK 1" + this.GameMenu.CurJoinType);
            // this.GameMenu.enabled = true;
            // this.GameMenu.setJoinType(ParticipateType.None);
            // this.GameMenu.ShowGameMenu();
        }
        console.log("TEST 2 " + this.GameMenu.enabled);
    }

    start()
    {     
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

    log()
    {
        console.log("Check GameMenu enabled", this.GameMenu.enabled);
        console.log("Check GameMenu Node active", this.GameMenuNode);
    }

    ZaloDataExecution(data)
    {
        if(data != null)
        {
            WebsocketConnect.getInstance().screenLog(JSON.stringify(data.event + " and " + data.data));

            switch(data.event)
            {
                case LOGIN:
                    console.log("LOG-IN ZALO");
                    if(data.data) ServerConnect.ACCESS_TOKEN = data.data;
                    this.onClickSendAppInfo();
                    this.onClickSendUserInfo();   
                    break;
                case GET_APP_INFO:
                    console.log("APPINFO ZALO");
                    break;

                case GET_USER_INFO:
                    console.log("USER INFO ZALO");
                    if(data.data)
                    {
                        ServerConnect.USER_ID = data.data.userInfo.id;
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
                    return;
                    
                case FOLLOW_OA:
                    console.log("FOLLOW OA ZALO");
                    return;

                case GET_HREF:
                    console.log("GET-HREF ZALO");
                    WebsocketConnect.getInstance().screenLog(JSON.stringify(data.event + ":" + data.data));

                    let url = data.data
                    if(ChannelManager.isViewer()) 
                        url = window.location.search

                    let urlParams = new URLSearchParams(url);
                    let roomID = urlParams.get("roomId")

                    if(this.GameMenu == null) return;
                    
                    if(roomID == null){
                        this.GameMenu.setJoinType(ParticipateType.None);
                        this.GameMenu.enabled = true;
                        this.GameMenu.ShowGameMenu();
                        return
                    }
                     
                    if(this.GameMenu.CurJoinType != ParticipateType.Guest)
                    {
                        WebsocketConnect.getInstance().connectWebSocKet(roomID);
                        this.scheduleOnce(()=>
                        {
                            WebsocketConnect.getInstance().InvokeRoom(roomID);
                        }, 1);

                        this.scheduleOnce(()=>
                        {
                            WebsocketConnect.getInstance().screenLog( " Delay 3 second ");
                            this.GameMenu.setJoinType(ParticipateType.Guest);
                            this.GameMenu.enabled = true;

                            this.GameMenu.ShowGameMenu(ChannelManager.getRoomInfo());
                            WebsocketConnect.getInstance().screenLog(roomID);
                            this.onClickSendFLogWinHref();
                        },1.25);
                    }
                    else
                    {
                        WebsocketConnect.getInstance().screenLog(" Stop ");
                        // if(ChannelManager.isViewer()){
                        // WebsocketConnect.getInstance().connectWebSocKet(roomID);
                        // this.scheduleOnce(()=>
                        // {
                        //     WebsocketConnect.getInstance().InvokeRoom(roomID);
                        // }, 1);
                        // }
                    }    
                    
                    break;

                case SHARE_LINK:
                    console.log("SHARE-LINK ZALO");
                    WebsocketConnect.getInstance().screenLog(JSON.stringify(data.event + "-" + data.data));
                    break;
                    
                default: return;
            }
        }     
        else
        {
            WebsocketConnect.getInstance().screenLog("null");
        }       
    }

    onClickSendLogin()
    {
        ConsoleHelper.Instance.sendMessageToParent(LOGIN)
    }

    onClickSendAppInfo()
    {
        ConsoleHelper.Instance.sendMessageToParent(GET_APP_INFO)
    }

    onClickSendUserInfo()
    {
        ConsoleHelper.Instance.sendMessageToParent(GET_USER_INFO)
    }

    onClickSendScanQR()
    {
        ConsoleHelper.Instance.sendMessageToParent(SCAN_QR_CODE)
    }

    onClickSendFollowOA()
    {
        ConsoleHelper.Instance.sendMessageToParent(FOLLOW_OA)
    }

    onClickSendFLogWinHref()
    {
        ConsoleHelper.Instance.sendMessageToParent(GET_HREF)
    }
}

