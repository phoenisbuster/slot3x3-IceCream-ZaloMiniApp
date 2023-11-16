import { _decorator, Component, EventTarget, game, director } from 'cc';
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
        if(!director.isPersistRootNode(this.node))
        {
            director.addPersistRootNode(this.node);
        }  
    }

    start() {
       this.createInstance();
       if (window) 
       {
            console.error("window");    
            //@ts-ignore
            window.onReceivedMessage = ConsoleHelper.Instance.onReceivedMessage.bind(this)
       }
       this.init();
    }

    sendMessageToParent(event = null, data = null){
        let message = createChildMessage(event, data);
        // window.parent.postMessage(message,'*');
        window.top.postMessage(message,'*');
    }

    onReceivedMessage(msg){
        consoleEvent.emit(onReceivedMessageEvent, msg);
    }

    init(){
        if(window.addEventListener)
        {
            console.error("addEventListener");
            //@ts-ignore
            window.addEventListener("message", window.onReceivedMessage, false);
        } 
        else 
        {
            console.error("attachEvent");
            //@ts-ignore
            window.attachEvent("onmessage", window.onReceivedMessage);
        }
    }

}

