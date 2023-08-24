import { _decorator, Component, instantiate, Label, Node, Prefab, Rect, sp, sys, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export enum Badge 
{
    gold = "_gold",
    platinum = "_platinum",
    diamond = "_diamond",
    ruby = "_ruby",
    emerald = "_emerald",
}

export default class GameUtils 
{
    public static count: number = 0;
    public static isStatusPing: boolean = true;
    public static gameBetLevel: number = -1;
    // public static cardType: Map<number,number[]> = new Map <number, number[]>();

    // public static getCardType(num: number){
    //   if(this.cardType.has(num)) return this.cardType.get(num);
    // }
    // public static setCardType(){
    //   let key = 0;
    //   let type = 0;
    //   let card = 0;
    //   while(key < 52){
    //       this.cardType.set(key, [card, type]);
    //       type++;
    //       key++;
    //       if(type == 4) {
    //           card++;
    //           type = 0;
    //       }
    //   }
    //   log("this.cardType", this.cardType);
    // }
    public static createClickBtnEvent(node: Node, componentName: string, handlerEvent: string, custom: string = "") 
    {
        const clickEventHandler = new Component.EventHandler();
        clickEventHandler.target = node; //This node is the node to which your event handler code component belongs
        clickEventHandler.component = componentName; //This is the code file name
        clickEventHandler.handler = handlerEvent;
        clickEventHandler.customEventData = custom;
        return clickEventHandler;
    }

    public static getUrlParameter(name, url) 
    {
        name = name.replace("/[[]/", "\\[").replace("/[]]/", "\\]");
        let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        let results = regex.exec(url);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    public static removeParameterUrl(sParam, sourceURL): string 
    {
        var rtn = sourceURL.split("?")[0],
            param,
            params_arr = [],
            queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";

        if(queryString !== "") 
        {
            params_arr = queryString.split("&");
            for(var i = params_arr.length - 1; i >= 0; i -= 1) 
            {
                param = params_arr[i].split("=")[0];
                if(param === sParam) 
                {
                    params_arr.splice(i, 1);
                }
            }
            if(params_arr.length) 
                rtn = rtn + "?" + params_arr.join("&");
        }
        return rtn;
    }

    public static removeAllParameterUrl(sourceURL): string 
    {
        var rtn = sourceURL.split("?")[0],
            param,
            params_arr = [],
            queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
        if (queryString !== "") 
        {
            params_arr = queryString.split("&");
            for (var i = params_arr.length - 1; i >= 0; i -= 1) 
            {
                param = params_arr[i].split("=")[0];
                // if (param === sParam) {
                params_arr.splice(i, 1);
                // }
            }
            if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
        }
        return rtn;
    }

    public static convertToOtherNode(fromNode: Node, targetNode: Node, pos: Vec3 = null) 
    {
        let parent = fromNode;
        if (fromNode.parent) parent = fromNode.parent;
        let worldSpace = parent.getComponent(UITransform).convertToWorldSpaceAR(fromNode.position);
        if(pos) 
        {
            worldSpace = fromNode.getComponent(UITransform).convertToWorldSpaceAR(pos);
        }
        return targetNode.getComponent(UITransform).convertToNodeSpaceAR(worldSpace);
    }

    public static convertToOtherNode2(fromNode: Node, targetNode: Node, pos: Vec2 = null) 
    {
        let parent = fromNode;
        if (fromNode.parent) parent = fromNode.parent;
        let worldSpace = parent.getComponent(UITransform).convertToWorldSpaceAR(fromNode.getPosition());
        if(pos) 
        {
            worldSpace = fromNode.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(pos.x, pos.y, 0));
        }
        return targetNode.getComponent(UITransform).convertToNodeSpaceAR(worldSpace);
    }

    public static rectContainsPoint(rect: Rect, point: Vec2) 
    {
        const result = point.x >= rect.origin.x && 
                        point.x <= rect.origin.x + rect.size.width && 
                        point.y >= rect.origin.y && 
                        point.y <= rect.origin.y + rect.size.height;
        return result;
    }

    public static createItemFromNode<T extends Component>(item: new () => T, node: Node, parentNode: Node = null, insert: boolean = false): T 
    {
        if (!node) return null;
        let parent = parentNode ? parentNode : node.parent;
        let newNode = instantiate(node);

        if(insert) 
        {
            parent.insertChild(newNode, 0);
        } 
        else 
        {
            parent.addChild(newNode);
        }
        
        let newItem = newNode.getComponent(item);
        newItem.node.active = true;
        node.active = false;
        return newItem;
    }

    public static cloneItemFromNode<T extends Component>(item: new () => T, node: Node): T 
    {
        if (!node) return null;
        let newNode = instantiate(node);

        let newItem = newNode.getComponent(item);
        newItem.node.active = true;
        node.active = false;
        return newItem;
    }

    public static createItemFromPrefab<T extends Component>(item: new () => T, prefab: Prefab, parentNode: Node): T 
    {
        if (!prefab) return null;
        let node = instantiate(prefab);
        parentNode.addChild(node);

        let newItem = node.getComponent(item);
        newItem.node.active = true;
        return newItem;
    }

    public static createNodeFromPrefab<T>(prefab: Prefab, parentNode: Node): Node 
    {
        if (!prefab) return null;
        let node = instantiate(prefab);
        parentNode.addChild(node);
        return node;
    }

    public static formatDate(date: Date, format: string): string 
    {
        format = format.replace("%Y", date.getFullYear().toString());
        format = format.replace("%m", date.getMonth().toString().length < 2 ? "0" + date.getMonth().toString() : date.getMonth().toString());
        format = format.replace("%d", date.getDay().toString().length < 2 ? "0" + date.getDay().toString() : date.getDay().toString());
        format = format.replace("%h", date.getHours().toString().length < 2 ? "0" + date.getHours().toString() : date.getHours().toString());
        format = format.replace("%m", date.getMinutes().toString().length < 2 ? "0" + date.getMinutes().toString() : date.getMinutes().toString());
        format = format.replace("%s", date.getSeconds().toString().length < 2 ? "0" + date.getSeconds().toString() : date.getSeconds().toString());
        return format;
    }

    public static formatMoneyNumberMyUser(money: number): string 
    {
        let s = "$ " + this.numberWithCommas(money);
        return s;
    }

    public static formatMoneyNumberMyUserNotIcon(money: number): string 
    {
        return this.numberWithCommas(money);
    }

    public static formatMoneyNumberUser(money: number): string 
    {
        let s = "$ " + this.formatMoneyNumber(money);
        return s;
    }

    public static formatMoneyNumber(money: number): string 
    {
        let sign = 1;
        let value = money;
        if (money < 0) 
            {
            sign = -1;
            value = value * -1;
        }

        var format = "";
        if(value >= 1000000000.0) 
        {
            value /= 1000000000.0;
            format = "B";
        } 
        else if(value >= 1000000.0) 
        {
            value /= 1000000.0;
            format = "M";
        } 
        else if (value >= 1000.0) 
        {
            value /= 1000.0;
            format = "K";
        }

        value = (Math.floor(value * 100 + 0.00000001) / 100) * sign;
        return value + format;
    }

    public static formatMoneyNumber_v2(money: number): string {
        let sign = 1;
        let value = money;
        if (money < 0) 
        {
            sign = -1;
            value = value * -1;
        }

        var format = "";
        if(value >= 1000000000.0) 
        {
            value /= 1000000000.0;
            format = " Tỉ";
        } 
        else if(value >= 1000000.0) 
        {
            value /= 1000000.0;
            format = " Triệu";
        } 
        else if(value >= 1000.0) 
        {
            value /= 1000.0;
            format = " Ngàn";
        }

        value = (Math.floor(value * 100 + 0.00000001) / 100) * sign;
        return value + format;
    }

    public static numberWithCommasMoney(number) 
    {
        let s = "$ " + this.numberWithCommas(number);
        return s;
    }

    public static numberWithCommas(number) 
    {
        if (number) 
        {
            var result = (number = parseFloat(number)).toFixed(2).toString().split(".");
            result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            return result[1] !== "00" ? result.join(",") : result[0];
        }
        return "0";
    }

    public static numberWithCommasV2(number) 
    {
        if (number) 
        {
            var result = (number = parseFloat(number)).toFixed(2).toString().split(".");
            result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            return result[1] !== "00" ? result.join(",") : result[0];
        }
        return "0";
    }

    public static numberWithDot(number) 
    {
        if (number) 
        {
            var result = (number = parseFloat(number)).toFixed(2).toString().split(".");
            result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            return result[1] !== "00" ? result.join(",") : result[0];
        }
        return "0";
    }

    public static formatMoneyWithRange(money: number, shortenStart: number = 100000000): string 
    {
        let rs = "";
        if (money >= shortenStart) rs = GameUtils.formatMoneyNumber(money);
        else rs = GameUtils.numberWithCommas(money);
        return rs;
    }

    public static roundNumber(num: number, roundMin: number = 1000): number 
    {
        let temp = parseInt((num / roundMin).toString());
        if (num % roundMin != 0) temp += 1;
        return temp * roundMin;
    }

    public static getRandomInt(max: number, min: number = 0): number 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public static randomInsideCircle(R: number = 1): Vec2 
    {
        let r = R * Math.sqrt(Math.random());
        let theta = Math.random() * 2 * Math.PI;
        let x = r * Math.cos(theta);
        let y = r * Math.sin(theta);
        return new Vec2(x, y);
    }

    public static getRandomFloat(max) 
    {
        return Math.random() * max;
    }

    public static playAnimOnce(skeleton: sp.Skeleton, toAnimation: string, backAnimation: string, onCompleted: Function = null) 
    {
        if (skeleton == null || skeleton == undefined) return;
        // if (skeleton.getCurrent(0) != null && skeleton.getCurrent(0).animation.name == toAnimation) {
        //   return;
        // }
        skeleton.setCompleteListener((trackEntry: sp.spine.TrackEntry) => 
        {
            if (backAnimation != "" && backAnimation != null) skeleton.setAnimation(0, backAnimation, true);
            if (trackEntry.animation && trackEntry.animation.name == toAnimation) onCompleted && onCompleted();
        });
        skeleton.setAnimation(0, toAnimation, false);
    }

    public static sum(array: number[]) 
    {
        if (array.length <= 0) return 0;
        return array.reduce((total, val) => total + val);
    }

    public static setContentLabelAutoSize(label: Label, content: string) {
        if (content.length > 30) 
        {
            // label.node. = (30 * label.fontSize) / 2;
            label.overflow = Label.Overflow.RESIZE_HEIGHT;
        } 
        else 
        {
            label.overflow = Label.Overflow.NONE;
        }
        label.string = content;
    }

    static FormatString(str: string, ...val: any[]) 
    {
        for (let index = 0; index < val.length; index++) 
        {
            str = str.replace(`{${index}}`, val[index].toString());
        }
        return str;
    }


    public static isPlatformIOS() 
    {
        return sys.platform == sys.Platform.IOS;
    }

    public static isBrowser() 
    {
        return sys.isBrowser;
    }

    public static isNative() 
    {
        return sys.isNative;
    }

    public static isLogVersion() {
        return true;
    }

    public static isNullOrUndefined(object) 
    {
        return object == null || object == undefined;
    }

    public static copyToClipboard(str: string) 
    {
        switch (sys.platform) 
        {
            case sys.Platform.ANDROID:
            case sys.Platform.IOS:
                // Native.getInstance().call("copyToClipBoard", str);
                break;
            case sys.Platform.MOBILE_BROWSER:
            case sys.Platform.DESKTOP_BROWSER:
                if (!navigator.clipboard)
                {
                    // use old commandExec() way
                    const el = document.createElement("textarea");
                    el.value = str;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand("copy");
                    document.body.removeChild(el);
                }
                else
                {   
                    navigator.clipboard.writeText(str).then(()=>
                    {
                        console.warn("Copy to Clipboard Success");
                    }, 
                    ()=>
                    {
                        console.error("Copy to Clipboard Fail");
                    });
                }
                break;
        }
    }

    fancyTimeFormat(duration: number)
    {   
        // Hours, minutes and seconds
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;

        // Output like "01:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) 
        {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }
}
  

