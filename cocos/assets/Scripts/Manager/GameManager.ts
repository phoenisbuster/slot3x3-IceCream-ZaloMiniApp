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

const { ccclass, property } = _decorator;

const { ResultItem, LineData } = GameDefinedData.getAllRef();

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

    ///////////////////////////////////////// Set/Get Info ///////////////////////////////
    public setCheatLine()
    {
        this.CheatEditLine.placeholder = this.CheatEditLine.string;
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
            this.uiController.onRollBtnClickAnim();
    }

    onEndTurn(result: Map<number, InstanceType<typeof ResultItem>>[], callback: ()=>void = null)
    {
        // lineData.forEach((data, idx)=>
        // {
        //     var val1 = -1;
        //     var val2 = -1;
        //     var val3 = -1;
        //     data.line.forEach((order, id)=>
        //     {
        //         var val = result[order.row].get(order.col).result;
        //         switch(id)
        //         {
        //             case 0:
        //                 val1 = val;
        //                 break;

        //             case 1:
        //                 val2 = val;
        //                 break;

        //             case 2:
        //                 val3 = val;
        //                 break;
        //         }
        //     })
        // })
        if(result[0].get(0).result == result[1].get(0).result && result[0].get(0).result == result[2].get(0).result)
        {
            console.warn("WIN SYMBOL", result[0].get(0).result + 1);
        }

        if(result[0].get(1).result == result[1].get(1).result && result[0].get(1).result == result[2].get(1).result)
        {
            console.warn("WIN SYMBOL", result[0].get(1).result + 1);
        }

        if(result[0].get(2).result == result[1].get(2).result && result[0].get(2).result == result[2].get(2).result)
        {
            console.warn("WIN SYMBOL", result[0].get(2).result + 1);
        }

        if(result[0].get(0).result == result[1].get(1).result && result[0].get(0).result == result[2].get(2).result)
        {
            console.warn("WIN SYMBOL", result[0].get(0).result + 1);
        }

        if(result[2].get(0).result == result[1].get(1).result && result[2].get(0).result == result[0].get(2).result)
        {
            console.warn("WIN SYMBOL", result[2].get(0).result + 1);
        }
        
        callback && callback();
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

    private loadMainGamePopup(callback: ()=>void = null)
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

                callback && callback();
            }
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

