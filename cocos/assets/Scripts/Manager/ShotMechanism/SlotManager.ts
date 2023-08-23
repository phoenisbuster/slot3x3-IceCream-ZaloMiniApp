import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

export type ResultItem = {
    sprite: SpriteFrame,
    result: number
}

@ccclass('SlotManager')
export class SlotManager extends Component 
{
    start() {

    }

    update(deltaTime: number) {
        
    }
}

