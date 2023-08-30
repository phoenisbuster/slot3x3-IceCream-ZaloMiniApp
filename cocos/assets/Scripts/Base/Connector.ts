import { _decorator, Component } from 'cc';
// import "reflect-metadata";
import * as signalR from "@microsoft/signalr"
import { getUrl } from './helper';
import { ChannelManager } from '../Networks/ChannelManager';

const { ccclass, property } = _decorator;

// export const VITE_ENDPOINT = "https://beer-game-socket-stg-vhqmfn2jqa-as.a.run.app"
export const VITE_CDP_ENDPOINT = "https://svc.mydatalakes.com/";

export const VITE_ENDPOINT = "https://loyalty-socket.o2o.com.vn"
const roomId = "619626ad-7344-4f71-940b-c6d9c15e68bd"; //"9520ec72-8faf-4157-886d-4b82490c18c9"; //619626ad-7344-4f71-940b-c6d9c15e68bd

@ccclass('Connector')
export class Connector{
  private connection;

  accessToken: string = "";

  get Connection(){
    return this.connection;
  }
  
  initConnection(id: string = null){
    if(!id) id = roomId;
    console.log("Set WS Connection with roomID: " + id);

    let host = ChannelManager.getUserInfo();

    this.connection = new signalR["default"].HubConnectionBuilder()
                      .withUrl(getUrl(VITE_ENDPOINT, id, host.getID(), host.getName(), host.getAvatarUrl()), {
                        skipNegotiation: true,
                        transport: (signalR["default"].HttpTransportType.WebSockets),
                      })
                      .configureLogging(signalR["default"].LogLevel.Information)
                      .build();
    // this.connection.onclose(async () => {
    //   await this.startConnecting();
    // });
  }


  startConnecting = async () => {
    try {
      console.log("Attempting reconnect");
      await this.connection.start();
    } catch (err) {
      console.log(err);
      // setTimeout(async () => {
      //   await this.startConnecting();
      // }, 5000);
    }
  };

  stopConnection = function() {
    this.connection?.stop();
  };


  getConnectionState(){
    if(this.connection == null) return signalR["default"].HubConnectionState.Disconnected;
    return this.connection.state;
}
}

