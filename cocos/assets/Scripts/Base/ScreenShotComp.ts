import { _decorator, Camera, Component, director, Node, RenderTexture, size, Sprite, sys, Vec2, screen, SpriteFrame, Texture2D, game, Director, Quat, Vec3 } from 'cc';
// import { FBInstant } from "";
import GameUtils from './GameUtils';
import { PlatformType } from 'zmp-sdk';
import { Platform } from '@microsoft/signalr/dist/esm/Utils';

// import Facebook from '../Social/Facebook';

const { ccclass, property } = _decorator;

@ccclass('ScreenShotComp')
export class ScreenShotComp extends Component 
{
    @property(Node)
    private gameCanvas: Node = null;
    
    private static _instance: ScreenShotComp = null;

    private idx: number = 0;

    static getInstance(): ScreenShotComp 
    {     
        return ScreenShotComp._instance;
    }

    protected onLoad(): void 
    {
        ScreenShotComp._instance = this;
        director.addPersistRootNode(this.node);
    }

    capture(isPostFb: boolean = false, isPostTwitter: boolean = false, isDownLoad: boolean = false, onFinish: ()=>void = null)
    {
        // var fullQuality = canvas.toDataURL('image/jpeg', 1.0);
        // var mediumQuality = canvas.toDataURL('image/jpeg', 0.5);
        // var lowQuality = canvas.toDataURL('image/jpeg', 0.1);
        if(sys.platform != sys.Platform.DESKTOP_BROWSER && sys.browserType == sys.BrowserType.SAFARI)
        {
            this.gameCanvas.setRotationFromEuler(new Vec3(0, 0, 180));
            this.gameCanvas.scale = new Vec3(-1, 1, 1);
        }


        var callback = () => {

            //canvas 캡쳐
            //this._imageHtmlElemental.src = game.canvas.toDataURL()
            console.log(game.canvas.toDataURL().slice(0, 20));
            var width = screen.windowSize.width;
            var height = screen.windowSize.height;

            //1. canvas elemental base64 데이터 get
            var imageData = game.canvas.toDataURL();

            //2. 2d canvas 만들기 
            var captureCanvas = document.createElement("canvas");
            captureCanvas.id = 'captureCanvas';
            captureCanvas.width = width;
            captureCanvas.height = height;
            var captureCanvasCtx = captureCanvas.getContext("2d");

            //2.5 이미지 만들기 
            var image = new Image();
            image.src = imageData;
            image.onload = () => 
            {
                let _width = width;
                let _height = height;
                let _x = 0;
                let _y = 0;
                //3. 2d canvas에 이미지 붙이기 \
                
                captureCanvasCtx.drawImage(image, 0, 0, width, height);

                //4. 2d canvas에서 오려올 데이터 만들기 
                // var cropImageData = captureCanvasCtx.getImageData((winSize.width/2)-(_width/2)+_x, (winSize.height/2)-(_height/2)+_y, _width, _height);
                var cropImageData = captureCanvasCtx.getImageData((width/2)-(_width/2)+_x, (height/2)-(_height/2)+_y, _width, _height);
                //5. 오려진 데이터 사이즈만큼의 canvas만들기
                var cropCanvas = document.createElement("canvas");
                cropCanvas.id = 'cropCanvas';
                cropCanvas.width = _width;
                cropCanvas.height = _height;

                //6. 오려진 데이터를 오려진 canvas에 그리기 
                var cropCanvasCtx = cropCanvas.getContext("2d");
                cropCanvasCtx.rect(0, 0, _width, _height);
                cropCanvasCtx.fillStyle = 'white';
                cropCanvasCtx.fill();
                cropCanvasCtx.putImageData(cropImageData, 0, 0);

                console.log("Screenshot check a", cropCanvasCtx.getTransform().toJSON());
                console.log("Screenshot check b", this.gameCanvas.eulerAngles);
                console.log("Screenshot check c", this.gameCanvas.getRotation());
                console.log("Screenshot check d", this.gameCanvas.getScale());

                //7. 잘려진 이미지 데이터
                var cropCanvasBase64Data = cropCanvas.toDataURL();
                // log(cropCanvasBase64Data);

                // this._imageHtmlElemental.src = cropCanvasBase64Data;
                // let image = cropCanvasBase64Data.replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
                // window.location.href=image;
                if(isDownLoad)
                {
                    var link = document.createElement('a');
                    link.download = "screencapture" + this.idx;
                    link.href = cropCanvasBase64Data;
                    link.click();

                    this.idx++;
                }

                // if(isPostFb)
                //     Facebook.upload(cropCanvasBase64Data);
                // let url = "http://twitter.com/share?url=[url]&via=trucsweb&image-src=" + cropCanvasBase64Data+"&text=[title]"
                // let text = "aaaaaaaaaaaaa";
                // let shareUrl = cropCanvasBase64Data
                // let url = Utils.FormatString("https://twitter.com/intent/tweet?text={0}&url={1}", text, shareUrl)
                // console.error(url)
                // sys.openURL(url);
                // let imgLink = "https://cdn.yeudulich.com/media/cms/a8/29/e894-5a23-41b9-b70a-7c7638ef1e4a.jpg"


                // window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(imgLink)+'&t='+encodeURIComponent("dontlookup"),'sharer','toolbar=0,status=0,width=626,height=436');
                // window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent("https://cdn.yeudulich.com/media/cms/a8/29/e894-5a23-41b9-b70a-7c7638ef1e4a.jpg"))
                // let shareLink = "http://twitter.com/share?text={0}&url={1}&hashtags={2}"
                // window.open(Utils.FormatString(shareLink, "Dont look up", imgLink, "hash1,hash2"))
                cropCanvas = null;
                captureCanvas = null;

                // return cropCanvasBase64Data;

                if(sys.platform != sys.Platform.DESKTOP_BROWSER && sys.browserType == sys.BrowserType.SAFARI)
                {
                    this.gameCanvas.setRotationFromEuler(new Vec3(0, 0, 0));
                    this.gameCanvas.scale = new Vec3(1, 1, 1);
                }

                onFinish && onFinish();

                // FBInstant.shareAsync({
                //     intent: 'SHARE', // * "INVITE" | "REQUEST" | "CHALLENGE" | "SHARE"
                //     image: cropCanvasBase64Data,
                //     text: 'X is asking for your help!',
                //     data: { myReplayData: '...' },
                //     }).then(function() {
                //         console.info("share image done");
                //     }).catch(e=>{
                //         console.warn("share failed: ", e);
                // });
            };

        }

        //draw 이벤트 발생후 toDataURL을 해주어야 데이터를 받을수 있다 
        director.once(Director.EVENT_AFTER_DRAW, callback);
    }
}

