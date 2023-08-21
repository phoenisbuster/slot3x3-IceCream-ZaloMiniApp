import { _decorator, Component, Node, EventTarget, Sprite, Director, director } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import SoundManager from '../Base/SoundManager';
import { getSoundName, SoundName } from '../Base/SoundName';
import { GameMenu } from '../UIScript/GameMenu';
const { ccclass, property } = _decorator;

@ccclass('LoadingPopup')
export class LoadingPopup extends PopUpInstance {
   
    public static eventTarget = new EventTarget();

    @property(Sprite)
    Logo: Sprite = null;
    
    onShow(data)
    {
        LoadingPopup.eventTarget.on(GameMenu.LoadingComplete, this.onClickClose, this);
        LoadingPopup.eventTarget.emit(GameMenu.LoadingComplete);
    }

    onDisable()
    {
        LoadingPopup.eventTarget.off(GameMenu.LoadingComplete, this.onClickClose, this);
    }

    onClickClose()
    {
        this.scheduleOnce(this.LoadMainScene, 1);
        //this.hidePopup()
    }

    private LoadMainScene()
    {
        director.loadScene("main");
    }
}

