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
var lineBar_template_1 = require("./lineBar.template");
var utils_1 = require("../../../../public/scripts/utils");
var lineBar_model_1 = require("./lineBar.model");
var base_chart_1 = require("../../base/base.chart");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var LineBarComponent = (function (_super) {
    __extends(LineBarComponent, _super);
    function LineBarComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.lineBarData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.styleObj = null;
        _this.changeObj = null;
        _this.body = {
            "datasource_id": 52,
            "dimensions": [
                { "field": "score", "alias": "date" },
                {
                    "field": "ROUND(count/total*100,2)",
                    "alias": "percent"
                },
                { "field": "average_R" },
                { "field": "average_F" },
                { "field": "average_M" }
            ],
            "filters": [
                { "field": 'year_month', "operator": "=", "value": utils_1.Utils.changeDate(dataSourceConfig_1.DataSourceConfig.getMonthShowFormatDate(), "-", "") },
                { "field": 'brand_name', "operator": "=", "value": "all" },
                { "field": 'channel_name', "operator": "=", "value": "all" }
            ],
            "orderBy": [{ "field": "score", "function": "ASC" }]
        };
        var template = new lineBar_template_1.LineBarTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.lineBarData = new lineBar_model_1.LineBarModel();
        _this.echartData = {
            backgroundColor: _this.lineBarData.backgroundColor,
            color: _this.lineBarData.color,
            textStyle: {
                color: _this.lineBarData.textStyle_color,
                fontFamily: _this.lineBarData.textStyle_fontFamily,
                fontSize: _this.lineBarData.textStyle_fontSize,
            },
            title: {
                show: _this.lineBarData.title_show,
                text: _this.lineBarData.title_text,
                subtext: _this.lineBarData.title_subtext,
                left: _this.lineBarData.title_left,
                top: _this.lineBarData.title_top,
            },
            legend: {
                show: _this.lineBarData.legend_show,
                z: _this.lineBarData.legend_z,
                left: _this.lineBarData.legend_left,
                top: _this.lineBarData.legend_top,
                orient: _this.lineBarData.legend_orient,
                data: _this.lineBarData.legend_data,
                itemHeight: _this.lineBarData.legend_itemHeight,
                itemWidth: _this.lineBarData.legend_itemWidth,
                type: 'scroll',
                textStyle: {
                    color: _this.lineBarData.legend_textStyle_color,
                    fontFamily: _this.lineBarData.legend_textStyle_fontFamily,
                    fontSize: _this.lineBarData.legend_textStyle_fontSize,
                }
            },
            tooltip: {
                show: _this.lineBarData.tooltip_show,
                trigger: _this.lineBarData.tooltip_trigger,
                formatter: _this.lineBarData.tooltip_formatter,
                axisPointer: {
                    type: _this.lineBarData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: _this.lineBarData.tooltip_textStyle_color,
                    fontFamily: _this.lineBarData.tooltip_textStyle_fontFamily,
                    fontSize: _this.lineBarData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.lineBarData.tooltip_backgroundColor,
                borderColor: _this.lineBarData.tooltip_borderColor,
                borderWidth: _this.lineBarData.tooltip_borderWidth,
                padding: _this.lineBarData.tooltip_padding,
            },
            grid: {
                show: _this.lineBarData.grid_show,
                left: _this.lineBarData.grid_left,
                right: _this.lineBarData.grid_right,
                bottom: _this.lineBarData.grid_bottom,
                containLabel: _this.lineBarData.grid_containLabel,
                borderColor: _this.lineBarData.grid_borderColor,
                borderWidth: _this.lineBarData.grid_borderWidth
            },
            //线图
            xAxis: {
                show: _this.lineBarData.xAxis_show,
                type: _this.lineBarData.xAxis_type,
                boundaryGap: _this.lineBarData.xAxis_boundaryGap,
                data: _this.lineBarData.xAxis_data,
                name: _this.lineBarData.xAxis_name,
                nameLocation: _this.lineBarData.xAxis_nameLocation,
                nameGap: _this.lineBarData.xAxis_nameGap,
                axisLine: {
                    show: _this.lineBarData.xAxis_axisLine_show,
                    lineStyle: {
                        color: _this.lineBarData.xAxis_axisLine_lineStyle_color,
                        width: _this.lineBarData.xAxis_axisLine_lineStyle_width,
                        type: _this.lineBarData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: _this.lineBarData.xAxis_axisTick_show,
                    alignWithLabel: _this.lineBarData.xAxis_axisTick_alignWithLabel,
                    length: _this.lineBarData.xAxis_axisTick_length,
                    lineStyle: {
                        width: _this.lineBarData.xAxis_axisTick_lineStyle_width,
                        type: _this.lineBarData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: _this.lineBarData.xAxis_axisLabel_show,
                    margin: _this.lineBarData.xAxis_axisLabel_margin,
                    rotate: 0,
                    textStyle: {
                        color: _this.lineBarData.xAxis_axisLabel_textStyle_color,
                        fontFamily: _this.lineBarData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.lineBarData.xAxis_axisLabel_textStyle_fontSize,
                    }
                },
                //区域中的分割线
                splitLine: {
                    show: _this.lineBarData.xAxis_splitLine_show,
                    lineStyle: {
                        color: _this.lineBarData.xAxis_splitLine_lineStyle_color,
                        width: _this.lineBarData.xAxis_splitLine_lineStyle_width,
                        type: _this.lineBarData.xAxis_splitLine_lineStyle_type
                    },
                }
            },
            yAxis: [{
                    show: _this.lineBarData.yAxis_show,
                    type: _this.lineBarData.yAxis_type,
                    name: _this.lineBarData.yAxis_name,
                    nameLocation: _this.lineBarData.yAxis_nameLocation,
                    nameTextStyle: {
                        color: "#fff"
                    },
                    nameGap: _this.lineBarData.yAxis_nameGap,
                    min: _this.lineBarData.yAxis_min,
                    max: _this.lineBarData.yAxis_max,
                    axisLine: {
                        show: _this.lineBarData.yAxis_axisLine_show,
                        lineStyle: {
                            color: _this.lineBarData.yAxis_axisLine_lineStyle_color,
                            width: _this.lineBarData.yAxis_axisLine_lineStyle_width,
                            type: _this.lineBarData.yAxis_axisLine_lineStyle_type,
                        },
                    },
                    //y轴刻度
                    axisTick: {
                        show: _this.lineBarData.yAxis_axisTick_show,
                        alignWithLabel: _this.lineBarData.yAxis_axisTick_alignWithLabel,
                        length: _this.lineBarData.yAxis_axisTick_length,
                        lineStyle: {
                            width: _this.lineBarData.yAxis_axisTick_lineStyle_width,
                            type: _this.lineBarData.yAxis_axisTick_lineStyle_type,
                        }
                    },
                    //y轴label
                    axisLabel: {
                        show: _this.lineBarData.yAxis_axisLabel_show,
                        margin: _this.lineBarData.yAxis_axisLabel_margin,
                        textStyle: {
                            color: _this.lineBarData.yAxis_axisLabel_textStyle_color,
                            fontFamily: _this.lineBarData.yAxis_axisLabel_textStyle_fontFamily,
                            fontSize: _this.lineBarData.yAxis_axisLabel_textStyle_fontSize,
                        },
                        formatter: '{value}'
                    },
                    //区域中的分割线
                    splitLine: {
                        show: _this.lineBarData.yAxis_splitLine_show,
                        lineStyle: {
                            color: _this.lineBarData.yAxis_splitLine_lineStyle_color,
                            width: _this.lineBarData.yAxis_splitLine_lineStyle_width,
                            type: _this.lineBarData.yAxis_splitLine_lineStyle_type
                        },
                    },
                    interval: 1,
                }, {
                    show: _this.lineBarData.yAxis_show,
                    type: _this.lineBarData.yAxis_type,
                    name: _this.lineBarData.yAxis_1_name,
                    nameLocation: _this.lineBarData.yAxis_nameLocation,
                    nameTextStyle: {
                        color: "#fff"
                    },
                    nameGap: _this.lineBarData.yAxis_nameGap,
                    min: _this.lineBarData.yAxis_1_min,
                    max: _this.lineBarData.yAxis_1_max,
                    axisLine: {
                        show: _this.lineBarData.yAxis_axisLine_show,
                        lineStyle: {
                            color: _this.lineBarData.yAxis_axisLine_lineStyle_color,
                            width: _this.lineBarData.yAxis_axisLine_lineStyle_width,
                            type: _this.lineBarData.yAxis_axisLine_lineStyle_type,
                        },
                    },
                    //y轴刻度
                    axisTick: {
                        show: _this.lineBarData.yAxis_axisTick_show,
                        alignWithLabel: _this.lineBarData.yAxis_axisTick_alignWithLabel,
                        length: _this.lineBarData.yAxis_axisTick_length,
                        lineStyle: {
                            width: _this.lineBarData.yAxis_axisTick_lineStyle_width,
                            type: _this.lineBarData.yAxis_axisTick_lineStyle_type,
                        }
                    },
                    //y轴label
                    axisLabel: {
                        show: _this.lineBarData.yAxis_axisLabel_show,
                        margin: _this.lineBarData.yAxis_axisLabel_margin,
                        textStyle: {
                            color: _this.lineBarData.yAxis_axisLabel_textStyle_color,
                            fontFamily: _this.lineBarData.yAxis_axisLabel_textStyle_fontFamily,
                            fontSize: _this.lineBarData.yAxis_axisLabel_textStyle_fontSize,
                        },
                        formatter: '{value} %'
                    },
                    //区域中的分割线
                    splitLine: {
                        show: _this.lineBarData.yAxis_splitLine_show,
                        lineStyle: {
                            color: _this.lineBarData.yAxis_splitLine_lineStyle_color,
                            width: _this.lineBarData.yAxis_splitLine_lineStyle_width,
                            type: _this.lineBarData.yAxis_splitLine_lineStyle_type
                        },
                    },
                    interval: 5
                }],
            series: [{
                    name: _this.lineBarData.series_name,
                    type: _this.lineBarData.series_type,
                    smooth: _this.lineBarData.series_smooth,
                    symbol: _this.lineBarData.series_symbol,
                    symbolSize: _this.lineBarData.series_symbolSize,
                    showSymbol: _this.lineBarData.series_showSymbol,
                    label: {
                        normal: {
                            show: _this.lineBarData.series_label_normal_show,
                            position: 'top'
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: _this.lineBarData.series_lineStyle_normal_width,
                            type: _this.lineBarData.series_lineStyle_normal_type
                        },
                    },
                    data: _this.lineBarData.series_data
                }
            ]
        };
        return _this;
    }
    LineBarComponent.prototype.beforeShow = function () {
    };
    LineBarComponent.prototype.afterShow = function () {
    };
    LineBarComponent.prototype.beforeDestory = function () {
    };
    LineBarComponent.prototype.afterDestory = function () {
    };
    LineBarComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    LineBarComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    LineBarComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    LineBarComponent.prototype.mergeFilterChange = function (event, target) {
        _super.prototype.onFilterChange.call(this, this, target);
    };
    LineBarComponent.prototype.dataChange = function (data) {
        if (this.myChart == null) {
            this.init();
        }
        // if(data.total > 0){
        //     $("#"+this.scopeID).find("div[commonTotal] span").html(Utils.changeNumber(data.total));
        // }else{
        //     $("#"+this.scopeID).find("div[commonTotal] span").html("0");
        // }
        data['lineBartype'] = "lineBartype";
        var changeData = utils_1.Utils.changeData(data, this.styleObj);
        utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
        var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
        this.myChart.setOption(newDdata, true);
    };
    LineBarComponent.prototype.styleChange = function (style) {
    };
    LineBarComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(LineBarComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    LineBarComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]"));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    LineBarComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    return LineBarComponent;
}(base_component_1.BaseComponent));
exports.LineBarComponent = LineBarComponent;
//# sourceMappingURL=lineBar.component.js.map