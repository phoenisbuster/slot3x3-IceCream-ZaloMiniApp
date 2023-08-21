import { _decorator, Component, Node, EventTarget, Button, RichText } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import SoundManager from '../Base/SoundManager';
import { getSoundName, SoundName } from '../Base/SoundName';
import { GameMenu } from '../UIScript/GameMenu';
const { ccclass, property } = _decorator;

@ccclass('GameInfoPopup')
export class GameInfoPopup extends PopUpInstance {
   
    public static eventTarget = new EventTarget();

    @property(Button)
    CreateRoomBtn: Button = null;

    @property(RichText)
    TimeText: RichText = null;

    @property(RichText)
    MaxPlayer: RichText = null;
    
    onShow(data)
    {
        //SoundManager.getInstance().play(getSoundName(SoundName.BGM));
    }

    onClickClose()
    {
        //SoundManager.getInstance().stop(getSoundName(SoundName.BGM));
        GameInfoPopup.eventTarget.emit(GameMenu.CreateRoomClick);
        this.hidePopup();
    }
}

