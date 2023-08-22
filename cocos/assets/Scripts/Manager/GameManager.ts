import { _decorator, Component, Node, log, random, Sprite, SpringJoint2D, instantiate, director, input, Input, EventKeyboard, KeyCode, UITransform, sp, Skeleton, Label } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import { PopupName } from '../Base/PopupName';
import UIManager from '../Base/UIManager';
import { GameInfoPopup } from '../Popup/GameInfoPopup';
import { LoadingPopup } from '../Popup/LoadingPopup';
import { RoomInfo } from '../Networks/RoomInfo';
import { WebsocketConnect } from '../Networks/WebsocketConnect';
import { ZaloConnection } from '../Networks/ZaloConnection';
import { ChannelManager } from '../Networks/ChannelManager';
import { GamePlayUI } from '../Popup/GamePlayUI';
import { UIController } from './UIController';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component 
{
    private static _instance: GameManager = null;
    
    @property(Sprite)
    MainBG: Sprite = null;

    @property(Sprite)
    MainLogo: Sprite = null;

    @property(Node)
    MainLayout: Node = null;

    @property(Node)
    MainCanvas: Node = null;

    @property(UIController)
    uiController: UIController = null;

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
    private MainGame: PopUpInstance = null;
    private Loading: PopUpInstance = null;

    private curRoomName: string = "";
    private username: string = "";
    private phone: string = "";

    static getInstance(): GameManager 
    {
        return GameManager._instance;
    }

    createInstance()
    {
        if(GameManager._instance != null) 
        {
            this.destroy();
            return;
        };
        GameManager._instance = this;
        
        if(!director.isPersistRootNode(this.node))
        {
            director.addPersistRootNode(this.node);
        }    
    }

    onLoad()
    {
        this.createInstance();
    }

    start()
    {
        if(ChannelManager.isViewer()) return;
        this.showLoadingPopup();

        this.uiController.hideFrameBoard();
        this.uiController.playGirlTalkAnim();
    }

    onEnable()
    {
        // CreateRoomPopup.eventTarget.on(GameMenu.CreateRoomCancel, this.CancelCreateRoom, this);
        // CreateRoomPopup.eventTarget.on(GameMenu.CreateRoomOK, this.CreateRoomConfirm, this);
        // LobbyPopup.eventTarget.on(GameMenu.PlayGameClick, this.OnClickPlayGame, this);
        ZaloConnection.eventTarget.on("test", this.ShowGameInfo, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    onDisable()
    {
        // CreateRoomPopup.eventTarget.off(GameMenu.CreateRoomCancel, this.CancelCreateRoom, this);
        // CreateRoomPopup.eventTarget.off(GameMenu.CreateRoomOK, this.CreateRoomConfirm, this);
        // LobbyPopup.eventTarget.off(GameMenu.PlayGameClick, this.OnClickPlayGame, this);
        ZaloConnection.eventTarget.off("test", this.ShowGameInfo, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    onDestroy()
    {
        delete GameManager._instance;
        GameManager._instance = null;
    }

    showLoadingPopup()
    {
        if(this.Loading)
        {
            this.Loading.showPopup();
            return;
        }

        var data = ()=>
        {
            GameManager.getInstance().ShowGameInfo();
        }
        
        UIManager.getInstance().openPopup(
            LoadingPopup, 
            PopupName.Loading,
            data,
            (popupValue) => 
            {
                this.Loading = popupValue;
            }
        );
    }

    ShowGameInfo()
    {
        if(this.GameInfo)
        {
            this.GameInfo.showPopup();
            return;
        }
        
        var data = ()=>
        {
            GameManager.getInstance().ShowMainGame();
        }

        UIManager.getInstance().openPopup(
            GameInfoPopup, 
            PopupName.GameInfo,
            data,
            (popupValue) =>
            {
                this.GameInfo = popupValue;
            }
        );
    }

    ShowMainGame()
    {
        console.warn("WTF " + this.username + " : " + this.phone);
        this.uiController.setFrameBoard(this.username, this.phone);
        this.uiController.playGirlWinAnim();

        this.scheduleOnce(()=>
        {
            this.uiController.hideFrameBoard();
            this.ShowGameInfo();
        }, 3);
        
        // if(this.MainGame)
        // {
        //     this.MainGame.showPopup();
        //     return;
        // }
        
        // var data = ()=>
        // {
        //     GameManager.getInstance().ShowGameInfo();
        // }

        // UIManager.getInstance().openPopup(
        //     GamePlayUI, 
        //     PopupName.GamePlay,
        //     data,
        //     (popupValue) =>
        //     {
        //         this.MainGame = popupValue;
        //     }
        // );
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

    public setUserInfo(name: string, phone: string)
    {
        console.warn("??????");
        this.username = name;
        this.phone = phone;

        this.setRoomName(name);
    }

    public getUserName(): string
    {
        return this.username;
    }

    public getPhoneNumer(): string
    {
        return this.phone;
    }



    ///////////////////////////////////////// For Debug Only ///////////////////////////////
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

