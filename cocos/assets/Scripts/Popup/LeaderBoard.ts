import { _decorator, Button, CCInteger, Component, director, EventKeyboard, EventTarget, Game, Input, input, instantiate, KeyCode, Label, Light, log, Node, Prefab, RichText, ScrollView, sp, Sprite, SpriteFrame, tween, UITransform, Vec3 } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import { GameState, LightState, PlayerState } from '../GameState';
import { RankInfo } from '../UIScript/RankInfo';
import LocalStorageManager from '../Base/LocalStorageManager';
import { ServerConnect } from '../Networks/ServerConnect';
import { ChannelManager } from '../Networks/ChannelManager';
import { WebsocketConnect } from '../Networks/WebsocketConnect';
import { ZaloConnection } from '../Networks/ZaloConnection';
import { consoleEvent, onReceivedMessageEvent } from '../Base/ConsoleHelper';
import { UserInfo } from '../Networks/UserInfo';
const { ccclass, property } = _decorator;

@ccclass('LeaderBoard')
export class LeaderBoard extends PopUpInstance 
{
    @property(Prefab)
    Rank1_Prefabs: Prefab = null;

    @property(Prefab)
    Rank2_Prefabs: Prefab = null;

    @property(Prefab)
    Rank3_Prefabs: Prefab = null;

    @property(SpriteFrame)
    Rank1_Image: SpriteFrame = null;

    @property(SpriteFrame)
    Rank2_Image: SpriteFrame = null;

    @property(SpriteFrame)
    Rank3_Image: SpriteFrame = null;

    @property(SpriteFrame)
    Rank_Other_Image: SpriteFrame = null;

    @property(Prefab)
    Rank_Custom_Prefabs: Prefab = null;

    @property(Prefab)
    Player_Rank_Prefabs: Prefab = null;

    @property(ScrollView)
    PlayerRanks: ScrollView = null;

    @property(RankInfo)
    PlayerCurrentRankScript: RankInfo = null;

    @property(Button)
    PlayAgainBtn: Button = null;

    @property(CCInteger)
    StartPos: number = -70;

    @property(CCInteger)
    DistanceBetRanks: number = -110;

    @property(Label)
    Msg: Label = null;

    public static eventTarget: EventTarget = new EventTarget();
    public static SHOW_LEADERBOARD = "LeaderBoard";

    private numberOfPlayers: number = 10;
    private userRank = 1;
    private PlayerList: UserInfo[] = [];

    private UserRankNode: Node = null;

    onShow(data: UserInfo[])
    {
        this.PlayerList = data;
        this.numberOfPlayers = data.length;
        this.Msg.string = "" + this.numberOfPlayers;
        for(let i = 0; i < data.length; i++)
        {
            if(data[i].getID() == ChannelManager.getUserInfo().getID())
            {
                this.userRank = i+1;
                //break;
            }
            this.Msg.string += " Your Rank: " + this.userRank + " At idx: " + JSON.stringify(data[i]);
        }
        console.log("Total player " + this.numberOfPlayers);
        console.log("Player rank " + this.userRank);
        
        for(let i = 0; i < data.length; i++)
        {
            this.Msg.string += JSON.stringify(data[i]);
        }
    }

    start()
    {
        this.GenerateLeaderBoard();
        this.scheduleOnce(()=>
        {
            this.ShowUserCurrentRank();
        }, 1);
    }

    onClickPlayAgain()
    {
        ChannelManager.refreshRoom();
        ChannelManager.refreshGuest();
        ZaloConnection.getInstance().onClose();
        WebsocketConnect.getInstance().closeEventListener();
        ZaloConnection.isLogin = true;
        console.log("Play Again: " + (ZaloConnection.getInstance().GameMenu.enabled));
        
        console.log(JSON.stringify(ChannelManager.getRoomInfo()));
        console.log(JSON.stringify(ChannelManager.getUserInfo()));
        console.log(JSON.stringify(ChannelManager.getPlayersInfo().length));

        this.scheduleOnce(()=>
        {
            director.loadScene("LoadingScene");
        }, 1);
        
    }

    private GenerateLeaderBoard()
    {
        log("Total players: " + this.numberOfPlayers);

        this.PlayerRanks.content.destroyAllChildren();
        let size = this.PlayerRanks.content.getComponent(UITransform).contentSize;
        this.PlayerRanks.content.getComponent(UITransform).setContentSize(size.x, 110*(this.numberOfPlayers+1) + 25);
        for(let i = 0; i < this.numberOfPlayers; i++)
        {
            let rankInstance: Node = null;
            let correctRank = i+1;
            switch(i)
            {
                case 0:
                    rankInstance = instantiate(this.Rank1_Prefabs);
                    break;
                case 1:
                    rankInstance = instantiate(this.Rank2_Prefabs);
                    break;
                case 2:
                    rankInstance = instantiate(this.Rank3_Prefabs);
                    break;
                default:
                    rankInstance = instantiate(this.Rank_Custom_Prefabs);
                    rankInstance.getComponent(RankInfo)?.setRankValue(correctRank.toString());
                    break;
            }
            let name = this.PlayerList[i].getName(); //correctRank == this.userRank? "You're rank " : "Player rank "; 
            rankInstance.getComponent(RankInfo)?.setName(name);
            rankInstance.getComponent(RankInfo).loadAvatar(this.PlayerList[i].getAvatarUrl());
            rankInstance.parent = this.PlayerRanks.content;
            rankInstance.setPosition(new Vec3(0, this.StartPos + i*this.DistanceBetRanks, 0));

            if(correctRank == this.userRank)
            {
                this.UserRankNode = rankInstance;
            }
        }
    }

    private ShowUserCurrentRank()
    {
        log("User rank: " + this.userRank);
        switch(this.userRank)
        {
            case 1:
                this.PlayerCurrentRankScript.setRankSymbol(this.Rank1_Image);
                break;
            case 2:
                this.PlayerCurrentRankScript.setRankSymbol(this.Rank2_Image);
                break;
            case 3:
                this.PlayerCurrentRankScript.setRankSymbol(this.Rank3_Image);
                break;
            default:
                this.PlayerCurrentRankScript.setRankSymbol(this.Rank_Other_Image);
                break;
        }
        this.PlayerCurrentRankScript.setRankValue(this.userRank > 3 ? this.userRank.toString() : "");
        this.PlayerCurrentRankScript.setName(this.PlayerList[this.userRank-1].getName());
        this.PlayerCurrentRankScript.loadAvatar(this.PlayerList[this.userRank-1].getAvatarUrl());
    }

    update()
    {
        if(this.UserRankNode && this.numberOfPlayers > 7)
        {
            if(this.UserRankNode.worldPosition.y  >= 380 && this.UserRankNode.worldPosition.y <= 1100)
            {
                this.PlayerCurrentRankScript.node.active = false;
            }
            else
            {
                this.PlayerCurrentRankScript.node.active = true;
            }
        }
    }
}

