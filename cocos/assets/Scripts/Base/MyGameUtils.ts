import { _decorator, Component, Node, screen, Size, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MyGameUtils')
export class MyGameUtils 
{
    public static isPlatformIOS(): boolean
    {
        return sys.platform == sys.Platform.IOS;
    }

    public static isPlatformAndroid(): boolean
    {
        return sys.platform == sys.Platform.ANDROID;
    }
    
    public static isBrowser(): boolean
    {
        return sys.isBrowser;
    }

    public static isNative(): boolean
    {
        return sys.isNative;
    }

    public static getWindowRes(): Size
    {
        return screen.windowSize;
    }


    public static isNullOrUndefined(object: any): boolean 
    {
        return object == null || object == undefined;
    }
 
    
    public static getNumberWithComas(value: string|number, fixed: number = 0): string
    {
        if(!value)
        {
            return "0";
        }

        if(typeof(value) == "number")
        {
            value = value.toFixed(fixed).toString();
        }

        var newVal = value.split(".");       
        if(fixed == 0)
            newVal[1] = "00";   
        var returnValue = newVal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return newVal[1] !== "00" ? returnValue.concat("." + newVal[1]) : returnValue;
    }

    public static getNumberWithDot(value: string|number, fixed: number = 0): string
    {
        if(!value)
        {
            return "0";
        }

        if(typeof(value) == "number")
        {
            value = value.toFixed(fixed).toString();
        }

        var newVal = value.split(".");
        if(fixed == 0)
            newVal[1] = "00";     
        var returnValue = newVal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return newVal[1] !== "00" ? returnValue.concat("," + newVal[1]) : returnValue;
    }

    public static formatRoundingNumber(value: number, useEng: boolean = true): string
    {
        let sign = "";
        if (value < 0) 
        {
            sign = "-";
            value = -value;
        }

        var format = "";
        if(value >= 1000000000.0) 
        {
            value /= 1000000000.0;
            format = useEng? "B" : " Tỉ";
        } 
        else if(value >= 1000000.0) 
        {
            value /= 1000000.0;
            format = useEng? "M" : " Triệu";
        } 
        else if(value >= 1000.0) 
        {
            value /= 1000.0;
            format = useEng? "K" :  " Ngàn";
        }

        value = (Math.floor(value * 100 + 0.00000001) / 100);
        return sign + value + format;
    }
    
    public static roundNumber(num: number, roundMin: number = 1000): number 
    {
        let temp = parseInt((num / roundMin).toString());
        if(num % roundMin != 0) 
            temp += 1;
        return temp * roundMin;
    }


    public static getRandomInt(max: number, min: number = 0): number 
    {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max-min+1)) + min;
    }

    public static getRandomFloat(max: number): number
    {
        return Math.random() * max;
    }

    public static getRandomEleInArray(array: any[]): any
    {
        return array[this.getRandomInt(array.length-1)];
    }

    public static getRandomEleInArrayByIndex(array: any[]): number
    {
        return this.getRandomInt(array.length-1);
    }

    public static sum(array: number[]) 
    {
        if(array.length <= 0) 
            return 0;
        return array.reduce((total, val) => total + val);
    }

    public static allEleEqual(array: number[])
    {
        if(array.length <= 0)
            return false;
        if(array.length == 1)
            return true;
        
        var val = array[0];
        for (let i = 1; i < array.length; i++) 
        {
            if(val != array[i])
                return false;
        }
        return true;
    }

    public static getFirstEleGreater(array: number[], target: number) 
    {
        // Array must be sorted
        let low = 0, high = array.length;  
        while (low != high) 
        {
            let mid = (low + high) / 2; 
            if(array[mid] <= target) 
            {
                low = mid + 1;
            }
            else 
            {
                high = mid;
            }
        }
        return array[low];
    }


    public static getDate(date: Date): number
    {
        return date.getDate();
    }

    public static getMonth(date: Date): number
    {
        return date.getMonth() + 1;
    }

    public static getYear(date: Date): number
    {
        return date.getFullYear();
    }

    public static getHour(date: Date): number
    {
        return date.getHours();
    }

    public static getNumDaysOfMonth(date: Date)
    {
        switch(date.getMonth() + 1)
        {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            
            case 2:
                if(date.getFullYear() % 4 == 0)
                {
                    return 29;
                }
                else
                {
                    return 28;
                }
            
            default:
                return 30;
        }
    }

    public static getUrlParameter(name, url) 
    {
        name = name.replace("/[[]/", "\\[").replace("/[]]/", "\\]");
        let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        let results = regex.exec(url);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }



}


