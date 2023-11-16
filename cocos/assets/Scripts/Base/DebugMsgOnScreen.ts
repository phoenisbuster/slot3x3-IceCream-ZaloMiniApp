import { _decorator, Component, director, Label, Node } from 'cc';
import { consoleEvent } from './ConsoleHelper';
const { ccclass, property } = _decorator;

@ccclass('DebugMsgOnScreen')
export class DebugMsgOnScreen extends Component 
{
    private static _instance: DebugMsgOnScreen = null;

    @property(Label)
    debugMsg: Label = null;
    
    static getInstance(): DebugMsgOnScreen 
    {
        return DebugMsgOnScreen._instance;
    }

    createInstance()
    {
        if(DebugMsgOnScreen._instance != null) 
        {
            console.log("DebugMsgOnScreen connect has already loaded");
            this.destroy();
            return;
        };
        DebugMsgOnScreen._instance = this; 
    }

    onLoad()
    {
        this.createInstance();
    }

    setDebugMsg(msg: string = "", isReset: boolean = false)
    {
        if(isReset)
            this.debugMsg.string = msg;
        else
            this.debugMsg.string += "\n" + msg;
    }
}

