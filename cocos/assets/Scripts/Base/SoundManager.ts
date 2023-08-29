// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LocalStorageManager from "./LocalStorageManager";
import SoundItem from "./SoundItem";

import { _decorator, Component, warn, EventTarget, director, error } from 'cc';

const { ccclass, property } = _decorator;
const SoundManagerEvent = new EventTarget();
@ccclass
export default class SoundManager extends Component {
  private static instance: SoundManager = null;
  soundMap: Map<string, SoundItem> = new Map<string, SoundItem>();

  static KEY_EFFECT_VOLUME: string = "volumeEffect";
  static KEY_EFFECT: string = "isEffect";
  static KEY_MUSIC_VOLUME: string = "volumeMusic";
  static KEY_MUSIC: string = "isMusic";

  static ON_SOUND_BG_EVENT = "ON_SOUND_BG_EVENT";
  static ON_SOUND_EFF_EVENT = "ON_SOUND_EFF_EVENT";
  
  private isEnableMusic: boolean = true;
  private isEnableSfx: boolean = true;
  private musicVolume: number = 1;
  private sfxVolume: number = 1;


  static getInstance(): SoundManager {
    return SoundManager.instance;
  }

  onLoad(){
    this.init();
    this.loadConfigFromFromStorage();
  }

  init(){
    SoundManager.instance = this;
    let sounds = this.node.getComponentsInChildren(SoundItem);
    for (let i = 0; i < sounds.length; i++) {
      this.soundMap.set(sounds[i].node.name, sounds[i]);
    }
  }

  play(soundName: string, from: number = 0, autoStopDelay: number = -1){
    if(this.soundMap.has(soundName)){
      this.soundMap.get(soundName).play(from, autoStopDelay);
    }else{
      error("can not find sound", soundName)
    }
  }

  stop(soundName: string){
    if(this.soundMap.has(soundName)){
      this.soundMap.get(soundName).stop();
    }
  }

  private loadConfigFromFromStorage() {
    this.isEnableMusic = this.getMusicStatusFromStorage();
    this.isEnableSfx = this.getSfxStatusFromStorage();
    this.musicVolume = this.getMusicVolumeFromStorage();
    this.sfxVolume = this.getSfxVolumeFromStorage();

    this.setMusicVolume(this.musicVolume);
    this.setSfxVolume(this.sfxVolume);
  }

  setMusicStatus(isOn: boolean){
    this.isEnableMusic = isOn;
    this.saveMusicStatusToStorage(isOn);
    SoundManagerEvent.emit(SoundManager.ON_SOUND_BG_EVENT, isOn);
  }

  setMusicVolume(volume: number, isSave: boolean = true){
    this.musicVolume = volume;
    if(!isSave) return; 
    
    this.saveMusicVolumeToStorage(volume);
    let isOn = volume > 0;
    this.saveMusicStatusToStorage(isOn);
    SoundManagerEvent.emit(SoundManager.ON_SOUND_BG_EVENT, isOn);
  }

  get MusicVolume(){
    return this.isEnableMusic? this.musicVolume: 0;
  }

  setSfxVolume(volume: number, isSave: boolean = true){
    this.sfxVolume = volume;
    if(!isSave) return;
    
    this.saveSfxVolumeToStorage(volume);
    let isOn = this.sfxVolume > 0;
    this.saveSfxStatusToStorage(isOn);
    SoundManagerEvent.emit(SoundManager.ON_SOUND_EFF_EVENT, isOn);
  }

  setSfxStatus(isOn: boolean){
    this.isEnableSfx = isOn;
    this.saveSfxStatusToStorage(isOn);
    SoundManagerEvent.emit(SoundManager.ON_SOUND_EFF_EVENT, isOn);
  }

  get SfxVolume(){
    return this.isEnableSfx? this.sfxVolume: 0;
  }

  //SECTION Storage
  getMusicStatusFromStorage(): boolean {
    return LocalStorageManager.internalGetBoolean(SoundManager.KEY_MUSIC, true);
  }

  saveMusicStatusToStorage(isOn: boolean){
    LocalStorageManager.internalSaveBoolean(SoundManager.KEY_MUSIC, isOn);
  }

  getMusicVolumeFromStorage(): number {
    return Number.parseFloat(LocalStorageManager.internalGetString(SoundManager.KEY_MUSIC_VOLUME, "1"));
  }

  saveMusicVolumeToStorage(volume: number): void {
    LocalStorageManager.internalSaveString(SoundManager.KEY_MUSIC_VOLUME, volume.toString());
  }

  getSfxStatusFromStorage(): boolean {
    return LocalStorageManager.internalGetBoolean(SoundManager.KEY_EFFECT, true);
  }

  saveSfxStatusToStorage(isOn: boolean){
    LocalStorageManager.internalSaveBoolean(SoundManager.KEY_EFFECT, isOn);
  }

  getSfxVolumeFromStorage(): number {
    return Number.parseFloat(LocalStorageManager.internalGetString(SoundManager.KEY_EFFECT_VOLUME, "1"));
  }
  
  saveSfxVolumeToStorage(volume: number): void {
    LocalStorageManager.internalSaveString(SoundManager.KEY_EFFECT_VOLUME, volume.toString());
  }
  //!SECTION

  onDestroy(){
    
    delete SoundManager.instance;
    SoundManager.instance = null;
  }
}
