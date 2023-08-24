import { _decorator, Component, EventTarget, Node, SpriteFrame } from 'cc';
import { ReelItem } from './ReelItem';
import { GameDefinedData } from '../GameDefinedData';
import { MyGameUtils } from '../../Base/MyGameUtils';

const { ccclass, property } = _decorator;

const { ResultItem } = GameDefinedData.getAllRef();

@ccclass('ReelManager')
export class ReelManager extends Component 
{
    private mainReel: ReelItem = null;
    private blurReel: ReelItem[] = [];

    private resultData: Map<number, InstanceType<typeof ResultItem>> = new Map<number, InstanceType<typeof ResultItem>>();

    public event: EventTarget = new EventTarget();
    
    onLoad()
    {
        this.getComponentsInChildren(ReelItem).forEach((value, idx)=>
        {
            if(value.isBlur)
                this.blurReel.push(value)
            else
                this.mainReel = value;
        });

        console.warn("Check blur " + this.blurReel.length);
        console.warn("Check Main Reel " + this.mainReel.node.name);
    }

    initData(symbolList: SpriteFrame[], blurList: SpriteFrame[])
    {
        if(!this.mainReel || this.blurReel.length <= 0)
        {
            console.error("Reel Manager Data Have Not Difined!!!");
            return;
        }
        
        this.mainReel.initData(symbolList, blurList);
        this.blurReel.forEach((value)=>
        {
            value.initData(symbolList, blurList);
        })
    }

    spin()
    {
        this.resultData = this.mainReel.generateResultData();

        this.blurReel.forEach((value)=>
        {
            value.randomSprite(true);
        });

        this.scheduleOnce(()=>
        {
            this.sendResultData();
        }, 1);
    }

    getResultData(): Map<number, InstanceType<typeof ResultItem>>
    {
        const returnVal = this.resultData;
        // this.resultData = new Map<number, InstanceType<typeof ResultItem>>();
        return returnVal;
    }

    sendResultData()
    {
        const returnVal = this.resultData;
        this.resultData = new Map<number, InstanceType<typeof ResultItem>>();
        this.event.emit("finish", returnVal);
    }

    setCheat(isCheat: boolean, key: number)
    {
        this.mainReel.setCheat(isCheat, key);
    }
}

