import { _decorator, Camera, Component, director, Node, sys, Vec2, screen, Texture2D, game, Director, Quat, Vec3 } from 'cc';
import { MyGameUtils } from './MyGameUtils';

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

    protected start(): void 
    {
        // this.logImportantInfo();
    }

    logImportantInfo()
    {
        console.warn("==== Log Info For ScreenShot ====");

        console.log("Platform ", sys.platform);
        console.log("sys isBowser ", sys.isBrowser);
        console.log("sys isMobile ", sys.isMobile);
        console.log("sys isNative ", sys.isNative);
        console.log("Browser type ", sys.browserType);
        console.log("Browser version ", sys.browserVersion);
        console.log("Os version ", sys.osVersion);
        console.log("Os main version ", sys.osMainVersion);

        const ctx2d = document.createElement('canvas').getContext('2d');
        if (!ctx2d) 
        {
            console.log('your browser/OS/drivers do not support 2d');
        } 
        else 
        {
            console.log('2d render works!');
            console.log("Check browser 2d render attr is null", ctx2d.getContextAttributes);
            if(ctx2d.getContextAttributes)
            {
                console.log("Check browser 2d render attr", ctx2d.getContextAttributes());
            }
        }

        if(typeof CanvasRenderingContext2D !== 'undefined') 
        {
            console.log('Game appears to support 2d');
        } 
        else 
        {
            console.log('Game has no 2d support at all'); 
        }

        const gl1 = document.createElement('canvas').getContext('webgl');
        if (!gl1) 
        {
            console.log('your browser/OS/drivers do not support WebGL');
        } 
        else 
        {
            console.log('webgl works!');
            console.log("Check browser webgl attr", gl1.getContextAttributes());
        }

        const gl2 = document.createElement('canvas').getContext('webgl2');
        if (!gl2) 
        {
            console.log('your browser/OS/drivers do not support WebGL2');
        } 
        else 
        {
            console.log('webgl2 works!');
            console.log("Check browser webgl2 attr", gl2.getContextAttributes());
        }

        console.log("Check Game Canvas a", game.canvas.getContext("2d"));
        console.log("Check Game Canvas b", game.canvas.getContext("webgl"));
        console.log("Check Game Canvas c", game.canvas.getContext("webgl2"));

        var x = game.canvas.getContext("webgl");
        var y = game.canvas.getContext("webgl2");

        if(!x) 
        {
            if (typeof WebGLRenderingContext !== 'undefined') 
            {
                console.log('Game appears to support WebGL but it might be disabled');
            } 
            else 
            {
                console.log('Game has no WebGL support at all'); 
            }
        } 
        else 
        {
            console.log('Game Webgl works!', x);
            console.log("Game Webgl getContextAttributes", x.getContextAttributes());
            console.log("Game Webgl getContextAttributes premultipliedAlpha", x.getContextAttributes().premultipliedAlpha);
        }

        if(!y) 
        {
            if (typeof WebGL2RenderingContext !== 'undefined') 
            {
                console.log('Game appears to support WebGL2 but it might be disabled');
            } 
            else 
            {
                console.log('Game has no WebGL2 support at all'); 
            }
        } 
        else 
        {
            console.log('Game Webgl2 works!', y);
            console.log("Game Webgl2 getContextAttributes", y.getContextAttributes());
            console.log("Game Webgl2 getContextAttributes premultipliedAlpha", y.getContextAttributes().premultipliedAlpha);
        }

        console.warn("==== End ====")
    }

    capture(isPostFb: boolean = false, isPostTwitter: boolean = false, isDownLoad: boolean = false, onFinish: ()=>void = null)
    {
        // var fullQuality = canvas.toDataURL('image/jpeg', 1.0);
        // var mediumQuality = canvas.toDataURL('image/jpeg', 0.5);
        // var lowQuality = canvas.toDataURL('image/jpeg', 0.1);

        var callback = () => {
            //canvas 캡쳐
            //this._imageHtmlElemental.src = game.canvas.toDataURL()
            // console.log(game.canvas.toDataURL().slice(0, 25));
            // console.log("Screenshot check a", this.gameCanvas.eulerAngles);
            // console.log("Screenshot check b", this.gameCanvas.getRotation());
            // console.log("Screenshot check c", this.gameCanvas.getScale());

            var width = screen.windowSize.width;
            var height = screen.windowSize.height;

            //1. canvas elemental base64 데이터 get

            /*  Since it's a bug of safari when premultipliedAlpha: false while creating a webgl context
                But it has to be false due to the project and engine (Cocos ????) :))
                It was fixed on new device with new ios (dont't know exactly which one) => So just flip data in case of old device
                Old device somehow Canvas rendering Ctx do not have Attr Ctx => Use that to detect
                Use this solution instead => Use getDataUrl method
                The below solution is unused!!!!
            */
            var imageData = this.getDataUrl(game.canvas); //game.canvas.toDataURL();

            //2. 2d canvas 만들기 
            var captureCanvas = document.createElement("canvas");
            captureCanvas.id = 'captureCanvas';
            captureCanvas.width = width;
            captureCanvas.height = height;
            var captureCanvasCtx = captureCanvas.getContext("2d");

            // const t1 = document.createElement("canvas").getContext("2d");
            // const captureCanvasWebGlCtx = captureCanvas.getContext("webgl");
            // const captureCanvasWebGl2Ctx = captureCanvas.getContext("webgl2");

            // console.warn("Capture Canvas 2d t1 Check", t1);
            // console.warn("Capture Canvas 2d t1 Attr Check", MyGameUtils.isNullOrUndefined(t1.getContextAttributes));
            // console.warn("Capture Canvas 2d Check", captureCanvasCtx);
            // console.warn("Capture Canvas 2d Attr Check", MyGameUtils.isNullOrUndefined(captureCanvasCtx.getContextAttributes));
            // console.warn("Capture Canvas webGL Check", captureCanvasWebGlCtx);
            // console.warn("Capture Canvas webGl2 Check", captureCanvasWebGl2Ctx);

            //2.1 Flip the canvas vertically on safari browser of iphone 

            /*  Since it's a bug of safari when premultipliedAlpha: false while creating a webgl context
                But it has to be false due to the project and engine (Cocos ????) :))
                It was fixed on new device with new ios (dont't know exactly which one) => So just flip data in case of old device
                Old device somehow Canvas rendering Ctx do not have Attr Ctx => Use that to detect
                There is other way => Use getDataUrl method so just comment this solution
            */

            // if(sys.platform != sys.Platform.DESKTOP_BROWSER && sys.browserType == sys.BrowserType.SAFARI 
            //     && MyGameUtils.isNullOrUndefined(captureCanvasCtx.getContextAttributes))
            // {
            //     // 2 ways, choose whichever you want
            //     captureCanvasCtx.translate(0, height);
            //     captureCanvasCtx.scale(1, -1);
            //     captureCanvasCtx.setTransform(
            //         1, 0,            // set the direction of x axis
            //         0, -1,           // set the direction of y axis
            //         0,               // set the x origin
            //         height           // set the y origin
            //     );
            //     console.warn("FLIP THE IMAGE");
            // }
            
            //2.5 이미지 만들기 
            var image = new Image();
            image.src = imageData;
            image.onload = () => 
            {
                let _width = width;
                let _height = height;
                let _x = 0;
                let _y = 0;
                //3. 2d canvas에 이미지 붙이기

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

                // console.log("Screenshot check d", cropCanvasCtx.getTransform().toJSON());

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

                onFinish && onFinish();
            };

        }

        //draw 이벤트 발생후 toDataURL을 해주어야 데이터를 받을수 있다 
        director.once(Director.EVENT_AFTER_DRAW, callback);
    }

    //This is new solution => More time consumming but acceptable since we do not use screen shot that much
    getDataUrl(origCanvas: HTMLCanvasElement)
    {
        // console.log("Screen Shot with New Solution");
        
        var canvas = document.createElement('canvas');
        canvas.width = origCanvas.width;
        canvas.height = origCanvas.height;
        var destCtx = canvas.getContext('2d');

        if(!destCtx) 
        {
            console.error("Cannot create context")
            return ""
        }
        destCtx?.drawImage(origCanvas, 0, 0);

        return destCtx.canvas.toDataURL();
    }
}

