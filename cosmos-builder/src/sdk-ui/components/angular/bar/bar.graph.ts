import { TdBaseGraph } from '../common/td-base.graph';

const STACK_ONE = "one";

export class BarGraph extends TdBaseGraph {

    seriesOption: any[] = [];
    stackOption: any[] = [];
    total: any;
    querys: any;
    configuration: any;
    abscissa: boolean;//第一维度为日期维度
    dimensiondate: boolean;//第二维度为日期维度
    constructor(data: any = {}) {
        super("bar");
        if (data && data["data"] && data["data"][0] && data["data"][0].length > 0) {
            data = {
                data: data["data"][1],
                style: data['style']
            };
            if (data && data.data && data.data[0] && data.data[0]["data"] && data.data[0]["data"].length && data.data[0]["sumMetric"]) {
                this.total = data.data[0]["sumMetric"];
                this.querys = data.data[0]["data"];
            } else {
                this.total = false;
            }
            if (data && data.data && data.data[0] && data.data[0]["data"] && data.data[0]["data"].length && data.data[0]["interval"]) {
                if (data.data[0]["interval"]['field'] == data.data[0]["dimensions"][0]) {
                    if (data.data[0].interval.granularity == "day") {
                        this.abscissa = true;
                    }else{
                        this.abscissa = false;
                    }
                    this.dimensiondate = false;
                } else {
                    this.abscissa = false;
                    this.dimensiondate = true;
                }
            } else {
                this.abscissa = false;
            }
            data && data.data && data.data.length && this.setBarData(data.data[0]["data"]);
            data && data.style && this.setBarStyle(data.style, this.abscissa);
        }


    }

    /**
     * 解析数据成ECharts格式
     * @param  {any}       gpdata [description]
     * @param  {string =      'bar'}       gptype [description]
     * @return {[type]}           [description]
     */
    setBarData(gpdata: any[] = []) {
        this.addCategory();

        if (!gpdata.length) {
            return;
        }
        // 确定数据类型
        // 1 ===》 两维度一指标
        // 0 ===》 一维度一指标
        if (typeof gpdata[0] == "object") {
            this.series = [];
            this.legend.data = [];

            const DATA_TYPE: number = gpdata[0].hasOwnProperty(this.DIMENSION_SECOND) ? 1 : 0;
            this.setDataType(DATA_TYPE, this.gpType);

            // 暂存第二维度
            let dimension_second_arr: any = [];
            gpdata.forEach((item: any) => {
                // 添加第一维度
                if (!this.xAxis.data.includes(item[this.DIMENSION_FIRST])) {
                    this.xAxis.data.push(item[this.DIMENSION_FIRST]);
                }
                if (DATA_TYPE) {
                    // 添加series（第二维度）
                    if (!dimension_second_arr.includes(item[this.DIMENSION_SECOND])) {
                        this.legend.data.push(item[this.DIMENSION_SECOND]);
                        dimension_second_arr.push(item[this.DIMENSION_SECOND]);
                        this.series.push({
                            name: item[this.DIMENSION_SECOND],
                            type: this.gpType,
                            data: [item[this.GRAPH_ITEM_VALUE]]
                        })
                    } else {
                        this.series[dimension_second_arr.indexOf(item[this.DIMENSION_SECOND])].data.push(item[this.GRAPH_ITEM_VALUE]);
                    }
                } else {
                    if (!this.series.length) {
                        this.series.push({ data: [] });
                    }
                    this.series[0].data.push(item[this.GRAPH_ITEM_VALUE]);
                }
            });
            this.seriesOption = [];
            this.stackOption = [];
        } else {
            console.log('数据格式错误');
            console.log(gpdata);
        }
    }

    /**
     * 设置数据类型
     * @param  {any}       dataitem [description]
     * @param  {string =        'bar'}       gptype [description]
     * @return {[type]}             [description]
     */
    setDataType(DATA_TYPE: number = 0, gptype: string = "bar") {
        if (!DATA_TYPE) {
            this.series.push({
                data: [],
                type: gptype
            })
        }
    }


