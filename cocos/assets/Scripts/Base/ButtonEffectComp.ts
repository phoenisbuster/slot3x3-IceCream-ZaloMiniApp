// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { _decorator, Component, Canvas, Size, sys, view, Button, Toggle, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export default class ButtonEffectComp extends Component {
    button: Button = null;
    toggle: Toggle = null;
    
    @property(Node)
    target: Node = null;

    onLoad () {
        this.button = this.node.getComponent(Button);
        this.toggle = this.node.getComponent(Toggle);
        if(this.target == null) this.target = this.node;
    }

    start () {
        this.registerEvent();
    }

    // update (dt) {}

    private registerEvent() {        
        this.node.on(Node.EventType.TOUCH_START, this.onMouseEnter, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseLeave, this, true);
    }
    
    private unregisterEvent() {        
        this.node.off(Node.EventType.TOUCH_START, this.onMouseEnter, this, true);
        this.node.off(Node.EventType.TOUCH_END, this.onMouseLeave, this, true);        
    }
 
    onMouseEnter(_: any, __: any){
        if(this.button != null && this.button.interactable)
            this.target.scale = new Vec3(1.05, 1.05, 1.05);

        if(this.toggle != null && this.toggle.interactable)
            this.target.scale = new Vec3(1.05, 1.05, 1.05);
    }

    onMouseLeave(_: any, __: any){
        this.target.scale = Vec3.ONE;
    }

    onDestroy(){
        this.unregisterEvent();
    }
}
