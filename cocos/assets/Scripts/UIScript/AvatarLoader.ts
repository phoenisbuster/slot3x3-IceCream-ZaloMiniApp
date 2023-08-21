import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { Utils } from '../Base/Utils';
const { ccclass, property } = _decorator;

@ccclass('AvatarLoader')
export class AvatarLoader extends Component 
{
    AvatarSprite: Sprite = null
    
    onLoad()
    {
        this.AvatarSprite = this.node.getComponentInChildren(Sprite);
    }

    setAvatar(value: SpriteFrame)
    {
        if(this.AvatarSprite)
        {
            this.AvatarSprite.spriteFrame = value;
        }    
    }

    loadAvatar(url: string){
        let self = this;
        Utils.loadImage(url, spr =>
        {
            self?.setAvatar(spr);
        });
    }
}

