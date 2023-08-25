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
            RewardData
        }
    }
}



