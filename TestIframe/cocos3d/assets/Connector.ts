import { _decorator, Component } from 'cc';
import "reflect-metadata";
import * as signalR from "@microsoft/signalr"
import { getUrl } from './Base/helper';

const { ccclass, property } = _decorator;

const VITE_ENDPOINT = "https://beer-game-socket-stg-vhqmfn2jqa-as.a.run.app"
const roomId = "9520ec72-8faf-4157-886d-4b82490c18c9";
const userAppId = "3368637342326461234";
const userName = "User Name";
const userAvatar = "https://h5.zdn.vn/static/images/avatar.png";



@ccclass('Connector')
export class Connector{
  private connection;
  get Connection(){
    return this.connection;
  }
  
  initConnection(){
    this.connection = new signalR["default"].HubConnectionBuilder()
                      .withUrl(getUrl(VITE_ENDPOINT, roomId, userAppId, userName, userAvatar), {
                        skipNegotiation: true,
                        transport: (signalR["default"].HttpTransportType.WebSockets),
                      })
                      .configureLogging(signalR["default"].LogLevel.Information)
                      .build();
    this.connection.onclose(async () => {
      await this.startConnecting();
    });
  }


  startConnecting = async () => {
    try {
      console.log("Attempting reconnect");
      await this.connection.start();
    } catch (err) {
      console.log(err);
      setTimeout(async () => {
        await this.startConnecting();
      }, 5000);
    }
  };


  getConnectionState(){
    if(this.connection == null) return signalR["default"].HubConnectionState.Disconnected;
    return this.connection.state;
}
}

