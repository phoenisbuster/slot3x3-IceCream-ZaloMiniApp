import { _decorator, Component, director, Node } from 'cc';
import SoundManager from '../Base/SoundManager';
import { getSoundName, SoundName } from '../Base/SoundName';
const { ccclass, property } = _decorator;

@ccclass('Audio')
export class Audio extends Component {
    start() 
    {
        this.playBGMusic();
        if(!director.isPersistRootNode(this.node))
        {
            director.addPersistRootNode(this.node);
        } 
    }

    playBGMusic()
    {
        SoundManager.getInstance().play(getSoundName(SoundName.BGM));
    }

    stopBGMusic()
    {
        SoundManager.getInstance().stop(getSoundName(SoundName.BGM));
    }
}

