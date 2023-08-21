import { _decorator, CCString, Component, Node, RichText, Sprite, SpriteFrame } from 'cc';
import { Utils } from '../Base/Utils';
const { ccclass, property } = _decorator;

@ccclass('RankInfo')
export class RankInfo extends Component 
{
    @property(Sprite)
    Rank_Symbol: Sprite = null;
    
    @property(RichText)
    Rank_Value: RichText = null;

    @property(Sprite)
    Rank_Avartar: Sprite = null;

    @property(RichText)
    Rank_Name: RichText = null;

    @property(CCString)
    Name_Color_Code: string = "#6b372f";

    @property(CCString)
    Rank_Color_Code: string = "#fdff66";
    
    private playerID: number = 0;
    
    setName(value: string)
    {
        this.Rank_Name.string = "<color=" + this.Name_Color_Code + ">" + value + "</color>";
    }

    setRankSymbol(value: SpriteFrame)
    {
        this.Rank_Symbol.spriteFrame = value;
    }

    setRankValue(value: string)
    {
        this.Rank_Value.string = "<color=" + this.Rank_Color_Code + ">" + value + "</color>";
    }

    setAvatar(value: SpriteFrame)
    {
        this.Rank_Avartar.node.getComponentInChildren(Sprite).spriteFrame = value;
    }

    loadAvatar(url: string){
        let self = this;
        Utils.loadImage(url, spr =>
        {
            self?.setAvatar(spr);
        });
    }

    setPlayerID(value: number)
    {
        this.playerID = value;
    }

    getPlayerID(): number
    {
        return this.playerID;
    }
}

