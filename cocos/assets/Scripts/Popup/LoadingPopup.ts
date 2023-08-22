import { _decorator, Component, Node, EventTarget, Sprite, Director, director } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import SoundManager from '../Base/SoundManager';
import { getSoundName, SoundName } from '../Base/SoundName';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('LoadingPopup')
export class LoadingPopup extends PopUpInstance {
   
    public static eventTarget = new EventTarget();

    @property(Sprite)
    Logo: Sprite = null;

    private onLoadingComplete: Function = null;
    
    onShow(data: Function)
    {
        LoadingPopup.eventTarget.on(GameManager.LoadingComplete, this.onClickClose, this);
        
        this.onLoadingComplete = data;
        this.scheduleOnce(this.onClickClose, 1);
    }

    onDisable()
    {
        LoadingPopup.eventTarget.off(GameManager.LoadingComplete, this.onClickClose, this);
    }

    onClickClose()
    {
        this.onLoadingComplete && this.onLoadingComplete();
        this.hidePopup();
    }
}

