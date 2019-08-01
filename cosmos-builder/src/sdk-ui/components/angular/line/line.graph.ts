import { TdBaseGraph } from '../common/td-base.graph'

export class LineGraph extends TdBaseGraph {
    abscissa: boolean;
    originData: any = [];
    constructor(data: any = {}) {
        super('line');
        if (data && data["data"] && data["data"][0] && data["data"][0].length > 0) {
            data = {
                data: data["data"][1],
                style: data['style']
            };
            if (data && data.data && data.data[0] && data.data[0]["data"] && data.data[0]["data"].length && data.data[0]["interval"]) {
                if (data.data[0]["interval"]['field'] == data.data[0]["dimensions"][0]) {
                    if (data.data[0].interval.granularity == "day") {
                        this.abscissa = true;
                    }else{
                        this.abscissa = false;
                    }
                } else {
                    this.abscissa = false;
                }
            } else {
                this.abscissa = false;
            }
            data && data.data && data.data.length && this.setLineData(data.data[0]["data"]);
            data && data.style && this.setLineStyle(data.style, this.abscissa);
        }
    }

    /**
     * 解析数据成ECharts格式
     * @param  {any}       gpdata [description]
     * @param  {string =      'bar'}       gptype [description]
     * @return {[type]}           [description]
     */
    setLineData(gpdata: any[] = []) {
        this.addCategory();

        if (!gpdata.length) {
            return;
        }
        // 确定数据类型
        // 1 ===》 两维度一指标
        // 0 ===》 一维度一指标
        if (typeof gpdata[0] == 'object') {
            this.series = [];
            this.legend.data = [];
            const DATA_TYPE: number = gpdata[0].hasOwnProperty(this.DIMENSION_SECOND) ? 1 : 0;
            this.setDataType(DATA_TYPE, this.gpType);
            // 暂存第二维度
            let dimension_second_arr: any = [];
            gpdata.forEach((item: any) => {
                // 添加第一维度
                if (!this.xAxis.data.includes(item[this.DIMENSION_FIRST])) {
                    this.xAxis.data.push(item[this.DIMENSION_FIRST])
                }
                if (DATA_TYPE) {
                    // 添加series（第二维度）
                    if (!dimension_second_arr.includes(item[this.DIMENSION_SECOND])) {
                        this.legend.data.push(item[this.DIMENSION_SECOND]);

                        dimension_second_arr.push(item[this.DIMENSION_SECOND]);
                        this.series.push({
                            name: item[this.DIMENSION_SECOND],
                            type: this.gpType,
                            data: [item[this.GRAPH_ITEM_VALUE]],
                            smooth: true
                        })
                    } else {
                        this.series[dimension_second_arr.indexOf(item[this.DIMENSION_SECOND])].data.push(item[this.GRAPH_ITEM_VALUE])
                    }
                } else {
                    this.series[0].data.push(item[this.GRAPH_ITEM_VALUE])
                }
            })
            this.copySeriesData();
        } else {
            console.log('数据格式错误');
            console.log(gpdata)
        }
    }

