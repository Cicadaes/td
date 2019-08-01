"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by zhaoxue on 2017/3/28.
 */
var base_component_1 = require("../base.component");
var bar_template_1 = require("./bar.template");
var utils_1 = require("../../public/scripts/utils");
var bar_model_1 = require("./bar.model");
var base_chart_1 = require("datwill-sdk/lib/views/base/base.chart");
var BarComponent = (function (_super) {
    __extends(BarComponent, _super);
    function BarComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.barData = null;
        _this.echartData = null;
        _this.styleObj = null;
        var template = new bar_template_1.BarTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.barData = new bar_model_1.BarModel();
        _this.echartData = {
            backgroundColor: _this.barData.backgroundColor,
            color: _this.barData.color,
            title: {
                show: _this.barData.title_show,
                text: _this.barData.title_text,
                subtext: _this.barData.title_subtext,
                left: _this.barData.title_left,
                top: _this.barData.title_top,
                textStyle: {
                    color: _this.barData.title_textStyle_color
                }
            },
            legend: {
                show: _this.barData.legend_show,
                z: _this.barData.legend_z,
                left: _this.barData.legend_left,
                top: _this.barData.legend_top,
                orient: _this.barData.legend_orient,
                // data:this.barData.legend_data,
                itemHeight: _this.barData.legend_itemHeight,
                type: 'scroll',
            },
            tooltip: {
                show: _this.barData.tooltip_show,
                trigger: _this.barData.tooltip_trigger,
                formatter: _this.barData.tooltip_formatter,
                axisPointer: {
                    type: _this.barData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: _this.barData.tooltip_textStyle_color,
                    fontFamily: _this.barData.tooltip_textStyle_fontFamily,
                    fontSize: _this.barData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.barData.tooltip_backgroundColor,
                borderColor: _this.barData.tooltip_borderColor,
                borderWidth: _this.barData.tooltip_borderWidth,
                padding: _this.barData.tooltip_padding,
            },
            grid: {
                show: _this.barData.grid_show,
                left: _this.barData.grid_left,
                right: _this.barData.grid_right,
                bottom: _this.barData.grid_bottom,
                containLabel: _this.barData.grid_containLabel,
                borderColor: _this.barData.grid_borderColor,
                borderWidth: _this.barData.grid_borderWidth
            },
            //线图
            xAxis: {
                show: _this.barData.xAxis_show,
                type: _this.barData.xAxis_type,
                name: _this.barData.xAxis_name,
                nameLocation: _this.barData.xAxis_nameLocation,
                nameGap: _this.barData.xAxis_nameGap,
                boundaryGap: _this.barData.xAxis_boundaryGap,
                // data: this.barData.xAxis_data,
                axisLine: {
                    show: _this.barData.xAxis_axisLine_show,
                    lineStyle: {
                        color: _this.barData.xAxis_axisLine_lineStyle_color,
                        width: _this.barData.xAxis_axisLine_lineStyle_width,
                        type: _this.barData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: _this.barData.xAxis_axisTick_show,
                    alignWithLabel: _this.barData.xAxis_axisTick_alignWithLabel,
                    length: _this.barData.xAxis_axisTick_length,
                    lineStyle: {
                        color: _this.barData.xAxis_axisTick_lineStyle_color,
                        width: _this.barData.xAxis_axisTick_lineStyle_width,
                        type: _this.barData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: _this.barData.xAxis_axisLabel_show,
                    margin: _this.barData.xAxis_axisLabel_margin,
                    // interval: 0,
                    rotate: 0,
                    textStyle: {
                        color: _this.barData.xAxis_axisLabel_textStyle_color,
                        fontFamily: _this.barData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.barData.xAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: _this.barData.xAxis_splitLine_show,
                    lineStyle: {
                        color: _this.barData.xAxis_splitLine_lineStyle_color,
                        width: _this.barData.xAxis_splitLine_lineStyle_width,
                        type: _this.barData.xAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    type: _this.barData.xAxis_axisPointer_type,
                    label: {
                        show: _this.barData.xAxis_axisPointer_label_show,
                    }
                }
            },
            yAxis: {
                show: _this.barData.yAxis_show,
                type: _this.barData.yAxis_type,
                name: _this.barData.yAxis_name,
                nameLocation: _this.barData.yAxis_nameLocation,
                nameRotate: _this.barData.yAxis_nameRotate,
                nameGap: _this.barData.yAxis_nameGap,
                axisLine: {
                    show: _this.barData.yAxis_axisLine_show,
                    lineStyle: {
                        color: _this.barData.yAxis_axisLine_lineStyle_color,
                        width: _this.barData.yAxis_axisLine_lineStyle_width,
                        type: _this.barData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: _this.barData.yAxis_axisTick_show,
                    alignWithLabel: _this.barData.yAxis_axisTick_alignWithLabel,
                    length: _this.barData.yAxis_axisTick_length,
                    lineStyle: {
                        color: _this.barData.yAxis_axisTick_lineStyle_color,
                        width: _this.barData.yAxis_axisTick_lineStyle_width,
                        type: _this.barData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: _this.barData.yAxis_axisLabel_show,
                    margin: _this.barData.yAxis_axisLabel_margin,
                    // interval: 0,
                    rotate: 0,
                    textStyle: {
                        color: _this.barData.yAxis_axisLabel_textStyle_color,
                        fontFamily: _this.barData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.barData.yAxis_axisLabel_textStyle_fontSize,
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
                    show: _this.barData.yAxis_splitLine_show,
                    lineStyle: {
                        color: _this.barData.yAxis_splitLine_lineStyle_color,
                        width: _this.barData.yAxis_splitLine_lineStyle_width,
                        type: _this.barData.yAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    show: _this.barData.yAxis_axisPointer_show,
                    label: {
                        show: _this.barData.yAxis_axisPointer_label_show
                    }
                }
            },
            series: [{
                    name: _this.barData.series_name,
                    type: _this.barData.series_type,
                    stack: _this.barData.series_stack,
                    smooth: _this.barData.series_smooth,
                    symbol: _this.barData.series_symbol,
                    symbolSize: _this.barData.series_symbolSize,
                    showSymbol: _this.barData.series_showSymbol,
                    //柱图
                    barWidth: _this.barData.series_barWidth,
                    barMaxWidth: _this.barData.series_barMaxWidth,
                    barMinHeight: _this.barData.series_barMinHeight,
                    barGap: _this.barData.series_barGap,
                    lineStyle: {
                        normal: {
                            // color: this.barData.series_lineStyle_normal_color,
                            width: _this.barData.series_lineStyle_normal_width,
                            type: _this.barData.series_lineStyle_normal_type
                        },
                    },
                    itemStyle: {
                        normal: {
                            // color: this.barData.series_itemStyle_normal_color,
                            borderColor: _this.barData.series_itemStyle_normal_bordercolor,
                            borderWidth: _this.barData.series_itemStyle_normal_borderwidth,
                            borderType: _this.barData.series_itemStyle_normal_bordertype
                        },
                    },
                    areaStyle: {
                        normal: {
                            // color: this.barData.series_areaStyle_normal_color,
                            opacity: _this.barData.series_areaStyle_normal_opacity
                        },
                    },
                }
            ]
        };
        return _this;
    }
    BarComponent.prototype.beforeShow = function () {
    };
    BarComponent.prototype.afterShow = function () {
    };
    BarComponent.prototype.beforeDestory = function () {
    };
    BarComponent.prototype.afterDestory = function () {
    };
    BarComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    BarComponent.prototype.dataChange = function (data) {
        if (this.myChart == null) {
            this.init();
        }
        else {
            data['barype'] = "barType";
            var changeData = utils_1.Utils.changeData(data, this.styleObj);
            utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
            var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
            this.myChart.setOption(newDdata, true);
        }
    };
    BarComponent.prototype.styleChange = function (style) {
        if (this.myChart == null) {
            this.init();
        }
        else {
            this.styleObj = style;
            var changeStyle = utils_1.Utils.addStyle(style);
            utils_1.Utils.mergeSourceData(changeStyle, this.echartData);
            var newStyle = utils_1.Utils.compareObj(changeStyle, this.echartData);
            this.myChart.setOption(newStyle, true);
        }
    };
    BarComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(BarComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    BarComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    return BarComponent;
}(base_component_1.BaseComponent));
exports.BarComponent = BarComponent;
//# sourceMappingURL=bar.component.js.map