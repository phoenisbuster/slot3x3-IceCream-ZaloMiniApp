import { _decorator, Component, director } from 'cc';
import { RoomInfo } from './RoomInfo';
import { UserInfo } from './UserInfo';
const { ccclass, property } = _decorator;

@ccclass('ChannelManager')
export class ChannelManager extends Component 
{
    private static _instance: ChannelManager = null;

    private static CurrentRoom: RoomInfo = null;
    private static CurrentUser: UserInfo = new UserInfo(0, "DevAccount", "3368637342326461", "https://s120-ava-talk.zadn.vn/a/5/0/0/1/120/47c87051e98d40548ac790e7fd6fa426.jpg");
    private static CurrentPlayers: UserInfo[] = null;

    public DefaultRoomID: string = "";
    
    static getInstance(): ChannelManager 
    {
        return ChannelManager._instance;
    }

    static getRoomInfo(): RoomInfo 
    {
        return ChannelManager.CurrentRoom;
    }

    static getUserInfo(): UserInfo
    {
        return ChannelManager.CurrentUser;
    }

    static getPlayersInfo(): UserInfo[]
    {
        return ChannelManager.CurrentPlayers;
    }

    static setRoomInfo(value: RoomInfo) 
    {
        ChannelManager.CurrentRoom = value;
    }

    static setUserInfo(value: UserInfo)
    {
        ChannelManager.CurrentUser = value;
    }

    static setPlayersInfo(value: UserInfo)
    {
        ChannelManager.CurrentPlayers.push(value);
    }

    static checkPlayersInfo(id: string): boolean
    {
        console.log("Check ID " + ChannelManager.CurrentPlayers.length);
        for(let i = 0; i < ChannelManager.CurrentPlayers.length; i++)
        {
            if(ChannelManager.CurrentPlayers[i].getID() == id)
            {
                return true;
            }
        }
        return false;
    }

    static refreshRoom()
    {
        delete ChannelManager.CurrentRoom;
        ChannelManager.CurrentRoom = null;
    }

    static refreshUser()
    {
        delete ChannelManager.CurrentUser;
        ChannelManager.CurrentUser = null;
    }

    static refreshGuest()
    {
        ChannelManager.CurrentPlayers = [];
    }

    createInstance()
    {
        if(ChannelManager._instance != null) 
        {
            this.destroy();
            return;
        };
        ChannelManager._instance = this;
        ChannelManager.CurrentPlayers= [];
        if(ChannelManager.isViewer())
            ChannelManager.CurrentUser = new UserInfo(-1, "", "", "");
        if(!director.isPersistRootNode(this.node))
        {
            console.log("ADD PErsisten Node 4");
            director.addPersistRootNode(this.node);
        }    
    }

    static isHost()
    {
       return ChannelManager.getUserInfo()?.getID() == ChannelManager.getRoomInfo()?.getHostID()
    }

    static isViewer(){
        return false
    }

    onLoad()
    {        
        this.createInstance();
    }

    onDestroy()
    {
        ChannelManager.refreshRoom();
        ChannelManager.refreshUser();
        ChannelManager.refreshGuest();
        
        delete ChannelManager._instance;
        ChannelManager._instance = null;
    }
}

