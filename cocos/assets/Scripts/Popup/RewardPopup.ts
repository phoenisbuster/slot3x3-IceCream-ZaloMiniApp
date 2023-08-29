import { _decorator, Button, Component, Label, Node, sp } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import { ScreenShotComp } from '../Base/ScreenShotComp';
import { Audio } from '../Manager/Audio';
import { getSoundName, SoundName } from '../Base/SoundName';
import SoundManager from '../Base/SoundManager';
const { ccclass, property } = _decorator;

export interface RewardPopupData
{
    callback: ()=>void,
    name: string,
    phone: string,
    reward: number[]
}

@ccclass('RewardPopup')
export class RewardPopup extends PopUpInstance 
{
    public static eventTarget = new EventTarget();

    @property(Button)
    screenShotBtn: Button = null;

    @property(Label)
    nameLabel: Label = null;

    @property(Label)
    phoneLabel: Label = null;

    @property(sp.Skeleton)
    rewardAnim: sp.Skeleton = null;

    private onCallBackComplete: ()=>void = null;
    private rewardQueue: number[] = [];
    private isJackpot: boolean = false;

    private currentSkinName: string = "default";
    
    onShow(data: RewardPopupData)
    {
        this.onCallBackComplete = data.callback;

        this.nameLabel.string = data.name;
        this.phoneLabel.string = data.phone;
        this.rewardQueue = data.reward.filter(this.onlyUnique);

        this.onPlayAnimReward();
    }

    onClickClose()
    {
        this.isJackpot = false;
        this.nameLabel.string = "";
        this.phoneLabel.string = "";
        this.rewardQueue = [];
        
        this.onCallBackComplete && this.onCallBackComplete();
        this.hidePopup();
    }

    onClickScreenShot()
    {
        console.warn("Screen Shot Begin");
        this.screenShotBtn.interactable = false;
        this.screenShotBtn.node.active = false;
        
        this.scheduleOnce(()=>
        {
            ScreenShotComp.getInstance().capture(false, false, true, ()=>
            {
                this.playEndAnim();
                console.warn("Screen Shot Finish");
            });
        }, 0.5);

        
    }

    onPlayAnimReward(callback: ()=>void = null)
    {
        if(this.rewardQueue.length <= 0)
        {
            callback && callback();
            this.hidePopup();
            return;
        }

        this.rewardQueue.forEach((val)=>
        {
            if(val == 7)
            {
                console.warn("JACK POT DISPLAY", val);

                this.isJackpot = true;
                this.playJackpotAnim();
                return;
            }
        });
        
        if(!this.isJackpot)
            this.playSymbolAnim(this.rewardQueue.pop());
    }

    private onlyUnique(value, index, array) 
    {
        return array.indexOf(value) === index;
    }

    private playSymbolAnim(symbol: number = 1)
    {
        if(symbol == 7)
        {
            if(this.rewardQueue.length <= 0)
                this.onClickClose();

            return;
        }   

        SoundManager.getInstance().play(getSoundName(SoundName.SfxReward));
        
        this.screenShotBtn.interactable = false;
        this.currentSkinName = "symbol" + (symbol+1);
        
        this.setAnimation(this.rewardAnim, this.currentSkinName, "in", false, 0, 1, ()=>
        {
            this.screenShotBtn.interactable = true;
            this.setAnimation(this.rewardAnim, this.currentSkinName, "loop", true, 0, 1, ()=>
            {
                
            });
        });
    }

    private playJackpotAnim()
    {
        SoundManager.getInstance().play(getSoundName(SoundName.SfxJackpot));
        
        this.screenShotBtn.interactable = false;
        this.currentSkinName = "symbol_jp";
        
        this.setAnimation(this.rewardAnim, this.currentSkinName, "in_jp", false, 0, 1, ()=>
        {
            this.screenShotBtn.interactable = true;
            this.setAnimation(this.rewardAnim, this.currentSkinName, "loop_jp", true, 0, 1, ()=>
            {
            
            });
        });
    }

    private playEndAnim()
    {
        var animName: string = this.isJackpot? "out_jp" : "out";
        
        this.setAnimation(this.rewardAnim, this.currentSkinName, animName, false, 0, 1, ()=>
        {
            this.screenShotBtn.node.active = true;
            if(this.isJackpot)
            {
                SoundManager.getInstance().stop(getSoundName(SoundName.SfxJackpot));
                this.isJackpot = false;
            }
            
            if(this.rewardQueue.length > 0)
            {
                console.warn("Still More Reward");
                this.playSymbolAnim(this.rewardQueue.pop());
            }
            else
            {
                console.warn("Done Reward");
                this.onClickClose();
            }
        });
    }

    /////////////////////////////////////////// SPINE ANIM /////////////////////////////////////////
    private setAnimation(skeleton: sp.Skeleton = null, 
        skin: string = "default",
        animationName: string = "animation", 
        loop: boolean = false, 
        startTime: number = 0, 
        timeScale: number = 1,
        callback: ()=>void = null) 
    {
        if(!skeleton)
        {
            return;
        }
        skeleton.setSkin(skin);
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
}