    /**
     * 图表样式数据转换
     * @param  {any}    gpstyle [description]
     * @return {[type]}         [description]
     */
    setBarStyle(data: any, abscissa?: any) {
        let that = this;
        if (!data) {
            return;
        }
        this.setToolTip();
        data.legend && this.setLegend(data.legend);
        if (data.axis && data.linkageData) {
            let metric: any = '';
            data.linkageData.forEach((element: any) => {
                if (element && element["metrics"]) {
                    metric = element["metrics"];
                }
            });
            data.axis['yAxisName'] = metric;
        }
        data.grid && this.setGrid(data.grid);
        data.bgAndBorder && this.setBackgroundColor(data.bgAndBorder);
        data.axis && this.setAxis(data.axis, abscissa);
        this.adaptionbar(data);
        this.configuration = this[data.bar.category].type;
        if (data.bar) {
            data.bar.category && this.setCategory(data.bar.category);
            this.setColor(data.bar);
            this.setBarItemStyle(data);
        }
        if (abscissa) {
            this.tooltip.formatter = function (params: any) {
                var relVal = "<div style='font-size:14px;margin-bottom:16px;'>" + params[0].name.toString().slice(0, 4) + '-' + params[0].name.toString().slice(4, 6) + '-' + params[0].name.toString().slice(6) + "</div>";
                for (let j = 0; j < params.length; j++) {
                    relVal = relVal + "<div *ngFor='let param of params;let i=index' style='display:block;font-size:12px;margin-bottom:13px;'><div style='float:left'><span style='line-height:10px;display: inline-block;height:6px;width:6px;border-radius:50%;margin-right:8px;margin-bottom:1px;background:" + params[j].color + "'></span><span style='font-size: 12px;color: #FFFFFF;font-family: HelveticaNeue,Microsoft YaHei,PingFangSC;'>" + params[j].seriesName + "</span> <span style='margin:0 8px;display:inline-block'></span> " + "</div><div style='float:right;font-size: 12px;color: #FFFFFF;font-family: HelveticaNeue,Microsoft YaHei,PingFangSC;'>" + (params[j].value == null ? "暂无数据" : that.setPrecision(params[j].value)) + "</div></div><div style='clear:both'></div>";
                }
                return relVal;
            }
        }
        if (this.dimensiondate) {
            this.tooltip.formatter = function (params: any) {
                var relVal = "<div style='font-size:14px;margin-bottom:16px;'>" + params[0].name + "</div>";
                for (let j = 0; j < params.length; j++) {
                    relVal = relVal + "<div *ngFor='let param of params;let i=index' style='display:block;font-size:12px;margin-bottom:13px;'><div style='float:left'><span style='line-height:10px;display: inline-block;height:6px;width:6px;border-radius:50%;margin-right:8px;margin-bottom:1px;background:" + params[j].color + "'></span><span style='font-size: 12px;color: #FFFFFF;font-family: HelveticaNeue,Microsoft YaHei,PingFangSC;'>" + params[j].seriesName.toString().toString().slice(0, 4) + '-' + params[j].seriesName.toString().toString().slice(4, 6) + '-' + params[j].seriesName.toString().toString().slice(6) + "</span> <span style='margin:0 8px;display:inline-block'></span> " + "</div><div style='float:right;font-size: 12px;color: #FFFFFF;font-family: HelveticaNeue,Microsoft YaHei,PingFangSC;'>" + (params[j].value == null ? "暂无数据" : that.setPrecision(params[j].value)) + "</div></div><div style='clear:both'></div>";
                }
                return relVal;
            }
            this.legend.formatter = function (name: any) {
                let names = name.toString().slice(0, 4) + '-' + name.toString().slice(4, 6) + '-' + name.toString().slice(6)
                if (data.legend.character != null) {
                    if (names.length > data.legend.character) {
                        return names.substring(0, data.legend.character) + '...';
                    } else {
                        return names
                    }
                } else {
                    if (names.length > 10) {
                        return names.substring(0, 10) + '...';
                    } else {
                        return names
                    }
                }
            }
        }

    }

    /**
     * 类目轴切换
     * @return {[type]} [description]
     */
    private setCategory(data: string = "xAxis") {
        if (data != "xAxis" && data != "yAxis") {
            data = "xAxis";
        }
        if (this[data].type != "category") {
            this.configuration = this[data].type;
            let obj = this.xAxis;
            this.xAxis = this.yAxis;
            this.yAxis = obj;
        }
    }

    /**
     * 设置调色盘颜色列表
     * @param  {any} data   [description]
     * @return {[type]}     [description]
     */
    private setColor(data: any) {
        //this.color = [...data].slice(0, num);

        if (!data.colors || !data.colors.length) {
            return;
        }
        data = data.colors;
        if (data.mode == 'single') {
            data = data.slice(0, 1);
        }

        for (let i = 0; i < this.color.length; i++) {
            this.color[i] = data[i % data.length]
        }
    }

