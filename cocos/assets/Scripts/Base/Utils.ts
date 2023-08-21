import { _decorator, Component, Node, Color, log, Graphics, SpriteFrame, assetManager, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Utils')
export class Utils extends Component {
    public static QRCreate(width: number, height: number, ctx: Graphics, url: string) {
        
        log("QRCreate " + url);
    
        //@ts-ignore
        var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
        qrcode.addData(url);
        qrcode.make();
    
        ctx.fillColor = Color.BLACK;
        //block width and height
        var tileW = width / qrcode.getModuleCount();
        var tileH = height / qrcode.getModuleCount();
    
        //draw in the Graphics
        for (var row = 0; row < qrcode.getModuleCount(); row++) {
          for (var col = 0; col < qrcode.getModuleCount(); col++) {
            if (qrcode.isDark(row, col)) {
              //ctx.fillColor = cc.Color.BLACK;
              var w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW);
              var h = Math.ceil((row + 1) * tileW) - Math.floor(row * tileW);
              ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
              ctx.fill();
            }
          }
        }
    
        return qrcode;
      }

      static loadImage(url, callback:(sprite: SpriteFrame)=>void = null){
        if(url == "" || !url) 
        {
          console.log("Error empty url")
          return;
        }
        
        assetManager.loadRemote(url, function (err, imageAsset) {
          if(err != null) 
          {
            console.log("Error when loading img", err)
            return;
          }
          
          const sprite_Frame = new SpriteFrame();
          const texture = new Texture2D();
          texture.image = imageAsset;
          sprite_Frame.texture = texture;
          sprite_Frame.name = "QRImg";
          callback && callback(sprite_Frame)
        });
    }
}


