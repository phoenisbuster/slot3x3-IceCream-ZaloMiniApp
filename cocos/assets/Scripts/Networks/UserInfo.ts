import { Vec2 } from "cc";

export class UserInfo
{
    private index: number = 0;
    private userName: string = "";
    private userID: string = "";
    private roomID: string = "";
    private avatar: string = "";
    private initPos: Vec2 = Vec2.ZERO;
    private facing: number = 0;
    
    constructor(index: number = 0, name: string = "Default", id: string = "", avatar: string = "")
    {
        this.index = index;
        this.userName = name;
        this.userID = id;
        this.avatar = avatar;
    }

    public getIndex(){
        return this.index;
    }

    public getName(): string
    {
        return this.userName;
    }

    public getID(): string
    {
        return this.userID;
    }

    public getRoomID(): string
    {
        return this.roomID;
    }

    public getAvatarUrl(): string
    {
        return this.avatar;
    }

    public setRoomID(value: string)
    {
        this.roomID = value;
    }

    public getInitPos(): Vec2
    {
        return this.initPos;
    }

    public getFacing(): number
    {
        return this.facing;
    }

    public setInitPos(pos: Vec2, facing: number)
    {
        this.initPos = pos;
        this.facing = facing;
    }
}