    /**
     * 遍历柱图的series，设置线图的itemstyle
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    private setBarItemStyle(data: any = {}) {
        let that = this;
        this.series && this.series.forEach((item: any) => {
            item && Object.assign(item, {
                stack: data.bar.stacked ? STACK_ONE : "",
                itemStyle: {
                    normal: {
                        label: {
                            position: (data.bar.category == 'xAxis') ? 'top' : 'right',
                            textBorderColor: 'transparent',
                            default: (data.bar.category == 'xAxis') ? 20 : 0,
                            verticalAlign: (data.bar.category == 'xAxis') ? 'bottom' : '',
                            show: data.bar.dataLabel,
                            formatter: function (p: any) {
                                return that.formatNum(p.value);
                            }
                        }
                    }
                },
            });
        });
        if (data.bar.stacked && data.bar.allStacked) {
            if (!this.stackOption.length) {
                let axis = this.yAxis;
                if (data.bar.category != 'xAxis') {
                    axis = this.xAxis;
                }
                axis && Object.assign(axis, {
                    axisLabel: {
                        formatter: data.bar.stacked && data.bar.allStacked ? `{value}%` : `{value}`
                    },
                    max: 100,
                    interval: 20
                });
                this.tooltip && Object.assign(this.tooltip, {
                    confine: true,
                    formatter: function (params: any) {
                        if (params[0].name.length !== 8) {
                            var relVal = "<div style='font-size:14px;margin-bottom:16px;'>" + params[0].name + "</div>";
                        } else {
                            var relVal = "<div style='font-size:14px;margin-bottom:16px;'>" + params[0].name.toString().slice(0, 4) + '-' + params[0].name.toString().slice(4, 6) + '-' + params[0].name.toString().slice(6) + "</div>";
                        }
                        for (let k = 0; k < params.length; k++) {
                            let date = that.number(params[k].data)
                            relVal = relVal + "<div ><span style='line-height:10px;display: inline-block;height:6px;width:6px;border-radius:50%;margin-right:8px;margin-bottom:1px;background:" + params[k].color + "'></span>" + params[k].seriesName + " <span style='margin:0 8px;display:inline-block'></span><div style='display:inline-block'>" + date + "%" + "</div></div>";
                        }
                        let content = "<div style='height:12px;display:block;font-size:12px;margin-bottom:13px;'>" + relVal + "<div style='clear: both'></div></div>";
                        return content;
                    }
                });
                this.stackOption = this.deepCopy(this.series);
                let DataArr = this.handleStack(data.bar);
                this.stackOption && this.stackOption.forEach((item: any, index: number) => {
                    item && Object.assign(item, {
                        itemStyle: {
                            normal: {
                                label: {
                                    show: data.bar.dataLabel,
                                    position: (data.bar.category == 'xAxis') ? 'insideTop' : 'insideRight',
                                    formatter: function (p: any) {
                                        DataArr[p.seriesIndex][p.dataIndex] || ""
                                        return that.formatNum(p.value);
                                    }
                                }
                            }
                        },
                        stack: data.bar.stacked ? STACK_ONE : "",
                    });
                });
            }
            this.series = this.stackOption
        } else {
            if (this.xAxis && this.xAxis.axisLabel) {
                // delete this.xAxis.axisLabel.formatter;
            }
            if (this.yAxis && this.yAxis.axisLabel) {
                // delete this.yAxis.axisLabel.formatter;
            }
            if (this.tooltip && this.tooltip.formatter) {
                // delete this.tooltip.formatter;
            }

            this.series = this.seriesOption.length ? this.seriesOption : this.series;
        }

        if (this.series && this.series.length == 1) {
            let arr: any = [];
            let maxInNumbers: any;
            let minInNumbers: any;
            arr = this.series[0]["data"]
            for (let k = 0; k < arr.length; k++) {
                maxInNumbers = Math.max.apply(Math, arr);
                minInNumbers = Math.min.apply(Math, arr);
            }
            let dataShadow: any = [];
            for (let i = 0; i < arr.length; i++) {
                dataShadow.push(Math.ceil((maxInNumbers + Number(maxInNumbers * 0.3))))
            }
            let shadowcolor;
            if (data && data["bar"] && data["bar"]["shadowcolor"] && data["bar"]["shadow"]) {
                shadowcolor = data["bar"]["shadowcolor"]
            } else {
                shadowcolor = "transparent"
            }

            if (data && data["axis"] && (data["axis"]["yAxisMax"] == "" || data["axis"]["yAxisMax"] == null)) {
                if (this.configuration && (this.configuration == "category")) {
                    this.yAxis.max = Math.ceil(maxInNumbers + Number(maxInNumbers * 0.3))
                }
                if (this.configuration && (this.configuration == "value")) {
                    this.xAxis.max = Math.ceil(maxInNumbers + Number(maxInNumbers * 0.3))
                }
            }
            else {
                for (let k = 0; k < dataShadow.length; k++) {
                    dataShadow[k] = data["axis"]["yAxisMax"]
                }
            }

            let bargroup = {
                show: false,
                type: 'bar',
                axisTick: {
                    show: true
                },
                itemStyle: {
                    color: shadowcolor
                },
                emphasis: {
                    itemStyle: {
                        color: shadowcolor
                    },
                },
                barGap: '-100%',
                data: dataShadow,
                tooltip: {
                    show: false
                },
                animation: false
            };
            this.series[0]["z"] = 10;
            if (data && data["bar"] && (data["bar"]["category"] == "yAxis")) {
                this.series[0]['data'] = this.series[0]['data'].reverse()
                this.yAxis["data"] = this.yAxis["data"].reverse()
            }

            this.series.push(bargroup)
        } else {
            let mate: any = [];
            let maxs: any;
            let mins: any;
            this.series && this.series.forEach((items: any) => {
                items && items.data.forEach((item: any) => {
                    mate.push(item);
                })
            });
            for (let k = 0; k < mate.length; k++) {
                maxs = Math.max.apply(Math, mate);
                mins = Math.min.apply(Math, mate);
            };
            if (data && data["axis"] && (data["axis"]["yAxisMax"] == "" || data["axis"]["yAxisMax"] == null)) {
                if (this.configuration && (this.configuration == "category")) {
                    this.yAxis.max = Math.ceil(maxs + Number(maxs * 0.3));
                }
                if (this.configuration && (this.configuration == "value")) {
                    this.xAxis.max = Math.ceil(maxs + Number(maxs * 0.3));
                }
            }
            else {
                this.xAxis.max = data["axis"]["yAxisMax"];
            }
            if (data && data["bar"] && (data["bar"]["category"] == "yAxis")) {
                for (let i = 0; i < this.series.length; i++) {
                    this.series[i].data = this.series[i].data.reverse();
                }
                this.yAxis["data"] = this.yAxis["data"].reverse();
            }
        }
        /**
         *          
         */
        if (data.bar.date && this.total) {
            let meattent: any = [];
            let meattents: any = [];
            let maxx: any = [];
            this.stackOption = this.deepCopy(this.series);
            let Index: any = 0;
            for (let key in this.total) {
                Index = Index + 1;
            }
            if (Index > 1) {
                for (let i = 0; i < Index; i++) {
                    for (let j = 0; j < this.stackOption[0].data.length; j++) {
                        this.stackOption[i].data[j] = this.stackOption[i].data[j] / this.total[("sum_" + this.stackOption[i]["name"])]
                    }
                }
                for (let z = 0; z < this.stackOption[0].data.length; z++) {
                    for (let i = this.stackOption.length - 1; i > -1; i--) {
                        meattent.push(this.stackOption[i]["data"][z])
                    }
                }
            } else {
                if (this.total["Y"] == 0 || this.total["Y"] == null) {
                    return;
                }
                if (this.series.length == 1) {
                    for (let z = 0; z < this.stackOption[0].data.length; z++) {
                        if (!this.total["Y"]) {
                            this.total["Y"] = 0;
                        }
                        meattent.push(this.stackOption[0]["data"][z] / this.total["Y"])
                    }

                }
                if (this.series.length !== 1 && !this.total["Y"] && this.total["Y"] !== null) {
                    for (let i = 0; i < this.stackOption.length; i++) {
                        for (let j = 0; j < this.stackOption[0].data.length; j++) {
                            this.stackOption[i].data[j] = this.stackOption[i].data[j] / this.total[("sum_" + this.stackOption[i]["name"])]
                        }
                    }
                    for (let z = 0; z < this.stackOption[0].data.length; z++) {
                        for (let i = this.stackOption.length - 1; i > -1; i--) {
                            meattent.push(this.stackOption[i]["data"][z])
                        }
                    }
                }
                if (this.series.length !== 1 && (this.total["Y"] == null || this.total["Y"])) {
                    for (let i = 0; i < this.stackOption.length; i++) {
                        for (let j = 0; j < this.stackOption[0].data.length; j++) {
                            if (!this.total["Y"]) {
                                this.total["Y"] = 0;
                            }
                            this.stackOption[i].data[j] = this.stackOption[i].data[j] / this.total["Y"];
                        }
                    }
                    for (let z = 0; z < this.stackOption[0].data.length; z++) {
                        for (let i = this.stackOption.length - 1; i > -1; i--) {
                            meattent.push(this.stackOption[i]["data"][z])
                        }
                    }
                }
            }
            for (let k = 0; k < meattent.length; k++) {
                meattent[k] = this.toPercent(meattent[k])
            }
            let meattent1: any = [];
            if (this.series && this.series[this.series.length - 1] && this.series[this.series.length - 1]["barGap"] && this.series[this.series.length - 1]["barGap"] == "-100%") {
                for (let j = 0; j < meattent.length; j++) {
                    if (j % 2 == 1) {
                        meattent1.push(meattent[j]);
                    }
                }
                meattent = meattent1;
            }
            //meattent = meattent.reverse();
            let axtor = {
                type: 'category',
                z: 10,
                data: meattent,
                axisLabel: {
                    interval: 0,
                    align: 'left',
                    textStyle: {
                        fontSize: 12,
                        color: "#80848F",
                        fontFamily: "HelveticaNeue,Microsoft YaHei,PingFangSC"
                    }
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true,
                },
                axisLine: {
                    show: data["axis"]["yAxisLine"] || true,
                    onZero: false,  //坑  Y轴线
                    lineStyle: {
                        width: 1,
                        color: data["axis"]["axisColor"] || "#C5C8CE",
                    }

                }

            }
            this.yAxis = [this.yAxis, axtor]
            this.yAxis = this.deepCopy(this.yAxis);
            let arr = {
                type: 'bar',
                yAxisIndex: 1,
                tooltip: {
                    show: false
                },
                data: meattent
            }
            this.series.push(arr)
        }
    }
    toPercent(point: any) {
        var str = Number(point * 100).toFixed(2);
        str += "%";
        return str;
    }
    private handleStack(data: any = {}) {
        let seriesData: any[][] = [];

        if (0 == this.seriesOption.length) {
            this.seriesOption = this.deepCopy(this.series);
        }

        let DataSum: any[] = [];
        let DataArr: any[] = [];
        DataArr.push(this.seriesOption[0].data);
        Object.assign(DataSum, this.seriesOption[0].data);
        for (let i = 1; i < this.seriesOption.length; i++) {
            let data = this.seriesOption[i].data;
            DataArr.push(data);
            for (let j = 0; j < data.length; j++) {
                DataSum[j] ? DataSum[j] += data[j] : DataSum[j] = data[j];//有可能有缺失的数据
            }
        }

        for (let i = 0; i < this.seriesOption.length; i++) {
            let item: any[] = [];
            seriesData.push(item);
            let data = this.seriesOption[i].data;
            for (let j = 0; j < data.length; j++) {
                let value = (data[j] / DataSum[j] * 100).toFixed(2);
                item.push(value);
            }
            this.stackOption[i].data = item;
        }

        return DataArr;
    }
    //百分比
    number(strNum: any) {
        strNum = Number(strNum)
        if (strNum || strNum == 0) {
            strNum = strNum.toFixed(2);
            var m = strNum.split(".");
            if (m.length != 1) {
                if (m[1] == "00") {
                    return strNum = m[0];
                } else {
                    return strNum = m[0] + "." + m[1]
                }
            }
        } else {
            return strNum
        }
    }
    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
    adaptionbar(data: any) {
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushRight") {
            let character: any;
            if (data["legend"]["character"] == null) {
                this.grid['right'] = (7 * 10) + 50;
            } else if (data["legend"]["character"] == 0) {
                this.grid['right'] = (7 * 5) + 50;
            } else {
                this.grid['right'] = (7 * data["legend"]["character"]) + 50;
            }
            if (data.bar && data.bar['scaling']) {
                this.dataZoom[0]["show"] = data.bar['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 45;
            } else {
                this.dataZoom[0]["show"] = data.bar['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 5;

            }
            this.grid['top'] = 20;
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushTop") {
            this.grid['right'] = '1.5%';
            this.grid['top'] = 43;
            if (data.bar && data.bar['scaling']) {
                this.grid['bottom'] = 45;
                this.dataZoom[0]["show"] = data.bar['scaling'];
                this.dataZoom[0]["end"] = 10;
            } else {
                this.dataZoom[0]["show"] = data.bar['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 5;
            }
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushBottom") {
            this.grid['right'] = '1.5%';
            this.grid['top'] = 20;
            if (data.bar && data.bar['scaling']) {
                this.dataZoom[0]["show"] = data.bar['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.dataZoom[0]["bottom"] = 30;
                this.grid['bottom'] = 75;
            } else {
                this.dataZoom[0]["show"] = data.bar['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.dataZoom[0]["bottom"] = 0;
                this.grid['bottom'] = 30;
            }
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "none") {
            this.grid['right'] = '1.5%';
            this.grid['top'] = 20;
            if (data.bar && data.bar['scaling']) {
                this.dataZoom[0]["show"] = data.bar['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 45;
            } else {
                this.dataZoom[0]["show"] = data.bar['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 5;
            }
        }
        if (data.bar.category == "xAxis") {
            if (data.axis && data.axis['yAxisTitle']) {
                this.grid['top'] = 40;
            }
            if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushTop" && data.axis && data.axis['yAxisTitle']) {
                this.grid['top'] = 65;
            }
            if (data.axis && data.axis['xAxisTitle']) {
                if (data.bar && data.bar['scaling']) {
                    this.dataZoom[0]["show"] = data.bar['scaling'];
                    this.dataZoom[0]["end"] = 10;
                    this.grid['bottom'] = 65;
                } else {
                    this.dataZoom[0]["show"] = data.bar['scaling'];
                    this.dataZoom[0]["end"] = 100;
                    this.grid['bottom'] = 20;
                }
            }
            if (data.axis && data.axis['xAxisTitle'] && !data.axis['xAxisLabel']) {
                if (data.bar && data.bar['scaling']) {
                    this.dataZoom[0]["show"] = data.bar['scaling'];
                    this.dataZoom[0]["end"] = 10;
                    this.grid['bottom'] = 80;
                } else {
                    this.dataZoom[0]["show"] = data.bar['scaling'];
                    this.dataZoom[0]["end"] = 100;
                    this.grid['bottom'] = 40;
                }
            }
            if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushBottom" && data.axis && data.axis['xAxisTitle']) {
                if (data.bar && data.bar['scaling']) {
                    this.dataZoom[0]["show"] = data.bar['scaling'];
                    this.dataZoom[0]["end"] = 10;
                    this.grid['bottom'] = 85;
                } else {
                    this.dataZoom[0]["show"] = data.bar['scaling'];
                    this.dataZoom[0]["end"] = 100;
                    this.grid['bottom'] = 45;
                }
            }
            if (data.axis && data.axis['xAxisTitle'] && !data.axis['xAxisLabel'] && data.legend["layout"]["type"] == "flushBottom") {
                if (data.bar && data.bar['scaling']) {
                    this.dataZoom[0]["show"] = data.bar['scaling'];
                    this.dataZoom[0]["end"] = 10;
                    this.grid['bottom'] = 105;
                } else {
                    this.dataZoom[0]["show"] = data.bar['scaling'];
                    this.dataZoom[0]["end"] = 100;
                    this.grid['bottom'] = 65;
                }
            }
        } else {
            //yAxisTitle=>标题
            if (data.axis && data.axis['yAxisTitle']) {
                this.yAxis.nameLocation = "middle";
                this.yAxis.nameTextStyle = {
                    padding: 0,
                }
                this.yAxis.nameGap = 30;
                this.grid['bottom'] = 25;
            }
            //yAxisLabel=>标签
            if (data.axis && data.axis['yAxisTitle'] && !data.axis['yAxisLabel']) {
                this.yAxis.nameGap = 15;
                this.grid['bottom'] = 30;
            }
            if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushBottom" && data.axis && data.axis['yAxisTitle']) {
                this.grid['bottom'] = 55;
            }
            //xAxisTitle=>标题
            if (data.axis && data.axis['xAxisTitle']) {
                this.xAxis.nameLocation = "end";
                this.xAxis.nameTextStyle = {
                    padding: [0, 0, 10, (12 * (this.Length + 2))],
                }
                this.xAxis.nameGap = 5;
                this.grid['top'] = 30;
            }
            if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushTop" && data.axis && data.axis['xAxisTitle']) {
                this.xAxis.nameLocation = "end";
                this.xAxis.nameTextStyle = {
                    padding: [0, 0, 10, (12 * (this.Length + 2))],
                }
                this.xAxis.nameGap = 5;
                this.grid['top'] = 55;
            }
            if (data.axis && !data.axis['xAxisLabel']) {
                this.grid['left'] = 15;
            }
        }
    }
}
