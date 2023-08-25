import { _decorator, Component, EventTarget, Node, sp, SpriteFrame } from 'cc';
import { ReelManager } from './ReelManager';
import { GameDefinedData } from '../GameDefinedData';
import { MyGameUtils } from '../../Base/MyGameUtils';
import { GameManager } from '../GameManager';

const { ccclass, property } = _decorator;

const { ResultItem, RewardData } = GameDefinedData.getAllRef();


@ccclass('SlotManager')
export class SlotManager extends Component 
{
    @property([SpriteFrame])
    private main_spriteFrameList: SpriteFrame[] = [];

    @property([SpriteFrame])
    private blur_spriteFrameList: SpriteFrame[] = [];

    @property([sp.SkeletonData])
    private main_spineDataList: sp.SkeletonData[] = [];

    public event: EventTarget = new EventTarget();

    private reelManagerList: ReelManager[] = [];

    private resultData: Map<number, InstanceType<typeof ResultItem>>[] = [];

    private isCheat: boolean = false;
    
    onLoad() 
    {
       this.reelManagerList = this.getComponentsInChildren(ReelManager);
    }

    onDestroy() 
    {
        this.reelManagerList.forEach((value)=>
        {
            value?.event?.off("finish", this.receiveResult, this);
        });
    }

    initData()
    {   
        if(this.reelManagerList.length > 0)
            this.reelManagerList.forEach((value)=>
            {
                value.initData(this.main_spriteFrameList, this.blur_spriteFrameList, this.main_spineDataList);
                value?.event?.on("finish", this.receiveResult, this);
            });
        else
            console.error("Slot Manager Data Have Not Defined!!!");
    }

    spin()
    {
        if(this.reelManagerList.length <= 0)
            return;

        this.setCheatData(this.checkCheat());
        
        // this.resetResult();
        this.reelManagerList.forEach((value)=>
        {
            this.scheduleOnce(()=>
            {
                value.spin();
            }, 0.1);
            
        });
    }

    receiveResult(result: Map<number, InstanceType<typeof ResultItem>>)
    {
        if(this.resultData.length >= this.reelManagerList.length)
        {
            return;
        }
        
        console.log("Result Receive ", result.size);
        this.resultData.push(result);

        if(this.resultData.length == this.reelManagerList.length)
        {
            this.testDebug_1();
            this.event.emit("finish", this.resultData);
        }
    }

    receiveReward(rewardData: InstanceType<typeof RewardData>[], callback: ()=>void = null)
    {
        rewardData.forEach((val, idx)=>
        {
            if(val.row >= 0 && val.row < this.reelManagerList.length)
            {
                this.reelManagerList[val.row].receiveRewardData(val.col, val.symbol);
            }
            else
            {
                console.error("Reward Data Error on Slot Manager", val);
            }
        });

        callback && callback();
    }

    resetResult()
    {
        this.resultData = [];

        this.reelManagerList.forEach((reel, idx)=>
        {
            reel.resetState();
        })
    }

    private testDebug_1()
    {
        this.resultData.forEach((value, idx)=>
        {
            console.log("==== Result for Col " + idx + " ====");
            value.forEach((data, key)=>
            {
                console.log("Symbol Key ", key);
                console.log("Symbol Name ", data.sprite?.name);
                console.log("Symbol result ", data.result);
            })
            console.log("==== End of Col " + idx + " ====")
        });
        
        this.scheduleOnce(()=>
        {
            this.reelManagerList.forEach((value)=>
            {
                console.log("TEST DEBUG RESULT IF DELETED AFTER SENT: ", value.getResultData());
            });
        })
    }

    private checkCheat()
    {
        if(GameManager.getInstance()?.getCheatEnable())
        {
            if(GameManager.getInstance()?.getCheatLineValue() >= 1 && GameManager.getInstance()?.getCheatLineValue() <= 5)
            {
                return true;
            }
            else
                return false;
        }
        else
            return false;
    }

    private setCheatData(enabled: boolean = false)
    {
        console.warn("CEHCK CHEAT", enabled);
        
        var line = GameManager.getInstance()?.getCheatLineValue();
        var key = -1;
        switch(line)
        {
            case 1:
                this.reelManagerList.forEach((value, idx)=>
                {
                    if(enabled)
                        key = 0;
                    value.setCheat(enabled, key);
                });
                break;

            case 2:
                this.reelManagerList.forEach((value, idx)=>
                {
                    if(enabled)
                        key = 1;
                    value.setCheat(enabled, key);
                });
                break;

            case 3:
                this.reelManagerList.forEach((value, idx)=>
                {
                    if(enabled)
                        key = 2;
                    value.setCheat(enabled, key);
                });
                break;

            case 4:
                this.reelManagerList.forEach((value, idx)=>
                {
                    if(enabled)
                        key = idx;
                    value.setCheat(enabled, key);
                });
                break;

            case 5:
                this.reelManagerList.forEach((value, idx)=>
                {
                    if(enabled)
                        key = this.reelManagerList.length - idx - 1;
                    value.setCheat(enabled, key);
                });
                break;
        }
    }
}

