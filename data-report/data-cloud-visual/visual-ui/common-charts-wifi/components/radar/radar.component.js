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
var radar_template_1 = require("./radar.template");
var utils_1 = require("../../public/scripts/utils");
var radar_model_1 = require("./radar.model");
var base_chart_1 = require("datwill-sdk/lib/views/base/base.chart");
var RadarComponent = (function (_super) {
    __extends(RadarComponent, _super);
    function RadarComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.radarData = null;
        _this.echartData = null;
        var template = new radar_template_1.RadarTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.radarData = new radar_model_1.RadarModel();
        _this.echartData = {
            backgroundColor: _this.radarData.backgroundColor,
            title: {
                show: _this.radarData.title_show,
                text: _this.radarData.title_text,
                subtext: _this.radarData.title_subtext,
                left: _this.radarData.title_left,
                top: _this.radarData.title_top,
                textStyle: {
                    color: _this.radarData.title_textStyle_color
                }
            },
            legend: {
                show: _this.radarData.legend_show,
                z: _this.radarData.legend_z,
                left: _this.radarData.legend_left,
                top: _this.radarData.legend_top,
                orient: _this.radarData.legend_orient,
                data: _this.radarData.legend_data,
            },
            //雷达图
            radar: {
                shape: _this.radarData.radar_shape,
                // center: this.radarData.radar_center,
                // radius: this.radarData.radar_radius,
                indicator: _this.radarData.radar_indicator,
            },
            tooltip: {
                show: _this.radarData.tooltip_show,
                trigger: _this.radarData.tooltip_trigger,
                formatter: _this.radarData.tooltip_formatter,
                axisPointer: {
                    type: _this.radarData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: _this.radarData.tooltip_textStyle_color,
                    fontFamily: _this.radarData.tooltip_textStyle_fontFamily,
                    fontSize: _this.radarData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.radarData.tooltip_backgroundColor,
                borderColor: _this.radarData.tooltip_borderColor,
                borderWidth: _this.radarData.tooltip_borderWidth,
                padding: _this.radarData.tooltip_padding,
            },
            grid: {
                show: _this.radarData.grid_show,
                left: _this.radarData.grid_left,
                right: _this.radarData.grid_right,
                bottom: _this.radarData.grid_bottom,
                containLabel: _this.radarData.grid_containLabel,
                borderColor: _this.radarData.grid_borderColor,
                borderWidth: _this.radarData.grid_borderWidth
            },
            //线图
            series: [{
                    name: _this.radarData.series_name,
                    type: _this.radarData.series_type,
                    stack: _this.radarData.series_stack,
                    smooth: _this.radarData.series_smooth,
                    symbol: _this.radarData.series_symbol,
                    symbolSize: _this.radarData.series_symbolSize,
                    showSymbol: _this.radarData.series_showSymbol,
                    lineStyle: {
                        normal: {
                            color: _this.radarData.series_lineStyle_normal_color,
                            width: _this.radarData.series_lineStyle_normal_width,
                            type: _this.radarData.series_lineStyle_normal_type
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: _this.radarData.series_itemStyle_normal_color,
                            borderColor: _this.radarData.series_itemStyle_normal_bordercolor,
                            borderWidth: _this.radarData.series_itemStyle_normal_borderwidth,
                            borderType: _this.radarData.series_itemStyle_normal_bordertype,
                        },
                    },
                    areaStyle: {
                        normal: {
                            type: _this.radarData.series_areaStyle_normal_type,
                            // color: this.radarData.series_areaStyle_normal_color,
                            opacity: _this.radarData.series_areaStyle_normal_opacity
                        },
                    },
                    data: _this.radarData.series_data
                }
            ]
        };
        return _this;
    }
    RadarComponent.prototype.beforeShow = function () {
    };
    RadarComponent.prototype.afterShow = function () {
    };
    RadarComponent.prototype.beforeDestory = function () {
    };
    RadarComponent.prototype.afterDestory = function () {
    };
    RadarComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    RadarComponent.prototype.dataChange = function (data) {
        this.chartData = data;
        // var myChartData = this.myChart.getOption();
        var newDdata = utils_1.Utils.compareObj(data, this.echartData);
        this.myChart.setOption(newDdata);
    };
    RadarComponent.prototype.styleChange = function (style) {
    };
    RadarComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(RadarComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    RadarComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    return RadarComponent;
}(base_component_1.BaseComponent));
exports.RadarComponent = RadarComponent;
//# sourceMappingURL=radar.component.js.map