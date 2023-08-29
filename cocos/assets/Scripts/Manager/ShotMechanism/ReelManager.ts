import { _decorator, CCFloat, Component, EventTarget, Node, sp, SpriteFrame, tween, Vec2, Vec3 } from 'cc';
import { ReelItem } from './ReelItem';
import { GameDefinedData } from '../GameDefinedData';
import { MyGameUtils } from '../../Base/MyGameUtils';
import { Audio } from '../Audio';
import { getSoundName, SoundName } from '../../Base/SoundName';
import SoundManager from '../../Base/SoundManager';

const { ccclass, property } = _decorator;

const { ResultItem, ConfigData } = GameDefinedData.getAllRef();

@ccclass('ReelManager')
export class ReelManager extends Component 
{
    private mainReel: ReelItem = null;
    private blurReel: ReelItem[] = [];

    private resultData: Map<number, InstanceType<typeof ResultItem>> = new Map<number, InstanceType<typeof ResultItem>>();

    public event: EventTarget = new EventTarget();

    @property(CCFloat)
    private topPosY: number = 630;

    @property(CCFloat)
    private mainPosY: number = 0;

    @property(CCFloat)
    private botPosY: number = -630;

    private timeState1 = 0.3;
    private timeState2 = 0.25;
    private timeState3 = 0.3;
    private timeState4 = 0.5;
    private timeState5 = 0.25;

    private spinNumber = 10;
    private shrugLevel = 50;
    
    onLoad()
    {
        this.getComponentsInChildren(ReelItem).forEach((value, idx)=>
        {
            if(value.isBlur)
                this.blurReel.push(value)
            else
                this.mainReel = value;
        });

        this.GetCongifData();

        // console.warn("Check blur " + this.blurReel.length);
        // console.warn("Check Main Reel " + this.mainReel.node.name);
    }

    initData(symbolList: SpriteFrame[], blurList: SpriteFrame[], spineData: sp.SkeletonData[])
    {
        if(!this.mainReel || this.blurReel.length <= 0)
        {
            console.error("Reel Manager Data Have Not Difined!!!");
            return;
        }
        
        this.mainReel.initData(symbolList, blurList, spineData);
        this.blurReel.forEach((value)=>
        {
            value.initData(symbolList, blurList, spineData);
        })
    }

