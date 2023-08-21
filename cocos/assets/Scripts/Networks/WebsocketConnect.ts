import { _decorator, Component, director, Label, Node, Vec2 } from 'cc';
import { Connector } from '../Base/Connector';
import { ServerConnect } from './ServerConnect';
import { UserInfo } from './UserInfo';
import { ChannelManager } from './ChannelManager';
import { GameMenu } from '../UIScript/GameMenu';
import { LobbyPopup } from '../Popup/LobbyPopup';
import { RoomInfo } from './RoomInfo';
import { GamePlayUI } from '../Popup/GamePlayUI';
import { LightState, PlayerState } from '../GameState';
import { MovingCharacter } from '../MovingCharacter';
import { RemotePlayer } from '../RemotePlayer';
import { LeaderBoard } from '../Popup/LeaderBoard';
import { ConsoleHelper } from '../Base/ConsoleHelper';
import { MapComp } from '../MapComp';
const { ccclass, property } = _decorator;

export enum WS_Event
{
    room = 'room',
    invoke_room = 'invoke-room',
    invoke_player = 'invoke-player',
    playerState = 'playerstate',
    roomCountDown = 'roomCountDown',
    roomGameStart = 'roomGameStart',
    timeCount = 'timeCount',
    move = 'move',
    playerMove = 'playerMove',
    endmove = 'endmove',
    playerEndMove = 'playerEndMove',
    roomRedOn = 'roomRedOn',
    roomRedOff = 'roomRedOff',
    playerDead = 'playerDead',
    userFinish = 'userFinish',
    finish = 'finish',
    leaderBoard = 'leaderBoard'
}

export enum WS_Type
{
    listen = 'listen',
    invoke = 'invoke'
}

@ccclass('WebsocketConnect')
export class WebsocketConnect extends Component 
{
    private static _instance: WebsocketConnect = null;
    public connector: Connector;
    public DefaultRoomID: string = "";

    public static eventTarget = new EventTarget();

    @property(Label)
    private TestMsg: Label = null;

    @property(Node)
    GameMenuNode: Node = null;

    private GameMenu: GameMenu = null;
    
    static getInstance(): WebsocketConnect 
    {
        return WebsocketConnect._instance;
    }

    createInstance()
    {
        if(WebsocketConnect._instance != null) 
        {
            this.destroy();
            return;
        };
        WebsocketConnect._instance = this;
        if(!director.isPersistRootNode(this.node))
        {
            console.log("ADD PErsisten Node 1");
            director.addPersistRootNode(this.node);
        }    
    }
    
    screenLog(str: string){
        // this.TestMsg.string+= "\n"
        // this.TestMsg.string+= str
    }

    logToZalo(str: string){
        ConsoleHelper.Instance.sendMessageToParent("LOG", str)
    }

    onLoad()
    {
        this.createInstance();
        director.addPersistRootNode(this.TestMsg.node);
        
        //@ts-ignore
        window.move = WebsocketConnect.getInstance().InvokeMove
        //@ts-ignore
        window.room = WebsocketConnect.getInstance().InvokeRoom        
        //@ts-ignore
        window.room = WebsocketConnect.getInstance().InvokeFinish
    }

    onDestroy()
    {
        delete WebsocketConnect._instance;
        WebsocketConnect._instance = null;
    }

    connectWebSocKet(roomID: string)
    {
        console.log("Connect WS with roomID: " + roomID);
        this.DefaultRoomID = roomID;
        this.connector = new Connector();
        this.connector.initConnection(roomID);
        
        this.initEventListener();    
    }

    roomListen: Function = (payload:any) =>
    {
        console.log("Listen room event", payload);
        //this.TestMsg.string = "" + payload;
        payload.value = {
                method: WS_Event.room,
                ...payload,
            };
        let room = new RoomInfo(payload.name, payload.id, payload.hostUserAppId, 1, payload.maxUser);

        WebsocketConnect.getInstance().logToZalo("zzzzzz: " + payload.start + "  -- " + JSON.stringify(payload))
        if(payload.start!=null)
            MapComp.START_CACHED = payload.start;
        ChannelManager.setRoomInfo(room);
        // console.log("CHECK: " + JSON.stringify(ChannelManager.getRoomInfo()));
    }

    invoke_roomEvent: Function = (payload:any) =>
    {
        console.log("Invoke invoke-room event", payload);
        this.screenLog(" InvokeRoom " + payload);

        payload.value = {
            method: WS_Event.invoke_room,
                ...payload,
            };
    }

