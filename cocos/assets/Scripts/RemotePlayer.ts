import { _decorator, Component, EventTarget, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
import { ChannelManager } from './Networks/ChannelManager';
import { ServerConnect } from './Networks/ServerConnect';
import { CharacterAnimation, animationState } from './CharacterAnimation';
import { BloodEffect } from './BloodEffect';
import { ChangeMaterial } from './ChangeMaterial';
import { MapComp } from './MapComp';
const { ccclass, property } = _decorator;

@ccclass('RemotePlayer')
export class RemotePlayer extends Component {

    public static eventTarget: EventTarget = new EventTarget();
    public static RECEIVE_MOVE_SIGNAL = "RECEIVE_MOVE_SIGNAL";
    public static RECEIVE_END_MOVE_SIGNAL = "RECEIVE_END_MOVE_SIGNAL";
    public static LISTEN_DEAD_SIGNAL = "LISTEN_DEAD_SIGNAL";
    public static rotateBloodEffect = 0;


    bloodEffect: BloodEffect = null;

    idRemote = null;
    remoteName = null;
    lastPosition: Vec3 = Vec3.ZERO;

    @property(Node)
    PlayerName = null

    @property(ChangeMaterial)
    playerIndex: ChangeMaterial = null

    @property(CharacterAnimation)
    public characterAnimation: CharacterAnimation = null;

    onEnable()
    {
        RemotePlayer.eventTarget.on(RemotePlayer.RECEIVE_MOVE_SIGNAL, this.updatePlayerPosition, this);
        RemotePlayer.eventTarget.on(RemotePlayer.RECEIVE_END_MOVE_SIGNAL, this.endMove, this);
        RemotePlayer.eventTarget.on(RemotePlayer.LISTEN_DEAD_SIGNAL, this.deadAnimation, this);
    }


    onDisable()
    {
        RemotePlayer.eventTarget.off(RemotePlayer.RECEIVE_MOVE_SIGNAL, this.updatePlayerPosition, this);
        RemotePlayer.eventTarget.off(RemotePlayer.RECEIVE_END_MOVE_SIGNAL, this.endMove, this);
        RemotePlayer.eventTarget.off(RemotePlayer.LISTEN_DEAD_SIGNAL, this.deadAnimation, this);
    }

    start(){
        console.log(this.remoteName)
        this.bloodEffect = this.node.getComponent(BloodEffect)
        this.PlayerName.getComponent(Label).string = this.remoteName
    }

    setIndex(num: number){
        this.playerIndex.setUserNumber(num + 1)
        this.node.setPosition(MapComp.getInstance().getStartPosByIndex(num));
    }    
    
    updatePlayerPosition(payload)
    {
        if(this.idRemote == payload.userAppId){
            if(this.characterAnimation.animState == animationState.Idle) {
                this.characterAnimation.animState = animationState.Move;
                this.characterAnimation.playMoving();
            }
            this.node.setPosition(payload.x,0,payload.y)
            this.node.setWorldRotationFromEuler(0, payload.facing, 0);
            this.PlayerName.setWorldRotationFromEuler(0,0,0);
        }
        this.lastPosition = this.node.getPosition();
    }

    endMove(payload){
        if(this.idRemote != payload) return;
        this.characterAnimation.stopMoving();
    }

    deadAnimation(payload){
        if(this.idRemote == payload){
            this.characterAnimation.playDeath();
            this.bloodEffect.enabled = true;
        }
    }

}

