export enum SoundName {
    BGM,
    SfxClick,
    SfxShotGun,
    SfxWin,
    SfxLose,
    SfxTurnAround,
    SfxUmph,
    SfxWalk,
    SfxRobot,
}

export function getSoundName(sound: SoundName){
  switch(sound){
    case SoundName.BGM: return "BGM"
    case SoundName.SfxClick: return "SfxClick"
    case SoundName.SfxShotGun: return "SfxShotGun"
    case SoundName.SfxWin: return "SfxWin"
    case SoundName.SfxLose: return "SfxLose"
    case SoundName.SfxTurnAround: return "SfxTurnAround"
    case SoundName.SfxUmph: return "SfxUmph"
    case SoundName.SfxWalk: return "SfxWalk"
    case SoundName.SfxRobot: return "SfxRobot"
  }
}
