import { _decorator, Component, EventTouch, Input, input, Node, NodeSpace, Quat, Tween, tween, Vec3 } from 'cc';
import { LeaderBoard } from './Popup/LeaderBoard';
import { PlayerState } from './GameState';
import { ChannelManager } from './Networks/ChannelManager';
import { MapComp } from './MapComp';
const { ccclass, property } = _decorator;

export enum CameraState
{
    Follow,
    FreeRoam,
    Stop
}

@ccclass('CameraFunction')
export class CameraFunction extends Component {
    @property(Vec3)
    rotation: Vec3 = null

    @property(Node)
    character: Node = null

    curCamState: CameraState = CameraState.Follow;

    isTouch: boolean = false;
    isForward: boolean = true;
    isLeft: boolean = false;
    isRigh: boolean = false;

    start()
    {
        this.rotation = this.character.getWorldPosition();
        if(ChannelManager.isViewer())
        {
            this.curCamState = CameraState.FreeRoam;
            this.FreeRoamMode(PlayerState.Death, ChannelManager.getUserInfo().getID());
        }
    }

    onEnable()
    {
        //GamePlayUI.eventTarget.on(GamePlayUI.FINISH_GAME, this.FreeRoamMode, this);
        LeaderBoard.eventTarget.on(LeaderBoard.SHOW_LEADERBOARD, this.StopCamera, this);
    }

    onDisable()
    {       
        //GamePlayUI.eventTarget.off(GamePlayUI.FINISH_GAME, this.FreeRoamMode, this);
        LeaderBoard.eventTarget.on(LeaderBoard.SHOW_LEADERBOARD, this.StopCamera, this);
        this.disableTouchInpput();
    }

    onDestroy()
    {
        this.unscheduleAllCallbacks();
        Tween.stopAllByTarget(this.node);
    }

    enableTouchInput(){
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    }
    disableTouchInpput () {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    update(deltaTime: number) 
    {
        if(this.curCamState == CameraState.Follow)
        {
            this.node.setRotationFromEuler(-16.7,0,0);
            this.node.setWorldPosition(this.rotation.x,11.174,this.rotation.z + 20)
            this.rotation = this.character.getWorldPosition();
        }
        else if(this.curCamState == CameraState.FreeRoam)
        {
            if(this.isTouch)
            {
                let direction = new Vec3(0,0,0);
                direction.z = this.isForward? -1 : 1;
                if(this.isLeft && !this.isRigh)
                {
                    direction.x = -1;
                }
                else if(this.isRigh && !this.isLeft)
                {
                    direction.x = 1;
                }
                else
                {
                    direction.x = 0;
                }

                direction = this.CheckBoundary(direction);
                
                this.node.translate(Vec3.multiplyScalar(direction, direction, 5*deltaTime), NodeSpace.WORLD);
            }    
        }
    }

    CheckBoundary(direction: Vec3): Vec3
    {
        if(this.node.position.x < MapComp.getInstance().CAM_LEFT)
        {
            direction.x = 0.1;
        }
        if(this.node.position.x > MapComp.getInstance().CAM_RIGHT)
        {
            direction.x = -0.1;
        }
        if(this.node.position.z > MapComp.getInstance().CAM_START)
        {
            direction.z = -0.1;
        }
        if(this.node.position.z < MapComp.getInstance().CAM_FINISH)
        {
            direction.z = 0.1;
        }

        return direction;
    }

    FreeRoamMode(playerState: PlayerState, id)
    {
        if(ChannelManager.isViewer())
        {
            let  quat : Quat = new Quat();
            Quat.fromEuler(quat, -30, 0, 0);
            tween(this.node).to(0.5, 
                {
                    position: new Vec3(this.node.position.x, 25, this.node.position.y),
                    rotation: quat
                }).start(); 
            this.curCamState = CameraState.FreeRoam;
            this.enableTouchInput();  
        }
    }

    StopCamera()
    {
        this.curCamState = CameraState.Stop;
        this.disableTouchInpput();
    }

    onTouchStart(event: EventTouch)
    {
        this.isTouch = true;
    }

    onTouchEnd(event: EventTouch)
    {
        this.isTouch = false
    }

    onTouchCancel(event: EventTouch)
    {
        
    }
    
    onTouchMove(event: EventTouch)
    {
        let direction = event.getDelta().normalize();
        if(direction.x < 0)
        {
            this.isLeft = true;
            this.isRigh = false;
        }
        else if(direction.x > 0)
        {
            this.isLeft = false;
            this.isRigh = true;
        }

        if(direction.y > 0)
        {
            this.isForward = true;
        }
        else if(direction.y < 0)
        {
            this.isForward = false;
        }
    }
}

