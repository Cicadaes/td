/**
 * Created by tommy on 2017/9/21.
 */

export class DemoData {
    staticData: any = [
        {
            "name": "top10",
            "value": 300,
            "date": "枣园小区"
        },
        {
            "name": "top10",
            "value": 330,
            "date": "东亚北上"
        },
        {
            "name": "top10",
            "value": 350,
            "date": "沿海赛洛城"
        },
        {
            "name": "top10",
            "value": 400,
            "date": "加州水郡西区"
        },
        {
            "name": "top10",
            "value": 540,
            "date": "中海紫御公馆"
        },
        {
            "name": "top10",
            "value": 570,
            "date": "临安家园"
        },
        {
            "name": "top10",
            "value": 600,
            "date": "金源小区"
        },
        {
            "name": "top10",
            "value": 700,
            "date": "西府颐园"
        },
        {
            "name": "top10",
            "value": 750,
            "date": "龙腾苑"
        },
        {
            "name": "top10",
            "value": 900,
            "date": "天通苑"
        }
    ];
    dataMap: any = {
        'area': [
            {
                "product_type": "3C",
                "buy_status": "取消",
                "product_count": 12570,
                "date": "3C",
                "name": "取消",
                "value": 12570
            },
            {
                "product_type": "3C",
                "buy_status": "成功",
                "product_count": 12983,
                "date": "3C",
                "name": "成功",
                "value": 12983
            },
            {
                "product_type": "3C",
                "buy_status": "退货",
                "product_count": 12339,
                "date": "3C",
                "name": "退货",
                "value": 12339
            },
            {
                "product_type": "化妆品",
                "buy_status": "取消",
                "product_count": 10979,
                "date": "化妆品",
                "name": "取消",
                "value": 10979
            },
            {
                "product_type": "化妆品",
                "buy_status": "成功",
                "product_count": 11037,
                "date": "化妆品",
                "name": "成功",
                "value": 11037
            },
            {
                "product_type": "化妆品",
                "buy_status": "退货",
                "product_count": 11068,
                "date": "化妆品",
                "name": "退货",
                "value": 11068
            },
            {
                "product_type": "母婴",
                "buy_status": "取消",
                "product_count": 21875,
                "date": "母婴",
                "name": "取消",
                "value": 21875
            },
            {
                "product_type": "母婴",
                "buy_status": "成功",
                "product_count": 21802,
                "date": "母婴",
                "name": "成功",
                "value": 21802
            },
            {
                "product_type": "母婴",
                "buy_status": "退货",
                "product_count": 21858,
                "date": "母婴",
                "name": "退货",
                "value": 21858
            },
            {
                "product_type": "生鲜",
                "buy_status": "取消",
                "product_count": 10719,
                "date": "生鲜",
                "name": "取消",
                "value": 10719
            },
            {
                "product_type": "生鲜",
                "buy_status": "成功",
                "product_count": 10887,
                "date": "生鲜",
                "name": "成功",
                "value": 10887
            },
            {
                "product_type": "生鲜",
                "buy_status": "退货",
                "product_count": 10597,
                "date": "生鲜",
                "name": "退货",
                "value": 10597
            }
        ],
        'StackedBar': [
            {
                "date": "停留客流",
                "name": "<1km",
                "value": 25
            },
            {
                "date": "停留客流",
                "name": "1-3km",
                "value": 25
            },
            {
                "date": "停留客流",
                "name": "3-5km",
                "value": 25
            },
            {
                "date": "停留客流",
                "name": ">5km",
                "value": 25
            },
            {
                "date": "跳出客流",
                "name": "<1km",
                "value": 25
            },
            {
                "date": "跳出客流",
                "name": "1-3km",
                "value": 25
            },
            {
                "date": "跳出客流",
                "name": "3-5km",
                "value": 25
            },
            {
                "date": "跳出客流",
                "name": ">5km",
                "value": 25
            },
            {
                "date": "入店老客",
                "name": "<1km",
                "value": 25
            },
            {
                "date": "入店老客",
                "name": "1-3km",
                "value": 25
            },
            {
                "date": "入店老客",
                "name": "3-5km",
                "value": 25
            },
            {
                "date": "入店老客",
                "name": ">5km",
                "value": 25
            },
            {
                "date": "入店新客",
                "name": "<1km",
                "value": 19
            },
            {
                "date": "入店新客",
                "name": "1-3km",
                "value": 26
            },
            {
                "date": "入店新客",
                "name": "3-5km",
                "value": 30
            },
            {
                "date": "入店新客",
                "name": ">5km",
                "value": 25
            },
            {
                "date": "入店客流",
                "name": "<1km",
                "value": 23
            },
            {
                "date": "入店客流",
                "name": "1-3km",
                "value": 25
            },
            {
                "date": "入店客流",
                "name": "3-5km",
                "value": 22
            },
            {
                "date": "入店客流",
                "name": ">5km",
                "value": 30
            }
        ],
    };

    public getDataByKey(key: string): void {
        if (this.dataMap[key]) {
            return this.dataMap[key];
        } else {
            return this.staticData;
        }
    }
}