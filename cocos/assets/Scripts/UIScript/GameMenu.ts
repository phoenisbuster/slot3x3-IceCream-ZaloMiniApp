import { _decorator, Component, Node, log, random, Sprite, SpringJoint2D, instantiate, director, input, Input, EventKeyboard, KeyCode, UITransform } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import { PopupName } from '../Base/PopupName';
import UIManager from '../Base/UIManager';
import { CreateRoomPopup } from '../Popup/CreateRoomPopup';
import { GameInfoPopup } from '../Popup/GameInfoPopup';
import { LoadingPopup } from '../Popup/LoadingPopup';
import { LobbyPopup } from '../Popup/LobbyPopup';
import { RoomInfo } from '../Networks/RoomInfo';
import { WebsocketConnect } from '../Networks/WebsocketConnect';
import { ZaloConnection } from '../Networks/ZaloConnection';
import { ChannelManager } from '../Networks/ChannelManager';

const { ccclass, property } = _decorator;

export enum ParticipateType
{
    None,
    Host,
    Guest,
    Viewer
}

@ccclass('GameMenu')
export class GameMenu extends Component 
{
    @property(Sprite)
    MainBG: Sprite = null;
    @property(Sprite)
    MainLogo: Sprite = null;
    @property(Node)
    MainLayout: Node = null;
    @property(Node)
    MainCanvas: Node = null;
    @property(Node)
    UIManagerNode: Node = null;
    @property(Node)
    SoundManagerNode: Node = null;
    @property(Node)
    AudioNode: Node = null;
    
    public static CreateRoomClick: string = "CreateRoomClick";
    public static CreateRoomCancel: string = "CreateRoomCancel";
    public static CreateRoomOK: string = "CreateRoomOK";
    public static PlayGameClick: string = "PlayGameClick";
    public static LoadingComplete: string = "FinishLoading";

    private GameInfo: PopUpInstance = null;
    private CreateRoom: PopUpInstance = null;
    private Lobby: PopUpInstance = null;
    private Loading: PopUpInstance = null;

    CurJoinType: ParticipateType = ParticipateType.None;

    public curRoomName: string = "";

    start()
    {
        director.preloadScene("main");
        if(ChannelManager.isViewer()) return;
        if(ZaloConnection.isLogin)
        {
            console.log("Player already log-in");
            this.ShowGameMenu();
        }
    }

    onEnable()
    {
        GameInfoPopup.eventTarget.on(GameMenu.CreateRoomClick, this.ShowCreateRoomPopup, this);
        CreateRoomPopup.eventTarget.on(GameMenu.CreateRoomCancel, this.CancelCreateRoom, this);
        CreateRoomPopup.eventTarget.on(GameMenu.CreateRoomOK, this.CreateRoomConfirm, this);
        LobbyPopup.eventTarget.on(GameMenu.PlayGameClick, this.OnClickPlayGame, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    onDisable()
    {
        GameInfoPopup.eventTarget.off(GameMenu.CreateRoomClick, this.ShowCreateRoomPopup, this);
        CreateRoomPopup.eventTarget.off(GameMenu.CreateRoomCancel, this.CancelCreateRoom, this);
        CreateRoomPopup.eventTarget.off(GameMenu.CreateRoomOK, this.CreateRoomConfirm, this);
        LobbyPopup.eventTarget.off(GameMenu.PlayGameClick, this.OnClickPlayGame, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    setJoinType(value: ParticipateType)
    {
        this.CurJoinType = value;
    }

    ShowGameMenu(Room: RoomInfo = new RoomInfo("You're Guest", "0", "0", 1, 8))
    {
        switch(this.CurJoinType)
        {
            case ParticipateType.None:
                this.ShowGameInfo();
                break;
            case ParticipateType.Host:
                this.ShowLobby(Room);
                break;
            case ParticipateType.Guest:
                WebsocketConnect.getInstance().screenLog(JSON.stringify(Room));
                this.ShowLobby(Room);
                break;
            default:
                this.ShowGameInfo();
                break;
        }
    }

    ShowGameInfo()
    {
        if(this.GameInfo)
        {
            this.GameInfo.showPopup();
            return;
        }
        UIManager.getInstance().openPopup(
            GameInfoPopup, 
            PopupName.GameInfo,
            null,
            (popupValue) =>
            {
                this.GameInfo = popupValue;
            }
        );
    }

    ShowCreateRoomPopup()
    {
        if(this.CreateRoom)
        {
            this.CreateRoom.showPopup();
            return;
            
        }
        UIManager.getInstance().openPopup(
            CreateRoomPopup, 
            PopupName.CreateRoom,
            null,
            (popupValue) =>
            {
                this.CreateRoom = popupValue;
            }
        );        
    }

    CancelCreateRoom()
    {
        this.CurJoinType = ParticipateType.None;
        this.ShowGameInfo();
    }

    CreateRoomConfirm(room: RoomInfo)
    {
        this.CurJoinType = ParticipateType.Host;
        this.ShowLobby(room);
        this.MainLogo.node.active = false;
    }

    ShowLobby(roomInstance: RoomInfo)
    {
        //director.preloadScene("main");
        let isHost = this.CurJoinType == ParticipateType.Guest? false : true
        let data = [roomInstance, isHost];

        if(this.Lobby)
        {
            this.Lobby._data = data;
            WebsocketConnect.getInstance().screenLog(" Data 1: " + data);
            this.Lobby.showPopup();
            return;
        }
        WebsocketConnect.getInstance().screenLog( " Data 2: " + data);
        UIManager.getInstance().openPopup(
            LobbyPopup, 
            PopupName.Lobby,
            data,
            (popupValue) => 
            {
                this.Lobby = popupValue;
            }
        );
    }

    OnClickPlayGame()
    {
        if(this.Loading)
        {
            this.Loading.showPopup();
            return;
        }
        
        UIManager.getInstance().openPopup(
            LoadingPopup, 
            PopupName.Loading,
            null,
            (popupValue) => 
            {
                this.Loading = popupValue;
            }
        );
    }

    public setRoomName(value: string)
    {
        this.curRoomName = value
    }

    public getCurRoomName(): string
    {
        return this.curRoomName;
    }

    public deleteRoomName()
    {
        this.curRoomName = "";
    }

    private onKeyPress(event: EventKeyboard)
    {
        if(event.keyCode == KeyCode.DIGIT_1)
        {
            console.log("Main Canvas size: " + this.MainCanvas.getComponent(UITransform).contentSize);
            console.log("Main Layout size: " + this.MainLayout.getComponent(UITransform).contentSize);
            console.log("Main Layout size: " + this.MainBG.getComponent(UITransform).contentSize);
            console.log("Main Layout size: " + this.UIManagerNode.getComponent(UITransform).contentSize);
        }
        else if(event.keyCode == KeyCode.DIGIT_2)
        {
            console.log("Main Logo size: " + this.MainLogo.getComponent(UITransform).contentSize);
            console.log("Main Logo local pos: " + this.MainLogo.node.position);
            console.log("Main Logo world pos: " + this.MainLogo.node.worldPosition);
        }
    }
}

