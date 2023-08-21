export class RoomInfo
{
    private roomName: string = "";
    private roomID: string = "";
    private hostID: string = "";
    private curNumberPlayer: number = 0;
    private maxPlayers: number = 0;

    constructor(name: string = "Default", id: string = "", host: string = "", numPlayer: number = 1, maxPlayer: number = 1)
    {
        this.roomName = name;
        this.roomID = id;
        this.hostID = host;
        this.curNumberPlayer = numPlayer;
        this.maxPlayers = maxPlayer;
    }

    public getName(): string
    {
        return this.roomName;
    }

    public getID(): string
    {
        return this.roomID;
    }

    public getHostID(): string
    {
        return this.hostID;
    }

    public getCurPlayerNumber(): number
    {
        return this.curNumberPlayer;
    }

    public setCurPlayerNumber(value: number)
    {
        this.curNumberPlayer = value;
    }

    public getMaxPlayer(): number
    {
        return this.maxPlayers;
    }

    public setMaxPlayer(value: number)
    {
        this.maxPlayers = value;
    }
}

