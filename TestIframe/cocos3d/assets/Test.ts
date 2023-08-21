import { _decorator, Component, Node, Label, random } from 'cc';
import "reflect-metadata";
import sdk, { SDKCreator } from "zmp-sdk";
import { ConsoleHelper, consoleEvent, onReceivedMessageEvent } from './Base/ConsoleHelper';
import { isParentMessage } from './Base/helper';

import { Connector } from './Connector';

const { ccclass, property } = _decorator;

const VITE_ENDPOINT = "https://beer-game-socket-stg-vhqmfn2jqa-as.a.run.app"
const roomId = "9520ec72-8faf-4157-886d-4b82490c18c9";
const userAppId = "3368637342326461234";
const userName = "User Name";
const userAvatar = "https://h5.zdn.vn/static/images/avatar.png";



@ccclass('Test')
export class Test extends Component {
    label: Label = null;
    static instance: Test;
    start() {
        // (sdk["default"] as SDKCreator).getAppInfo().then(res=>console.log(res));
        let self = this;
        consoleEvent.on(onReceivedMessageEvent, msg =>{self.log(msg.data)})
        Test.instance = this;
        this.initConnection();
        window.move = Test.instance.testInvokeMove
        window.room = Test.instance.testInvokeRoom
    }

    log(data){
        this.label = this.getComponent(Label)
        //@ts-ignore
        console.log("zzz", data)
        if(data!=null)
            this.label.string += "\n" + JSON.stringify(data)
        else
            this.label.string += "null"
    }

    onClickSend(){
        ConsoleHelper.Instance.sendMessageToParent({"a":"abc", "b": "bcd"})
    }

    connector: Connector;
    initConnection(){
        this.connector = new Connector();
        this.connector.initConnection();
        let connection = this.connector.Connection;

        connection.on("move", (payload: any) => {
            console.log("move", payload);
            payload.value = {
                    method: "move",
                    ...payload,
                };
        });
        connection.on("room", (payload: any) => {
            console.log("room", payload);
            payload.value = {
                method: "room",
                    ...payload,
                };
        });
        this.connector.startConnecting();
    }

    update(){
        if(this.connector==null) return;
        console.log(this.connector.getConnectionState())
    }

    testInvokeMove = async () => {
        await this.connector.Connection.invoke("move", Math.random(), roomId);
    };
    
    testInvokeRoom = async () => {
        await this.connector.Connection.invoke("invoke-room", roomId);
    };
}

