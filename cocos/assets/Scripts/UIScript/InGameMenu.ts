import { _decorator, Component, log, Node } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import UIManager from '../Base/UIManager';
import { GamePlayUI } from '../Popup/GamePlayUI';
import { PopupName } from '../Base/PopupName';
import { GameState, LightState } from '../GameState';
import { LeaderBoard } from '../Popup/LeaderBoard';
import { ChannelManager } from '../Networks/ChannelManager';
import { API_TYPE, CONNECT_METHOD, GAME_TYPE, ServerConnect } from '../Networks/ServerConnect';
import { UserInfo } from '../Networks/UserInfo';
const { ccclass, property } = _decorator;

@ccclass('InGameMenu')
export class InGameMenu extends Component {
    
    private GamePlayUI: PopUpInstance = null;
    private LeaderBoard: PopUpInstance = null;
    
    private isWin = false;
    private curLightStatus: LightState = null;
    
    onLoad()
    {
        // console.log(JSON.stringify(ChannelManager.getRoomInfo()));
        // console.log(JSON.stringify(ChannelManager.getUserInfo()));
        // ChannelManager.getPlayersInfo().forEach(ele=>
        // {
        //     console.log(JSON.stringify(ele));
        // })
    }
    
    start() 
    {
        this.ShowGamePlayUI();
    }

    onEnable()
    {
        GamePlayUI.eventTarget.on(GamePlayUI.CHANGE_LIGHT, this.SetLightStatus, this);
        //GamePlayUI.eventTarget.on(GamePlayUI.FINISH_GAME, this.ShowLeaderBoard, this);
        LeaderBoard.eventTarget.on(LeaderBoard.SHOW_LEADERBOARD, this.ShowLeaderBoard, this);
    }

    onDisable()
    {
        GamePlayUI.eventTarget.off(GamePlayUI.CHANGE_LIGHT, this.SetLightStatus, this);
        //GamePlayUI.eventTarget.off(GamePlayUI.FINISH_GAME, this.ShowLeaderBoard, this);
        LeaderBoard.eventTarget.on(LeaderBoard.SHOW_LEADERBOARD, this.ShowLeaderBoard, this);
    }

    private ShowGamePlayUI()
    {
        if(this.GamePlayUI)
        {
            this.GamePlayUI.showPopup();
            return;
        }
        UIManager.getInstance().openPopup(
            GamePlayUI, 
            PopupName.GamePlay,
            null,
            (popupValue) =>
            {
                this.GamePlayUI = popupValue;
            }
        );
    }

    private ShowLeaderBoard(ListUser: UserInfo[] = [])
    {
        if(this.LeaderBoard)
        {
            this.LeaderBoard.showPopup();
            return;
        }

        let data = ListUser;
        log("Receive Display LeaderBoard signal with: " + ListUser.length);
        UIManager.getInstance().openPopup(
            LeaderBoard, 
            PopupName.LeaderBoard,
            data,
            (popupValue) =>
            {
                this.LeaderBoard = popupValue;
                log("Finish Display LeaderBoard with: " + this.LeaderBoard + " and " + popupValue);
            }
        );
    }

    private SetLightStatus(value: LightState = LightState.GreenLight)
    {
        this.curLightStatus = value;
    }

    private connectPlayGame()
    {
        let body = JSON.stringify(
            {
                roomId: ChannelManager.getRoomInfo().getID()
            }
        )

        let params = new Map<string, any>();
        params.set("roomId", ChannelManager.getRoomInfo().getID());

        console.log("Play Game to RoomID: " + body);

        ServerConnect.getInstance().initConnection(
            ServerConnect.VITE_SOCKET_ENDPOINT,
            GAME_TYPE.RLGL,
            CONNECT_METHOD.POST,
            API_TYPE.PlayGame,
            params,
            null,
            null,
            null
        );
    }
}

