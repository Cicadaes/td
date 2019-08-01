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
var utils_1 = require("../../../../public/scripts/utils");
var area_model_1 = require("./area.model");
var base_chart_1 = require("../../base/base.chart");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var AreaComponent = (function (_super) {
    __extends(AreaComponent, _super);
    function AreaComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.areaData = null;
        _this.echartData = null;
        _this.styleObj = null;
        _this.body = {};
        var template = new area_template_1.AreaTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.areaData = new area_model_1.AreaModel();
        _this.echartData = {
            backgroundColor: _this.areaData.backgroundColor,
            color: _this.areaData.color,
            textStyle: {
                color: _this.areaData.textStyle_color,
                fontFamily: _this.areaData.textStyle_fontFamily,
                fontSize: _this.areaData.textStyle_fontSize,
            },
            title: {
                show: _this.areaData.title_show,
                text: _this.areaData.title_text,
                subtext: _this.areaData.title_subtext,
                left: _this.areaData.title_left,
                top: _this.areaData.title_top,
            },
            legend: {
                show: _this.areaData.legend_show,
                z: _this.areaData.legend_z,
                left: _this.areaData.legend_left,
                top: _this.areaData.legend_top,
                orient: _this.areaData.legend_orient,
                data: _this.areaData.legend_data,
                itemHeight: _this.areaData.legend_itemHeight,
                itemWidth: _this.areaData.legend_itemWidth,
                type: 'scroll',
                textStyle: {
                    color: _this.areaData.legend_textStyle_color,
                    fontFamily: _this.areaData.legend_textStyle_fontFamily,
                    fontSize: _this.areaData.legend_textStyle_fontSize,
                }
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
                boundaryGap: _this.areaData.xAxis_boundaryGap,
                data: _this.areaData.xAxis_data,
                name: _this.areaData.xAxis_name,
                nameLocation: _this.areaData.xAxis_nameLocation,
                nameGap: _this.areaData.xAxis_nameGap,
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
                        // color: this.areaData.xAxis_axisTick_lineStyle_color,
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
                }
            },
            yAxis: {
                show: _this.areaData.yAxis_show,
                type: _this.areaData.yAxis_type,
                name: _this.areaData.yAxis_name,
                nameLocation: _this.areaData.yAxis_nameLocation,
                nameGap: _this.areaData.yAxis_nameGap,
                min: _this.areaData.yAxis_min,
                max: _this.areaData.yAxis_max,
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
                        // color: this.areaData.yAxis_axisTick_lineStyle_color,
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
                    label: {
                        normal: {
                            show: _this.areaData.series_label_normal_show,
                        }
                    },
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
                            // borderColor: this.areaData.series_itemStyle_normal_bordercolor,
                            borderWidth: _this.areaData.series_itemStyle_normal_borderwidth,
                            borderType: _this.areaData.series_itemStyle_normal_bordertype
                        },
                    },
                    areaStyle: { normal: {} },
                    data: _this.areaData.series_data,
                }
            ]
        };
        return _this;
    }
    AreaComponent.prototype.beforeShow = function () {
    };
    AreaComponent.prototype.afterShow = function () {
        this.init();
    };
    AreaComponent.prototype.beforeDestory = function () {
    };
    AreaComponent.prototype.afterDestory = function () {
    };
    AreaComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    AreaComponent.prototype.setBodyObj = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "area";
        return this.body;
    };
    AreaComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            this.setBodyObj(changeObj.result);
        }
        else {
            return;
        }
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    AreaComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    AreaComponent.prototype.mergeFilterChange = function (event, target) {
        _super.prototype.onFilterChange.call(this, this, target);
    };
    AreaComponent.prototype.dataChange = function (data) {
        if (this.myChart == null) {
            this.init();
        }
        data['areatype'] = "areatype";
        var changeData = utils_1.Utils.changeData(data, this.styleObj);
        utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
        var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
        this.myChart.setOption(newDdata, true);
    };
    AreaComponent.prototype.styleChange = function (style) {
        if (this.myChart == null) {
            this.init();
        }
        for (var key in style) {
            if (key == 'title_second_font') {
                $('#' + this.scopeID).find('div[componentTitleFont]').html(style[key]);
            }
        }
        var newStyle = utils_1.Utils.compareObj(style, this.echartData);
        this.myChart.setOption(newStyle, true);
    };
    AreaComponent.prototype.loadData = function () {
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
    AreaComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    return AreaComponent;
}(base_component_1.BaseComponent));
exports.AreaComponent = AreaComponent;
//# sourceMappingURL=area.component.js.map