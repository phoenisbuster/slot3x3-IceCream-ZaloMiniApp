import { _decorator, Component, director } from 'cc';
import { RoomInfo } from '../Networks/RoomInfo';
import LocalStorageManager from '../Base/LocalStorageManager';
import { WebsocketConnect } from './WebsocketConnect';
import { ChannelManager } from './ChannelManager';
import { DEV_VER } from '../Base/helper';
import { Connector, VITE_CDP_ENDPOINT, VITE_ENDPOINT } from '../Base/Connector';
const { ccclass, property } = _decorator;

export enum CONNECT_METHOD
{
    GET = 'GET',
    POST = 'POST'
}

export enum GAME_TYPE
{
    RLGL = "/rlglgame/",
}

export enum API_TYPE
{
    JoinLink = "JoinLink",
    CreateRoom = "CreateRoom",
    ChangeReadyState = "ChangeReadyState",
    RemoveUser = "RemoveUser",
    SetHost = "SetHost",
    PlayGame = "Play"    
}

@ccclass('ServerConnect')
export class ServerConnect extends Component 
{
    private static _instance: ServerConnect = null;

    public static VITE_SOCKET_ENDPOINT = VITE_ENDPOINT
    public static VITE_CDP_ENDPOINT = VITE_CDP_ENDPOINT
    // public static APP_ID = "4194382088583347983";
    
    public static USER_ID = "3368637342326461";
    public static ACCESS_TOKEN = "";

    public static eventTarget = new EventTarget();

    static getInstance(): ServerConnect 
    {
        return ServerConnect._instance;
    }

    createInstance()
    {
        if(ServerConnect._instance != null) 
        {
            this.destroy();
            return;
        };
        ServerConnect._instance = this
        if(!director.isPersistRootNode(this.node))
        {
            console.log("ADD PErsisten Node 3");
            director.addPersistRootNode(this.node);
        }  
    }

    onLoad()
    {
        this.createInstance();

        // //@ts-ignore
        // window.testAPI = ServerConnect.getInstance().APITesting;
    }
    
    start() 
    {
        /*
            These lines are for manual testing API, comment or delete it when running real demo
        */
        //this.APITesting();
    }

    onDestroy()
    {
        delete ServerConnect._instance;
        ServerConnect._instance = null;
    }

    initConnection(defaultUrl: string, 
                    game_type: GAME_TYPE, 
                    method: CONNECT_METHOD, 
                    api_type: API_TYPE,
                    params: Map<string, any> = null, 
                    body: any = null, 
                    header: any = null,
                    onComplete: (input: any) => void = null)
    {
        // console.log("TEST Param Size: " + ((params!=null)? params.size : null));
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        
        xhr.onreadystatechange = function() {
            if(xhr.readyState == XMLHttpRequest.DONE) 
            {
                var data = xhr.response;
                console.log("Test the received msg: ", xhr.response);
                if(data)
                {
                    // console.log("Test response if success: ", api_type, data.data);
                    if(data.success == true)
                    {
                        console.log("Log Data: " + data.data);
                        ServerConnect.DataExecution(api_type, data.data, onComplete);
                    }
                }
                else
                {
                    console.log("404 Not found");
                }
            }
        }

        xhr.open(method, this.getUrl(defaultUrl, game_type, api_type, params), true);
        xhr.setRequestHeader("Content-type", "application/json");
        
        xhr.send(body);
    }

    getUrl(defaultUrl: string, 
            game_type: GAME_TYPE = null, 
            api_type: API_TYPE = null,
            params: Map<string, any> = null)
    {
        let UrlPath = "";
        if(params)
        {
            let i = 0;
            for (let [key, value] of params) 
            {
                if(i == 0)
                {
                    UrlPath += "?" + key + "=" + value;
                }
                else
                {
                    UrlPath += "&" + key + "=" + value;
                } 
                i++;        
            }
        }
        let url = defaultUrl + game_type + api_type + UrlPath;
        console.log(url);
        return url;
    }

    static DataExecution(api_type: API_TYPE, data: any, onComplete: (input: any) => void = null): any
    {
        switch(api_type)
        {
            case API_TYPE.CreateRoom:
                let room = new RoomInfo(data.name, data.id, data.hostUserAppId, 1, data.maxUser);
                ChannelManager.setRoomInfo(room);
                console.log("ADVANCE LOG: " + JSON.stringify(ChannelManager.getUserInfo()))
                ChannelManager.setPlayersInfo(ChannelManager.getUserInfo());
                // CreateRoomPopup.eventTarget.emit(GameMenu.CreateRoomOK, room);
                WebsocketConnect.getInstance().connectWebSocKet(data.id);
               
                WebsocketConnect.getInstance().screenLog(" From ServerConnect: " + JSON.stringify(ChannelManager.getRoomInfo()));
                if(onComplete)
                {
                    onComplete(null);
                }
                break;
            case API_TYPE.JoinLink:
                // LobbyPopup.QRCodeLink = data + DEV_VER;
                if(onComplete)
                {
                    onComplete(null);
                }
                break;
            case API_TYPE.ChangeReadyState:
                WebsocketConnect.getInstance().screenLog("Success " + API_TYPE.ChangeReadyState);
                break;
            case API_TYPE.RemoveUser:
                WebsocketConnect.getInstance().screenLog("Success " + API_TYPE.RemoveUser);
                break;
            case API_TYPE.SetHost:
                WebsocketConnect.getInstance().screenLog("Success " + API_TYPE.SetHost);
                break;
            case API_TYPE.PlayGame:
                break;
            default:
                WebsocketConnect.getInstance().screenLog(api_type + "   " + JSON.stringify(data))
        }
    }

    /*
        Testing API function
    */
    // APITesting(type = API_TYPE.RemoveUser, userId: string = "3368637342326461")
    // {   
    //     let params = new Map<string, any>();
    //     params.set("roomId", LocalStorageManager.internalGetUserData("ROOM").roomID);
    //     // value.set("env", "live");
    //     params.set("currentUserId", ServerConnect.USER_ID);
    //     params.set("userId", userId);
    //     console.log("TEST Params Size SEND: " + params.size);

    //     let body = JSON.stringify(
    //         {    
    //             roomId: LocalStorageManager.internalGetUserData("ROOM").roomID,
    //             userAppId: ServerConnect.APP_ID,
    //             isReady: true
    //         }
    //     );
    //     // currentUserId: "3368637342326461",
    //     // userId: "3368637342326461",
    //     // name: "test",
    //     // hostUserAppId: ServerConnect.APP_ID,
    //     console.log("TEST body SEND: " + body);

    //     let header = null;

    //     ServerConnect.getInstance().initConnection(ServerConnect.VITE_SOCKET_ENDPOINT, 
    //         GAME_TYPE.RLGL, 
    //         CONNECT_METHOD.POST, 
    //         API_TYPE.RemoveUser,
    //         params,
    //         null,
    //         header
    //     );
    // }
}

