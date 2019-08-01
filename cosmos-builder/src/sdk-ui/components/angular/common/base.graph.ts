import 'echarts/dist/extension/bmap';
import 'echarts/map/js/china.js';
import * as echarts from 'echarts';
export class BaseGraph {

    // 图表类型，默认为柱形图
    public gpType: string = 'bar';        // 数据相关

    public title: any = {};
    // 直角坐标系grid中的X轴
    public xAxis: any = {};
    // 直角坐标系grid中的X轴
    public yAxis: any = {};
    //坐标系区域缩放
    public dataZoom: any = {};
    // 系列列表，每个系列再有详细的配置，通过type决定自己的图表类型
    public series: any = [];

    // 地图图例
    public visualMap: any;
    public geo: any;

    // 样式相关
    // 图例
    public legend: any = {
        show: false,
        type: 'scroll'
    };
    // 提示框
    public tooltip: any = {};
    // 背景色
    public backgroundColor: string = "transparent";
    // 调色盘颜色列表
    public color: string[] = ['#2d8cf0', '#2de3c5', '#fcc45f', '#ff8454', '#db425a', '#34508c', '#5bb6fd', '#56d08b', '#b3e768', '#71808f'];
    // 直角坐标系内绘图网格
    public grid: any = {};

    // 设置属性的默认值
    constructor(gpType: string = 'line') {
        this.gpType = gpType;
        this.setDefaultOption(this.gpType);
    }
    /**
     * 对应图形设置默认数据
     * @param  {string = 'bar'}       gptype [description]
     * @return {[type]}      [description]
     */
    centtt(o1: any, o2: any) {
        if (isNaN(o1.value) || o1.value == null) return -1;
        if (isNaN(o2.value) || o2.value == null) return 1;
        return o1.value - o2.value;
    }
    data = [{
        name: '北京',
        value: 5.3
    },
    {
        name: '天津',
        value: 3.8
    },
    {
        name: '上海',
        value: 4.6
    },
    {
        name: '重庆',
        value: 3.6
    },
    {
        name: '河北',
        value: 3.4
    },
    {
        name: '河南',
        value: 3.2
    },
    {
        name: '云南',
        value: 1.6
    },
    {
        name: '辽宁',
        value: 4.3
    },
    {
        name: '黑龙江',
        value: 4.1
    },
    {
        name: '湖南',
        value: 2.4
    },
    {
        name: '安徽',
        value: 3.3
    },
    {
        name: '山东',
        value: 3.0
    },
    {
        name: '新疆',
        value: 1
    },
    {
        name: '江苏',
        value: 3.9
    },
    {
        name: '浙江',
        value: 3.5
    },
    {
        name: '江西',
        value: 2.0
    },
    {
        name: '湖北',
        value: 2.1
    },
    {
        name: '广西',
        value: 3.0
    },
    {
        name: '甘肃',
        value: 1.2
    },
    {
        name: '山西',
        value: 3.2
    },
    {
        name: '内蒙古',
        value: 3.5
    },
    {
        name: '陕西',
        value: 2.5
    },
    {
        name: '吉林',
        value: 4.5
    },
    {
        name: '福建',
        value: 2.8
    },
    {
        name: '贵州',
        value: 1.8
    },
    {
        name: '广东',
        value: 3.7
    },
    {
        name: '青海',
        value: 0.6
    },
    {
        name: '西藏',
        value: 0.4
    },
    {
        name: '四川',
        value: 3.3
    },
    {
        name: '宁夏',
        value: 0.8
    },
    {
        name: '海南',
        value: 1.9
    },
    {
        name: '台湾',
        value: 0.1
    },
    {
        name: '香港',
        value: 0.1
    },
    {
        name: '澳门',
        value: 0.1
    }
    ];

