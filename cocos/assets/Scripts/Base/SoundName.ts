export enum SoundName {
    BGM,
    SfxClick,
    SfxSpinBtn,
    SfxRollStop,
    SfxReward,
    SfxTWinline,
    SfxUmph,
    SfxWalk,
    SfxRobot,
}

export function getSoundName(sound: SoundName){
  switch(sound){
    case SoundName.BGM: return "BGM"
    case SoundName.SfxClick: return "SfxClick"
    case SoundName.SfxSpinBtn: return "spin"
    case SoundName.SfxRollStop: return "stop"
    case SoundName.SfxReward: return "trungthuong"
    case SoundName.SfxTWinline: return "winline"
    case SoundName.SfxUmph: return "SfxUmph"
    case SoundName.SfxWalk: return "SfxWalk"
    case SoundName.SfxRobot: return "SfxRobot"
  }
}
