import { _decorator, EventTarget, RichText, Button, Sprite, ScrollView, SpriteFrame, log, Graphics, UITransform } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import { GameMenu } from '../UIScript/GameMenu';
import { RoomInfo } from '../Networks/RoomInfo';
import { API_TYPE, CONNECT_METHOD, GAME_TYPE, ServerConnect } from '../Networks/ServerConnect';
import { Utils } from '../Base/Utils';
import { UserInfo } from '../Networks/UserInfo';
import { ChannelManager } from '../Networks/ChannelManager';
import { ConsoleHelper } from '../Base/ConsoleHelper';
import { SHARE_LINK } from '../Base/helper';
import { WebsocketConnect } from '../Networks/WebsocketConnect';
import { AvatarLoader } from '../UIScript/AvatarLoader';
const { ccclass, property } = _decorator;

@ccclass('LobbyPopup')
export class LobbyPopup extends PopUpInstance {
   
    public static eventTarget = new EventTarget();
    public static AddNewPlayer = "AddPlayer";
    public static InitPlayers: UserInfo[]= [];

    private RoomName: string = "Default Room";

    @property(RichText)
    RoomNameText: RichText = null;

    @property(ScrollView)
    PlayerQueue: ScrollView = null;

    @property(Button)
    AddPlayer: Button = null;

    @property(SpriteFrame)
    NonPlayerSprite: SpriteFrame = null;

    @property(SpriteFrame)
    IsPlayerSprite: SpriteFrame = null;

    @property(Button)
    PlayGameBtn: Button = null;

    @property(Graphics)
    QRCode: Graphics;

    static QRCodeLink: string = "";

    private curNumberPlayer = 0;

    private maxPlayer = 0;

    private roomInfo: RoomInfo = null;
    
    onShow(data)
    {
        LobbyPopup.eventTarget.on(LobbyPopup.AddNewPlayer, this.ReceiveCurNumberOfPlayer, this);
        this.roomInfo = ChannelManager.getRoomInfo();
        console.log(this.roomInfo);
        if(data[1])
        {
            console.log(" This is Host ");
            WebsocketConnect.getInstance().screenLog( " This is Host " + JSON.stringify(this.roomInfo));
        }
        else
        {
            console.log("This is GUEST")
            this.PlayGameBtn.node.active = false; 
            WebsocketConnect.getInstance().screenLog(" This is GUEST " + this.AddPlayer.interactable + " " + JSON.stringify(this.roomInfo));
            WebsocketConnect.getInstance().InvokeRoom(this.roomInfo.getID())
        }
        this.setRoomInfo();
        this.getUrlFromServer();
        if(ChannelManager.isViewer())
            WebsocketConnect.getInstance().InvokePlayer(this.roomInfo.getID())
        // if(LobbyPopup.InitPlayers.length > 0)
        // {
        //     this.ReceiveCurNumberOfPlayer(LobbyPopup.InitPlayers);
        // }
    }

    start()
    {
        //@ts-ignore
        window.loadPNG = this.loadPNG;
    }

    onEnable()
    {
        LobbyPopup.eventTarget.on(GameMenu.PlayGameClick, this.hidePopup, this);
    }

    onDisable()
    {
        LobbyPopup.eventTarget.off(LobbyPopup.AddNewPlayer, this.ReceiveCurNumberOfPlayer, this);
        LobbyPopup.eventTarget.off(GameMenu.PlayGameClick, this.hidePopup, this);
    }

    setRoomInfo()
    {
        this.RoomNameText.string = ChannelManager.getRoomInfo().getName();
        this.maxPlayer = ChannelManager.getRoomInfo().getMaxPlayer();
        //this.ReceiveCurNumberOfPlayer(this.roomInfo.getCurPlayerNumber());

        log("Room Info Name " + this.RoomNameText.string);
        log("Room Info ID " + ChannelManager.getRoomInfo().getID());
        log("Room Info Host ID " + ChannelManager.getRoomInfo().getHostID());
        log("Room Info Cur Member " + ChannelManager.getRoomInfo().getCurPlayerNumber());
        log("Room Info Max Member " + ChannelManager.getRoomInfo().getMaxPlayer());
    }

