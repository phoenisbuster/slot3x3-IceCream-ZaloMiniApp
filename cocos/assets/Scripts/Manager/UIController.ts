import { _decorator, Component, Label, Node, sp, Sprite, tween, Tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum GirlAnimName
{
    idle = "idle",
    talk = "talk",
    win = "win"
}

enum ChatBoxContent
{
    loading = "Game đang tải vui lòng đợi chút xíu, xin cảm ơn!!!",
    loadingDone = "Tải xong rồi, vào game thôi",
    getName = "Trước tiên cho mình xin tên và số điện thoại của bạn nhé",

    win = "Chúc mùng bạn đã trúng thưởng",
    out = "Xin lỗi nhưng hết lượt qya mất rồi",

    chat1 = "Test",
    chat2 = "Hôm nay có vẻ như bản không may mắn lắm thì phải :v",
    chat3 = "????",
    chat4 = "Ăn may đấy",
    chat5 = "Nói thật bạn xui vl"
    
}

@ccclass('UIController')
export class UIController extends Component 
{
    @property(sp.Skeleton)
    girlAnim: sp.Skeleton = null;

    @property(Sprite)
    chatBoxSprite: Sprite = null;

    @property(Label)
    chatBoxLabel: Label = null;

    @property(Sprite)
    frameBoardSprite: Sprite = null;

    @property(Label)
    frameBoardLabel: Label = null;

    private currentAnimName: string = GirlAnimName.idle;

    private curName: string = "";
    private curPhone: string = "";
    
    start() 
    {
        console.log("Anim Name " + this.currentAnimName);
        this.playGirlIdleAnim();
    }

    setFrameBoard(name: string, phone: string)
    {
        this.frameBoardLabel.string = name + "\n" + phone;
        this.frameBoardSprite.node.active = true;

        var x = this.frameBoardSprite.node.position.x;
        var y = this.frameBoardSprite.node.position.y;

        tween().target(this.frameBoardSprite.node).to(0.5, 
        {
            position: new Vec3(x - 1000, y, 0),
        }).call(()=>
        {
            console.log("CHECK ", this.frameBoardLabel.string);
        }).start();
    }

    hideFrameBoard()
    {
        this.frameBoardLabel.string = "";

        var x = this.frameBoardSprite.node.position.x;
        var y = this.frameBoardSprite.node.position.y;

        console.log("CHECK ", this.frameBoardSprite.node.position);

        tween().target(this.frameBoardSprite.node).to(0.5, 
        {
            position: new Vec3(x + 1000, y, 0),
        }).call(()=>
        {
            console.log("CHECK ", this.frameBoardSprite.node.position);
            this.frameBoardSprite.node.active = false;
        }).start();
    }

    setChatBox(content: string)
    {
        this.chatBoxLabel.string = content;
        this.chatBoxSprite.node.active = true;

        tween().target(this.chatBoxSprite.node).to(0.5, 
        {
            scale: new Vec3(1, 1, 1),
        }).call(()=>
        {
            tween().target(this.chatBoxSprite.node).delay(1).to(0.5, 
            {
                scale: new Vec3(0, 0, 0),
            }).call(()=>
            {
                this.chatBoxSprite.node.active = false;
            }).start();
        }).start();
    }

    playGirlIdleAnim()
    {
        this.currentAnimName = GirlAnimName.idle;
        this.setAnimation(this.girlAnim, this.currentAnimName, true);
    }

    playGirlTalkAnim()
    {
        this.setChatBox(ChatBoxContent.loading.toString());
        
        this.currentAnimName = GirlAnimName.talk;
        this.setAnimation(this.girlAnim, this.currentAnimName, false);
    }

    playGirlWinAnim()
    {
        this.setChatBox(ChatBoxContent.win.toString());
        
        this.currentAnimName = GirlAnimName.win;
        this.setAnimation(this.girlAnim, this.currentAnimName, false);
    }

    private setAnimation(skeleton: sp.Skeleton = null, animationName: string = "animation", loop: boolean = false, startTime: number = 0, timeScale: number = 1, callback: Function = null) 
    {
        if(!skeleton)
        {
            skeleton = this.girlAnim;
        }
        let state = skeleton.setAnimation(0, animationName, loop) as sp.spine.TrackEntry;

        if(state)
        { 
            state.animationStart = startTime;
        }
        skeleton.timeScale = timeScale;
    }
}

