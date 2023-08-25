import { _decorator, CCFloat, Component, EventTarget, Node, sp, SpriteFrame, Vec2, Vec3 } from 'cc';
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

    private allowMove: boolean = false;
    private movingState: number = 0;
    private curTime: number = 0;

    @property(CCFloat)
    private speed: number = 100;

    @property(CCFloat)
    private time: number = 5;

    @property(CCFloat)
    private topPosY: number = 630;

    @property(CCFloat)
    private mainPosY: number = 0;

    @property(CCFloat)
    private botPosY: number = -630;

    
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

    protected update(dt: number): void 
    {
        this.MovingForward(dt);
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
        //TODO
        //Moving Reels Here
        this.blurReel.forEach((value)=>
        {
            value.randomSprite(true);
        });

        this.allowMove = true;
        this.movingState++;

        this.scheduleOnce(()=>
        {
            // this.sendResultData();
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
        this.mainReel.setCheat(isCheat, key);
    }

    private MovingForward(dt)
    {
        let direction = new Vec2(0,1);
        if(this.allowMove)
        {
            switch(this.movingState)
            {
                case 1:
                    let mainPos = this.mainReel.node.getPosition().y;
                    mainPos -= this.speed * dt;
                    if(mainPos <= this.botPosY)
                    {
                        mainPos = this.topPosY;
                        this.mainReel.node.setPosition(new Vec3(this.mainReel.node.getPosition().x, this.topPosY, 0));

                        this.resultData = this.mainReel.generateResultData();

                        this.movingState++;
                        this.curTime = this.time;
                    }
                    else
                        this.mainReel.node.setPosition(new Vec3(this.mainReel.node.getPosition().x, mainPos, 0));

                    this.blurReel.forEach((blur, idx)=>
                    {
                        let blurPos = blur.node.getPosition().y;
                        blurPos -= this.speed * dt;

                        if(blurPos <= this.botPosY)
                        {
                            blurPos = this.topPosY;
                            blur.node.setPosition(new Vec3(blur.node.getPosition().x, this.topPosY, 0));
                        }
                        else
                            blur.node.setPosition(new Vec3(blur.node.getPosition().x, blurPos, 0));
                    });
                    break;

                case 2:
                    if(this.curTime <= 0)
                    {
                        this.blurReel.forEach((blur, idx)=>
                        {
                            if(blur.node.position.y <= this.mainPosY)
                                blur.node.setPosition(new Vec3(blur.node.getPosition().x, this.mainPosY, 0));
                            else
                                blur.node.setPosition(new Vec3(blur.node.getPosition().x, this.topPosY, 0));

                            this.curTime = 0;
                            this.movingState++;
                        });
                    }

                    this.blurReel.forEach((blur, idx)=>
                    {
                        let blurPos = blur.node.getPosition().y;
                        blurPos -= this.speed * dt;

                        if(blurPos <= this.botPosY)
                        {
                            blurPos = this.topPosY;
                            blur.randomSprite(true);
                        }
                        
                        blur.node.setPosition(new Vec3(blur.node.getPosition().x, blurPos, 0));
                    });
                    this.curTime -= dt;
                    break;

                case 3:
                    mainPos = this.mainReel.node.getPosition().y;
                    mainPos -= this.speed * dt;
                    if(mainPos <= this.mainPosY)
                    {
                        mainPos = this.mainPosY;
                        this.mainReel.node.setPosition(new Vec3(this.mainReel.node.getPosition().x, this.mainPosY, 0));

                        this.movingState = 0;
                        this.allowMove = false;
                    }
                    else
                        this.mainReel.node.setPosition(new Vec3(this.mainReel.node.getPosition().x, mainPos, 0));

                    this.blurReel.forEach((blur, idx)=>
                    {
                        let blurPos = blur.node.getPosition().y;
                        if(blurPos != this.topPosY)
                        {
                            blurPos -= this.speed * dt;
                            if(blurPos <= this.botPosY)
                            {
                                blurPos = this.botPosY;
                                blur.node.setPosition(new Vec3(blur.node.getPosition().x, this.botPosY, 0));
                            }
                            else
                                blur.node.setPosition(new Vec3(blur.node.getPosition().x, blurPos, 0));
                        }   
                    });
                    break;

                case 0:
                default:
                    break;
            }
        }
    }
}

