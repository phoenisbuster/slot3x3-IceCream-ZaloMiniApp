import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { ResultItem } from './SlotManager';
import { Utils } from '../../Base/Utils';
const { ccclass, property } = _decorator;



class ReelCell
{
    private id: number = 0;
    private data: ResultItem = null;

    constructor(_id: number, _item = null)
    {
        this.id = _id;

        if(_item != null)
            this.data = _item;
        else
            this.data = {
                sprite: null,
                result: -1
            };
    }

    setItem(_data: ResultItem)
    {
        this.data = _data;
    }

    getId(): number
    {
        return this.id;
    }

    getSprite(): SpriteFrame
    {
        return this.data.sprite;
    }

    getResult(): number
    {
        return this.data.result;
    }
}

@ccclass('ReelItem')
export class ReelItem extends Component 
{
    private itemList: ReelCell[] = [];

    private 

    onLoad(): void 
    {
        this.getComponentsInChildren(Sprite).forEach((value, idx)=>
        {
            this.itemList.push(new ReelCell(idx));
        });
        console.warn("Check " + this.itemList.length);
    }
    
    setSpinResult(valueList: ResultItem[])
    {
        
    }
}

