import { _decorator, Button, CCInteger, Component, EventKeyboard, EventTarget, Game, Input, input, KeyCode, Label, Light, log, Node, RichText, sp, Sprite, SpriteFrame } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import { SoundName } from '../Base/SoundName';
import { GameManager } from '../Manager/GameManager';
import { SlotManager } from '../Manager/ShotMechanism/SlotManager';
import { GameDefinedData } from '../Manager/GameDefinedData';
import { Audio } from '../Manager/Audio';

const { ccclass, property } = _decorator;

const { ResultItem, RewardData } = GameDefinedData.getAllRef();

export interface GamePlayUIData
{
    callback: ()=>void,
    turn: number
}

@ccclass('GamePlayUI')
export class GamePlayUI extends PopUpInstance 
{
    @property(Button)
    backBtn: Button = null;

    @property(Button)
    rollBtn: Button = null;

    @property(Label)
    turnLabel: Label = null;

    @property(CCInteger)
    defaultTurnNumber: number = 10;

    private slotManager: SlotManager = null;

    private onCallBackComplete: Function = null;

    private curTurnNumber = 0;

    private startSpin: boolean = false;
    private isSpinning: boolean = false;
    private spinFinish: boolean = false;

    private isWin = false;

    onLoad() 
    {
        this.slotManager = this.getComponentInChildren(SlotManager);
        this.slotManager?.event?.on("finish", this.onFinishRoll, this);
    }

    start() 
    {
        this.slotManager?.initData();
    }

    onEnable()
    {
        input.on(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    onDisable()
    {
        input.off(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    onDestroy() 
    {
        this.slotManager?.event?.off("finish", this.onFinishRoll, this);
    }
    
    onShow(data: GamePlayUIData)
    {
        if(!this.onCallBackComplete)
            this.onCallBackComplete = data.callback;

        this.curTurnNumber = data.turn > 0? data.turn : this.defaultTurnNumber;
        this.turnLabel.string = "" + this.curTurnNumber;
        GameManager.getInstance().changeTurn(this.curTurnNumber, false);

        this.resetState();
    }

    onClickClose()
    {
        this.onCallBackComplete && this.onCallBackComplete();
        this.hidePopup();
    }

    /////////////////////////////////////////// BUTTON CALL /////////////////////////////////////////
    onClickBackBtn()
    {
        this.onClickClose();
    }

    onClickRoll()
    {
        if(this.curTurnNumber <= 0)
            return;

        if(this.isSpinning)
            return;

        this.curTurnNumber--;
        this.turnLabel.string = "" + this.curTurnNumber;
        GameManager.getInstance().changeTurn(this.curTurnNumber, true);

        this.onStartRoll();
    }

    /////////////////////////////////////////// Game State /////////////////////////////////////////
    private onStartRoll()
    {
        this.startSpin = true;
        this.isSpinning = false;
        this.spinFinish = false;

        this.rollBtn.interactable = false;
        this.backBtn.interactable = false;

        this.slotManager?.spin(()=>
        {
            this.onSpinning();
        });
    }

    private onSpinning()
    {
        this.startSpin = false;
        this.isSpinning = true;
        this.spinFinish = false;
    }

    private onFinishRoll(result: Map<number, InstanceType<typeof ResultItem>>[])
    {
        this.startSpin = false;
        this.isSpinning = false;
        this.spinFinish = true;

        GameManager.getInstance().onEndTurn(result, 
                                            (rewardData: InstanceType<typeof RewardData>[])=>
                                            {
                                                this.slotManager.receiveReward(rewardData, ()=>
                                                {
                                                    
                                                });
                                            },
                                            ()=>
                                            {
                                                this.onFinishTurn();
                                            }
        );
    }

    private onFinishTurn()
    {
        //TODO: Waiting the Animation Reward to Finish + User Finish ScreenShot, Then Call This
        // this.scheduleOnce(()=>
        // {
        //     console.warn("FINISH STATE ON UI");
        //     this.resetState();
        // }, 1);

        console.warn("FINISH STATE ON UI");
        this.resetState();
    }

    private resetState()
    {
        this.startSpin = false;
        this.isSpinning = false;
        this.spinFinish = false;

        if(this.curTurnNumber == 0)
        {
            this.rollBtn.interactable = false;
            this.backBtn.interactable = false;
            GameManager.getInstance().onEndGame();
        }
        else
        {
            this.backBtn.interactable = true;
            this.rollBtn.interactable = true;
        }

        // this.slotManager.resetResult();
    }

    /////////////////////////////////////////// SPINE ANIM /////////////////////////////////////////
    private setAnimation(skeleton: sp.Skeleton = null, 
        animationName: string = "animation", 
        loop: boolean = false, 
        startTime: number = 0, 
        timeScale: number = 1, 
        callback: ()=>void = null) 
    {
        if(!skeleton)
        {
            // skeleton = this.girlAnim;
            return;
        }
        let state = skeleton.setAnimation(0, animationName, loop) as sp.spine.TrackEntry;

        skeleton.setCompleteListener((x: sp.spine.TrackEntry)=>
        {
            callback && callback();
        });

        if(state)
        { 
            state.animationStart = startTime;
        }
        skeleton.timeScale = timeScale;
    }

    ///////////////////////////////////////// For Debug Only ///////////////////////////////
    private onKeyPress(event: EventKeyboard)
    {
        
    }
}

