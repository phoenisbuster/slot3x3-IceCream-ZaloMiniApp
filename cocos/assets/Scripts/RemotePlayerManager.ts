import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ServerConnect } from './Networks/ServerConnect';
import { ChannelManager } from './Networks/ChannelManager';
import { RemotePlayer } from './RemotePlayer';
import { UserInfo } from './Networks/UserInfo';
const { ccclass, property } = _decorator;

@ccclass('RemotePlayerManager')
export class RemotePlayerManager extends Component {

    @property(Prefab)
    prefabPlayer : Prefab = null

    remotePlayer : Node [] = []

    playerInfo: UserInfo[] = []
    start() {
        this.playerInfo = ChannelManager.getPlayersInfo()
        
        for(let i = 0; i < this.playerInfo.length; i++){
             if(ServerConnect.USER_ID != this.playerInfo[i].getID()){
                 let newPlayer = (instantiate(this.prefabPlayer) as unknown) as Node;
                 newPlayer.parent = this.node.parent
                 let remotePlayerComp = newPlayer.getComponent(RemotePlayer);
                 remotePlayerComp.idRemote = this.playerInfo[i].getID()
                 remotePlayerComp.remoteName = this.playerInfo[i].getName()
                 remotePlayerComp.setIndex(this.playerInfo[i].getIndex())
                 this.remotePlayer.push(newPlayer);
                 //newPlayer.setPosition(0,0,7.824)
             }
        }
     }
}

