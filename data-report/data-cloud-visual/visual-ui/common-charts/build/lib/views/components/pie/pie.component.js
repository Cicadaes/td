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
var pie_template_1 = require("./pie.template");
var utils_1 = require("../../../../public/scripts/utils");
var pie_model_1 = require("./pie.model");
var base_chart_1 = require("../../base/base.chart");
var PieComponent = (function (_super) {
    __extends(PieComponent, _super);
    function PieComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        // private chartStyle:any = null;
        _this.pieData = null;
        _this.echartData = null;
        _this.styleObj = null;
        var template = new pie_template_1.PieTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.pieData = new pie_model_1.PieModel();
        _this.echartData = {
            backgroundColor: _this.pieData.backgroundColor,
            color: _this.pieData.color,
            title: {
                show: _this.pieData.title_show,
                text: _this.pieData.title_text,
                subtext: _this.pieData.title_subtext,
                left: _this.pieData.title_left,
                top: _this.pieData.title_top,
                textStyle: {
                    color: _this.pieData.title_textStyle_color
                }
            },
            legend: {
                show: _this.pieData.legend_show,
                z: _this.pieData.legend_z,
                left: _this.pieData.legend_left,
                top: _this.pieData.legend_top,
                orient: _this.pieData.legend_orient,
                data: _this.pieData.legend_data,
                padding: _this.pieData.legend_padding,
                itemHeight: _this.pieData.legend_itemHeight,
                type: 'scroll',
                textStyle: {
                    color: _this.pieData.legend_textStyle_color,
                    fontFamily: _this.pieData.legend_textStyle_fontFamily,
                    fontSize: _this.pieData.legend_textStyle_fontSize,
                }
            },
            tooltip: {
                show: _this.pieData.tooltip_show,
                trigger: _this.pieData.tooltip_trigger,
                formatter: _this.pieData.tooltip_formatter,
                textStyle: {
                    color: _this.pieData.tooltip_textStyle_color,
                    fontFamily: _this.pieData.tooltip_textStyle_fontFamily,
                    fontSize: _this.pieData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.pieData.tooltip_backgroundColor
            },
            // visualMap: {
            //     inRange: {
            //         colorLightness: [0, 1]
            //     }
            // },
            series: [{
                    name: _this.pieData.series_name,
                    type: _this.pieData.series_type,
                    radius: _this.pieData.series_radius,
                    center: _this.pieData.series_center,
                    // data: this.pieData.series_data.sort(function (a, b) { return a.value - b.value}),
                    // roseType: this.pieData.series_roseType,
                    label: {
                        normal: {
                            show: _this.pieData.series_label_normal_show,
                            position: _this.pieData.series_label_normal_position,
                            formatter: _this.pieData.series_label_normal_formatter,
                            textStyle: {
                                // color: this.pieData.series_label_normal_textStyle_color,
                                fontFamily: _this.pieData.series_label_normal_textStyle_fontFamily
                            }
                        }
                    },
                    // itemStyle: {
                    //     normal: {
                    //         color: '#c23531',
                    //         // shadowBlur: this.pieData.series_itemStyle_normal_shadowBlur,
                    //         // shadowColor: this.pieData.series_itemStyle_normal_shadowColor
                    //     }
                    // },
                    animationType: _this.pieData.series_animationType
                }]
        };
        return _this;
    }
    PieComponent.prototype.beforeShow = function () {
    };
    PieComponent.prototype.afterShow = function () {
        this.init();
    };
    PieComponent.prototype.beforeDestory = function () {
    };
    PieComponent.prototype.afterDestory = function () {
    };
    PieComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    PieComponent.prototype.getconfiginformation = function (event, changeObj) {
    };
    PieComponent.prototype.dataChange = function (data) {
        if (this.myChart == null) {
            this.init();
            data['pietype'] = "pieType";
            var changeData = utils_1.Utils.changeData(data, this.styleObj);
            utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
            var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
            this.myChart.setOption(newDdata, true);
        }
        else {
            data['pietype'] = "pieType";
            var changeData = utils_1.Utils.changeData(data, this.styleObj);
            utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
            var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
            this.myChart.setOption(newDdata, true);
        }
    };
    PieComponent.prototype.styleChange = function (style) {
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
    PieComponent.prototype.loadData = function () {
    };
    Object.defineProperty(PieComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    PieComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    return PieComponent;
}(base_component_1.BaseComponent));
exports.PieComponent = PieComponent;
//# sourceMappingURL=pie.component.js.map