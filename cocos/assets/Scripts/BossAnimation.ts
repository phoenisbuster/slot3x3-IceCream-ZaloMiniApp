import { _decorator, Component, animation } from 'cc';
import { GamePlayUI } from './Popup/GamePlayUI';
import { GameState, LightState } from './GameState';
import SoundManager from './Base/SoundManager';
import { getSoundName, SoundName } from './Base/SoundName';
const { ccclass, property } = _decorator;

@ccclass('BossAnimation')
export class BossAnimation extends Component {
    REDLIGHT = "RedLight"

    private animationController: animation.AnimationController; 
    start(){
        this.animationController = this.node.getComponent(animation.AnimationController);
    }
    onEnable()
    {
        GamePlayUI.eventTarget.on(GamePlayUI.CHANGE_LIGHT, this.toggleLight, this);
    }

    onDisable()
    {
        GamePlayUI.eventTarget.off(GamePlayUI.CHANGE_LIGHT, this.toggleLight, this);
    }

    toggleLight(){
        if(GameState.lightState == LightState.RedLight){
            this.animationController?.setValue(this.REDLIGHT, true);
            SoundManager.getInstance().play(getSoundName(SoundName.SfxRobot));
        }
        else{
            this.animationController?.setValue(this.REDLIGHT, false);
            SoundManager.getInstance().stop(getSoundName(SoundName.SfxRobot));
        }
    }

    onDestroy(){
        SoundManager.getInstance()?.stop(getSoundName(SoundName.SfxRobot));
    }
}

