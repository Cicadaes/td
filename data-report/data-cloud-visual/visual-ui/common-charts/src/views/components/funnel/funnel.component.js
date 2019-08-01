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
var funnel_template_1 = require("./funnel.template");
var utils_1 = require("../../../../public/scripts/utils");
var funnel_model_1 = require("./funnel.model");
var base_chart_1 = require("../../base/base.chart");
var FunnelComponent = (function (_super) {
    __extends(FunnelComponent, _super);
    function FunnelComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.funnelData = null;
        _this.echartData = null;
        var template = new funnel_template_1.FunnelTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.funnelData = new funnel_model_1.FunnelModel();
        _this.echartData = {
            backgroundColor: _this.funnelData.backgroundColor,
            title: {
                show: _this.funnelData.title_show,
                text: _this.funnelData.title_text,
                subtext: _this.funnelData.title_subtext,
                left: _this.funnelData.title_left,
                top: _this.funnelData.title_top,
                textStyle: {
                    color: _this.funnelData.title_textStyle_color
                }
            },
            legend: {
                show: _this.funnelData.legend_show,
                z: _this.funnelData.legend_z,
                left: _this.funnelData.legend_left,
                top: _this.funnelData.legend_top,
                orient: _this.funnelData.legend_orient,
                data: _this.funnelData.legend_data,
            },
            tooltip: {
                show: _this.funnelData.tooltip_show,
                trigger: _this.funnelData.tooltip_trigger,
                formatter: _this.funnelData.tooltip_formatter,
                axisPointer: {
                    type: _this.funnelData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: _this.funnelData.tooltip_textStyle_color,
                    fontFamily: _this.funnelData.tooltip_textStyle_fontFamily,
                    fontSize: _this.funnelData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.funnelData.tooltip_backgroundColor,
                borderColor: _this.funnelData.tooltip_borderColor,
                borderWidth: _this.funnelData.tooltip_borderWidth,
                padding: _this.funnelData.tooltip_padding,
            },
            grid: {
                show: _this.funnelData.grid_show,
                left: _this.funnelData.grid_left,
                right: _this.funnelData.grid_right,
                bottom: _this.funnelData.grid_bottom,
                containLabel: _this.funnelData.grid_containLabel,
                borderColor: _this.funnelData.grid_borderColor,
                borderWidth: _this.funnelData.grid_borderWidth
            },
            series: [{
                    name: _this.funnelData.series_name,
                    type: _this.funnelData.series_type,
                    stack: _this.funnelData.series_stack,
                    smooth: _this.funnelData.series_smooth,
                    symbol: _this.funnelData.series_symbol,
                    symbolSize: _this.funnelData.series_symbolSize,
                    showSymbol: _this.funnelData.series_showSymbol,
                    left: '5%',
                    top: 70,
                    bottom: 20,
                    width: '90%',
                    sort: 'descending',
                    gap: 2,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        },
                        emphasis: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: _this.funnelData.series_lineStyle_normal_color,
                            width: _this.funnelData.series_lineStyle_normal_width,
                            type: _this.funnelData.series_lineStyle_normal_type
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: _this.funnelData.series_itemStyle_normal_color,
                            borderColor: _this.funnelData.series_itemStyle_normal_bordercolor,
                            borderWidth: _this.funnelData.series_itemStyle_normal_borderwidth,
                            borderType: _this.funnelData.series_itemStyle_normal_bordertype
                        },
                    },
                    areaStyle: {
                        normal: {
                            color: _this.funnelData.series_areaStyle_normal_color,
                            opacity: _this.funnelData.series_areaStyle_normal_opacity
                        },
                    },
                    data: _this.funnelData.series_data
                }
            ]
        };
        return _this;
    }
    FunnelComponent.prototype.beforeShow = function () {
    };
    FunnelComponent.prototype.afterShow = function () {
        this.init();
    };
    FunnelComponent.prototype.beforeDestory = function () {
    };
    FunnelComponent.prototype.afterDestory = function () {
    };
    FunnelComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    FunnelComponent.prototype.getconfiginformation = function (event, changeObj) {
    };
    FunnelComponent.prototype.dataChange = function (data) {
        this.chartData = data;
        // var myChartData = this.myChart.getOption();
        var newDdata = utils_1.Utils.compareObj(data, this.echartData);
        this.myChart.setOption(newDdata);
    };
    FunnelComponent.prototype.styleChange = function (style) {
    };
    FunnelComponent.prototype.loadData = function () {
    };
    Object.defineProperty(FunnelComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    FunnelComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    return FunnelComponent;
}(base_component_1.BaseComponent));
exports.FunnelComponent = FunnelComponent;
//# sourceMappingURL=funnel.component.js.map