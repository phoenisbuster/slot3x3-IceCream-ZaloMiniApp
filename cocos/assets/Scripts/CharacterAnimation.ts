import { _decorator, Component, Node, animation, AnimationClip, AnimationManager, SkeletalAnimation, CCBoolean } from 'cc';
import { GameState, LightState } from './GameState';
const { ccclass, property } = _decorator;

export enum animationState{
    Idle = "Idle",
    Move = "Move",
    Death = "Death"
 }

@ccclass('CharacterAnimation')
export class CharacterAnimation extends Component {

    public animState: animationState = animationState.Idle;
    Idle = "Idle"
    Move = "Move"
    Death = "Death"

    // IS_MOVING: string = "isMoving";
    // DEATH: string = "Death";
    // RED_LIGHT: string = "RedLight";
    
    private anim: SkeletalAnimation

    //private animationController: animation.AnimationController; 

    start(){
        //this.animationController = this.node.getComponent(animation.AnimationController);
        this.anim = this.node.getComponent(SkeletalAnimation);
        this.anim.play(this.Idle)
    }

    stopMoving(){
        //this.animationController?.setValue(this.IS_MOVING,false
        this.animState = animationState.Idle;
        this.anim.play(this.Idle)
    }
    
    playMoving(){
        if(GameState.lightState == LightState.RedLight)
        {
            this.stopMoving();
            return;
        }

        if(!this.anim.getState("Move").isPlaying == true && this.animState == animationState.Move) 
        {
            this.anim.play(this.Move);
        }
        
        if(this.animState == animationState.Move) return;
        
        this.animState = animationState.Move;
        //this.animationController?.setValue(this.IS_MOVING,true);

    }

    playDeath(){
        this.animState = animationState.Death;
        this.anim.play(this.Death);
        //this.animationController?.setValue(this.DEATH, true);
        //this.stopMoving();
    }

    // stopDeath(){
    //     this.animationController?.setValue(this.DEATH, false);
    // }

    turnOnRedLight(){
        this.anim.pause()
        //this.animationController?.setValue(this.RED_LIGHT, true);
    }

    turnOnGreenLight(){
        this.anim.resume()
        //this.animationController?.setValue(this.RED_LIGHT, false);        
    }
}