    playerStateListen: Function = (payload:any) =>
    {
        console.log("Listen playerstate event", payload);
        let ListUser: UserInfo[] = [];
        payload.forEach(element => 
        {
            let user = new UserInfo(element.userName.index, element.userName, element.id, element.userAvatar);
            user.setInitPos(new Vec2(element.position.x, element.position.y), element.position.facing);
            ListUser.push(user);
        });
        this.scheduleOnce(()=>
        {
            LobbyPopup.eventTarget.emit(LobbyPopup.AddNewPlayer, ListUser);
        }, 1.5);
        LobbyPopup.InitPlayers = ListUser;
    }

    roomCountDownListen: Function = (payload:any) =>
    {
        console.log("Listen Room CountDown event", payload);
        //this.TestMsg.string = "" + payload;
        payload.value = {
            method: WS_Event.roomCountDown,
            ...payload,
        };
        MovingCharacter.moveSpeed = payload.speed;
        LobbyPopup.eventTarget.emit(GameMenu.PlayGameClick);
    }

    gameStartListen: Function = (payload:any) =>
    {
        console.log("Listen Room Game start", payload);
        //this.TestMsg.string = "" + payload;
        payload.value = {
            method: WS_Event.roomGameStart,
                ...payload,
            };
        GamePlayUI.eventTarget.emit(GamePlayUI.TIME_COUNT, payload.countDownTime);
    }

    timeDisplayListen: Function = (payload:any) =>
    {
        console.log("Listen Time Count Event", payload);
        //this.TestMsg.string = "" + payload;
        GamePlayUI.eventTarget.emit(GamePlayUI.TIME_COUNT, payload);
    }

    userMoveEvent: Function = (payload:any) =>
    {
        console.log("Invoke Move Event", payload);
        //this.TestMsg.string = "" + payload;
        payload.value = {
            method: WS_Event.move,
                ...payload,
            };
    }

    playerMoveListen: Function = (payload:any) =>
    {
        console.log("Listen Player Move Event", payload);
        RemotePlayer.eventTarget.emit(RemotePlayer.RECEIVE_MOVE_SIGNAL, payload);
    }

    playerEndMoveListen: Function = (payload:any) =>
    {
        console.log("Listen Player End Move Event", payload);
        RemotePlayer.eventTarget.emit(RemotePlayer.RECEIVE_END_MOVE_SIGNAL, payload);
    }

    userEndMoveEvent: Function = (payload:any) =>
    {
        console.log("Invoke End Move Event", payload);
        //this.TestMsg.string = "" + payload;
        payload.value = {
            method: WS_Event.endmove,
                ...payload,
            };
    }

    roomRedOnListen : Function = (payload:any) =>
    {
        console.log("Listen Room Red Off", payload);
        //this.TestMsg.string = "" + payload;
        GamePlayUI.eventTarget.emit(GamePlayUI.RECEIVE_LIGHT_SIGNAL, LightState.RedLight)
    } 

    roomRedOffListen : Function = (payload:any) =>
    {
        console.log("Listen Room Red Off", payload);
        //this.TestMsg.string = "" + payload;
        GamePlayUI.eventTarget.emit(GamePlayUI.RECEIVE_LIGHT_SIGNAL, LightState.GreenLight)
    }

    playerDeadListen : Function = (payload:any) =>
    {
        console.log("Listen Player Dead", payload + " - " + ChannelManager.getUserInfo().getID());
        GamePlayUI.eventTarget.emit(GamePlayUI.FINISH_GAME, PlayerState.Death, payload.toString());
        RemotePlayer.eventTarget.emit(RemotePlayer.LISTEN_DEAD_SIGNAL, payload)
    }

    userFinishListen : Function = (payload:any) =>
    {
        console.log("Listen User Finish", payload + " - " + ChannelManager.getUserInfo().getID());
        GamePlayUI.eventTarget.emit(GamePlayUI.FINISH_GAME, PlayerState.Death, payload.toString());
    }

    finishEvent: Function = (payload:any) =>
    {
        console.log("Listen Finish Signal", payload);
    }

    leaderBoardEvent: Function = (payload:any) =>
    {
        console.log("Listen Leader Board", payload);
        let ListUser: UserInfo[] = [];
        payload.forEach(element => 
        {
            let user = new UserInfo(element.index, element.userName, element.userAppId, element.userAvatar);
            ListUser.push(user);
        });
        LeaderBoard.eventTarget.emit(LeaderBoard.SHOW_LEADERBOARD, ListUser);
    }

