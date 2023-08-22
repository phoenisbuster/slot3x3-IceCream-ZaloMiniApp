import { _decorator, Component, director, Node } from 'cc';
import SoundManager from '../Base/SoundManager';
import { getSoundName, SoundName } from '../Base/SoundName';
const { ccclass, property } = _decorator;

@ccclass('Audio')
export class Audio extends Component 
{
    private static _instance: Audio = null;

    static getInstance(): Audio 
    {
        return Audio._instance;
    }

    createInstance()
    {
        if(Audio._instance != null) 
        {
            this.destroy();
            return;
        };
        Audio._instance = this;
        
        if(!director.isPersistRootNode(this.node))
        {
            director.addPersistRootNode(this.node);
        }    
    }

    onLoad()
    {
        this.createInstance();
    }

    start() 
    {
        this.playBGMusic();
    }

    playBGMusic()
    {
        SoundManager.getInstance()?.play(getSoundName(SoundName.BGM));
    }

    stopBGMusic()
    {
        SoundManager.getInstance()?.stop(getSoundName(SoundName.BGM));
    }

    playSoundInstance(name: SoundName)
    {
        SoundManager.getInstance()?.play(getSoundName(name));
    }

    stopSoundInstance(name: SoundName)
    {
        SoundManager.getInstance()?.stop(getSoundName(name));
    }
}

