// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import SoundManager from './SoundManager';
import { _decorator, Component, Enum, AudioSource, Tween, Node, tween, CCFloat } from 'cc';

const { ccclass, property } = _decorator;

export enum SoundType{
	Background,
	Effect_Single,
	Effect_Multiple,
    Effect_Loop_AutoStop //loop sfx va tu dong tat sau n giay
}


@ccclass
export default class SoundItem extends Component {
    @property(AudioSource)
    audioSource: AudioSource = null;

    @property({ type: Enum(SoundType) })
    soundType: SoundType = SoundType.Background;

    @property(CCFloat)
    autoStopDelay: number = -1;

    play(from: number = 0, autoStopDelay: number = -1){
        this.autoStopDelay = autoStopDelay;
        let durationES = this.audioSource.duration;

        switch(this.soundType){
            case SoundType.Background:
                if(this.audioSource.state == AudioSource.AudioState.PLAYING) return;
                this.audioSource.loop = true;
                this.audioSource.volume = SoundManager.getInstance().MusicVolume;
                this.audioSource.play();
                break;

            case SoundType.Effect_Single:
                if( this.audioSource.state == AudioSource.AudioState.PLAYING) return;
                this.audioSource.loop = false;
                this.audioSource.volume = SoundManager.getInstance().SfxVolume;
                this.audioSource.currentTime = Math.min(from, durationES);
                this.audioSource.play();
                break;

            case SoundType.Effect_Loop_AutoStop:
                if(this.audioSource.state == AudioSource.AudioState.PLAYING) return;
                this.audioSource.loop = true;
                this.audioSource.volume = SoundManager.getInstance().SfxVolume;
                this.audioSource.currentTime = Math.min(from, durationES);

                let self = this;
                if(self.autoStopDelay > 0){
                    tween(self.node)
                        .delay(self.autoStopDelay)
                        .call(()=>{
                            self.stop();
                        }).start();
                }
                break;

            case SoundType.Effect_Multiple:
                let newSfx = new Node("Effect_Multiple"+ this.node.name);
                newSfx.setParent(this.node);
                let audioSource = newSfx.addComponent(AudioSource);
                audioSource.clip = this.audioSource.clip;
                audioSource.loop = false;
                audioSource.volume = SoundManager.getInstance().SfxVolume;
                audioSource.currentTime = Math.min(from, durationES);
                audioSource.play();
                break;
        }
    }

    stop(){
        this.audioSource.stop();
        this.node.removeAllChildren();
        Tween.stopAllByTarget(this.node);
    }

    onDestroy(){
        Tween.stopAllByTarget(this.node);
    }
}