    private setDefaultOption(gptype: string = 'bar') {
        let that = this;
        switch (gptype) {
            case 'line':
                Object.assign(this, {
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        boundaryGap: false,
                        axisTick: {
                            show: true
                        },
                    },
                    yAxis: {
                        type: 'value',
                        // axisLabel: {
                        //     formatter: 'value'
                        // },
                        nameTextStyle: {
                            padding: [0, 0, 0, 12 * 3],
                        },
                        axisTick: {
                            show: true
                        }
                    },
                    dataZoom: [
                        {
                            show: false,
                            type: 'slider',
                            filterModeX: 'none',
                            xAxisIndex: 0,
                            start: 0,
                            end: 100,
                            bottom: 0,
                        }
                    ],
                    tooltip: {
                        trigger: 'item',
                        show: true,
                        padding: [12, 16],
                        backgroundColor: 'rgba(23,35,61,0.85)',
                        confine: true,
                        z: 20,
                        formatter: function (params: any) {
                            var relVal = "<div style='font-size:14px;margin-bottom:16px;'>" + params[0].name + "</div>";
                            for (let j = 0; j < params.length; j++) {
                                relVal = relVal + "<div *ngFor='let param of params;let i=index' style='display:block;font-size:12px;margin-bottom:13px;'><div style='float:left'><span style='line-height:10px;display: inline-block;height:6px;width:6px;border-radius:50%;margin-right:8px;margin-bottom:1px;background:" + params[j].color + "'></span><span style='font-size: 12px;color: #FFFFFF;font-family: HelveticaNeue,Microsoft YaHei,PingFangSC;'>" + params[j].seriesName + "</span> <span style='margin:0 8px;display:inline-block'></span> " + "</div><div style='float:right;font-size: 12px;color: #FFFFFF;font-family: HelveticaNeue,Microsoft YaHei,PingFangSC;'>" + (params[j].value == null ? "暂无数据" : that.setPrecision(params[j].value)) + "</div></div><div style='clear:both'></div>";
                            }
                            return relVal;
                        }
                    },
                    grid: {
                        borderWidth: '0',
                        top: 20,
                        left: '0%',
                        right: 90,
                        bottom: 5,
                        containLabel: true
                    },
                    legend: {
                        show: false,
                        type: 'scroll',
                        itemWidth: 10,
                        itemHeight: 10,
                        icon: 'line',
                        data: ['Forest'],
                        formatter: function (name: any) {
                            if (name.length > 5) {
                                return name.substring(0, 5) + '...';
                            } else {
                                return name
                            }
                        },
                        tooltip: {
                            show: true,
                            confine: true,
                            formatter: function (obj: any) {
                                return obj.name;
                            }
                        },
                        textStyle: {
                            color: "red",
                            fontFamily: "HelveticaNeue,Microsoft YaHei,PingFangSC",
                            fontSize: 12,
                        },
                    },
                    series: [
                        {
                            name: 'Forest',
                            type: gptype,
                            data: [320, 332, 301, 334, 390, 356, 465],
                            smooth: true
                        }

                    ]
                });
                break;
            case 'bar':
                Object.assign(this, {
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            show: true
                        },
                    },
                    yAxis: {
                        type: 'value',
                        nameTextStyle: {
                            padding: [0, 0, 0, 12 * 3],
                        },
                        axisTick: {
                            show: true
                        }
                    },
                    dataZoom: [
                        {
                            show: false,
                            type: 'slider',
                            filterModeX: 'none',
                            start: 0,
                            end: 100,
                            bottom: 0,
                        }
                    ],
                    grid: {
                        borderWidth: '0',
                        top: 20,
                        left: '0%',
                        right: 90,
                        bottom: 5,
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'item',
                        show: true,
                        padding: [12, 16],
                        backgroundColor: 'rgba(23,35,61,0.85)',
                        confine: true,
                        formatter: function (params: any) {
                            if (params[0] && params[0].name) {
                                var relVal = "<div style='font-size:14px;margin-bottom:16px;'>" + params[0].name + "</div>";
                                for (let j = 0; j < params.length; j++) {
                                    relVal = relVal + "<div *ngFor='let param of params;let i=index' style='display:block;font-size:12px;margin-bottom:13px;'><div style='float:left'><span style='line-height:10px;display: inline-block;height:6px;width:6px;border-radius:50%;margin-right:8px;margin-bottom:1px;background:" + params[j].color + "'></span>" + params[j].seriesName + " <span style='margin:0 8px;display:inline-block'></span> " + "</div><div style='float:right'>" + (params[j].value == null ? "暂无数据" : that.setPrecision(params[j].value)) + "</div></div><div style='clear:both'></div>";
                                }
                                return relVal;
                            }
                        }
                    },
                    legend: {
                        show: true,
                        type: 'scroll',
                        itemWidth: 10,
                        itemHeight: 10,
                        top: 'top',
                        align: 'left',
                        left: 'right',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: function (p: any) {
                                        return that.formatNum(p.value);
                                    }
                                }
                            }
                        },
                        data: ['Forest', 'Steppe', 'Desert', 'Wetland'],
                        formatter: function (name: any) {
                            if (name.length > 5) {
                                return name.substring(0, 5) + '...';
                            } else {
                                return name
                            }
                        },
                        tooltip: {
                            show: true,
                            confine: true,
                            formatter: function (obj: any) {
                                return obj.name;
                            }
                        },
                        textStyle: {
                            color: "#495060",
                            fontFamily: "HelveticaNeue,Microsoft YaHei,PingFangSC",
                            fontSize: 12,
                        },
                    },
                    series: [
                        {
                            name: 'Forest',
                            type: gptype,
                            data: [320, 332, 301, 334, 390, 356, 465]
                        },
                        {
                            name: 'Steppe',
                            type: gptype,
                            data: [520, 482, 291, 234, 290, 578, 356]
                        },
                        {
                            name: 'Desert',
                            type: gptype,
                            data: [450, 232, 201, 354, 190, 355, 123]
                        },
                        {
                            name: 'Wetland',
                            type: gptype,
                            data: [298, 377, 101, 299, 440, 578, 356]
                        }
                    ]
                });
                break;

            case 'grid':
                Object.assign(this, {
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    legend: {
                        show: false,
                        itemWidth: 10,
                        itemHeight: 10,
                        type: 'scroll',
                        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
                    },
                    tooltip: {
                        backgroundColor: 'rgba(23,35,61,0.85)',
                        trigger: 'item',
                        show: true,
                        confine: true,
                        padding: [12, 16],
                    },
                    series: [
                        {
                            name: 'Forest',
                            type: 'line',
                            data: [320, 332, 301, 334, 390, 356, 465]
                        },
                        {
                            name: 'Steppe',
                            type: 'line',
                            data: [520, 482, 291, 234, 290, 578, 356]
                        },
                        {
                            name: 'Desert',
                            type: 'line',
                            data: [450, 232, 201, 354, 190, 355, 123]
                        },
                        {
                            name: 'Wetland',
                            type: 'line',
                            data: [298, 377, 101, 299, 440, 578, 356]
                        }
                    ]
                });
                break;

            case 'map':
                delete this.dataZoom;
                Object.assign(this, {
                    grid: {
                        right: 10,
                        top: 80,
                    },
                    xAxis: {
                        show: false,
                    },
                    yAxis: {
                        show: false,
                    },
                    tooltip: {
                        confine: true,
                        trigger: 'item',
                        backgroundColor: 'rgba(23,35,61,0.85)',
                        show: true,
                        padding: [12, 16],
                        formatter: function (params: any) {
                            var relVal = "<div style='display:block;font-size:12px;margin-bottom:13px;'><div style='float:left'><span style='line-height:10px;display: inline-block;height:6px;width:6px;border-radius:50%;margin-right:8px;margin-bottom:1px;background:" + params.color + "'></span>" + params.name + " <span style='margin:0 8px;display:inline-block'></span> " + "</div><div style='float:right'>" + params.value ? (params.value + '%') : "暂无数据" + "</div></div><div style='clear:both'></div>";
                            return relVal;
                        }
                    },
                    visualMap: {
                        type: 'continuous',
                        show: true,
                        inRange: {
                            color: ['#ffffff', '#000000']
                        },
                        showLabel: true,
                        calculable: true,
                        text: ['高', '低'],
                        min: 0,
                        max: 7,
                        itemWidth: 11,
                        itemHeight: 72,
                        textStyle: {
                            fontFamily: '微软雅黑',
                            color: '#000000',
                            fontSize: 12,
                        },


                    },
                    geo: {
                        roam: true,
                        map: 'china',
                        label: {
                            emphasis: {
                                show: true
                            }
                        },
                        regions: [{
                            name: '南海诸岛',
                            value: 0,
                            itemStyle: {
                                normal: {
                                    opacity: 0,
                                    label: {
                                        show: false
                                    }
                                }
                            }
                        }],
                    },
                    series: [{
                        name: 'mapSer',
                        type: 'map',
                        roam: false,
                        geoIndex: 0,
                        label: {
                            show: false,
                        },
                        data: this.data
                    }]
                });
                break;
            case 'retention':
                Object.assign(this, {
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    legend: {
                        show: false,
                        type: 'scroll',
                        itemWidth: 10,
                        itemHeight: 10,
                        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
                    },
                    series: [
                        {
                            name: 'Forest',
                            type: 'bar',
                            data: [320, 332, 301, 334, 390, 356, 465]
                        },
                        {
                            name: 'Steppe',
                            type: 'bar',
                            data: [520, 482, 291, 234, 290, 578, 356]
                        },
                        {
                            name: 'Desert',
                            type: 'bar',
                            data: [450, 232, 201, 354, 190, 355, 123]
                        },
                        {
                            name: 'Wetland',
                            type: 'bar',
                            data: [298, 377, 101, 299, 440, 578, 356]
                        }
                    ]
                });
                break;
            case 'funnel':
                delete this.xAxis;
                delete this.yAxis;
                delete this.dataZoom;

                Object.assign(this, {
                    legend: {
                        show: false,
                        type: 'scroll',
                        orient: 'vertical',
                        left: 'right',
                        top: 'middle',
                        itemWidth: 10,
                        itemHeight: 10,
                        data: ['访问', '咨询', '订单', '点击', '展现'],
                        formatter: function (name: any) {
                            if (name.length > 5) {
                                return name.substring(0, 5) + '...';
                            } else {
                                return name
                            }
                        },
                        tooltip: {
                            show: true,
                            confine: true,
                            formatter: function (obj: any) {
                                return obj.name;
                            }
                        },
                        textStyle: {
                            color: "#495060",
                            fontFamily: "HelveticaNeue,Microsoft YaHei,PingFangSC",
                            fontSize: 12,
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        show: true,
                        confine: true,
                        padding: [12, 16],
                        backgroundColor: 'rgba(23,35,61,0.85)',
                        formatter: function (params: any) {
                            var relVal = "<div style='display:block;font-size:12px;margin-bottom:13px;'><div style='float:left'><span style='line-height:10px;display: inline-block;height:6px;width:6px;border-radius:50%;margin-right:8px;margin-bottom:1px;background:" + params.color + "'></span>" + params.name + " <span style='margin:0 8px;display:inline-block'></span> " + "</div><div style='float:right'>" + (params.value == null ? "暂无数据" : that.setPrecision(params.value)) + "</div></div><div style='clear:both'></div>";
                            return relVal;
                        }
                    },
                    series: [
                        {
                            type: gptype,
                            left: '15%',
                            right: '25%',
                            sort: 'descending',
                            label: {
                                show: false,
                                position: 'inside',
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            data: [
                                { value: 100, name: '访问' },
                                { value: 80, name: '咨询' },
                                { value: 60, name: '订单' },
                                { value: 40, name: '点击' },
                                { value: 20, name: '展现' }
                            ]
                        },
                        {
                            type: gptype,
                            left: '15%',
                            right: '25%',
                            sort: 'descending',
                            label: {
                                show: false,
                                position: 'inside',
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            data: [
                                { value: 100, name: '访问' },
                                { value: 80, name: '咨询' },
                                { value: 60, name: '订单' },
                                { value: 40, name: '点击' },
                                { value: 20, name: '展现' }
                            ]
                        },
                        {
                            type: gptype,
                            left: '15%',
                            right: '25%',
                            sort: 'descending',
                            label: {
                                show: true,
                                position: 'inside',
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            data: [
                                { value: 100, name: '访问' },
                                { value: 80, name: '咨询' },
                                { value: 60, name: '订单' },
                                { value: 40, name: '点击' },
                                { value: 20, name: '展现' }
                            ]
                        },
                        {
                            type: gptype,
                            left: '15%',
                            right: '25%',
                            sort: 'descending',
                            label: {
                                show: true,
                                position: 'inside',
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            data: [
                                { value: 100, name: '访问' },
                                { value: 80, name: '咨询' },
                                { value: 60, name: '订单' },
                                { value: 40, name: '点击' },
                                { value: 20, name: '展现' }
                            ]
                        }
                    ]
                });
                break;
            case 'pie':
                delete this.xAxis;
                delete this.yAxis;
                delete this.dataZoom;
                Object.assign(this, {
                    legend: {
                        itemWidth: 10,
                        itemHeight: 10,
                        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
                        formatter: function (name: any) {
                            if (name.length > 5) {
                                return name.substring(0, 5) + '...';
                            } else {
                                return name
                            }
                        },
                        tooltip: {
                            show: true,
                            confine: true,
                            formatter: function (obj: any) {
                                return obj.name;
                            }
                        },
                        textStyle: {
                            color: "#495060",
                            fontFamily: "HelveticaNeue,Microsoft YaHei,PingFangSC",
                            fontSize: 12,
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        show: true,
                        padding: [12, 16],
                        backgroundColor: 'rgba(23,35,61,0.85)',
                        confine: true,
                        formatter: function (params: any) {
                            var relVal = "<div style='display:block;font-size:12px;margin-bottom:13px;'><div style='float:left'><span style='line-height:10px;display: inline-block;height:6px;width:6px;border-radius:50%;margin-right:8px;margin-bottom:1px;background:" + params.color + "'></span>" + params.name + " <span style='margin:0 8px;display:inline-block'></span> " + "</div><div style='float:right'>" + (params.value == null ? "暂无数据" : that.setPrecision(params.value)) + "</div></div><div style='clear:both'></div>";
                            return relVal;
                        }
                    },
                    series: [
                        {
                            type: gptype,
                            center: ['38%', '50%'],
                            data: [
                                { value: 335, name: '直接访问' },
                                { value: 310, name: '邮件营销' },
                                { value: 234, name: '联盟广告' },
                                { value: 135, name: '视频广告' },
                                { value: 1548, name: '搜索引擎' }
                            ]
                        }
                    ]
                });




                break;
            case 'filter':
                delete this.xAxis;
                delete this.yAxis;
                delete this.dataZoom;
                Object.assign(this.series, [{
                    type: 'pie',
                    data: [
                        { value: 335, name: '直接访问' },
                        { value: 310, name: '邮件营销' },
                        { value: 234, name: '联盟广告' },
                        { value: 135, name: '视频广告' },
                        { value: 1548, name: '搜索引擎' }
                    ]
                }]);
                break;
            default:
                break
        }
    }

    /**
     * 添加类目轴
     * @return {[type]} [description]
     */
    public addCategory() {
        Object.assign(this, {
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value',
            }
        })
    }
    /**
     * 移除类目轴
     * @return {[type]} [description]
     */
    public removeCategory() {
        delete this.xAxis;
        delete this.yAxis;
    }
    /**
     * 设置数据的精度2位
     * @param obj 精度
     */
    setPrecision(obj: any, cont?: any) {
        if (cont) {
            if (!isNaN(Number(obj))) {
                obj = Number(obj);
                if (obj !== 0) {
                    let content;
                    content = this.Thousands(Number(obj.toFixed(2)));
                    let m = content.split(".");
                    if (m.length != 1) {
                        if (m[1].length != 2) {
                            content = m[0] + "." + m[1] + "0";
                        }
                    }
                    return content;
                }
            }
            return;
        } else {
            if (!isNaN(Number(obj))) {
                obj = Number(obj);
                if (obj !== 0) {
                    let ten: Number = 100000,
                        cent: boolean = false;
                    if (Number(obj) >= ten) {
                        obj = obj / 10000;
                        cent = true;
                    }
                    let content;
                    obj = Number(obj);
                    content = this.Thousands(Number(obj.toFixed(2)));
                    if (content !== Math.ceil(content)) {
                        let m = content.split(".");
                        if (m.length != 1) {
                            if (m[1].length != 2) {
                                content = m[0] + "." + m[1] + "0";
                            }
                        }
                    }
                    if (content == "100,000") {
                        return "10万";
                    }
                    if (cent) {
                        cent = false;
                        return content + "万";
                    } else {
                        return content;
                    }
                }
            }
        }
        return obj;
    }
    /**
     * 转为千分位
     * @param number 
     */
    Thousands(number: any) {
        if (number == 0) {
            return number;
        } else if (number == 0.0) {
            return number;
        }
        var num = number + "";
        num = num.replace(new RegExp(",", "g"), "");
        // 正负号处理
        var symble = "";
        if (/^([-+]).*$/.test(num)) {
            symble = num.replace(/^([-+]).*$/, "$1");
            num = num.replace(/^([-+])(.*)$/, "$2");
        }
        if (/^[0-9]+(\.[0-9]+)?$/.test(num)) {
            var num = num.replace(new RegExp("^[0]+", "g"), "");
            if (/^\./.test(num)) {
                num = "0" + num;
            }
            var decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/, "$1");
            var integer = num.replace(/^([0-9]+)(\.[0-9]+)?$/, "$1");
            var re = /(\d+)(\d{3})/;
            while (re.test(integer)) {
                integer = integer.replace(re, "$1,$2");
            }
            return symble + integer + decimal;
        } else {
            return number;
        }
    }
    /**
     * 显示数据调整
     * @param strNum 
     */
    formatNum(strNum: any) {
        strNum = Number(strNum)
        if (strNum && strNum !== 0) {
            strNum = strNum.toFixed(2);
            var m = strNum.split(".");
            if (m.length != 1) {
                if (m[1] == "00") {
                    strNum = m[0];
                }
            }
            if (strNum.length <= 3) {
                return strNum;
            }
            if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
                return strNum;
            }
            var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
            var re = new RegExp("(\\d)(\\d{3})(,|$)");
            // re.compile("(\\d)(\\d{3})(,|$)");
            while (re.test(b)) {
                b = b.replace(re, "$1,$2$3");
            }
            return a + "" + b + "" + c;
        } else {
            return strNum;
        }

    }


}
