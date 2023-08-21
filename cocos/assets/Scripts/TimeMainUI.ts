import { _decorator, Component, Node, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimeMainUI')
export class TimeMainUI extends Component {
    @property(RichText)
    private timeText: RichText = null;

    @property(Number)
    private time: Number = 0;
    onLoad(){
        this.changeTime();
    }
    changeTime(){
        this.timeText.string = "<color=#fdff66>"+this.time+"</color>";
    }
}

