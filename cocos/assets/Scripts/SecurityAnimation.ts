import { _decorator, Component, Node, animation } from 'cc';
import SoundManager from './Base/SoundManager';
import { getSoundName, SoundName } from './Base/SoundName';
const { ccclass, property } = _decorator;

@ccclass('SecurityAnimation')
export class SecurityAnimation extends Component {
    SHOOTING = "Shooting"

    private animationController: animation.AnimationController; 
    start(){
        this.animationController = this.node.getComponent(animation.AnimationController);
    }
    playShoot(){
        this.animationController?.setValue(this.SHOOTING, true);
        SoundManager.getInstance().play(getSoundName(SoundName.SfxShotGun));

        this.schedule(()=>
        {
            this.animationController?.setValue(this.SHOOTING, false);
        }, 0, 0, 1);
    }
}

