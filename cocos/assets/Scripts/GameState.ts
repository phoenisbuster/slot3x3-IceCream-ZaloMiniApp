import { _decorator, Component, Node,Enum, Button, SpriteFrame, Sprite } from 'cc';
import { CharacterAnimation } from './CharacterAnimation';
import { MovingCharacter } from './MovingCharacter';
const { ccclass, property } = _decorator;

export enum LightState{
    RedLight = "RedLight",
    GreenLight = "GreenLight",
 }

 export enum PlayerState{
    Alive = "Alive",
    Death = "Death",
    Finish = "Finish"
 }

@ccclass('GameState')
export class GameState extends Component {

    public static lightState: LightState = LightState.GreenLight;
    public static playerState: PlayerState = PlayerState.Alive;

    @property(Button)
    public btn: Button;

    @property(SpriteFrame)
    textureLight: SpriteFrame[] = [];

    @property(Sprite)
    light: Sprite

    onLoad(){
        GameState.playerState = PlayerState.Alive;
        GameState.lightState = LightState.GreenLight;
        this.light.spriteFrame = this.textureLight[0];
    }
    
    Onclickbutton(){
        this.toggleLight();
    }

    toggleLight(){
        if(GameState.lightState == LightState.RedLight){
            GameState.lightState = LightState.GreenLight;
            this.light.spriteFrame = this.textureLight[0];
        }
        else{
            GameState.lightState = LightState.RedLight;
            this.light.spriteFrame = this.textureLight[1];
        }
    }
}

