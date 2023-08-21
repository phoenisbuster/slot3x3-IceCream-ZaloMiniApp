import { _decorator, Component, EventTarget } from 'cc';
import { createChildMessage, isChildMessage, isParentMessage } from './helper';
const { ccclass, property } = _decorator;

export const consoleEvent = new EventTarget();
export const onReceivedMessageEvent = "onReceivedMessageEvent"

@ccclass('ConsoleHelper')
export class ConsoleHelper extends Component {
    static Instance: ConsoleHelper;
    
    createInstance(){
        if(ConsoleHelper.Instance!=null) {
            this.destroy()
            return
        };
        ConsoleHelper.Instance = this
    }

    start() {
       this.createInstance();
       if (window) {
            //@ts-ignore
            window.onReceivedMessage = ConsoleHelper.Instance.onReceivedMessage.bind(this)
       }
       this.init();
    }

    sendMessageToParent(data){
        let message = createChildMessage(data);
        window.parent.postMessage(message,'*');
    }

    onReceivedMessage(msg){
        consoleEvent.emit(onReceivedMessageEvent, msg);
    }

    init(){
        if(window.addEventListener){
            //@ts-ignore
            window.addEventListener("message", window.onReceivedMessage, false);
        } else {
             //@ts-ignore
            window.attachEvent("onmessage", window.onReceivedMessage);
        }
    }

}

