import { _decorator, Component, Node, EventTarget, Button, RichText, EditBox, Sprite } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import SoundManager from '../Base/SoundManager';
import { getSoundName, SoundName } from '../Base/SoundName';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameInfoPopup')
export class GameInfoPopup extends PopUpInstance {
   
    public static eventTarget = new EventTarget();

    @property(Button)
    playGameBtn: Button = null;

    @property(EditBox)
    nameInput: EditBox = null;

    @property(EditBox)
    phoneInput: EditBox = null;

    private onCallBackComplete: Function = null;

    private username: string = "";
    private phone: string = "";
    
    onShow(data: Function)
    {
        this.onCallBackComplete = data;
        this.checkEnablePlayGameBtn();
    }

    onClickClose()
    {
        this.onCallBackComplete && this.onCallBackComplete();
        this.hidePopup();
    }

    onEditNameComplete()
    {
        this.username = this.nameInput.string;

        this.checkEnablePlayGameBtn();
    }

    onEditPhoneComplete()
    {
        this.phone = this.phoneInput.string;

        this.checkEnablePlayGameBtn();
    }

    onPlayGameClick()
    {
        if(this.username == "" || this.phone == "")
            return;
        
        GameManager.getInstance().setUserInfo(this.username, this.phone);
        this.onClickClose();
    }

    private checkEnablePlayGameBtn()
    {
        if(this.username != "" && this.phone != "")
            this.enablePlayGameBtn();
        else
            this.disablePlayGameBtn();
    }

    private enablePlayGameBtn()
    {
        this.playGameBtn.interactable = true;
        // this.playGameBtn.getComponent(Sprite).grayscale = false;
    }

    private disablePlayGameBtn()
    {
        this.playGameBtn.interactable = false;
        // this.playGameBtn.getComponent(Sprite).grayscale = true;
    }
}

