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
var utils_1 = require("../../public/scripts/utils");
var strip_model_1 = require("./strip.model");
var base_chart_1 = require("datwill-sdk/lib/views/base/base.chart");
var StripComponent = (function (_super) {
    __extends(StripComponent, _super);
    function StripComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.stripData = null;
        _this.echartData = null;
        _this.styleObj = null;
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
                    lineStyle: {
                        normal: {
                            // color: this.stripData.series_lineStyle_normal_color,
                            width: _this.stripData.series_lineStyle_normal_width,
                            type: _this.stripData.series_lineStyle_normal_type
                        },
                    },
                    itemStyle: {
                        normal: {
                            // color: this.stripData.series_itemStyle_normal_color,
                            borderColor: _this.stripData.series_itemStyle_normal_bordercolor,
                            borderWidth: _this.stripData.series_itemStyle_normal_borderwidth,
                            borderType: _this.stripData.series_itemStyle_normal_bordertype
                        },
                    },
                    areaStyle: {
                        normal: {
                            // color: this.stripData.series_areaStyle_normal_color,
                            opacity: _this.stripData.series_areaStyle_normal_opacity
                        },
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
    };
    StripComponent.prototype.beforeDestory = function () {
    };
    StripComponent.prototype.afterDestory = function () {
    };
    StripComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    StripComponent.prototype.dataChange = function (data) {
        if (this.myChart == null) {
            this.init();
            data['striptype'] = "stripType";
            var changeData = utils_1.Utils.changeData(data, this.styleObj);
            utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
            var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
            this.myChart.setOption(newDdata, true);
        }
        else {
            data['striptype'] = "stripType";
            var changeData = utils_1.Utils.changeData(data, this.styleObj);
            utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
            var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
            this.myChart.setOption(newDdata, true);
        }
    };
    StripComponent.prototype.styleChange = function (style) {
        if (this.myChart == null) {
            this.init();
            this.styleObj = style;
            var changeStyle = utils_1.Utils.addStyle(style);
            utils_1.Utils.mergeSourceData(changeStyle, this.echartData);
            var newStyle = utils_1.Utils.compareObj(changeStyle, this.echartData);
            this.myChart.setOption(newStyle, true);
        }
        else {
            this.styleObj = style;
            var changeStyle = utils_1.Utils.addStyle(style);
            utils_1.Utils.mergeSourceData(changeStyle, this.echartData);
            var newStyle = utils_1.Utils.compareObj(changeStyle, this.echartData);
            this.myChart.setOption(newStyle, true);
        }
    };
    StripComponent.prototype.loadData = function () {
        this.init();
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
    return StripComponent;
}(base_component_1.BaseComponent));
exports.StripComponent = StripComponent;
//# sourceMappingURL=strip.component.js.map