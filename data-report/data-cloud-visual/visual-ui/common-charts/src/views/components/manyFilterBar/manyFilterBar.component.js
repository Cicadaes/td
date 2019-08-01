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
var manyFilterBar_template_1 = require("./manyFilterBar.template");
var utils_1 = require("../../../../public/scripts/utils");
var manyFilterBar_model_1 = require("./manyFilterBar.model");
var base_chart_1 = require("../../base/base.chart");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var ManyFilterBarComponent = (function (_super) {
    __extends(ManyFilterBarComponent, _super);
    function ManyFilterBarComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.barData = null;
        _this.echartData = null;
        _this.styleObj = null;
        _this.body = null;
        _this.metricData = {};
        _this.oldValue = [];
        _this.settingObjCode = '';
        _this.settingArrCode = '';
        var template = new manyFilterBar_template_1.ManyFilterBarTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.barData = new manyFilterBar_model_1.ManyFilterBarModel();
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
                type: 'plain',
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
                data: _this.barData.xAxis_data,
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
                },
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
                    //name: this.barData.series_name,
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
    ManyFilterBarComponent.prototype.beforeShow = function () {
    };
    ManyFilterBarComponent.prototype.afterShow = function () {
        this.init();
    };
    ManyFilterBarComponent.prototype.beforeDestory = function () {
    };
    ManyFilterBarComponent.prototype.afterDestory = function () {
    };
    ManyFilterBarComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    ManyFilterBarComponent.prototype.buildbody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        var date = new Date();
        var yestoday = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        for (var i = 0; i < this.body.filters.length; i++) {
            if (this.body.filters[i].field == "date") {
                this.body.filters[i].value = yestoday;
            }
        }
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "manyFilterBar";
        return this.body;
    };
    ManyFilterBarComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.body = this.buildbody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    //处理数据
    //处理数据
    ManyFilterBarComponent.prototype.handleData = function (json) {
        this.echartData.legend['data'] = [];
        var projectCount = this.body.filters[1]['value'].split(",").length; // 选择店铺的个数
        if (projectCount != 1) {
            //图例legend_data
            var obj_1 = {};
            for (var i = 0; i < json.length; i++) {
                if (!obj_1[json[i]["name"]]) {
                    this.echartData.legend['data'].push(json[i]["name"]);
                    obj_1[json[i]["name"]] = 1;
                }
            }
        }
        else {
            this.echartData.legend['data'] = ["今日", "昨日", "近7日", "近30日"];
        }
        //数列series_data
        var obj = {};
        $.extend(true, obj, this.echartData.series[0]);
        this.echartData['tooltip']['formatter'] = function (obj) {
            var time = obj[0].name;
            var formatterHtml = "";
            if (obj[0].name < 10) {
                time = "0" + obj[0].name + ":00 ~ 0" + obj[0].name + ":59";
            }
            else {
                time = obj[0].name + ":00 ~ " + obj[0].name + ":59";
            }
            for (var i = 0; i < obj.length; i++) {
                formatterHtml += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + obj[i].color + '"></span>' + obj[i].seriesName + " : " + obj[i].data + '<br>';
            }
            return time + '<br>' + formatterHtml;
        };
        var count_project = this.echartData.legend['data'].length;
        for (var n = 0; n < count_project; n++) {
            this.echartData.series[n] = {};
            $.extend(true, this.echartData.series[n], obj);
            this.echartData.series[n]['data'] = [];
            this.echartData.series[n].lineStyle['normal']['color'] = this.barData.color[n];
            this.echartData.series[n].itemStyle['normal']['color'] = this.barData.color[n];
            this.echartData.series[n].areaStyle['normal']['color'] = this.barData.color[n];
            this.echartData.series[n]['name'] = this.echartData.legend['data'][n];
            for (var z = 0; z < this.echartData.xAxis['data'].length; z++) {
                this.echartData.series[n]['data'][z] = 0;
                for (var m = 0; m < json.length; m++) {
                    if (this.echartData.series[n]['name'] == json[m].name && this.echartData.xAxis['data'][z] == json[m].date) {
                        this.echartData.series[n]['data'][z] = json[m]["value"];
                    }
                }
            }
        }
        if (this.echartData.series.length > count_project) {
            this.echartData.series.splice(count_project, this.echartData.series.length);
        }
    };
    ManyFilterBarComponent.prototype.dataChange = function (data) {
        if (data && data.length > 0) {
            this.myChart.clear();
            this.handleData(data); // 处理数据  -- 组装chart的结构
            if (this.myChart == null) {
                this.init();
            }
            else {
                data['manyFilterBar'] = "manyFilterBar";
                this.init();
            }
        }
        else {
            this.myChart.clear();
        }
    };
    ManyFilterBarComponent.prototype.filterChange = function (event, data) {
        if (data.metrics) {
            data.metrics[0]["alias"] = "value";
            this.metricData = data;
            this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        }
        else {
            var projectCount = data["filter"][0]['value'].split(",").length;
            (projectCount > 1) ? this.body = this.buildbody({ "dscKey": "c_2" }) : this.body = this.buildbody({ "dscKey": "c_1" });
            this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
            this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, this.metricData);
            var date = new Date();
            var yestoday = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            for (var i = 0; i < this.body.filters.length; i++) {
                if (this.body.filters[i].field == "date") {
                    this.body.filters[i].value = yestoday;
                }
            }
        }
        this.postChange(this.body);
    };
    ManyFilterBarComponent.prototype.styleChange = function (style) {
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
    ManyFilterBarComponent.prototype.loadData = function () {
    };
    Object.defineProperty(ManyFilterBarComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    ManyFilterBarComponent.prototype.changeBody = function (body, innerText) {
        body['metrics'] = [
            { 'field': innerText, 'alias': 'value' },
        ];
        return body;
    };
    ManyFilterBarComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    ManyFilterBarComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]"));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    return ManyFilterBarComponent;
}(base_component_1.BaseComponent));
exports.ManyFilterBarComponent = ManyFilterBarComponent;
//# sourceMappingURL=manyFilterBar.component.js.map