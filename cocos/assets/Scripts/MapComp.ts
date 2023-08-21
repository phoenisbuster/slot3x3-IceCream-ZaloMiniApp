import { _decorator, Component, Node, CCObject, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapComp')
export class MapComp extends Component {
    private static instance: MapComp = null;
    static START_CACHED: number = 6;

    static getInstance(): MapComp {
        return MapComp.instance;
    }

    @property(Node)
    private startLine: Node = null;

    @property(Node)
    private finishLine: Node = null;
   
    LEFT: number = -25
    RIGHT: number = 25

    START: number = 6
    FINISH: number = -94

    START_OFFSET = 15;

    CAM_LEFT: number = -25
    CAM_RIGHT: number = 25
    CAM_FINISH: number = -94
    CAM_START: number = -94


    onLoad(){
        MapComp.instance = this
    }

    start(){
        this.init(MapComp.START_CACHED)
    }

    init(start: number = 6, finish: number = -94, left: number = -25, right: number = 25){
        this.LEFT = left
        this.RIGHT = right
        this.START = start
        this.FINISH = finish

        this.CAM_LEFT = this.LEFT
        this.CAM_RIGHT = this.RIGHT
        this.CAM_START = this.START + 44
        this.CAM_FINISH = this.FINISH - 16

        this.START_OFFSET = this.START + 7;

        this.startLine.setPosition(new Vec3(0, this.startLine.position.y, this.START))
        this.finishLine.setPosition(new Vec3(0, this.finishLine.position.y, this.FINISH))
    }

    getRandomStartPos(){
        let x =  (Math.random() -1) * Math.abs(this.LEFT - this.RIGHT)/2;
        return new Vec3(x , 0, this.START);
    }


    getStartPosByIndex(index: number){
        let mul = 1
        if(index%2 == 0)
            mul = -1
        let x =  3.5 * index * mul
        return new Vec3(x , 0, this.START);
    }

    isFinish(posZ: number){
        return posZ < this.FINISH
    }
}

