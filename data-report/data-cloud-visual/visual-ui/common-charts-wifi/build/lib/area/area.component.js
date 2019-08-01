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
var area_template_1 = require("./area.template");
var utils_1 = require("../../public/scripts/utils");
var area_model_1 = require("./area.model");
var base_chart_1 = require("datwill-sdk/lib/views/base/base.chart");
var AreaComponent = (function (_super) {
    __extends(AreaComponent, _super);
    function AreaComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.areaData = null;
        _this.echartData = null;
        _this.styleObj = null;
        var template = new area_template_1.AreaTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.areaData = new area_model_1.AreaModel();
        _this.echartData = {
            backgroundColor: _this.areaData.echart_backgroundColor,
            color: _this.areaData.echart_color,
            title: {
                show: _this.areaData.title_show,
                text: _this.areaData.title_text,
                subtext: _this.areaData.title_subtext,
                left: _this.areaData.title_left,
                top: _this.areaData.title_top,
                textStyle: {
                    color: _this.areaData.title_textStyle_color
                }
            },
            legend: {
                show: _this.areaData.legend_show,
                z: _this.areaData.legend_z,
                left: _this.areaData.legend_left,
                top: _this.areaData.legend_top,
                orient: _this.areaData.legend_orient,
                data: _this.areaData.legend_data,
                itemHeight: _this.areaData.legend_itemHeight,
                type: 'scroll',
            },
            tooltip: {
                show: _this.areaData.tooltip_show,
                trigger: _this.areaData.tooltip_trigger,
                formatter: _this.areaData.tooltip_formatter,
                axisPointer: {
                    type: _this.areaData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: _this.areaData.tooltip_textStyle_color,
                    fontFamily: _this.areaData.tooltip_textStyle_fontFamily,
                    fontSize: _this.areaData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.areaData.tooltip_backgroundColor,
                borderColor: _this.areaData.tooltip_borderColor,
                borderWidth: _this.areaData.tooltip_borderWidth,
                padding: _this.areaData.tooltip_padding,
            },
            grid: {
                show: _this.areaData.grid_show,
                left: _this.areaData.grid_left,
                right: _this.areaData.grid_right,
                bottom: _this.areaData.grid_bottom,
                containLabel: _this.areaData.grid_containLabel,
                borderColor: _this.areaData.grid_borderColor,
                borderWidth: _this.areaData.grid_borderWidth
            },
            //线图
            xAxis: {
                show: _this.areaData.xAxis_show,
                type: _this.areaData.xAxis_type,
                nameLocation: _this.areaData.xAxis_nameLocation,
                nameGap: _this.areaData.xAxis_nameGap,
                boundaryGap: _this.areaData.xAxis_boundaryGap,
                data: _this.areaData.xAxis_data,
                axisLine: {
                    show: _this.areaData.xAxis_axisLine_show,
                    lineStyle: {
                        color: _this.areaData.xAxis_axisLine_lineStyle_color,
                        width: _this.areaData.xAxis_axisLine_lineStyle_width,
                        type: _this.areaData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: _this.areaData.xAxis_axisTick_show,
                    alignWithLabel: _this.areaData.xAxis_axisTick_alignWithLabel,
                    length: _this.areaData.xAxis_axisTick_length,
                    lineStyle: {
                        color: _this.areaData.xAxis_axisTick_lineStyle_color,
                        width: _this.areaData.xAxis_axisTick_lineStyle_width,
                        type: _this.areaData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: _this.areaData.xAxis_axisLabel_show,
                    margin: _this.areaData.xAxis_axisLabel_margin,
                    // interval: 0,
                    rotate: 0,
                    textStyle: {
                        color: _this.areaData.xAxis_axisLabel_textStyle_color,
                        fontFamily: _this.areaData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.areaData.xAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: _this.areaData.xAxis_splitLine_show,
                    lineStyle: {
                        color: _this.areaData.xAxis_splitLine_lineStyle_color,
                        width: _this.areaData.xAxis_splitLine_lineStyle_width,
                        type: _this.areaData.xAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    type: _this.areaData.xAxis_axisPointer_type,
                    label: {
                        show: _this.areaData.xAxis_axisPointer_label_show,
                    }
                }
            },
            yAxis: {
                show: _this.areaData.yAxis_show,
                type: _this.areaData.yAxis_type,
                nameLocation: _this.areaData.yAxis_nameLocation,
                nameGap: _this.areaData.yAxis_nameGap,
                nameRotate: _this.areaData.yAxis_nameRotate,
                axisLine: {
                    show: _this.areaData.yAxis_axisLine_show,
                    lineStyle: {
                        color: _this.areaData.yAxis_axisLine_lineStyle_color,
                        width: _this.areaData.yAxis_axisLine_lineStyle_width,
                        type: _this.areaData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: _this.areaData.yAxis_axisTick_show,
                    alignWithLabel: _this.areaData.yAxis_axisTick_alignWithLabel,
                    length: _this.areaData.yAxis_axisTick_length,
                    lineStyle: {
                        color: _this.areaData.yAxis_axisTick_lineStyle_color,
                        width: _this.areaData.yAxis_axisTick_lineStyle_width,
                        type: _this.areaData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: _this.areaData.yAxis_axisLabel_show,
                    margin: _this.areaData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: _this.areaData.yAxis_axisLabel_textStyle_color,
                        fontFamily: _this.areaData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.areaData.yAxis_axisLabel_textStyle_fontSize,
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
                    show: _this.areaData.yAxis_splitLine_show,
                    lineStyle: {
                        color: _this.areaData.yAxis_splitLine_lineStyle_color,
                        width: _this.areaData.yAxis_splitLine_lineStyle_width,
                        type: _this.areaData.yAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    show: _this.areaData.yAxis_axisPointer_show,
                    label: {
                        show: _this.areaData.yAxis_axisPointer_label_show
                    }
                }
            },
            series: [{
                    name: _this.areaData.series_name,
                    type: _this.areaData.series_type,
                    stack: _this.areaData.series_stack,
                    smooth: _this.areaData.series_smooth,
                    symbol: _this.areaData.series_symbol,
                    symbolSize: _this.areaData.series_symbolSize,
                    showSymbol: _this.areaData.series_showSymbol,
                    lineStyle: {
                        normal: {
                            // color: this.areaData.series_lineStyle_normal_color,
                            width: _this.areaData.series_lineStyle_normal_width,
                            type: _this.areaData.series_lineStyle_normal_type
                        },
                    },
                    itemStyle: {
                        normal: {
                            // color: this.areaData.series_itemStyle_normal_color,
                            borderColor: _this.areaData.series_itemStyle_normal_bordercolor,
                            borderWidth: _this.areaData.series_itemStyle_normal_borderwidth,
                            borderType: _this.areaData.series_itemStyle_normal_bordertype
                        },
                    },
                    areaStyle: {
                        normal: {
                            // color: this.areaData.series_areaStyle_normal_color,
                            opacity: _this.areaData.series_areaStyle_normal_opacity
                        },
                    },
                    data: _this.areaData.series_0_data
                }]
        };
        return _this;
    }
    AreaComponent.prototype.beforeShow = function () {
    };
    AreaComponent.prototype.afterShow = function () {
    };
    AreaComponent.prototype.beforeDestory = function () {
    };
    AreaComponent.prototype.afterDestory = function () {
    };
    AreaComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    AreaComponent.prototype.settingChange = function (event, target) {
    };
    AreaComponent.prototype.dataChange = function (data) {
        data['areatype'] = "areaType";
        var changeData = utils_1.Utils.changeData(data, this.styleObj);
        utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
        var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
        this.myChart.setOption(newDdata, true);
    };
    AreaComponent.prototype.styleChange = function (style) {
        this.styleObj = style;
        var changeStyle = utils_1.Utils.addStyle(style);
        utils_1.Utils.mergeSourceData(changeStyle, this.echartData);
        var newStyle = utils_1.Utils.compareObj(changeStyle, this.echartData);
        this.myChart.setOption(newStyle, true);
    };
    AreaComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(AreaComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    AreaComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]"));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    return AreaComponent;
}(base_component_1.BaseComponent));
exports.AreaComponent = AreaComponent;
//# sourceMappingURL=area.component.js.map