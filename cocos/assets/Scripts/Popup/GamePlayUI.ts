import { _decorator, Button, CCInteger, Component, EventKeyboard, EventTarget, Game, Input, input, KeyCode, Label, Light, log, Node, RichText, sp, Sprite, SpriteFrame } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import LocalStorageManager from '../Base/LocalStorageManager';
import SoundManager from '../Base/SoundManager';
import { getSoundName, SoundName } from '../Base/SoundName';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

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

    private onCallBackComplete: Function = null;

    private curTurnNumber = 0;

    private startSpin: boolean = false;
    private isSpinning: boolean = false;
    private spinFinish: boolean = false;

    private isWin = false;
    
    onShow(data: GamePlayUIData)
    {
        this.onCallBackComplete = data.callback;
        this.curTurnNumber = data.turn > 0? data.turn : this.defaultTurnNumber;

        this.turnLabel.string = "" + this.curTurnNumber;
        GameManager.getInstance().uiController.changeTurnNumber(this.curTurnNumber);
    }

    onClickClose()
    {
        this.onCallBackComplete && this.onCallBackComplete();
        this.hidePopup();
    }

    onEnable()
    {
        input.on(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    onDisable()
    {
        input.off(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    update()
    {
        
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
        GameManager.getInstance().uiController.changeTurnNumber(this.curTurnNumber);
        GameManager.getInstance().uiController.onRollBtnClickAnim();

        this.startSpin = true;
        this.rollBtn.interactable = false;

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

