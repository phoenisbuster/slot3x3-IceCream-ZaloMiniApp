import { _decorator, Component, Node, log, random, Sprite, SpringJoint2D, instantiate, director, input, Input, EventKeyboard, KeyCode, UITransform, sp, Skeleton, Label, CCInteger, CCBoolean, EditBox } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import { PopupName } from '../Base/PopupName';
import UIManager from '../Base/UIManager';
import { GameInfoPopup } from '../Popup/GameInfoPopup';
import { LoadingPopup } from '../Popup/LoadingPopup';
import { ZaloConnection } from '../Networks/ZaloConnection';
import { GamePlayUI } from '../Popup/GamePlayUI';
import { UIController } from './UIController';
import { GameDefinedData } from './GameDefinedData';
import { MyGameUtils } from '../Base/MyGameUtils';
import { RewardPopup } from '../Popup/RewardPopup';

const { ccclass, property } = _decorator;

const { ResultItem, LineData, RewardData } = GameDefinedData.getAllRef();

const lineData = LineData.getData();

@ccclass('GameManager')
export class GameManager extends Component 
{
    private static _instance: GameManager = null;
    
    @property(Node)
    MainCanvas: Node = null;
    
    @property(Sprite)
    MainBG: Sprite = null;

    @property(Node)
    PopupLayout: Node = null;

    @property(Node)
    UILayout: Node = null;

    @property(Node)
    BtnLayout: Node = null;

    @property(Node)
    RewardLayout: Node = null;

    @property(Node)
    CheatLayout: Node = null;

    @property(UIController)
    private uiController: UIController = null;

    @property(Node)
    UIManagerNode: Node = null;

    @property(Node)
    SoundManagerNode: Node = null;

    @property(EditBox)
    CheatEditLine: EditBox = null;

    @property(EditBox)
    CheatEditSymbol: EditBox = null;

    @property(Node)
    AudioNode: Node = null;

    @property(CCInteger)
    defaultTurn: number = 5;

    @property(CCBoolean)
    private isCheat: boolean = false;

    private cheatVal: string = "-1";
    
    public static CreateRoomClick: string = "CreateRoomClick";
    public static CreateRoomCancel: string = "CreateRoomCancel";
    public static CreateRoomOK: string = "CreateRoomOK";
    public static PlayGameClick: string = "PlayGameClick";
    public static LoadingComplete: string = "FinishLoading";

    private GameInfo: PopUpInstance = null;
    private MainGame: PopUpInstance = null;
    private Loading: PopUpInstance = null;
    private Reward: PopUpInstance = null;

    private curRoomName: string = "";
    private username: string = "";
    private phone: string = "";

    private curTurnNumber: number = 0;

    static getInstance(): GameManager 
    {
        return GameManager._instance;
    }

    private createInstance()
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

    protected onLoad()
    {
        this.createInstance();
        this.loadAllPopup();
    }

    protected start()
    {
        this.curTurnNumber = this.defaultTurn;
        this.showLoadingPopup();

        this.CheatLayout.active = this.isCheat;
    }