    spin()
    {
        this.blurReel.forEach((value)=>
        {
            value.randomSprite(true);
        });

        this.MovingState_1();
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

    receiveRewardData(idx: number, symbol: number)
    {
        this.mainReel.showWinSprite(idx, symbol);
    }

    resetState()
    {
        this.mainReel.hideAllWinSprite();
    }

    setCheat(isCheat: boolean, key: number)
    {
        // console.warn("Check CHEAT", isCheat, key);
        this.mainReel.setCheat(isCheat, key);
    }

    private GetCongifData()
    {
        this.timeState1 = ConfigData.getInstance().timeState1;
        this.timeState2 = ConfigData.getInstance().timeState2;
        this.timeState3 = ConfigData.getInstance().timeState3;
        this.timeState4 = ConfigData.getInstance().timeState4;
        this.timeState5 = ConfigData.getInstance().timeState5;

        this.spinNumber = ConfigData.getInstance().spinNumber;
        this.shrugLevel = ConfigData.getInstance().shrugLevel;
    }

    /////////////////////////////////// MOVING REEL ///////////////////////////////////////
    private MovingState_1()
    {
        tween(this.mainReel.node).to(this.timeState1,
        {
            position: new Vec3(this.mainReel.node.position.x, this.botPosY, 0)
        }).call(()=>
        {
            this.mainReel.node.position = new Vec3(this.mainReel.node.position.x, this.topPosY, 0);
            this.resultData = this.mainReel.generateResultData();

            
        }).start();

        this.blurReel.forEach((blur, idx)=>
        {
            if(Math.abs(blur.node.position.y - this.botPosY) <= 150)
                blur.node.position = new Vec3(blur.node.position.x, this.topPosY, 0);
            else
                tween(blur.node).to(this.timeState1, 
                {
                    position: new Vec3(blur.node.position.x, this.mainPosY, 0)
                }).call(()=>
                {
                    blur.node.position = new Vec3(blur.node.position.x, this.mainPosY, 0);
                    this.MovingState_2();
                }).start();
        })
    }

    private MovingState_2(time: number = 0)
    {
        if(time >= this.spinNumber)
        {
            // console.warn("Check ????", time);
            this.MovingState_3()
            return;
        }
        
        this.blurReel.forEach((blur, idx)=>
        {
            if(Math.abs(blur.node.position.y - this.topPosY) <= 150)
            {
                tween(blur.node).to(this.timeState2, 
                {
                    position: new Vec3(blur.node.position.x, this.mainPosY, 0)
                }).call(()=>
                {
                    blur.node.position = new Vec3(blur.node.position.x, this.mainPosY, 0);
                    // console.warn("????");
                }).start();
            }
            else if(Math.abs(blur.node.position.y - this.mainPosY) < 150)
            {
                tween(blur.node).to(this.timeState2, 
                {
                    position: new Vec3(blur.node.position.x, this.botPosY, 0)
                }).call(()=>
                {
                    blur.node.position = new Vec3(blur.node.position.x, this.topPosY, 0);
                    blur.randomSprite(true);
                    this.MovingState_2(time+1);
                    // console.warn("????", time+1);
                }).start();
            }
        });
    }

    private MovingState_3()
    {
        this.blurReel.forEach((blur, idx)=>
        {
            if(Math.abs(blur.node.position.y - this.topPosY) <= 150)
            {
                blur.randomSprite(false);
        
                tween(blur.node).to(this.timeState3, 
                {
                    position: new Vec3(blur.node.position.x, this.mainPosY, 0)
                }).call(()=>
                {
                    blur.node.position = new Vec3(blur.node.position.x, this.mainPosY, 0);
                }).start();
            }
            else
            {
                tween(blur.node).to(this.timeState3, 
                {
                    position: new Vec3(blur.node.position.x, this.botPosY, 0)
                }).call(()=>
                {
                    blur.node.position = new Vec3(blur.node.position.x, this.topPosY, 0);
                    blur.randomSprite(false);
                    this.MovingState_4();
                }).start();
            }
        });
    }

    private MovingState_4()
    {
        tween(this.mainReel.node).to(this.timeState4, 
        {
            position: new Vec3(this.mainReel.node.position.x, this.mainPosY, 0)
        }).call(()=>
        {
            this.mainReel.node.position = new Vec3(this.mainReel.node.position.x, this.mainPosY, 0);
        }).start();

        this.blurReel.forEach((blur, idx)=>
        {
            if(Math.abs(blur.node.position.y - this.mainPosY) <= 150)
            {
                tween(blur.node).to(this.timeState4, 
                {
                    position: new Vec3(blur.node.position.x, this.botPosY, 0)
                }).call(()=>
                {
                    blur.node.position = new Vec3(blur.node.position.x, this.botPosY, 0);
                    this.MovingState_5();
                }).start();
            }
        });
    }

    private MovingState_5()
    {
        SoundManager.getInstance().play(getSoundName(SoundName.SfxRollStop));
        tween(this.mainReel.node).to(this.timeState5, 
        {
            position: new Vec3(this.mainReel.node.position.x, this.mainPosY - this.shrugLevel, 0)
        })
        .call(()=>
        {
            // SoundManager.getInstance().play(getSoundName(SoundName.SfxRollStop));
        })
        .to(this.timeState5, 
        {
            position: new Vec3(this.mainReel.node.position.x, this.mainPosY, 0)
        })
        .call(()=>
        {
            this.sendResultData();
        }).start();

        this.blurReel.forEach((blur, idx)=>
        {
            if(Math.abs(blur.node.position.y - this.topPosY) <= 150)
            {
                tween(blur.node).to(this.timeState5, 
                {
                    position: new Vec3(blur.node.position.x, this.topPosY - this.shrugLevel, 0)
                })
                .to(this.timeState5, 
                {
                    position: new Vec3(blur.node.position.x, this.topPosY, 0)
                })
                .call(()=>
                {
                    
                }).start();
            }
        });
    }
}

