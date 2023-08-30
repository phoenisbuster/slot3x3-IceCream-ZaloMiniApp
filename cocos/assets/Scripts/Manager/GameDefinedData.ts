import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;


export namespace GameDefinedData
{
    class ResultItem {
        public sprite: SpriteFrame;
        public result: number;

        constructor(_sprite: SpriteFrame = null, _result: number = -1)
        {
            this.sprite = _sprite;
            this.result = _result;
        }
    }

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
        getInfo = "Cho mình xin tên và số điện thoại của bạn nhé",
        playgame = "Chúc bạn chơi game vui vẻ",

        win = "Chúc mùng bạn đã trúng thưởng",
        out = "Xin lỗi nhưng hết lượt quay mất rồi",

        chat1 = "Test",
        chat2 = "Hôm nay có vẻ như bản không may mắn lắm thì phải :v",
        chat3 = "????",
        chat4 = "Ăn may đấy",
        chat5 = "Nói thật bạn xui vl",

        nameInvalid = "Tên của bạn không hợp lệ",
        phoneInvalid = "Số điện thoại của bạn không hợp lệ"
    }

    class RewardData
    {
        public col: number;
        public row: number;
        public symbol: number;

        constructor(_col: number = 0, _row: number = 0, _symbol: number = 0)
        {
            this.col = _col;
            this.row = _row;
            this.symbol = _symbol;
        }
    }

    class ConfigData
    {
        private static _instance: ConfigData = null;

        public static getInstance(): ConfigData
        {
            if(!ConfigData._instance)
            {
                ConfigData._instance = new ConfigData();
            }

            return ConfigData._instance;
        }
        
        private _timeState1 = 0.3;
        public get timeState1() : number
        {
            return this._timeState1;
        }

        private _timeState2 = 0.25;
        public get timeState2() : number
        {
            return this._timeState2;
        }

        private _timeState3 = 0.3;
        public get timeState3() : number
        {
            return this._timeState3;
        }

        private _timeState4 = 0.5;
        public get timeState4() : number
        {
            return this._timeState4;
        }

        private _timeState5 = 0.25;
        public get timeState5() : number
        {
            return this._timeState5;
        }

        private _spinNumber = 10;
        public get spinNumber() : number
        {
            return this._spinNumber;
        }
        private _shrugLevel = 100;
        public get shrugLevel() : number
        {
            return this._shrugLevel;
        }
    }

    type LineAddress =
    {
        col: number,
        row: number
    }

    type Line =
    {
        line: LineAddress[]
    }

    class LineData
    {
        private static data: Line[] = 
        [
            {
                line: 
                [
                    {
                        col: 0, 
                        row: 0
                    },
                    {
                        col: 0, 
                        row: 1
                    },
                    {
                        col: 0, 
                        row: 2
                    },
                ]
            },
            {
                line: 
                [
                    {
                        col: 1, 
                        row: 0
                    },
                    {
                        col: 1, 
                        row: 1
                    },
                    {
                        col: 1, 
                        row: 2
                    },
                ]
            },
            {
                line: 
                [
                    {
                        col: 2, 
                        row: 0
                    },
                    {
                        col: 2, 
                        row: 1
                    },
                    {
                        col: 2, 
                        row: 2
                    },
                ]
            },
            {
                line: 
                [
                    {
                        col: 0, 
                        row: 0
                    },
                    {
                        col: 1, 
                        row: 1
                    },
                    {
                        col: 2, 
                        row: 2
                    },
                ]
            },
            {
                line: 
                [
                    {
                        col: 0, 
                        row: 2
                    },
                    {
                        col: 1, 
                        row: 1
                    },
                    {
                        col: 2, 
                        row: 0
                    },
                ]
            }
        ]

        static getData()
        {
            return this.data;
        }
    }

    

    export function getAllRef() 
    {
        return {
            GirlAnimName, BtnSpinAnimName, ChatBoxContent,

            ResultItem,
            LineData,
            RewardData,
            ConfigData
        }
    }
}