    initEventListener()
    {
        let connection = this.connector.Connection;
        
        connection.on(WS_Event.room, this.roomListen);

        connection.on(WS_Event.invoke_room, this.invoke_roomEvent);

        connection.on(WS_Event.playerState, this.playerStateListen);

        connection.on(WS_Event.roomCountDown, this.roomCountDownListen);

        connection.on(WS_Event.roomGameStart, this.gameStartListen);

        connection.on(WS_Event.timeCount, this.timeDisplayListen);

        connection.on(WS_Event.move, this.userMoveEvent);

        connection.on(WS_Event.playerMove, this.playerMoveListen);

        connection.on(WS_Event.endmove, this.userEndMoveEvent);

        connection.on(WS_Event.playerEndMove, this.playerEndMoveListen);

        connection.on(WS_Event.roomRedOn, this.roomRedOnListen);

        connection.on(WS_Event.roomRedOff, this.roomRedOffListen);

        connection.on(WS_Event.playerDead, this.playerDeadListen);

        connection.on(WS_Event.userFinish, this.userFinishListen);

        connection.on(WS_Event.finish, this.finishEvent);

        connection.on(WS_Event.leaderBoard, this.leaderBoardEvent);

        this.connector.startConnecting();
    }

    closeEventListener()
    {
        let connection = this.connector.Connection;
        if(connection != null){
            console.log("Close webSocket");

            connection.off(WS_Event.room, this.roomListen);

            connection.off(WS_Event.invoke_room, this.invoke_roomEvent);

            connection.off(WS_Event.playerState, this.playerStateListen);

            connection.off(WS_Event.roomCountDown, this.roomCountDownListen);

            connection.off(WS_Event.roomGameStart, this.gameStartListen);

            connection.off(WS_Event.timeCount, this.timeDisplayListen);

            connection.off(WS_Event.move, this.userMoveEvent);

            connection.off(WS_Event.playerMove, this.playerMoveListen);

            connection.off(WS_Event.endmove, this.userEndMoveEvent);

            connection.off(WS_Event.playerEndMove, this.playerEndMoveListen);

            connection.off(WS_Event.roomRedOn, this.roomRedOnListen);

            connection.off(WS_Event.roomRedOff, this.roomRedOffListen);

            connection.off(WS_Event.playerDead, this.playerDeadListen);

            connection.off(WS_Event.userFinish, this.userFinishListen);

            connection.off(WS_Event.finish, this.finishEvent);

            connection.off(WS_Event.leaderBoard, this.leaderBoardEvent);
        }
        this.connector.stopConnection();
        this.connector = null;
    }

    update()
    {
        if(this.connector==null) return;
        console.log(this.connector.getConnectionState())
    }

    onClickInvokeRoom()
    {
        this.InvokeRoom();
    }

    onClickInvokeMove()
    {
        this.InvokeMove();
    }

    onClickInvokeFinish()
    {
        this.InvokeFinish;
    }
    
    InvokeMove = async (x = 0, y = 0, facing = 0) => 
    {
        let userMove = JSON.stringify(
            {    
                roomId: this.DefaultRoomID,
                userAppId: ServerConnect.USER_ID,
                x: x,
                y: y,
                facing: facing
            }
        );
        
        
        console.log("SEND MOVE signal to: " + this.DefaultRoomID + " with data " + userMove);

        await this.connector.Connection.invoke(WS_Event.move, {
            roomId: this.DefaultRoomID,
            userAppId: ServerConnect.USER_ID,
            x: x,
            y: y,
            facing: facing
        })
    }

    InvokeEndMove = async () => 
    {
        let userEndMove = JSON.stringify(
            {    
                roomId: this.DefaultRoomID,
                userAppId: ServerConnect.USER_ID
            }
        );
        
        console.log("SEND END MOVE signal to: " + this.DefaultRoomID + " with data " + userEndMove);
        await this.connector.Connection.invoke(WS_Event.endmove, {
            roomId: this.DefaultRoomID,
            userAppId: ServerConnect.USER_ID
        })
    }
    
    InvokeRoom = async (id:string = this.DefaultRoomID) => 
    {
        console.log("SEND INVOKE-ROOM signal to: " + id);
        await this.connector.Connection.invoke(WS_Event.invoke_room, id);
    }

    InvokePlayer = async (id:string = this.DefaultRoomID) => 
    {
        console.log("SEND INVOKE-PLayer signal to: " + id);
        await this.connector.Connection.invoke(WS_Event.invoke_player, id);
    }


    InvokeFinish = async () => 
    {
        let userFinish = JSON.stringify(
            {
                roomId: this.DefaultRoomID,
                userAppId: ServerConnect.USER_ID
            }
        );
        console.log("SEND FINISH signal to: " + this.DefaultRoomID + " with data " + userFinish);
        await this.connector.Connection.invoke(WS_Event.finish, {
            roomId: this.DefaultRoomID,
            userAppId: ServerConnect.USER_ID
        })
    }
}

