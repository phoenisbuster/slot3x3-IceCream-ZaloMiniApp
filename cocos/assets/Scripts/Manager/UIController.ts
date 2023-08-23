import { _decorator, CCFloat, Component, Label, Node, Scheduler, sp, Sprite, tween, Tween, UIOpacity, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum GirlAnimName
{
    idle = "idle",
    talk = "talk",
    win = "win"
}

enum BtnSpinAnimName
{
    idle1 = "Idle1",
    idle2 = "Idle2",
    in = "in",
    out = "out",
    touch = "touch"
}

enum ChatBoxContent
{
    loading = "Game đang tải vui lòng đợi chút xíu, xin cảm ơn!!!",
    loadingDone = "Tải xong rồi, vào game thôi",
    getInfo = "Trước tiên cho mình xin tên và số điện thoại của bạn nhé",
    playgame = "Chúc bạn chơi game vui vẻ",

    win = "Chúc mùng bạn đã trúng thưởng",
    out = "Xin lỗi nhưng hết lượt qya mất rồi",

    chat1 = "Test",
    chat2 = "Hôm nay có vẻ như bản không may mắn lắm thì phải :v",
    chat3 = "????",
    chat4 = "Ăn may đấy",
    chat5 = "Nói thật bạn xui vl",

    nameInvalid = "Tên của bạn không hợp lệ",
    phoneInvalid = "Số điện thoại của bạn không hợp lệ"
}

@ccclass('UIController')
export class UIController extends Component 
{
    @property(Sprite)
    blackBG: Sprite = null;

    @property(sp.Skeleton)
    girlAnim: sp.Skeleton = null;

    @property(sp.Skeleton)
    btnSpinAnim: sp.Skeleton = null;

    @property(Sprite)
    chatBoxSprite: Sprite = null;

    @property(Label)
    chatBoxLabel: Label = null;

    @property(Sprite)
    frameBoardSprite: Sprite = null;

    @property(Label)
    frameBoardLabel: Label = null;

    @property(Label)
    turnNumberLabel: Label = null;

    @property(Sprite)
    backBtnSprite: Sprite = null;

    @property(CCFloat)
    showPos: number = 235;

    @property(CCFloat)
    hidePos: number = 235;

    private currentAnimName: string = GirlAnimName.idle;

    private curName: string = "";
    private curPhone: string = "";

    private schedulerCall: Function = null;
    private strIdx: number = 0;
    private strTemp: string = "";
    
    start() 
    {
        console.log("Anim Name " + this.currentAnimName);
        this.loadingState();
    }

    ///////////////////////////////////// UI DISPLAY BASE ON GAME FLOW ////////////////////////////
    loadingState()
    {
        this.blackBG.node.active = true;
        this.playGirlIdleAnim();
        this.playBTnSpinIdleAnim(true, true);
        this.resetFrameBoardContent();
    }

    getUserInfoState(playAgain: boolean)
    {
        this.unscheduleAllCallbacks();
        
        this.blackBG.node.active = true;
        this.showHideTurnDisplay(false);
        this.showHideBackBtnSprite(false);
        
        this.showhideChatBox(true);
        
        var callback = ()=>
        {
            this.playGirlIdleAnim();
        }
        this.playGirlTalkAnim(callback);
        
        if(playAgain)
        {
            callback = ()=>
            {
                this.playBTnSpinIdleAnim(true, true);
            }
            this.playBTnSpinInOutAnim(false, callback);
        }

        this.setChatBoxConentWithAnim(ChatBoxContent.getInfo, 0.5);
    }

    getUserInfoFinish(name: string, phone: string)
    {
        this.blackBG.node.active = false;
        
        this.curName = name;
        this.curPhone = phone;
        this.setFrameBoardContent();

        var callback = ()=>
        {
            this.playGirlIdleAnim();
        }
        this.playGirlTalkAnim(callback);

        callback = ()=>
        {
            this.playBTnSpinIdleAnim(false, true);
            this.showHideTurnDisplay(true);
            this.showHideBackBtnSprite(true);
        }
        this.playBTnSpinInOutAnim(true, callback);

        this.setChatBoxConentWithAnim(ChatBoxContent.playgame, 0.5);

        this.showhideChatBox(false, 3);
    }

    winState()
    {
        var callback = ()=>
        {
            this.playGirlIdleAnim();
        }
        this.playGirlWinAnim(callback);

        this.showhideChatBox(true);
        this.setChatBoxConentWithAnim(ChatBoxContent.win, 0.5);
    }

    outOfTurnState()
    {
        var callback = ()=>
        {
            this.playGirlIdleAnim();
        }
        this.playGirlTalkAnim(callback);

        callback = ()=>
        {
            this.playBTnSpinIdleAnim(true, true);
        }
        this.playBTnSpinInOutAnim(false, callback);

        this.showhideChatBox(true);
        this.setChatBoxConentWithAnim(ChatBoxContent.out, 0.5);
    }

    ///////////////////////////////////// CHANGE UI DISPLAY /////////////////////////////////////////
    showHideTurnDisplay(isShow: boolean)
    {
        this.turnNumberLabel.node.active = isShow;
    }

    changeTurnNumber(turn: number)
    {
        this.turnNumberLabel.string = turn>0? "" + turn : "0";
    }

    showHideBackBtnSprite(isShow: boolean)
    {
        var out: number = isShow? 255 : 0;
        
        tween(this.backBtnSprite.getComponent(UIOpacity)).to(0.1,
        {
            opacity: out
        }).start();
    }

    onRollBtnClickAnim()
    {
        this.playBTnSpinTouchAnim(false, ()=>
        {
            this.onSpinFinish();
        });
    }

    onSpinFinish()
    {
        this.playBTnSpinIdleAnim(false, true);
    }

    /////////////////////////////////////////// FRAME BOARD /////////////////////////////////////////
    private showFrameBoard()
    {
        this.frameBoardSprite.node.active = true;
        var y = this.frameBoardSprite.node.position.y;

        tween().target(this.frameBoardSprite.node).to(0.5, 
        {
            position: new Vec3(this.showPos, y, 0),
        }).start();
    }

    private hideFrameBoard()
    {
        var y = this.frameBoardSprite.node.position.y;

        tween().target(this.frameBoardSprite.node).to(0.5, 
        {
            position: new Vec3(this.hidePos, y, 0),
        }).call(()=>
        {
            this.frameBoardSprite.node.active = false;
        }).start();
    }

    private setFrameBoardContent()
    {
        this.frameBoardLabel.string = this.curName + "\n" + this.curPhone;
    }

    private resetFrameBoardContent()
    {
        this.frameBoardLabel.string = "";
    }

    /////////////////////////////////////////// CHAT BOX /////////////////////////////////////////
    private setChatBoxConentWithAnim(content: string, delay: number = 0, callback: ()=>void = null)
    {
        if(this.schedulerCall)
            this.unschedule(this.schedulerCall)
        
        this.strTemp = content;
        this.strIdx = 0;

        this.chatBoxLabel.string = "";
        
        this.schedulerCall = ()=>
        {
            if(this.strIdx >= this.strTemp.length)
            {
                console.warn("Set Chat Box Content Finish");
                this.chatBoxLabel.string = content;
                callback && callback();
                return;
            }
                
            this.chatBoxLabel.string += this.strTemp[this.strIdx];
            this.strIdx++;
        }

        this.schedule(this.schedulerCall, 0.05, this.strTemp.length, delay);
    }

    private setChatBoxConent(content: string)
    {
        this.chatBoxLabel.string = content;
    }

    private resetChatBoxContent()
    {
        this.chatBoxLabel.string = "";
    }

    private showChatBoxWithAnim(callback: ()=>{} = null, finish: ()=>{} = null)
    {
        this.chatBoxSprite.node.scale = new Vec3(0, 0, 0);
        this.chatBoxSprite.node.active = true;

        tween().target(this.chatBoxSprite.node).to(0.5, 
        {
            scale: new Vec3(1, 1, 1),
        }).call(()=>
        {
            callback && callback();
            
            tween().target(this.chatBoxSprite.node).delay(1).to(0.5, 
            {
                scale: new Vec3(0, 0, 0),
            }).call(()=>
            {
                this.chatBoxSprite.node.active = false;
                finish && finish();
            }).start();
        }).start();
    }

    private showhideChatBox(isShow: boolean, delay: number = 0)
    {
        this.chatBoxSprite.node.scale = new Vec3(1, 1, 1);
        
        if(delay > 0)
            this.scheduleOnce(()=>
            {
                this.chatBoxSprite.node.active = isShow;
            }, delay);
        else
            this.chatBoxSprite.node.active = isShow;
    }

    /////////////////////////////////////////// GIRL ANIM /////////////////////////////////////////
    private playGirlIdleAnim()
    {
        this.currentAnimName = GirlAnimName.idle;
        this.setAnimation(this.girlAnim, this.currentAnimName, true);
    }

    private playGirlTalkAnim(callback: ()=>void = null)
    {        
        this.currentAnimName = GirlAnimName.talk;
        this.setAnimation(this.girlAnim, this.currentAnimName, false, 0, 1, callback);
    }

    private playGirlWinAnim(callback: ()=>void = null)
    {
        this.currentAnimName = GirlAnimName.win;
        this.setAnimation(this.girlAnim, this.currentAnimName, false, 0, 1, callback);
    }

    /////////////////////////////////////////// BTN SPIN ANIM /////////////////////////////////////////
    private playBTnSpinIdleAnim(isIdle1: boolean, isLoop: boolean, callback: ()=>void = null)
    {
        var name = isIdle1? BtnSpinAnimName.idle1 : BtnSpinAnimName.idle2;
        this.setAnimation(this.btnSpinAnim, name, isLoop, 0, 1, callback);
    }

    private playBTnSpinInOutAnim(isIn: boolean, callback: ()=>void = null)
    {        
        var name = isIn? BtnSpinAnimName.in : BtnSpinAnimName.out;
        this.setAnimation(this.btnSpinAnim, name, false, 0, 1, callback);
    }

    private playBTnSpinTouchAnim(isLoop: boolean, callback: ()=>void = null)
    {
        var name = BtnSpinAnimName.touch;
        this.setAnimation(this.btnSpinAnim, name, isLoop, 0, 1, callback);
    }

    /////////////////////////////////////////// SPINE ANIM /////////////////////////////////////////
    private setAnimation(skeleton: sp.Skeleton = null, 
        animationName: string = "animation", 
        loop: boolean = false, 
        startTime: number = 0, 
        timeScale: number = 1, 
        callback: ()=>void = null) 
    {
        if(!skeleton)
        {
            return;
        }
        let state = skeleton.setAnimation(0, animationName, loop) as sp.spine.TrackEntry;

        skeleton.setCompleteListener((x: sp.spine.TrackEntry)=>
        {
            callback && callback();
        });

        if(state)
        { 
            state.animationStart = startTime;
        }
        skeleton.timeScale = timeScale;
    }
}

