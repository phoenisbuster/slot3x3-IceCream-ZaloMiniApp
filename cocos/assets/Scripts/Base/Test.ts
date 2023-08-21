import { _decorator, Component, Node, Label, random, input, Input, EventKeyboard, KeyCode, Graphics } from 'cc';
import "reflect-metadata";
import sdk, { SDKCreator } from "zmp-sdk";
import { ConsoleHelper, consoleEvent, onReceivedMessageEvent } from './ConsoleHelper';
import { createChildMessage, GET_APP_INFO, isParentMessage } from './helper';
import { Connector } from './Connector';
import { Utils } from './Utils';

const { ccclass, property } = _decorator;

const VITE_ENDPOINT = "https://beer-game-socket-stg-vhqmfn2jqa-as.a.run.app";
const VITE_CDP_ENDPOINT = "https://svc.mydatalakes.com/";
const roomId = "9520ec72-8faf-4157-886d-4b82490c18c9";
const userAppId = "3368637342326461234";
const userName = "User Name";
const userAvatar = "https://h5.zdn.vn/static/images/avatar.png";
const ZPM_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MTE1NjMxMzY3ODk0NTgyNTAxIiwiYXBwSWQiOiIzNTc2NDgzMzExNjk5MTcyMzQyIiwiaXNzIjoiYXV0aDAiLCJleHAiOjE2NzAzMDk1MTh9.kqRHzRfQYYZHiQBKV7zsNKZMTzTZsbS3zAxVtTeNqAk";


@ccclass('Test')
export class Test extends Component {
    label: Label = null;

    @property(Graphics)
    ctx: Graphics;
    static instance: Test;
    start() {
        // (sdk["default"] as SDKCreator).getAppInfo().then(res=>console.log(res));
        let self = this;
        consoleEvent.on(onReceivedMessageEvent, msg =>{self.log(msg.data)})
        Test.instance = this;
        this.initConnection();
        //@ts-ignore
        window.move = Test.instance.testInvokeMove
        //@ts-ignore
        window.room = Test.instance.testInvokeRoom

        Utils.QRCreate(200, 200, this.ctx, "https://google.com.vn")
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
        ConsoleHelper.Instance.sendMessageToParent(GET_APP_INFO)
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
        connection.on("invoke-room", (payload: any) => {
            console.log("invoke-room", payload);
            payload.value = {
                method: "invoke-room",
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

