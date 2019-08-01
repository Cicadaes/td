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
var strip_template_1 = require("./strip.template");
var utils_1 = require("../../../../public/scripts/utils");
var strip_model_1 = require("./strip.model");
var base_chart_1 = require("../../base/base.chart");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var StripComponent = (function (_super) {
    __extends(StripComponent, _super);
    function StripComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.stripData = null;
        _this.echartData = null;
        _this.styleObj = null;
        _this.body = null;
        _this.scene = null;
        _this.dataConfig = {};
        _this.body_change = null;
        _this.bodyDist = {
            "metric_change_1": {
                "metrics": [
                    {
                        "field": "duration_new_5"
                    },
                    {
                        "field": "duration_new_15"
                    },
                    {
                        "field": "duration_new_30"
                    },
                    {
                        "field": "duration_new_60"
                    },
                    {
                        "field": "duration_old_5"
                    },
                    {
                        "field": "duration_old_15"
                    },
                    {
                        "field": "duration_old_30"
                    },
                    {
                        "field": "duration_old_60"
                    }
                ]
            },
            "metric_change_3": {
                "metrics": [
                    {
                        "field": "high_active_5"
                    },
                    {
                        "field": "high_active_15"
                    },
                    {
                        "field": "high_active_30"
                    },
                    {
                        "field": "high_active_60"
                    },
                    {
                        "field": "middle_active_5"
                    },
                    {
                        "field": "middle_active_15"
                    },
                    {
                        "field": "middle_active_30"
                    },
                    {
                        "field": "middle_active_60"
                    },
                    {
                        "field": "low_active_5"
                    },
                    {
                        "field": "low_active_15"
                    },
                    {
                        "field": "low_active_30"
                    },
                    {
                        "field": "low_active_60"
                    },
                    {
                        "field": "sleep_active_5"
                    },
                    {
                        "field": "sleep_active_15"
                    },
                    {
                        "field": "sleep_active_30"
                    },
                    {
                        "field": "sleep_active_60"
                    }
                ]
            }
        };
        var template = new strip_template_1.StripTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.stripData = new strip_model_1.StripModel();
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
                right: _this.stripData.legend_right,
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
                borderColor: _this.stripData.tooltip_borderColor,
                borderWidth: _this.stripData.tooltip_borderWidth,
                padding: _this.stripData.tooltip_padding,
            },
            grid: {
                show: _this.stripData.grid_show,
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
                //x轴刻度
                axisTick: {
                    show: _this.stripData.xAxis_axisTick_show,
                    alignWithLabel: _this.stripData.xAxis_axisTick_alignWithLabel,
                    length: _this.stripData.xAxis_axisTick_length,
                    lineStyle: {
                        // color: this.stripData.xAxis_axisTick_lineStyle_color,
                        width: _this.stripData.xAxis_axisTick_lineStyle_width,
                        type: _this.stripData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: _this.stripData.xAxis_axisLabel_show,
                    margin: _this.stripData.xAxis_axisLabel_margin,
                    // interval: 0,
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
                    data: _this.stripData.series_data
                }
            ]
        };
        return _this;
    }
    StripComponent.prototype.beforeShow = function () {
    };
    StripComponent.prototype.afterShow = function () {
        this.init();
    };
    StripComponent.prototype.beforeDestory = function () {
    };
    StripComponent.prototype.afterDestory = function () {
    };
    StripComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    StripComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.dataConfig = changeObj.result;
        this.scene = changeObj.result.scene;
        this.body = this.buildbody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    StripComponent.prototype.dataChange = function (data) {
        if (data.length == 0) {
            this.myChart.clear();
            return;
        }
        var dataArray = [];
        if (this.scene == "scene_2") {
            this.echartData.tooltip.formatter = "{b0}: {c0}";
            this.echartData.legend.show = false;
            for (var i = data.length - 1; i >= 0; i--) {
                var obj = data[i];
                dataArray.push({
                    "date": obj.area_name,
                    "value": obj.metric_value
                });
            }
        }
        else if (this.scene == "scene_1" && data.length > 0) {
            this.echartData.tooltip.formatter = "";
            this.echartData.legend.show = true;
            var obj = data[0];
            if (!this.body_change || this.body_change == "metric_change_1") {
                dataArray.push({
                    "date": "1min",
                    "name": "新客",
                    "value": obj["duration_new_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "新客",
                    "value": obj["duration_new_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "新客",
                    "value": obj["duration_new_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "新客",
                    "value": obj["duration_new_60"]
                });
                dataArray.push({
                    "date": "1min",
                    "name": "老客",
                    "value": obj["duration_old_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "老客",
                    "value": obj["duration_old_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "老客",
                    "value": obj["duration_old_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "老客",
                    "value": obj["duration_old_60"]
                });
            }
            else if (this.body_change == "metric_change_3") {
                dataArray.push({
                    "date": "1min",
                    "name": "高活跃客群",
                    "value": obj["high_active_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "高活跃客群",
                    "value": obj["high_active_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "高活跃客群",
                    "value": obj["high_active_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "高活跃客群",
                    "value": obj["high_active_60"]
                });
                // "middle_active_5":0,"middle_active_15":0,"middle_active_30":0,"middle_active_60":0,
                dataArray.push({
                    "date": "1min",
                    "name": "中活跃客群",
                    "value": obj["middle_active_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "中活跃客群",
                    "value": obj["middle_active_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "中活跃客群",
                    "value": obj["middle_active_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "中活跃客群",
                    "value": obj["middle_active_60"]
                });
                // "low_active_5":0,"low_active_15":0,"low_active_30":0,"low_active_60":0,
                dataArray.push({
                    "date": "1min",
                    "name": "低活跃客群",
                    "value": obj["low_active_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "低活跃客群",
                    "value": obj["low_active_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "低活跃客群",
                    "value": obj["low_active_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "低活跃客群",
                    "value": obj["low_active_60"]
                });
                // "sleep_active_5":0,"sleep_active_15":0,"sleep_active_30":0,"sleep_active_60":0}]
                dataArray.push({
                    "date": "1min",
                    "name": "沉睡客群",
                    "value": obj["sleep_active_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "沉睡客群",
                    "value": obj["sleep_active_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "沉睡客群",
                    "value": obj["sleep_active_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "沉睡客群",
                    "value": obj["sleep_active_60"]
                });
            }
        }
        else if (this.scene == "scene_3" && data.length > 0) {
            this.echartData.tooltip.formatter = "";
            this.echartData.legend.show = true;
            var obj = data[0];
            dataArray.push({
                "date": "1次",
                "name": "老客",
                "value": obj["time_old_1"]
            });
            dataArray.push({
                "date": "2-3次",
                "name": "老客",
                "value": obj["time_old_2"]
            });
            dataArray.push({
                "date": "4-5次",
                "name": "老客",
                "value": obj["time_old_3"]
            });
            dataArray.push({
                "date": ">5次",
                "name": "老客",
                "value": obj["time_old_5"]
            });
        }
        if (this.myChart == null) {
            // 基于准备好的dom，初始化echarts实例
            this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID));
        }
        dataArray['striptype'] = "stripType";
        var changeData = utils_1.Utils.changeData(dataArray, this.styleObj);
        utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
        var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
        newDdata["series"][0]["label"] = {
            "normal": {
                "position": 'right',
                "show": true,
                "formatter": '{c}',
                "color": '#76818e'
            }
        };
        this.myChart.setOption(newDdata, true);
    };
    StripComponent.prototype.filterChange = function (event, data) {
        if (data.body_change) {
            this.body_change = data.body_change;
            if (this.bodyDist[data.body_change]) {
                this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, this.bodyDist[data.body_change]);
            }
        }
        else {
            this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        }
        this.postChange(this.body);
    };
    StripComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    StripComponent.prototype.styleChange = function (style) {
    };
    StripComponent.prototype.loadData = function () {
    };
    Object.defineProperty(StripComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    StripComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    //buildBody
    StripComponent.prototype.buildbody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "strip";
        return this.body;
    };
    return StripComponent;
}(base_component_1.BaseComponent));
exports.StripComponent = StripComponent;
//# sourceMappingURL=strip.component.js.map