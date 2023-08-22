import { _decorator, Button, Component, EventKeyboard, EventTarget, Game, Input, input, KeyCode, Label, Light, log, Node, RichText, sp, Sprite, SpriteFrame } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import LocalStorageManager from '../Base/LocalStorageManager';
import { ChannelManager } from '../Networks/ChannelManager';
import SoundManager from '../Base/SoundManager';
import { getSoundName, SoundName } from '../Base/SoundName';
const { ccclass, property } = _decorator;

@ccclass('GamePlayUI')
export class GamePlayUI extends PopUpInstance 
{
    @property(RichText)
    TimeText: RichText = null;

    @property(Sprite)
    Light: Sprite = null;
    
    @property(Button)
    ChangeLight: Button = null;

    @property(sp.Skeleton)
    WinLoseAnim: sp.Skeleton = null;

    @property(SpriteFrame)
    GreenLightSprite: SpriteFrame = null;

    @property(SpriteFrame)
    RedLightSprite: SpriteFrame = null;

    @property(Label)
    Msg: Label = null;

    private isWin = false;

    public static eventTarget: EventTarget = new EventTarget();
    public static CHANGE_LIGHT: string = "ChangeLightSignal";
    public static RECEIVE_LIGHT_SIGNAL: string = "LightSignalFromServer";
    public static TIME_COUNT: string = "TimeCount";
    public static FINISH_GAME: string = "EndGame";

    static Anim_Win: string = "win";
    static Anim_Lose: string = "lose";
    
    onShow(data)
    {
        // log("Check ANIM Avalable " + this.WinLoseAnim.node.active);
        // this.WinLoseAnim.enabled = false; 

        // this.Msg.string = JSON.stringify(ChannelManager.getRoomInfo());
        // this.Msg.string += JSON.stringify(ChannelManager.getUserInfo());

        // ChannelManager.getPlayersInfo().forEach(ele=>
        // {
        //     this.Msg.string += JSON.stringify(ele);
        // })
    }

    onEnable()
    {
        input.on(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    onDisable()
    {
        input.off(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }

    setAnimation(skeleton: sp.Skeleton = null, animationName: string = "animation", loop: boolean = false, startTime: number = 0, timeScale: number = 1) 
    {
        if(!skeleton)
        {
            skeleton = this.WinLoseAnim;
        }
        let state = skeleton.setAnimation(0, animationName, loop) as sp.spine.TrackEntry;
        if(state)
        { 
            state.animationStart = startTime;
        }
        skeleton.timeScale = timeScale;
    }

    onClickChangeLight()
    {
        
    }

    onReceiveTimeUpdate(value: number)
    {
        this.TimeText.string = "<color=#fdff66>" + value.toString() + "</color>";
    }

    private PlayAnimEnding(isWin: boolean = false, disableAfterPlay: boolean = false)
    {
        if(ChannelManager.isViewer()) return;
        this.WinLoseAnim.enabled = true;
        let name = isWin? GamePlayUI.Anim_Win : GamePlayUI.Anim_Lose;
        this.setAnimation(this.WinLoseAnim, name, false);
        let sfx = isWin? SoundName.SfxWin : SoundName.SfxLose;
        SoundManager.getInstance().play(getSoundName(sfx));

        if(disableAfterPlay)
        {
            this.scheduleOnce(()=>
            {
                this.WinLoseAnim.enabled = false;
            }, 3);
        }
    }

    private onKeyPress(event: EventKeyboard)
    {
        if(event.keyCode == KeyCode.SPACE)
        {
            this.PlayAnimEnding(true, true);
        }
        else if(event.keyCode == KeyCode.SHIFT_LEFT)
        {
            this.PlayAnimEnding(false, true);
        }
    }

    update()
    {
        //this.onReceiveGameState(GameState.playerState);
    }
}

