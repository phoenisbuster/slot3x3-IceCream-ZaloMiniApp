import { _decorator, CCInteger, Component, Game, Node, Vec2, Vec3 } from 'cc';
import { InputComp } from '../InputComp';
import { MovingCharacter } from '../MovingCharacter';
import { GameState, LightState } from '../GameState';
import { BloodEffect } from '../BloodEffect';
import { CharacterAnimation } from '../CharacterAnimation';
const { ccclass, property } = _decorator;

@ccclass('BotMove')
export class BotMove extends Component {
    @property(InputComp)
    private input: InputComp = null;
    @property ({type: CCInteger})
    public moveSpeed = 1;
    @property(CharacterAnimation)
    public characterAnimation: CharacterAnimation = null;
    @property(Node)
    BotName: Node = null;

    @property(Vec2)
    Destination: Vec2 = new Vec2();

    private _deltaTime = 0.02;
    private _angle;
    public static rotateBloodEffect = 0;
    private _direction = new Vec2();
    bloodEffect: BloodEffect = null;


    startMove = false;
    stopMove = false;


    start() {

    }

    update(deltaTime: number) {
        if(InputComp.isTouching == true && this.stopMove == false){
            this.startMove =true
        }
        if(this.startMove == true && GameState.lightState == LightState.GreenLight){
            this.rotate()
            this.characterAnimation.playMoving();
            this.calculateDirection();
            this.move(this._direction.x, this._direction.y);
        }
        else{
            this.characterAnimation.stopMoving();
        }
    }

    calculateDirection(){
        let threshold = 0.1
        let curPos = new Vec2(this.node.position.x,this.node.position.z)
        let dist = Vec2.distance(this.Destination, curPos)
        if (dist < threshold) {
            this.startMove = false;
            this.stopMove = true;
            return;
        }

        this._direction = new Vec2(curPos.x - this.Destination.x ,this.Destination.y - curPos.y);
        this._direction = this._direction.normalize();
    }

    move(x: number, y: number){
        //this.checkMoveCondition();
        let newPosX = this.node.position.x + -x * this.moveSpeed * this._deltaTime;
        let newPosZ = this.node.position.z + y * this.moveSpeed * this._deltaTime;
        this.node.setPosition(newPosX ,this.node.position.y, newPosZ);
    }

    rotate(){
        this._angle = this._direction.angle(new Vec2(0,1))*180/Math.PI
        if(this._direction.x > 0){
            this._angle = -this._angle;
        }
        BotMove.rotateBloodEffect = this._angle;
        this.node.setWorldRotationFromEuler(0,this._angle,0);
        this.BotName.setWorldRotationFromEuler(0,0,0);
    }

    checkMoveCondition(){
        if(GameState.lightState == LightState.RedLight){
            //GameState.playerState = PlayerState.Death
            //this.characterAnimation.playDeath();
            // for(let i = 0; i<4; i++){
            //     this.securityAnimation[i].playShoot();
            // }
            //this.bloodEffect.enabled = true;
            // console.log("death");
        }
    }
}