    protected onEnable()
    {
        ZaloConnection.eventTarget.on("test", this.showGameInfo, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    protected onDisable()
    {
        ZaloConnection.eventTarget.off("test", this.showGameInfo, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    protected onDestroy()
    {
        delete GameManager._instance;
        GameManager._instance = null;
    }

    ///////////////////////////////////////// Show Popup ///////////////////////////////
    showCheat()
    {
        this.CheatLayout.active = !this.CheatLayout.active;
        this.isCheat = this.CheatLayout.active;
    }

    showLoadingPopup()
    {
        this.uiController.loadingState();

        if(this.Loading)
        {
            this.Loading.showPopup();
            return;
        }
        else
        {
            this.loadLoadingPopup(this.showLoadingPopup);
        }
    }

    showGameInfo(playAgain: boolean = false)
    {
        this.uiController.getUserInfoState(playAgain);
        
        if(this.GameInfo)
        {
            this.GameInfo.showPopup();
            return;
        }
        else
        {
            this.loadGameInfoPopup(this.showGameInfo);
        }
    }

    showMainGame()
    {
        this.uiController.getUserInfoFinish(this.username, this.phone);
        
        if(this.MainGame)
        {
            var data = {
                callback: null,
                turn: this.curTurnNumber
            }
            
            this.MainGame.open(data);
            return;
        }
        else
        {
            this.loadMainGamePopup(this.showMainGame);
        }
    }

    showRewardPopup(rewardQueue: number[], onComplete: ()=>void = null)
    {
        if(this.Reward)
        {
            var data = {
                callback: onComplete,
                name: this.username,
                phone: this.phone,
                reward: rewardQueue
            }
            
            this.Reward.open(data);
            return;
        }
        else
        {
            this.loadRewardPopup();
        }
    }

    ///////////////////////////////////////// Set/Get Info ///////////////////////////////
    public setCheatLine()
    {
        this.CheatEditLine.placeholder = "Line: " + this.CheatEditLine.string;
        this.cheatVal = this.CheatEditLine.string;
        this.CheatEditLine.string = "";
    }

    public getCheatEnable(): boolean
    {
        return this.isCheat;
    }

    public getCheatLineValue(): number
    {
        var val = -1;
        try
        {
            val = parseInt(this.cheatVal);
        }
        catch
        {
            this.cheatVal = "-1";
            val = -1;
        }
        return val;
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

    public changeTurn(turn: number, isRoll: boolean)
    {
        this.curTurnNumber = turn;
        this.uiController.changeTurnNumber(this.curTurnNumber);

        if(isRoll)
        {
            this.uiController.onRollBtnClickAnim();
            this.uiController.showHideBackBtnSprite(false);
        }
    }

    public onEndTurn(result: Map<number, InstanceType<typeof ResultItem>>[], 
                    callback: (data: InstanceType<typeof RewardData>[])=>void = null,
                    onComplete: ()=>void = null)
    {
        const rewardData: InstanceType<typeof RewardData>[] = [];
        const rewardPopupData: number[] = [];

        lineData.forEach((data, idx)=>
        {
            var val: number[] = [];

            for(let i = 0; i < data.line.length; i++) 
            {
                val.push(result[data.line[i].row].get(data.line[i].col).result);
            }

            if(val.length == data.line.length && MyGameUtils.allEleEqual(val))
            {
                console.warn("WIN SYMBOL", val[0] + 1);
                rewardPopupData.push(val[0]);
                for(let i = 0; i < data.line.length; i++) 
                {
                    rewardData.push(new RewardData(data.line[i].col, data.line[i].row, val[0]));
                }
            }
        })
        
        this.onReward(rewardPopupData, onComplete);
        callback && callback(rewardData);
    }

    public onReward(rewardQueue: number[], onComplete: ()=>void = null)
    {
        this.scheduleOnce(()=>
        {
            this.showRewardPopup(rewardQueue, onComplete);
        }, 1);
    }

    public onEndGame()
    {
        this.uiController.outOfTurnState(()=>
        {
            this.MainGame.hidePopup();
            GameManager.getInstance().showGameInfo(true);
            GameManager.getInstance().onResetGame();
        });
    }

    public onResetGame()
    {
        this.curTurnNumber = this.defaultTurn;
    }

    ///////////////////////////////////////// Load All Popup ///////////////////////////////
    private loadAllPopup()
    {
        this.loadLoadingPopup();
        this.loadGameInfoPopup();
        this.loadMainGamePopup();
        this.loadRewardPopup();
    }
    
    private loadLoadingPopup(callback: ()=>void = null)
    {
        var data = ()=>
        {
            GameManager.getInstance().showGameInfo(false);
        }
        
        UIManager.getInstance().openPopup(
            LoadingPopup, 
            PopupName.Loading,
            data,
            (popupValue) => 
            {
                this.Loading = popupValue;
                this.Loading.node.active = false;

                callback && callback();
            }
        );
    }

    private loadGameInfoPopup(callback: ()=>void = null)
    {
        var data = ()=>
        {
            GameManager.getInstance().showMainGame();
        }

        UIManager.getInstance().openPopup(
            GameInfoPopup, 
            PopupName.GameInfo,
            data,
            (popupValue) =>
            {
                this.GameInfo = popupValue;
                this.GameInfo.node.active = false;

                callback && callback();
            }
        );
    }

    private loadMainGamePopup(_callback: ()=>void = null)
    {
        var data = {
            callback: ()=>
            {
                GameManager.getInstance().showGameInfo(true);
                GameManager.getInstance().onResetGame();
            },
            turn: this.defaultTurn
        }

        UIManager.getInstance().openPopup(
            GamePlayUI, 
            PopupName.GamePlay,
            data,
            (popupValue) =>
            {
                this.MainGame = popupValue;
                this.MainGame.node.active = false;

                _callback && _callback();
            }
        );
    }

    private loadRewardPopup(_callback: ()=>void = null)
    {
        var data = {
            callback: ()=>
            {   
                console.warn("Default Call Back RewardPopup Called");
                GameManager.getInstance().onEndGame();
            },
            name: "",
            phone: "",
            reward: []
        }

        UIManager.getInstance().openPopup(
            RewardPopup, 
            PopupName.Reward,
            data,
            (popupValue) =>
            {
                this.Reward = popupValue;
                this.Reward.node.active = false;

                _callback && _callback();
            },
            this.RewardLayout
        );
    }

    ///////////////////////////////////////// For Debug Only ///////////////////////////////
    private onKeyPress(event: EventKeyboard)
    {
        // if(event.keyCode == KeyCode.DIGIT_1)
        // {
        //     console.log("Main Canvas size: " + this.MainCanvas.getComponent(UITransform).contentSize);
        //     console.log("Main Layout size: " + this.MainLayout.getComponent(UITransform).contentSize);
        //     console.log("Main Layout size: " + this.MainBG.getComponent(UITransform).contentSize);
        //     console.log("Main Layout size: " + this.UIManagerNode.getComponent(UITransform).contentSize);
        // }
        // else if(event.keyCode == KeyCode.DIGIT_2)
        // {
        //     console.log("Main Logo size: " + this.MainLogo.getComponent(UITransform).contentSize);
        //     console.log("Main Logo local pos: " + this.MainLogo.node.position);
        //     console.log("Main Logo world pos: " + this.MainLogo.node.worldPosition);
        // }
    }
}

        // if(result[0].get(0).result == result[1].get(0).result && result[0].get(0).result == result[2].get(0).result)
        // {
        //     console.warn("WIN SYMBOL", result[0].get(0).result + 1);
        //     rewardData.push(new RewardData(0, 0, result[0].get(0).result));
        //     rewardData.push(new RewardData(0, 1, result[0].get(0).result));
        //     rewardData.push(new RewardData(0, 2, result[0].get(0).result));
        // }

        // if(result[0].get(1).result == result[1].get(1).result && result[0].get(1).result == result[2].get(1).result)
        // {
        //     console.warn("WIN SYMBOL", result[0].get(1).result + 1);
        //     rewardData.push(new RewardData(1, 0, result[0].get(1).result));
        //     rewardData.push(new RewardData(1, 1, result[0].get(1).result));
        //     rewardData.push(new RewardData(1, 2, result[0].get(1).result));
        // }

        // if(result[0].get(2).result == result[1].get(2).result && result[0].get(2).result == result[2].get(2).result)
        // {
        //     console.warn("WIN SYMBOL", result[0].get(2).result + 1);
        //     rewardData.push(new RewardData(2, 0, result[0].get(2).result));
        //     rewardData.push(new RewardData(2, 1, result[0].get(2).result));
        //     rewardData.push(new RewardData(2, 2, result[0].get(2).result));
        // }

        // if(result[0].get(0).result == result[1].get(1).result && result[0].get(0).result == result[2].get(2).result)
        // {
        //     console.warn("WIN SYMBOL", result[0].get(0).result + 1);
        //     rewardData.push(new RewardData(0, 0, result[0].get(0).result));
        //     rewardData.push(new RewardData(1, 1, result[0].get(0).result));
        //     rewardData.push(new RewardData(2, 2, result[0].get(0).result));
        // }

        // if(result[2].get(0).result == result[1].get(1).result && result[2].get(0).result == result[0].get(2).result)
        // {
        //     console.warn("WIN SYMBOL", result[2].get(0).result + 1);
        //     rewardData.push(new RewardData(0, 2, result[2].get(0).result));
        //     rewardData.push(new RewardData(1, 1, result[2].get(0).result));
        //     rewardData.push(new RewardData(2, 0, result[2].get(0).result));
        // }

