import { _decorator, CCBoolean, Component, instantiate, Layers, Node, sp, Sprite, SpriteFrame, Vec3 } from 'cc';
import { GameDefinedData } from '../GameDefinedData';
import { MyGameUtils } from '../../Base/MyGameUtils';
import { GameManager } from '../GameManager';

const { ccclass, property } = _decorator;

const { ResultItem } = GameDefinedData.getAllRef();

class ReelCell
{
    private id: number = 0;
    private boundarySprite: Sprite = null;
    private dataSprite: Sprite = null;
    private spineComp: sp.Skeleton = null;
    private data: InstanceType<typeof ResultItem> = null;

    constructor(_id: number, _boundarySprite: Sprite = null, _dataSprite: Sprite = null, _item: InstanceType<typeof ResultItem> = null)
    {
        this.id = _id;
        this.boundarySprite = _boundarySprite;
        this.dataSprite = _dataSprite;

        this.setSpine(this.dataSprite.node);

        if(_item != null)
            this.data = _item;
        else
            this.data = new ResultItem();
    }

    private setSpine(parent: Node)
    {
        const node = instantiate(new Node("SpineAnim")); 
        node.parent = parent;
        node.layer = Layers.BitMask.UI_2D;
        node.position = new Vec3(0, -62, 0);

        this.spineComp = node.addComponent(sp.Skeleton);
        this.spineComp.skeletonData = null;
        this.spineComp.premultipliedAlpha = false;
        this.spineComp.enabled = false;
    }

    //////////////////////// Get/Set Data ////////////////////////////
    setItem(_data: InstanceType<typeof ResultItem>)
    {
        this.data = _data;

        if(this.data)
        {
            this.dataSprite.spriteFrame = this.data.sprite;
        }
    }

    getId(): number
    {
        return this.id;
    }

    getBoundarySpriteComp(): Sprite
    {
        return this.boundarySprite;
    }

    getDataSpriteComp(): Sprite
    {
        return this.dataSprite;
    }

    getCurSpriteFrame(): SpriteFrame
    {
        return this.dataSprite?.spriteFrame;
    }

    getDataSprite(): SpriteFrame
    {
        if(this.checkDataAvailable())
            return this.data.sprite;
        else
            return null;
    }

    getResult(): number
    {
        if(this.checkDataAvailable())
            return this.data.result;
        else
            return -1;
    }

    checkDataAvailable(): boolean
    {
        return !MyGameUtils.isNullOrUndefined(this.data);
    }

    //////////////////////// Show/Hide UI ////////////////////////////
    showHideBoundarySprite(isShow: boolean = false, animData: sp.SkeletonData = null)
    {
        this.boundarySprite.enabled = isShow;

        if(animData != null && isShow)
        {
            // console.warn("JUST WTF A", this.spineComp.node.parent.name);
            // console.warn("JUST WTF B", this.spineComp.node.parent.parent.name);
            
            this.spineComp.skeletonData = animData;
            let state = this.spineComp.setAnimation(0, "animation", true) as sp.spine.TrackEntry;

            this.dataSprite.enabled = false;
            this.spineComp.enabled = true;

            if(state)
            { 
                state.animationStart = 0;
            }

            // console.warn("JUST WTF C", this.spineComp.animation);
            // console.warn("JUST WTF D", this.spineComp.timeScale);
        }
        else
        {
            this.spineComp.skeletonData = null;

            this.dataSprite.enabled = true;
            this.spineComp.enabled = false;
        }
    }
}

@ccclass('ReelItem')
export class ReelItem extends Component 
{
    @property(CCBoolean)
    isBlur: boolean = false;

    private itemList: Map<number, ReelCell> = new Map<number, ReelCell>();

    private spriteFrameList: SpriteFrame[] = [];
    private spriteFrameBlurList: SpriteFrame[] = [];
    private spineDataList: sp.SkeletonData[] = [];

    private isCheat: boolean = false;
    private cheatKey: number = -1;

    onLoad(): void 
    {
        this.node.children.forEach((value, idx)=>
        {
            this.itemList.set(idx , new ReelCell(idx, value.getComponent(Sprite), value.getComponentInChildren(Sprite)));
            value.getComponent(Sprite).enabled = false;
        });
    }
    
    initData(symbolList: SpriteFrame[], blurList: SpriteFrame[], spineData: sp.SkeletonData[])
    {
        this.spriteFrameList = symbolList;
        this.spriteFrameBlurList = blurList;
        this.spineDataList = spineData;

        this.randomSprite(this.isBlur);
    }

    getItemLength(): number
    {
        return this.itemList.size;
    }

    resetItem()
    {
        this.itemList.clear();
    }

    generateResultData(): Map<number, InstanceType<typeof ResultItem>>
    {
        if(this.isBlur)
            return null;

        const resultData: Map<number, InstanceType<typeof ResultItem>> = new Map<number, InstanceType<typeof ResultItem>>();
        
        var cheatIdx = MyGameUtils.getRandomEleInArrayByIndex(this.spriteFrameList);
        this.itemList.forEach((value, key)=>
        {
            var idx = 0;
            // console.warn("CHECK CHEAT cheatKey", this.cheatKey);
            // console.warn("CHECK CHEAT key", key);
            if(this.isCheat && key == this.cheatKey)
            {
                idx = this.getCheatSymbol();
            }
            else
            {
                idx = MyGameUtils.getRandomEleInArrayByIndex(this.spriteFrameList);
            }
            var data = new ResultItem(this.spriteFrameList[idx], idx);

            value.setItem(data);
            resultData.set(key, data);
        });

        return resultData;
    }

    randomSprite(isGetBlur: boolean)
    {
        this.itemList.forEach((value, key)=>
        {
            var idx = MyGameUtils.getRandomEleInArrayByIndex(isGetBlur? this.spriteFrameBlurList : this.spriteFrameList);
            var data = new ResultItem(isGetBlur? this.spriteFrameBlurList[idx] : this.spriteFrameList[idx], idx);

            value.setItem(data);
        });
    }

    showWinSprite(idx: number, symbol: number)
    {
        if(this.isBlur)
            return;
        
        var data: sp.SkeletonData = null;
        if(symbol >= 0 || symbol < this.spineDataList.length)
            data = this.spineDataList[symbol];

        console.warn("CHECK A", this.spineDataList.length);
        console.warn("CHECK B", data?.name);
        
        this.itemList.get(idx).showHideBoundarySprite(true, data);
    }

    hideAllWinSprite()
    {
        if(this.isBlur)
            return;
        
        this.itemList.forEach((value, key)=>
        {
            value.showHideBoundarySprite(false, null);
        })
    }

    setCheat(_isCheat: boolean, _key: number)
    {
        this.isCheat = _isCheat;
        this.cheatKey = _key;
    }

    private getCheatSymbol(): number
    {
        var resultStr = GameManager.getInstance()?.CheatEditSymbol.string;
        var resultVal = 0;

        try
        {
            resultVal = parseInt(resultStr);

            if(Number.isNaN(resultVal) || resultVal < 0 || resultVal >= this.spriteFrameList.length)
                resultVal = 0;
        }
        catch
        {
            resultVal = 0;
        }
        finally
        {
            return resultVal;
        }
    }
}

