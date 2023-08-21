import { _decorator, Component, CCInteger, Input, Vec2, Node, Label} from 'cc';
import { CharacterAnimation, animationState } from './CharacterAnimation';
import { InputComp } from './InputComp';
import { GameState, LightState, PlayerState } from './GameState';
import { SecurityAnimation } from './SecurityAnimation';
import { GamePlayUI } from './Popup/GamePlayUI';
import { BloodEffect } from './BloodEffect';
import { WebsocketConnect } from './Networks/WebsocketConnect';
import { ChannelManager } from './Networks/ChannelManager';
import SoundManager from './Base/SoundManager';
import { SoundName, getSoundName } from './Base/SoundName';
import { ChangeMaterial } from './ChangeMaterial';
import { MapComp } from './MapComp';
const { ccclass, property } = _decorator;
@ccclass('MovingCharacter')
export class MovingCharacter extends Component {
    private _deltaTime = 0.02;
    @property(InputComp)
    private input: InputComp = null;
    @property ({type: CCInteger})
    public static moveSpeed = 1;
    @property(CharacterAnimation)
    public characterAnimation: CharacterAnimation = null;
    @property(SecurityAnimation)
    public securityAnimation: SecurityAnimation [] = []
    @property(Node)
    PlayerName: Node = null;

    @property(ChangeMaterial)
    playerIndex: ChangeMaterial = null

    private _angle = 180;
    private counter = 0;
    private old_counter = 0;

    public static rotateBloodEffect = 0;

    bloodEffect: BloodEffect = null;

    onEnable()
    {
        GamePlayUI.eventTarget.on(GamePlayUI.CHANGE_LIGHT, this.pauseCharacter, this);
    }

    onDisable()
    {
        GamePlayUI.eventTarget.off(GamePlayUI.CHANGE_LIGHT, this.pauseCharacter, this);
    }

    start(){
        this.bloodEffect = this.node.getComponent(BloodEffect)
        this.input.onMove = this._move.bind(this);
        this.input.onStop =this._stopMove.bind(this);
        this.input.onStart = this._startMove.bind(this);
        this.counter = 0;
        this.old_counter = 0;
       
        // this.invokeMove();
        this.invokeEndMove();
        this.PlayerName.getComponent(Label).string = ChannelManager.getUserInfo().getName()
        let players = ChannelManager.getPlayersInfo()
        for(let i = 0; i < players.length; i++){ 
            if(ChannelManager.getUserInfo().getID() == players[i].getID()){
                this.setIndex(i);
                break
            }
        }
    }

    setIndex(num: number){
        this.playerIndex.setUserNumber(num + 1)
        this.node.setPosition(MapComp.getInstance().getStartPosByIndex(num));
    }    

    update(){
        if(InputComp.isTouching == true && this.counter == this.old_counter+1 && GameState.playerState == PlayerState.Alive){
            this.rotate()
            this.characterAnimation.playMoving();
            if(!ChannelManager.isViewer())
            {
                SoundManager.getInstance().play(getSoundName(SoundName.SfxWalk));
            }
            this.move(this.input.Direction.x, this.input.Direction.y);
        }
    }

    _move(deltaTime: number) {
        if(GameState.playerState != PlayerState.Death){
            if(this.input.TouchType != Input.EventType.TOUCH_END){
                this.old_counter = this.counter;
                this.counter++;
            }
        }
    }

    _startMove(deltaTime: number){
        if(GameState.playerState != PlayerState.Death){
            this.old_counter = 0;
            this.counter = 1;
        }
    }
    _stopMove(deltaTime: number){
        if(this.input.TouchType == Input.EventType.TOUCH_END && this.characterAnimation.animState == animationState.Move){
            this.characterAnimation.stopMoving();
            this.old_counter = 0;
            this.counter = 0;
            this.invokeEndMove()
        }
    }

    move(x: number, y: number){
        this.checkMoveCondition();
        let newPosX = this.node.position.x + -x * MovingCharacter.moveSpeed * this._deltaTime;
        let newPosZ = this.node.position.z + y * MovingCharacter.moveSpeed * this._deltaTime;

        newPosX = Math.max(MapComp.getInstance().LEFT, Math.min(newPosX, MapComp.getInstance().RIGHT));
        newPosZ = Math.min(newPosZ, MapComp.getInstance().START_OFFSET)

        this.node.setPosition(newPosX ,this.node.position.y, newPosZ);
        this.invokeMove();
        if(MapComp.getInstance().isFinish(newPosZ)) {
            this.InvokeFinish();
            GameState.playerState = PlayerState.Finish;
        }
    }

    rotate(){
        this._angle = this.input.Direction.angle(new Vec2(0,1))*180/Math.PI
        if(this.input.Direction.x > 0){
            this._angle = -this._angle;
        }
        MovingCharacter.rotateBloodEffect = this._angle;
        this.node.setWorldRotationFromEuler(0,this._angle,0);
        this.PlayerName.setWorldRotationFromEuler(0,0,0);
    }

    checkMoveCondition(){
        if(GameState.lightState == LightState.RedLight){
            GameState.playerState = PlayerState.Death
            this.characterAnimation.playDeath();
            let isViewer = ChannelManager.isViewer();
            if(isViewer) return;

            SoundManager.getInstance().play(getSoundName(SoundName.SfxUmph));
            for(let i = 0; i<4; i++){
                this.securityAnimation[i].playShoot();
            }
            this.bloodEffect.enabled = true;
        }
    }

    pauseCharacter(){
        if(GameState.lightState == LightState.RedLight){
            this.characterAnimation.turnOnRedLight();
        }
        else{
            this.characterAnimation.turnOnGreenLight();
        }
    }

    invokeMove(){
        if(ChannelManager.isViewer()) return;
        WebsocketConnect.getInstance().InvokeMove(this.node.position.x, this.node.position.z, this._angle);
    }

    invokeEndMove(){
        WebsocketConnect.getInstance().InvokeEndMove();
    }

    InvokeFinish(){
        WebsocketConnect.getInstance().InvokeFinish();
    }
}

