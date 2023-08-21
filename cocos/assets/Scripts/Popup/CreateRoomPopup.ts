import { _decorator, Component, Node, EventTarget, EditBox, Button, error } from 'cc';
import PopUpInstance from '../Base/PopUpInstance';
import SoundManager from '../Base/SoundManager';
import { getSoundName, SoundName } from '../Base/SoundName';
import { GameMenu } from '../UIScript/GameMenu';
import { API_TYPE, CONNECT_METHOD, GAME_TYPE, ServerConnect } from '../Networks/ServerConnect';
import { RoomInfo } from '../Networks/RoomInfo';
const { ccclass, property } = _decorator;

@ccclass('CreateRoomPopup')
export class CreateRoomPopup extends PopUpInstance {
   
    public static eventTarget = new EventTarget();

    @property(Button)
    CancelBtn: Button = null;

    @property(Button)
    OkBtn: Button = null;

    @property(EditBox)
    RoomName: EditBox = null;

    private roomName: string = "";
    
    onShow(data)
    {
        
    }

    onClickClose()
    {
        CreateRoomPopup.eventTarget.emit(GameMenu.CreateRoomCancel);
        this.hidePopup();
        this.RoomName.string = "";
    }

    onClickOK()
    {
        if(this.RoomName.string == "")
        {
            return;
        }
        this.connectCreateRoom();
        this.hidePopup();
    }

    private getNameFromEditBox()
    {
        this.roomName = this.RoomName.string;
        this.RoomName.string = "";    
        return this.roomName;
    }

    private connectCreateRoom()
    {
        let body = JSON.stringify(
            {
                name: this.getNameFromEditBox(),
                hostUserAppId: ServerConnect.USER_ID,
            }
        )

        ServerConnect.getInstance().initConnection(
            ServerConnect.VITE_SOCKET_ENDPOINT,
            GAME_TYPE.RLGL,
            CONNECT_METHOD.POST,
            API_TYPE.CreateRoom,
            null,
            body,
            null,
            null
        );
    }
}

