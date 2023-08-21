// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SoundManager from "./SoundManager";
import { getSoundName, SoundName } from "./SoundName";


import { _decorator, Component, Button, Enum } from 'cc';
const { ccclass, property } = _decorator;


@ccclass
export default class ButtonSound extends Component {
    @property({type: Enum(SoundName)})
    sound: SoundName = SoundName.SfxClick;

    onLoad () {
        var clickEventHandler = new Component.EventHandler();
        clickEventHandler.target = this.node; 
        clickEventHandler.component = "ButtonSound";
        clickEventHandler.handler = "callback";

        var button = this.node.getComponent(Button);
        
        button.clickEvents.push(clickEventHandler);
    }

    callback () {
        SoundManager.getInstance().play(getSoundName(this.sound));
    }
}
