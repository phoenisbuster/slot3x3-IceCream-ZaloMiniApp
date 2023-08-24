import { _decorator, CCBoolean, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
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
    private data: InstanceType<typeof ResultItem> = null;

    constructor(_id: number, _boundarySprite: Sprite = null, _dataSprite: Sprite = null, _item: InstanceType<typeof ResultItem> = null)
    {
        this.id = _id;
        this.boundarySprite = _boundarySprite;
        this.dataSprite = _dataSprite;

        if(_item != null)
            this.data = _item;
        else
            this.data = new ResultItem();
    }

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

    showHideBoundarySprite(isShow: boolean = false)
    {
        this.boundarySprite.enabled = isShow;
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
    
    initData(symbolList: SpriteFrame[], blurList: SpriteFrame[])
    {
        this.spriteFrameList = symbolList;
        this.spriteFrameBlurList = blurList;

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
            console.warn("CHECK CHEAT cheatKey", this.cheatKey);
            console.warn("CHECK CHEAT key", key);
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

    showWinSprite(idx: number)
    {
        if(!this.isBlur)
            this.itemList.get(idx).showHideBoundarySprite(true);
    }

    hideAllWinSprite()
    {
        this.itemList.forEach((value, key)=>
        {
            value.showHideBoundarySprite(false);
        })
    }

    setCheat(_isCheat: boolean, _key: number)
    {
        this.isCheat = _isCheat;
        this.cheatKey = _key;
    }

    getCheatSymbol(): number
    {
        var resultStr = GameManager.getInstance()?.CheatEditSymbol.string;
        var resultVal = 0;
        try
        {
            resultVal = parseInt(resultStr);
            if(resultVal < 0 && resultVal >= this.spriteFrameList.length)
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

