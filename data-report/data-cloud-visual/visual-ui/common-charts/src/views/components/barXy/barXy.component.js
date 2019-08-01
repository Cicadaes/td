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
var barXy_template_1 = require("./barXy.template");
var utils_1 = require("../../../../public/scripts/utils");
var barXy_model_1 = require("./barXy.model");
var base_chart_1 = require("../../base/base.chart");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var BarXyComponent = (function (_super) {
    __extends(BarXyComponent, _super);
    function BarXyComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.barData = null;
        _this.echartData = null;
        _this.styleObj = null;
        _this.body = null;
        _this.oldValue = [];
        _this.settingObjCode = '';
        _this.settingArrCode = '';
        var template = new barXy_template_1.BarXyTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.barData = new barXy_model_1.BarXyModel();
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
                data: [],
                itemHeight: _this.barData.legend_itemHeight,
                itemWidth: _this.barData.legend_itemWidth,
                type: 'scroll',
                textStyle: {
                    color: _this.barData.legend_textStyle_color,
                    fontFamily: _this.barData.legend_textStyle_fontFamily,
                    fontSize: _this.barData.legend_textStyle_fontSize,
                }
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
                data: [],
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
                    // stack: this.barData.series_stack,
                    smooth: _this.barData.series_smooth,
                    symbol: _this.barData.series_symbol,
                    symbolSize: _this.barData.series_symbolSize,
                    showSymbol: _this.barData.series_showSymbol,
                    //柱图
                    // barWidth: this.barData.series_barWidth,
                    // barMaxWidth: this.barData.series_barMaxWidth,
                    // barMinHeight: this.barData.series_barMinHeight,
                    // barGap: this.barData.series_barGap,
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
                    data: []
                }
            ]
        };
        return _this;
    }
    BarXyComponent.prototype.beforeShow = function () {
    };
    BarXyComponent.prototype.afterShow = function () {
        this.init();
    };
    BarXyComponent.prototype.beforeDestory = function () {
    };
    BarXyComponent.prototype.afterDestory = function () {
    };
    BarXyComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    //buildBody
    BarXyComponent.prototype.buildbody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "barXy";
        return this.body;
    };
    BarXyComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            this.body = this.buildbody(changeObj.result);
            if (changeObj.result.readyBuildQuery) {
                this.postChange(this.body);
            }
        }
        else {
            return;
        }
    };
    //处理数据
    BarXyComponent.prototype.handleData = function (json) {
        this.echartData.legend['data'] = [];
        this.echartData.xAxis['data'] = [];
        //图例legend_data
        for (var i = 0; i < json.length; i++) {
            this.echartData.legend['data'].push(json[i][this.body.dimensions[0]['alias']]);
        }
        //横轴xAxis_data
        for (var key in json[0]) {
            if (key != this.body.dimensions[0]['alias']) {
                this.echartData.xAxis['data'].push(key);
            }
        }
        //数列series_data
        var obj = {};
        $.extend(true, obj, this.echartData.series[0]);
        this.echartData.series = [];
        for (var m = 0; m < json.length; m++) {
            this.echartData.series[m] = {};
            $.extend(true, this.echartData.series[m], obj);
            this.echartData.series[m]['data'] = [];
            this.echartData.series[m].lineStyle['normal']['color'] = this.barData.color[m];
            this.echartData.series[m].itemStyle['normal']['color'] = this.barData.color[m];
            this.echartData.series[m].areaStyle['normal']['color'] = this.barData.color[m];
            this.echartData.series[m]['name'] = this.echartData.legend['data'][m];
            for (var k = 0; k < this.body.metrics.length; k++) {
                this.echartData.series[m]['data'].push(json[m][this.echartData.xAxis['data'][k]]);
            }
        }
    };
    BarXyComponent.prototype.dataChange = function (data) {
        if (data && data.length > 0) {
            data = data;
        }
        else {
            data = [{ "name": "name暂无数据", "value": 0 }];
        }
        this.handleData(data);
        // 清除echart缓存
        this.myChart.clear();
        if (this.myChart == null) {
            this.init();
        }
        else {
            data['barType'] = "barType";
            this.init();
        }
    };
    BarXyComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    BarXyComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    BarXyComponent.prototype.styleChange = function (style) {
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
    BarXyComponent.prototype.loadData = function () {
    };
    Object.defineProperty(BarXyComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    BarXyComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]"));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    return BarXyComponent;
}(base_component_1.BaseComponent));
exports.BarXyComponent = BarXyComponent;
//# sourceMappingURL=barXy.component.js.map