    getUrlFromServer()
    {
        let params = new Map<string, any>();
        params.set("roomId", ChannelManager.getRoomInfo().getID());
        params.set("env", "live");

        let self = this;
        ServerConnect.getInstance().initConnection(
            ServerConnect.VITE_SOCKET_ENDPOINT,
            GAME_TYPE.RLGL,
            CONNECT_METHOD.GET,
            API_TYPE.JoinLink,
            params,
            null,
            null,
            () => {
                self.ReceiveQRCode(this.QRCode);
                self.PlayGameBtn.interactable = true;
            }
        );
    }

    ReceiveCurNumberOfPlayer(value: UserInfo[])
    {
        this.curNumberPlayer = value.length;
        log("Curent Player " + this.curNumberPlayer);

        WebsocketConnect.getInstance().screenLog(" Receive_PlayerState ")

        for(let i = 0; i < this.PlayerQueue.content.children.length; i++)
        {
            if(i < this.curNumberPlayer)
            {
                this.PlayerQueue.content.children[i].getComponent(AvatarLoader).loadAvatar(value[i].getAvatarUrl());
                
                if(!ChannelManager.checkPlayersInfo(value[i].getID()))
                {
                    ChannelManager.setPlayersInfo(value[i]);
                    console.log("Add Player Success")
                    WebsocketConnect.getInstance().screenLog("Add Player Success");
                }
                else
                {
                    console.log("Player Exist")
                    ChannelManager.getPlayersInfo()[i].setInitPos(value[i].getInitPos(), value[i].getFacing());
                    WebsocketConnect.getInstance().screenLog("Player Exist");
                }
            }
            else
            {
                this.PlayerQueue.content.children[i].getComponent(AvatarLoader).setAvatar(this.NonPlayerSprite);
            }
        }
    }

    ReceiveQRCode(target: Graphics, url = "")
    {
        if(url != "") LobbyPopup.QRCodeLink = url;
        console.log("QR Code URL: " + LobbyPopup.QRCodeLink);

        let width = target.node.getComponent(UITransform).contentSize.width;
        let height = target.node.getComponent(UITransform).contentSize.height;
        Utils.QRCreate(width, height, target, LobbyPopup.QRCodeLink);
    }

    AddNewPlayer(e, user: UserInfo = new UserInfo())
    {        
        this.curNumberPlayer++;
        if(user)
        {
            this.PlayerQueue.content.children[this.curNumberPlayer-1].getComponent(AvatarLoader).loadAvatar(user.getAvatarUrl());
        }
        else
        {
            this.PlayerQueue.content.children[this.curNumberPlayer-1].getComponent(AvatarLoader).setAvatar(this.IsPlayerSprite);    
        }
               
        this.roomInfo.setCurPlayerNumber(this.curNumberPlayer);
        ChannelManager.setPlayersInfo(user);

        if(this.curNumberPlayer == this.maxPlayer)
        {
            this.AddPlayer.interactable = false;
            this.AddPlayer.node.active = false;
            this.onClickClose();
        }
    }

    PopPlayer()
    {
        this.PlayerQueue.content.children[this.curNumberPlayer-1].getComponent(Sprite).spriteFrame = this.NonPlayerSprite;
        this.curNumberPlayer--;
        
        this.roomInfo.setCurPlayerNumber(this.curNumberPlayer);
    }

    onClickShareLink()
    {
        WebsocketConnect.getInstance().screenLog(LobbyPopup.QRCodeLink);
        ConsoleHelper.Instance.sendMessageToParent(SHARE_LINK, LobbyPopup.QRCodeLink)
    }

    onClickClose()
    {
        //LobbyPopup.eventTarget.emit(GameMenu.PlayGameClick);
        this.QRCode.node.active = false;
        this.connectPlayGame();
        this.hidePopup();  
    }

    private connectPlayGame()
    {
        let body = JSON.stringify(
            {
                roomId: this.roomInfo.getID()
            }
        )

        let params = new Map<string, any>();
        params.set("roomId", this.roomInfo.getID());

        console.log("Play Game to RoomID: " + body);

        ServerConnect.getInstance().initConnection(
            ServerConnect.VITE_SOCKET_ENDPOINT,
            GAME_TYPE.RLGL,
            CONNECT_METHOD.POST,
            API_TYPE.PlayGame,
            params,
            null,
            null,
            null
        );
    }
}

