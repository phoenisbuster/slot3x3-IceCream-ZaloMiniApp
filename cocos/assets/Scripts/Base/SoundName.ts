export enum SoundName {
    BGM,
    SfxClick,
    SfxSpinBtn,
    SfxRollStop,
    SfxReward,
    SfxWinline,
    SfxCam,
    SfxJackpot,
    SfxRobot,
}

export function getSoundName(sound: SoundName){
  switch(sound){
    case SoundName.BGM: return "BGM"
    case SoundName.SfxClick: return "SfxClick"
    case SoundName.SfxSpinBtn: return "spin"
    case SoundName.SfxRollStop: return "stop"
    case SoundName.SfxReward: return "trungthuong"
    case SoundName.SfxWinline: return "winline"
    case SoundName.SfxCam: return "camera"
    case SoundName.SfxJackpot: return "jackpot"
    case SoundName.SfxRobot: return "SfxRobot"
  }
}
