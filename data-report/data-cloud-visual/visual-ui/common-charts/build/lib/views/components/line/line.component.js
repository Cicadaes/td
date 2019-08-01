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
var line_template_1 = require("./line.template");
var utils_1 = require("../../../../public/scripts/utils");
var line_model_1 = require("./line.model");
var base_chart_1 = require("../../base/base.chart");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var LineComponent = (function (_super) {
    __extends(LineComponent, _super);
    function LineComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.lineData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.styleObj = null;
        _this.changeObj = null;
        _this.body = {};
        _this.scene = null;
        var template = new line_template_1.LineTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.lineData = new line_model_1.LineModel();
        _this.echartData = {
            backgroundColor: _this.lineData.backgroundColor,
            color: _this.lineData.color,
            textStyle: {
                color: _this.lineData.textStyle_color,
                fontFamily: _this.lineData.textStyle_fontFamily,
                fontSize: _this.lineData.textStyle_fontSize,
            },
            title: {
                show: _this.lineData.title_show,
                text: _this.lineData.title_text,
                subtext: _this.lineData.title_subtext,
                left: _this.lineData.title_left,
                top: _this.lineData.title_top,
            },
            legend: {
                show: _this.lineData.legend_show,
                z: _this.lineData.legend_z,
                left: _this.lineData.legend_left,
                top: _this.lineData.legend_top,
                orient: _this.lineData.legend_orient,
                data: _this.lineData.legend_data,
                itemHeight: _this.lineData.legend_itemHeight,
                itemWidth: _this.lineData.legend_itemWidth,
                type: 'scroll',
                textStyle: {
                    color: _this.lineData.legend_textStyle_color,
                    fontFamily: _this.lineData.legend_textStyle_fontFamily,
                    fontSize: _this.lineData.legend_textStyle_fontSize,
                }
            },
            tooltip: {
                show: _this.lineData.tooltip_show,
                trigger: _this.lineData.tooltip_trigger,
                formatter: function (params, index) {
                    var tooltipData = "", total = 0;
                    for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                        var j = params_1[_i];
                        total = total + parseInt(j.value);
                    }
                    tooltipData += '<div class="line_tooltip">';
                    tooltipData += '<p>' + params[0].axisValue + '</p>';
                    tooltipData += '<ul>';
                    for (var _a = 0, params_2 = params; _a < params_2.length; _a++) {
                        var p = params_2[_a];
                        var rose = total > 0 ? ((parseInt(p.value) / total) * 100).toFixed(2) : 0;
                        tooltipData += '<li><em style="float: right; padding-left: 20px">' + rose + '%</em>' + p.marker + ' <b>' + p.seriesName + ' : ' + utils_1.Utils.parseFormatNum(p.value, 0) + ' </b></li>';
                    }
                    tooltipData += '</ul>';
                    tooltipData += '</div>';
                    return tooltipData;
                },
                axisPointer: {
                    type: _this.lineData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: _this.lineData.tooltip_textStyle_color,
                    fontFamily: _this.lineData.tooltip_textStyle_fontFamily,
                    fontSize: _this.lineData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.lineData.tooltip_backgroundColor,
                borderColor: _this.lineData.tooltip_borderColor,
                borderWidth: _this.lineData.tooltip_borderWidth,
                padding: _this.lineData.tooltip_padding,
            },
            grid: {
                show: _this.lineData.grid_show,
                left: _this.lineData.grid_left,
                right: _this.lineData.grid_right,
                bottom: _this.lineData.grid_bottom,
                containLabel: _this.lineData.grid_containLabel,
                borderColor: _this.lineData.grid_borderColor,
                borderWidth: _this.lineData.grid_borderWidth
            },
            //线图
            xAxis: {
                show: _this.lineData.xAxis_show,
                type: _this.lineData.xAxis_type,
                boundaryGap: _this.lineData.xAxis_boundaryGap,
                data: _this.lineData.xAxis_data,
                name: _this.lineData.xAxis_name,
                nameLocation: _this.lineData.xAxis_nameLocation,
                nameGap: _this.lineData.xAxis_nameGap,
                axisLine: {
                    show: _this.lineData.xAxis_axisLine_show,
                    lineStyle: {
                        color: _this.lineData.xAxis_axisLine_lineStyle_color,
                        width: _this.lineData.xAxis_axisLine_lineStyle_width,
                        type: _this.lineData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: _this.lineData.xAxis_axisTick_show,
                    alignWithLabel: _this.lineData.xAxis_axisTick_alignWithLabel,
                    length: _this.lineData.xAxis_axisTick_length,
                    lineStyle: {
                        // color: this.lineData.xAxis_axisTick_lineStyle_color,
                        width: _this.lineData.xAxis_axisTick_lineStyle_width,
                        type: _this.lineData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: _this.lineData.xAxis_axisLabel_show,
                    margin: _this.lineData.xAxis_axisLabel_margin,
                    // interval: 0,
                    rotate: 0,
                    textStyle: {
                        color: _this.lineData.xAxis_axisLabel_textStyle_color,
                        fontFamily: _this.lineData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.lineData.xAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: _this.lineData.xAxis_splitLine_show,
                    lineStyle: {
                        color: _this.lineData.xAxis_splitLine_lineStyle_color,
                        width: _this.lineData.xAxis_splitLine_lineStyle_width,
                        type: _this.lineData.xAxis_splitLine_lineStyle_type
                    },
                }
            },
            yAxis: {
                show: _this.lineData.yAxis_show,
                type: _this.lineData.yAxis_type,
                name: _this.lineData.yAxis_name,
                nameLocation: _this.lineData.yAxis_nameLocation,
                nameGap: _this.lineData.yAxis_nameGap,
                min: _this.lineData.yAxis_min,
                max: _this.lineData.yAxis_max,
                axisLine: {
                    show: _this.lineData.yAxis_axisLine_show,
                    lineStyle: {
                        color: _this.lineData.yAxis_axisLine_lineStyle_color,
                        width: _this.lineData.yAxis_axisLine_lineStyle_width,
                        type: _this.lineData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: _this.lineData.yAxis_axisTick_show,
                    alignWithLabel: _this.lineData.yAxis_axisTick_alignWithLabel,
                    length: _this.lineData.yAxis_axisTick_length,
                    lineStyle: {
                        // color: this.lineData.yAxis_axisTick_lineStyle_color,
                        width: _this.lineData.yAxis_axisTick_lineStyle_width,
                        type: _this.lineData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: _this.lineData.yAxis_axisLabel_show,
                    margin: _this.lineData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: _this.lineData.yAxis_axisLabel_textStyle_color,
                        fontFamily: _this.lineData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.lineData.yAxis_axisLabel_textStyle_fontSize,
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
                    show: _this.lineData.yAxis_splitLine_show,
                    lineStyle: {
                        color: _this.lineData.yAxis_splitLine_lineStyle_color,
                        width: _this.lineData.yAxis_splitLine_lineStyle_width,
                        type: _this.lineData.yAxis_splitLine_lineStyle_type
                    },
                }
            },
            series: [{
                    name: _this.lineData.series_name,
                    type: _this.lineData.series_type,
                    stack: _this.lineData.series_stack,
                    smooth: _this.lineData.series_smooth,
                    symbol: _this.lineData.series_symbol,
                    symbolSize: _this.lineData.series_symbolSize,
                    showSymbol: _this.lineData.series_showSymbol,
                    label: {
                        normal: {
                            show: _this.lineData.series_label_normal_show,
                        }
                    },
                    lineStyle: {
                        normal: {
                            // color: this.lineData.series_lineStyle_normal_color,
                            width: _this.lineData.series_lineStyle_normal_width,
                            type: _this.lineData.series_lineStyle_normal_type
                        },
                    },
                    itemStyle: {
                        normal: {
                            // color: this.lineData.series_itemStyle_normal_color,
                            // borderColor: this.lineData.series_itemStyle_normal_bordercolor,
                            borderWidth: _this.lineData.series_itemStyle_normal_borderwidth,
                            borderType: _this.lineData.series_itemStyle_normal_bordertype
                        },
                    },
                    areaStyle: {
                        normal: {
                            color: _this.lineData.series_areaStyle_normal_color,
                        },
                    },
                    data: _this.lineData.series_data
                }
            ]
        };
        return _this;
    }
    LineComponent.prototype.beforeShow = function () {
    };
    LineComponent.prototype.afterShow = function () {
        this.init();
    };
    LineComponent.prototype.beforeDestory = function () {
    };
    LineComponent.prototype.afterDestory = function () {
    };
    LineComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    LineComponent.prototype.setBodyObj = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "line";
        return this.body;
    };
    LineComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            this.scene = changeObj.result.scene;
            this.setBodyObj(changeObj.result);
        }
        else {
            return;
        }
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    LineComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    LineComponent.prototype.mergeFilterChange = function (event, target) {
        _super.prototype.onFilterChange.call(this, this, target);
    };
    LineComponent.prototype.dataChange = function (data) {
        if (this.myChart == null) {
            this.init();
        }
        data['linetype'] = "linetype";
        var changeData = utils_1.Utils.changeData(utils_1.Utils.handleLifeCycleMap(data, "name"), this.styleObj);
        utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
        var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
        this.myChart.setOption(newDdata, true);
    };
    LineComponent.prototype.styleChange = function (style) {
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
    LineComponent.prototype.loadData = function () {
    };
    Object.defineProperty(LineComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    LineComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]"));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    LineComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    return LineComponent;
}(base_component_1.BaseComponent));
exports.LineComponent = LineComponent;
//# sourceMappingURL=line.component.js.map