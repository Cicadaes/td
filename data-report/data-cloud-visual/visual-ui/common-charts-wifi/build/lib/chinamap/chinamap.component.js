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
var chinamap_template_1 = require("./chinamap.template");
var utils_1 = require("../../public/scripts/utils");
var chinamap_model_1 = require("./chinamap.model");
var base_chart_1 = require("datwill-sdk/lib/views/base/base.chart");
var ChinaMapComponent = (function (_super) {
    __extends(ChinaMapComponent, _super);
    function ChinaMapComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.chartStyle = null;
        _this.chinamapData = null;
        _this.echartData = null;
        _this.styleObj = null;
        var template = new chinamap_template_1.ChinaMapTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.chinamapData = new chinamap_model_1.ChinaMapModel();
        function randomData() {
            return Math.round(Math.random() * 1000);
        }
        _this.echartData = {
            backgroundColor: _this.chinamapData.backgroundColor,
            color: _this.chinamapData.color,
            title: {
                show: _this.chinamapData.title_show,
                text: _this.chinamapData.title_text,
                subtext: _this.chinamapData.title_subtext,
                left: _this.chinamapData.title_left
            },
            tooltip: {
                trigger: _this.chinamapData.tooltip_trigger
            },
            legend: {
                orient: _this.chinamapData.legend_orient,
                left: _this.chinamapData.legend_left,
                top: _this.chinamapData.legend_top,
                data: _this.chinamapData.legend_data
            },
            visualMap: {
                show: _this.chinamapData.visualMap_show,
                min: _this.chinamapData.visualMap_min,
                max: _this.chinamapData.visualMap_max,
                left: _this.chinamapData.visualMap_left,
                top: _this.chinamapData.visualMap_top,
                text: _this.chinamapData.visualMap_text,
                orient: _this.chinamapData.visualMap_orient,
                itemWidth: _this.chinamapData.visualMap_itemWidth,
                itemHeight: _this.chinamapData.visualMap_itemHeight,
                calculable: _this.chinamapData.visualMap_calculable,
                controller: {
                    inRange: {
                        color: _this.chinamapData.visualMap_controller_inRange_color,
                    }
                }
            },
            series: [
                {
                    name: _this.chinamapData.series_name,
                    type: _this.chinamapData.series_type,
                    mapType: _this.chinamapData.series_mapType,
                    roam: _this.chinamapData.series_roam,
                    label: {
                        normal: {
                            show: _this.chinamapData.series_label_normal_show,
                            textStyle: {
                                color: _this.chinamapData.series_label_normal_textStyle_color,
                                fontFamily: _this.chinamapData.series_label_normal_textStyle_fontFamily,
                            }
                        },
                        emphasis: {
                            show: _this.chinamapData.series_label_emphasis_show
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: _this.chinamapData.series_itemStyle_normal_areaColor
                        },
                    },
                    showLegendSymbol: _this.chinamapData.series_showLegendSymbol,
                    data: _this.chinamapData.series_data
                }
            ]
        };
        return _this;
    }
    ChinaMapComponent.prototype.beforeShow = function () {
    };
    ChinaMapComponent.prototype.afterShow = function () {
    };
    ChinaMapComponent.prototype.beforeDestory = function () {
    };
    ChinaMapComponent.prototype.afterDestory = function () {
    };
    ChinaMapComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    ChinaMapComponent.prototype.dataChange = function (data) {
        if (this.myChart == null) {
            this.init();
            data['maptype'] = "mapType";
            var changeData = utils_1.Utils.changeData(data, this.styleObj);
            utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
            var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
            this.myChart.setOption(newDdata, true);
        }
        else {
            data['maptype'] = "mapType";
            var changeData = utils_1.Utils.changeData(data, this.styleObj);
            utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
            var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
            this.myChart.setOption(newDdata, true);
        }
    };
    ChinaMapComponent.prototype.styleChange = function (style) {
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
    ChinaMapComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(ChinaMapComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    ChinaMapComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    return ChinaMapComponent;
}(base_component_1.BaseComponent));
exports.ChinaMapComponent = ChinaMapComponent;
//# sourceMappingURL=chinamap.component.js.map