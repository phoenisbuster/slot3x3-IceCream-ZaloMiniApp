import { _decorator, Component, Node, EventTarget, Button, RichText, EditBox } from 'cc';
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
    }

    onClickClose()
    {
        this.onCallBackComplete && this.onCallBackComplete();
        this.hidePopup();
    }

    onEditNameComplete()
    {
        this.nameInput.placeholder = this.nameInput.string;
        this.username = this.nameInput.string;

        this.nameInput.string = "";
    }

    onEditPhoneComplete()
    {
        this.phoneInput.placeholder = this.phoneInput.string;
        this.phone = this.phoneInput.string;

        this.phoneInput.string = "";
    }

    onPlayGameClick()
    {
        GameManager.getInstance().setUserInfo(this.username, this.phone);
        this.onClickClose();
    }
}