    /**
     * 设置数据类型
     * @param  {any}       dataitem [description]
     * @param  {string =        'bar'}       gptype [description]
     * @return {[type]}             [description]
     */
    setDataType(DATA_TYPE: number = 0, gptype: string = 'bar') {
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
    setLineStyle(data: any, abscissa?: any) {
        let that = this;
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

        data.axis && this.setAxis(data.axis, abscissa);
        data.grid && this.setGrid(data.grid);
        data.bgAndBorder && this.setBackgroundColor(data.bgAndBorder);
        data.line && this.setLineItemStyle(data.line, data.missingData);
        this.adaptionline(data);
        if (abscissa) {
            this.tooltip.formatter = function (params: any) {
                var relVal = "<div style='font-size:14px;margin-bottom:16px;'>" + params[0].name.toString().slice(0, 4) + '-' + params[0].name.toString().slice(4, 6) + '-' + params[0].name.toString().slice(6) + "</div>";
                for (let j = 0; j < params.length; j++) {
                    relVal = relVal + "<div *ngFor='let param of params;let i=index' style='display:block;font-size:12px;margin-bottom:13px;'><div style='float:left'><span style='line-height:10px;display: inline-block;height:6px;width:6px;border-radius:50%;margin-right:8px;margin-bottom:1px;background:" + params[j].color + "'></span><span style='font-size: 12px;color: #FFFFFF;font-family: HelveticaNeue,Microsoft YaHei,PingFangSC;'>" + params[j].seriesName + "</span> <span style='margin:0 8px;display:inline-block'></span> " + "</div><div style='float:right;font-size: 12px;color: #FFFFFF;font-family: HelveticaNeue,Microsoft YaHei,PingFangSC;'>" + (params[j].value == null ? "暂无数据" : that.setPrecision(params[j].value)) + "</div></div><div style='clear:both'></div>";
                }
                return relVal;
            }
        }
    }

    /**
     * 遍历线图的series，设置线图的itemstyle
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    private setLineItemStyle(data: any = {}, missingData: string = "breakValue") {
        let that = this;
        this.series && this.series.forEach((item: any) => {
            item && Object.assign(item, {
                symbolSize: data.displayPoint || (item.data && item.data.length <= 1) ? 4 : 0,
                lineStyle: {
                    width: data.borderWidth >= 0 ? data.borderWidth : 2
                },
                connectNulls: missingData == "breakValue" ? false : true,
                itemStyle: {
                    normal: {
                        label: {
                            show: data.dataLabel,
                            formatter: function (p: any) {
                                return that.formatNum(p.value);
                            }
                        }
                    }
                },
            })
        });

        if (missingData == "zeroValue") {
            let that = this;
            this.series && this.series.forEach((item: any, index: any) => {
                if (!item.data) {
                    item.data = [];
                }
                let curLen = item.data.length;
                for (let i = 0; i < curLen; i++) {
                    if (that.originData[index]['data'][i] == null) {
                        item.data[i] = 0;
                    }
                }
            });
        }
    }
    adaptionline(data: any) {
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushRight") {
            let character: any;
            if (data["legend"]["character"] == null) {
                this.grid['right'] = (7 * 10) + 50;
            } else if (data["legend"]["character"] == 0) {
                this.grid['right'] = (7 * 5) + 50;
            } else {
                this.grid['right'] = (7 * data["legend"]["character"]) + 50;
            }
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 45;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 5;

            }
            this.grid['top'] = 20;
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushTop") {
            this.grid['right'] = '1.5%';
            this.grid['top'] = 43;
            if (data.line && data.line['scaling']) {
                this.grid['bottom'] = 45;
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 5;
            }
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushBottom") {
            this.grid['right'] = '1.5%';
            this.grid['top'] = 20;
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.dataZoom[0]["bottom"] = 30;
                this.grid['bottom'] = 75;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.dataZoom[0]["bottom"] = 0;
                this.grid['bottom'] = 30;
            }
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "none") {
            this.grid['right'] = '1.5%';
            this.grid['top'] = 20;
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 45;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 5;
            }
        }
        if (data.axis && data.axis['yAxisTitle']) {
            this.grid['top'] = 40;
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushTop" && data.axis && data.axis['yAxisTitle']) {
            this.grid['top'] = 65;
        }
        if (data.axis && data.axis['xAxisTitle']) {
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 65;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 20;
            }
        }
        if (data.axis && data.axis['xAxisTitle'] && !data.axis['xAxisLabel']) {
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 80;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 40;
            }
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushBottom" && data.axis && data.axis['xAxisTitle']) {
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 85;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 45;
            }
        }
        if (data.axis && data.axis['xAxisTitle'] && !data.axis['xAxisLabel'] && data.legend["layout"]["type"] == "flushBottom") {
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 105;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 65;
            }
        }
    }

    /**
     * 拷贝原始数据SeriesData
     */
    copySeriesData() {
        this.originData = [];
        this.series && this.series.forEach((item: any, index: any) => {
            if (!item.data) {
                item.data = [];

            }
            this.originData[index] = {};
            this.originData[index]['data'] = JSON.parse(JSON.stringify(item.data));

        });
    }
}
