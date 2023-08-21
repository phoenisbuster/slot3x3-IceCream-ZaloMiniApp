import { _decorator, Component, Vec2, EventTouch, input, Input } from 'cc';
import { ChannelManager } from './Networks/ChannelManager';

const { ccclass, property } = _decorator;

@ccclass('InputComp')
export class InputComp extends Component {
    private _pressedX = 0;
    private _pressedY = 0;

    private _touchType: Input.EventType;
    private _direction: Vec2 = new Vec2(0,-1);

    public static touchMove = false;
    public static isTouching = false;

    get Direction(): Vec2{
        return this._direction;
    }

    get TouchType(){
        return this._touchType;
    }

    onMove;
    onStart;
    onStop

    onLoad(){
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this)

        if(ChannelManager.isViewer())
        {
            this.node.destroy();
        }
    }
    onDestroy () {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }


    onTouchStart(event: EventTouch){
        InputComp.isTouching = true;
        if(this.onStart!=null) this.onStart();
        this._touchType = Input.EventType.TOUCH_START;

    }

    onTouchEnd(event: EventTouch){
        this._touchType = Input.EventType.TOUCH_END;
        if(this.onStop!=null) this.onStop();
        this._pressedX = 0
        this._pressedY = 0
        InputComp.touchMove = false;
        InputComp.isTouching = false;
    }

    onTouchCancel(event: EventTouch){
        this._touchType = Input.EventType.TOUCH_CANCEL;
    }
    
    onTouchMove(event: EventTouch){
        InputComp.touchMove =true;
        this._touchType = Input.EventType.TOUCH_MOVE;
        if(this.onMove!=null) this.onMove();
        let threshold = 10
        let touch_pos = event.getLocation();
        let oldPos = new Vec2(this._pressedX, this._pressedY)
        let dist = Vec2.distance(oldPos, touch_pos)
        if(dist < threshold) return;


        this.calculateDirection(touch_pos);

    }

    calculateDirection(touch_pos: Vec2){
        if(this._pressedX == 0 && this._pressedY == 0) {
            this._pressedX = touch_pos.x;
            this._pressedY = touch_pos.y;
            return;
        }
        let endX = this._pressedX - touch_pos.x;
        let endY = this._pressedY - touch_pos.y;
        this._direction = new Vec2(endX,endY);
        this._direction = this._direction.normalize();
        this._pressedX = touch_pos.x;
        this._pressedY = touch_pos.y;
    }

    

}

