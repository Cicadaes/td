/**
 * Created by zhaoxue on 2017/3/28.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_component_1 = require("../base.component");
var cityHorizontalBar_template_1 = require("./cityHorizontalBar.template");
var utils_1 = require("../../../../public/scripts/utils");
var cityHorizontalBar_model_1 = require("./cityHorizontalBar.model");
var base_chart_1 = require("../../base/base.chart");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var $ = require("jquery");
var CityHorizontalBarComponent = (function (_super) {
    __extends(CityHorizontalBarComponent, _super);
    function CityHorizontalBarComponent() {
        var _this = _super.call(this) || this;
        _this.myChartFirst = null;
        _this.myChartSecond = null;
        _this.myChartThird = null;
        _this.myChartFourth = null;
        _this.chartData = null;
        _this.stripData = null;
        _this.echartData = null;
        _this.styleObj = null;
        _this.body = null;
        _this.scene = null;
        var template = new cityHorizontalBar_template_1.CityHorizontalBarTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.stripData = new cityHorizontalBar_model_1.CityHorizontalBarModel();
        _this.echartData = {
            backgroundColor: _this.stripData.backgroundColor,
            color: _this.stripData.echart_color,
            title: {
                show: _this.stripData.title_show,
                text: _this.stripData.title_text,
                subtext: _this.stripData.title_subtext,
                left: _this.stripData.title_left,
                top: _this.stripData.title_top,
                textStyle: {
                    color: _this.stripData.title_textStyle_color
                }
            },
            legend: {
                show: _this.stripData.legend_show,
                z: _this.stripData.legend_z,
                left: _this.stripData.legend_left,
                top: _this.stripData.legend_top,
                orient: _this.stripData.legend_orient,
                data: _this.stripData.legend_data,
                itemHeight: _this.stripData.legend_itemHeight,
                type: 'scroll',
            },
            tooltip: {
                show: _this.stripData.tooltip_show,
                trigger: _this.stripData.tooltip_trigger,
                formatter: _this.stripData.tooltip_formatter,
                axisPointer: {
                    type: _this.stripData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: _this.stripData.tooltip_textStyle_color,
                    fontFamily: _this.stripData.tooltip_textStyle_fontFamily,
                    fontSize: _this.stripData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.stripData.tooltip_backgroundColor,
                padding: _this.stripData.tooltip_padding,
            },
            grid: {
                show: _this.stripData.grid_show,
                top: _this.stripData.grid_top,
                left: _this.stripData.grid_left,
                right: _this.stripData.grid_right,
                bottom: _this.stripData.grid_bottom,
                containLabel: _this.stripData.grid_containLabel,
                borderColor: _this.stripData.grid_borderColor,
                borderWidth: _this.stripData.grid_borderWidth
            },
            //线图
            xAxis: {
                show: _this.stripData.xAxis_show,
                type: _this.stripData.xAxis_type,
                boundaryGap: _this.stripData.xAxis_boundaryGap,
                data: _this.stripData.xAxis_data,
                name: _this.stripData.xAxis_name,
                nameLocation: _this.stripData.xAxis_nameLocation,
                nameGap: _this.stripData.xAxis_nameGap,
                axisLine: {
                    show: _this.stripData.xAxis_axisLine_show,
                    lineStyle: {
                        color: _this.stripData.xAxis_axisLine_lineStyle_color,
                        width: _this.stripData.xAxis_axisLine_lineStyle_width,
                        type: _this.stripData.xAxis_axisLine_lineStyle_type,
                    },
                },
                splitNumber: 2,
                //x轴刻度
                axisTick: {
                    show: _this.stripData.xAxis_axisTick_show,
                    alignWithLabel: _this.stripData.xAxis_axisTick_alignWithLabel,
                    length: _this.stripData.xAxis_axisTick_length,
                    lineStyle: {
                        width: _this.stripData.xAxis_axisTick_lineStyle_width,
                        type: _this.stripData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: _this.stripData.xAxis_axisLabel_show,
                    margin: _this.stripData.xAxis_axisLabel_margin,
                    rotate: 0,
                    textStyle: {
                        color: _this.stripData.xAxis_axisLabel_textStyle_color,
                        fontFamily: _this.stripData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.stripData.xAxis_axisLabel_textStyle_fontSize,
                    },
                    formatter: function (value, index) {
                        var texts = [];
                        var new_num = value;
                        var istype = '';
                        if (value > 9999) {
                            if (value < 1e8) {
                                new_num = (new_num / 1e4).toFixed(2).toString();
                                istype = '万';
                            }
                            else if (value >= 1e8) {
                                new_num = (new_num / 1e8).toFixed(2).toString();
                                istype = '亿';
                            }
                        }
                        texts.push(new_num + istype);
                        return texts;
                    }
                },
                //区域中的分割线
                splitLine: {
                    show: _this.stripData.xAxis_splitLine_show,
                    lineStyle: {
                        color: _this.stripData.xAxis_splitLine_lineStyle_color,
                        width: _this.stripData.xAxis_splitLine_lineStyle_width,
                        type: _this.stripData.xAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    type: _this.stripData.xAxis_axisPointer_type,
                    label: {
                        show: _this.stripData.xAxis_axisPointer_label_show,
                    }
                }
            },
            yAxis: {
                show: _this.stripData.yAxis_show,
                type: _this.stripData.yAxis_type,
                boundaryGap: _this.stripData.yAxis_boundaryGap,
                data: _this.stripData.yAxis_data,
                name: _this.stripData.yAxis_name,
                nameLocation: _this.stripData.yAxis_nameLocation,
                nameRotate: _this.stripData.yAxis_nameRotate,
                nameGap: _this.stripData.yAxis_nameGap,
                axisLine: {
                    show: _this.stripData.yAxis_axisLine_show,
                    lineStyle: {
                        color: _this.stripData.yAxis_axisLine_lineStyle_color,
                        width: _this.stripData.yAxis_axisLine_lineStyle_width,
                        type: _this.stripData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: _this.stripData.yAxis_axisTick_show,
                    alignWithLabel: _this.stripData.yAxis_axisTick_alignWithLabel,
                    length: _this.stripData.yAxis_axisTick_length,
                    lineStyle: {
                        color: _this.stripData.yAxis_axisTick_lineStyle_color,
                        width: _this.stripData.yAxis_axisTick_lineStyle_width,
                        type: _this.stripData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: _this.stripData.yAxis_axisLabel_show,
                    margin: _this.stripData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: _this.stripData.yAxis_axisLabel_textStyle_color,
                        fontFamily: _this.stripData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.stripData.yAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: _this.stripData.yAxis_splitLine_show,
                    lineStyle: {
                        color: _this.stripData.yAxis_splitLine_lineStyle_color,
                        width: _this.stripData.yAxis_splitLine_lineStyle_width,
                        type: _this.stripData.yAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    show: _this.stripData.yAxis_axisPointer_show,
                    label: {
                        show: _this.stripData.yAxis_axisPointer_label_show
                    }
                }
            },
            series: [{
                    name: _this.stripData.series_name,
                    type: _this.stripData.series_type,
                    barGap: _this.stripData.series_barGap,
                    stack: 'chart',
                    label: {
                        normal: {
                            position: 'right',
                            show: true,
                            formatter: '{c}',
                            color: '#000'
                        }
                    },
                    "barWidth": 20,
                    data: _this.stripData.series_data
                }
            ]
        };
        return _this;
    }
    CityHorizontalBarComponent.prototype.beforeShow = function () {
    };
    CityHorizontalBarComponent.prototype.afterShow = function () {
        this.init();
    };
    CityHorizontalBarComponent.prototype.beforeDestory = function () {
    };
    CityHorizontalBarComponent.prototype.afterDestory = function () {
    };
    CityHorizontalBarComponent.prototype.resize = function () {
        if (this.myChartFirst)
            this.myChartFirst.resize();
        if (this.myChartSecond)
            this.myChartSecond.resize();
        if (this.myChartThird)
            this.myChartThird.resize();
        if (this.myChartFourth)
            this.myChartFourth.resize();
    };
    CityHorizontalBarComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.scene = changeObj.result.scene;
        this.body = this.buildbody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    CityHorizontalBarComponent.prototype.handleData = function (jsonArr, index) {
        var proportion = jsonArr["proportion"];
        var name = jsonArr["name"];
        //(proportion != undefined || proportion != null)?proportion = proportion:proportion = "";
        $('#' + this.scopeID).find('.cityHorizontalBarWapTit').eq(index).find("i").text(name);
        $('#' + this.scopeID).find('.cityHorizontalBarWapTit').eq(index).find("b").text(proportion);
    };
    CityHorizontalBarComponent.prototype.dataChange = function (data) {
        if (!data || data.length == 0) {
            return;
        }
        if (data && data.length > 0) {
            this.echartData.tooltip.formatter = "{b0}: {c0}";
            this.echartData.legend.show = false;
            for (var i = 0; i < data.length; i++) {
                this.handleData(data[i], i);
            }
        }
        var dataArray1 = [];
        var dataArray2 = [];
        var dataArray3 = [];
        var dataArray4 = [];
        var data0 = data[0]["data"];
        var data1 = data[1]["data"];
        var data2 = data[2]["data"];
        var data3 = data[3]["data"];
        for (var i = data0.length - 1; i >= 0; i--) {
            dataArray1.push({
                "date": data0[i].name,
                "value": data0[i].value
            });
        }
        for (var i = data1.length - 1; i >= 0; i--) {
            dataArray2.push({
                "date": data1[i].name,
                "value": data1[i].value
            });
        }
        for (var i = data2.length - 1; i >= 0; i--) {
            dataArray3.push({
                "date": data2[i].name,
                "value": data2[i].value
            });
        }
        for (var i = data3.length - 1; i >= 0; i--) {
            dataArray4.push({
                "date": data3[i].name,
                "value": data3[i].value
            });
        }
        if (this.myChartFirst == null) {
            // 基于准备好的dom，初始化echarts实例
            this.myChartFirst = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartFirst]"));
        }
        if (this.myChartSecond == null) {
            // 基于准备好的dom，初始化echarts实例
            this.myChartSecond = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartSecond]"));
        }
        if (this.myChartThird == null) {
            // 基于准备好的dom，初始化echarts实例
            this.myChartThird = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartThird]"));
        }
        if (this.myChartFourth == null) {
            // 基于准备好的dom，初始化echarts实例
            this.myChartFourth = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartFourth]"));
        }
        //dataArray1['cityhorizontalbartype'] = "cityhorizontalbartype";
        dataArray1['striptype'] = "stripType";
        dataArray2['striptype'] = "striptype";
        dataArray3['striptype'] = "striptype";
        dataArray4['striptype'] = "striptype";
        var changeData1 = utils_1.Utils.changeData(dataArray1, this.styleObj);
        utils_1.Utils.clearSeariesData(changeData1, this.echartData.series);
        var newDdata1 = utils_1.Utils.compareObj(changeData1, this.echartData);
        if (newDdata1["series"] != 0) {
            newDdata1["series"][0]["label"] = {
                "normal": {
                    "position": 'right',
                    "show": true,
                    "formatter": '{c}',
                    "color": '#76818e'
                }
            };
            newDdata1["series"][0]["barWidth"] = 14;
        }
        this.myChartFirst.setOption(newDdata1, true);
        var changeData2 = utils_1.Utils.changeData(dataArray2, this.styleObj);
        utils_1.Utils.clearSeariesData(changeData2, this.echartData.series);
        var newDdata2 = utils_1.Utils.compareObj(changeData2, this.echartData);
        if (newDdata2["series"] != 0) {
            newDdata2["series"][0]["label"] = {
                "normal": {
                    "position": 'right',
                    "show": true,
                    "formatter": '{c}',
                    "color": '#76818e'
                }
            };
            newDdata2["series"][0]["barWidth"] = 14;
        }
        this.myChartSecond.setOption(newDdata2, true);
        var changeData3 = utils_1.Utils.changeData(dataArray3, this.styleObj);
        utils_1.Utils.clearSeariesData(changeData3, this.echartData.series);
        var newDdata3 = utils_1.Utils.compareObj(changeData3, this.echartData);
        if (newDdata3["series"] != 0) {
            newDdata3["series"][0]["label"] = {
                "normal": {
                    "position": 'right',
                    "show": true,
                    "formatter": '{c}',
                    "color": '#76818e'
                }
            };
            newDdata3["series"][0]["barWidth"] = 14;
        }
        this.myChartThird.setOption(newDdata3, true);
        var changeData4 = utils_1.Utils.changeData(dataArray4, this.styleObj);
        utils_1.Utils.clearSeariesData(changeData4, this.echartData.series);
        var newDdata4 = utils_1.Utils.compareObj(changeData4, this.echartData);
        if (newDdata4["series"] != 0) {
            newDdata4["series"][0]["label"] = {
                "normal": {
                    "position": 'right',
                    "show": true,
                    "formatter": '{c}',
                    "color": '#76818e'
                }
            };
            newDdata4["series"][0]["barWidth"] = 14;
        }
        //console.log("====>newDdata4",JSON.stringify(newDdata4))
        this.myChartFourth.setOption(newDdata4, true);
    };
    CityHorizontalBarComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    CityHorizontalBarComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    CityHorizontalBarComponent.prototype.styleChange = function (style) {
    };
    CityHorizontalBarComponent.prototype.loadData = function () {
    };
    Object.defineProperty(CityHorizontalBarComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    CityHorizontalBarComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChartFirst = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartFirst]"));
        this.myChartFirst.setOption(this.echartData); // 绘制图表
        this.myChartSecond = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartSecond]"));
        this.myChartSecond.setOption(this.echartData); // 绘制图表
        this.myChartThird = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartThird]"));
        this.myChartThird.setOption(this.echartData); // 绘制图表
        this.myChartFourth = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartFourth]"));
        this.myChartFourth.setOption(this.echartData); // 绘制图表
    };
    //buildBody
    CityHorizontalBarComponent.prototype.buildbody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "cityHorizontalBar";
        return this.body;
    };
    return CityHorizontalBarComponent;
}(base_component_1.BaseComponent));
exports.CityHorizontalBarComponent = CityHorizontalBarComponent;
//# sourceMappingURL=cityHorizontalBar.component.js.map