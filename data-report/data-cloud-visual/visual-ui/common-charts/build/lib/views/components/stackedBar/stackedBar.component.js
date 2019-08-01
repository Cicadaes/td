/**
 * Created by zhaoxue on 2017/3/28.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_component_1 = require("../base.component");
var stackedBar_template_1 = require("./stackedBar.template");
var utils_1 = require("../../../../public/scripts/utils");
var stackedBar_model_1 = require("./stackedBar.model");
var base_chart_1 = require("../../base/base.chart");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var StackedBarComponent = (function (_super) {
    __extends(StackedBarComponent, _super);
    function StackedBarComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.stripData = null;
        _this.echartData = null;
        _this.styleObj = null;
        _this.changeObj = null;
        _this.body = {};
        _this.run_date = "2017-05";
        _this.hour_type = "2";
        _this.handleArr = [];
        var template = new stackedBar_template_1.StackedBarTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.stripData = new stackedBar_model_1.StackedBarModel();
        _this.echartData = {
            backgroundColor: _this.stripData.backgroundColor,
            color: _this.stripData.echart_color,
            title: {
                show: _this.stripData.title_show,
                text: _this.stripData.title_text,
                subtext: _this.stripData.title_subtext,
                left: _this.stripData.title_left,
                top: _this.stripData.title_top,
                textStyle: {
                    color: _this.stripData.title_textStyle_color
                }
            },
            legend: {
                show: _this.stripData.legend_show,
                z: _this.stripData.legend_z,
                left: _this.stripData.legend_left,
                top: _this.stripData.legend_top,
                orient: _this.stripData.legend_orient,
                data: _this.stripData.legend_data,
                itemHeight: _this.stripData.legend_itemHeight,
                type: 'scroll',
            },
            tooltip: {
                show: _this.stripData.tooltip_show,
                trigger: _this.stripData.tooltip_trigger,
                formatter: _this.stripData.tooltip_formatter,
                axisPointer: {
                    type: _this.stripData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: _this.stripData.tooltip_textStyle_color,
                    fontFamily: _this.stripData.tooltip_textStyle_fontFamily,
                    fontSize: _this.stripData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.stripData.tooltip_backgroundColor,
                borderColor: _this.stripData.tooltip_borderColor,
                borderWidth: _this.stripData.tooltip_borderWidth,
                padding: _this.stripData.tooltip_padding,
            },
            grid: {
                show: _this.stripData.grid_show,
                left: _this.stripData.grid_left,
                right: _this.stripData.grid_right,
                bottom: _this.stripData.grid_bottom,
                containLabel: _this.stripData.grid_containLabel,
                borderColor: _this.stripData.grid_borderColor,
                borderWidth: _this.stripData.grid_borderWidth
            },
            //线图
            xAxis: {
                show: _this.stripData.xAxis_show,
                max: _this.stripData.xAxis_max,
                type: _this.stripData.xAxis_type,
                boundaryGap: _this.stripData.xAxis_boundaryGap,
                data: _this.stripData.xAxis_data,
                name: _this.stripData.xAxis_name,
                nameLocation: _this.stripData.xAxis_nameLocation,
                nameGap: _this.stripData.xAxis_nameGap,
                axisLine: {
                    show: _this.stripData.xAxis_axisLine_show,
                    lineStyle: {
                        color: _this.stripData.xAxis_axisLine_lineStyle_color,
                        width: _this.stripData.xAxis_axisLine_lineStyle_width,
                        type: _this.stripData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: _this.stripData.xAxis_axisTick_show,
                    alignWithLabel: _this.stripData.xAxis_axisTick_alignWithLabel,
                    length: _this.stripData.xAxis_axisTick_length,
                    lineStyle: {
                        // color: this.stripData.xAxis_axisTick_lineStyle_color,
                        width: _this.stripData.xAxis_axisTick_lineStyle_width,
                        type: _this.stripData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: _this.stripData.xAxis_axisLabel_show,
                    margin: _this.stripData.xAxis_axisLabel_margin,
                    // interval: 0,
                    rotate: 0,
                    textStyle: {
                        color: _this.stripData.xAxis_axisLabel_textStyle_color,
                        fontFamily: _this.stripData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.stripData.xAxis_axisLabel_textStyle_fontSize,
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
                    show: _this.stripData.xAxis_splitLine_show,
                    lineStyle: {
                        color: _this.stripData.xAxis_splitLine_lineStyle_color,
                        width: _this.stripData.xAxis_splitLine_lineStyle_width,
                        type: _this.stripData.xAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    type: _this.stripData.xAxis_axisPointer_type,
                    label: {
                        show: _this.stripData.xAxis_axisPointer_label_show,
                    }
                }
            },
            yAxis: [
                {
                    show: _this.stripData.yAxis_show,
                    type: _this.stripData.yAxis_type,
                    boundaryGap: _this.stripData.yAxis_boundaryGap,
                    data: _this.stripData.yAxis_data,
                    name: _this.stripData.yAxis_name,
                    nameLocation: _this.stripData.yAxis_nameLocation,
                    nameRotate: _this.stripData.yAxis_nameRotate,
                    nameGap: _this.stripData.yAxis_nameGap,
                    axisLine: {
                        show: _this.stripData.yAxis_axisLine_show,
                        lineStyle: {
                            color: _this.stripData.yAxis_axisLine_lineStyle_color,
                            width: _this.stripData.yAxis_axisLine_lineStyle_width,
                            type: _this.stripData.yAxis_axisLine_lineStyle_type,
                        },
                    },
                    //y轴刻度
                    axisTick: {
                        show: _this.stripData.yAxis_axisTick_show,
                        alignWithLabel: _this.stripData.yAxis_axisTick_alignWithLabel,
                        length: _this.stripData.yAxis_axisTick_length,
                        lineStyle: {
                            color: 'transparent',
                            width: 0,
                            type: _this.stripData.yAxis_axisTick_lineStyle_type,
                        }
                    },
                    //y轴label
                    axisLabel: {
                        show: _this.stripData.yAxis_axisLabel_show,
                        margin: _this.stripData.yAxis_axisLabel_margin,
                        textStyle: {
                            color: _this.stripData.yAxis_axisLabel_textStyle_color,
                            fontFamily: _this.stripData.yAxis_axisLabel_textStyle_fontFamily,
                            fontSize: _this.stripData.yAxis_axisLabel_textStyle_fontSize,
                        },
                    },
                    //区域中的分割线
                    splitLine: {
                        show: _this.stripData.yAxis_splitLine_show,
                        lineStyle: {
                            color: _this.stripData.yAxis_splitLine_lineStyle_color,
                            width: _this.stripData.yAxis_splitLine_lineStyle_width,
                            type: _this.stripData.yAxis_splitLine_lineStyle_type
                        },
                    },
                    axisPointer: {
                        show: _this.stripData.yAxis_axisPointer_show,
                        label: {
                            show: _this.stripData.yAxis_axisPointer_label_show
                        }
                    }
                },
                {
                    show: _this.stripData.yAxis_show,
                    type: _this.stripData.yAxis_type,
                    boundaryGap: _this.stripData.yAxis_boundaryGap,
                    data: _this.stripData.yAxis_data,
                    name: _this.stripData.yAxis_name,
                    nameLocation: _this.stripData.yAxis_nameLocation,
                    nameRotate: _this.stripData.yAxis_nameRotate,
                    nameGap: _this.stripData.yAxis_nameGap,
                    axisLine: {
                        show: _this.stripData.yAxis_axisLine_show,
                        lineStyle: {
                            color: _this.stripData.yAxis_axisLine_lineStyle_color,
                            width: _this.stripData.yAxis_axisLine_lineStyle_width,
                            type: _this.stripData.yAxis_axisLine_lineStyle_type,
                        },
                    },
                    //y轴刻度
                    axisTick: {
                        show: _this.stripData.yAxis_axisTick_show,
                        alignWithLabel: _this.stripData.yAxis_axisTick_alignWithLabel,
                        length: _this.stripData.yAxis_axisTick_length,
                        lineStyle: {
                            color: 'transparent',
                            width: 0,
                            type: _this.stripData.yAxis_axisTick_lineStyle_type,
                        }
                    },
                    //y轴label
                    axisLabel: {
                        show: _this.stripData.yAxis_axisLabel_show,
                        margin: _this.stripData.yAxis_axisLabel_margin,
                        textStyle: {
                            color: _this.stripData.yAxis_axisLabel_textStyle_color,
                            fontFamily: _this.stripData.yAxis_axisLabel_textStyle_fontFamily,
                            fontSize: _this.stripData.yAxis_axisLabel_textStyle_fontSize,
                        },
                    },
                    //区域中的分割线
                    splitLine: {
                        show: _this.stripData.yAxis_splitLine_show,
                        lineStyle: {
                            color: _this.stripData.yAxis_splitLine_lineStyle_color,
                            width: _this.stripData.yAxis_splitLine_lineStyle_width,
                            type: _this.stripData.yAxis_splitLine_lineStyle_type
                        },
                    },
                    axisPointer: {
                        show: _this.stripData.yAxis_axisPointer_show,
                        label: {
                            show: _this.stripData.yAxis_axisPointer_label_show
                        }
                    }
                }
            ],
            series: [{
                    name: _this.stripData.series_name,
                    type: _this.stripData.series_type,
                    //barGap: this.stripData.series_barGap,
                    // lineStyle: {
                    //     normal: {
                    //         // color: this.stripData.series_lineStyle_normal_color,
                    //         width: this.stripData.series_lineStyle_normal_width,
                    //         type: this.stripData.series_lineStyle_normal_type
                    //     },
                    // },
                    itemStyle: {
                        normal: {
                            // color: this.stripData.series_itemStyle_normal_color,
                            borderColor: _this.stripData.series_itemStyle_normal_bordercolor,
                            borderWidth: _this.stripData.series_itemStyle_normal_borderwidth,
                            borderType: _this.stripData.series_itemStyle_normal_bordertype
                        },
                    },
                    areaStyle: {
                        normal: {
                            // color: this.stripData.series_areaStyle_normal_color,
                            opacity: _this.stripData.series_areaStyle_normal_opacity
                        },
                    },
                    data: _this.stripData.series_data
                }
            ]
        };
        return _this;
    }
    StackedBarComponent.prototype.beforeShow = function () {
    };
    StackedBarComponent.prototype.afterShow = function () {
        this.init();
    };
    StackedBarComponent.prototype.beforeDestory = function () {
    };
    StackedBarComponent.prototype.afterDestory = function () {
    };
    StackedBarComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    //init
    StackedBarComponent.prototype.init = function () {
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]"));
        // 绘制图表
        this.myChart.setOption(this.echartData);
        //debugger
        //commonchange
        this.commonChange();
    };
    //求和
    StackedBarComponent.prototype.sum = function (series, index) {
        var sum = 0;
        for (var i = 0; i < series.length; i++) {
            sum += series[i]['data'][index];
        }
        return sum;
    };
    StackedBarComponent.prototype.getTotalArr = function (series) {
        if (series.length > 0 && series[0]['data']) {
            var totalArr = [];
            for (var i = 0; i < series[0]['data'].length; i++) {
                totalArr[i] = this.sum(series, i);
            }
            return totalArr;
        }
    };
    //处理数据 变百分比
    StackedBarComponent.prototype.handleData = function (item, totalArr) {
        var that = this;
        var newDataArr = [];
        for (var i = 0; i < item.data.length; i++) {
            var percentNum = (item.data[i] / totalArr[i] * 100).toFixed(2);
            newDataArr.push(percentNum);
        }
        ;
        //console.log(newDataArr,'newDataArr======');
        that.handleArr = newDataArr;
        return that.handleArr;
    };
    //数据改变
    StackedBarComponent.prototype.dataChange = function (data) {
        // data =             {
        //     "date": "入店客流",
        //     "name": "3-5km",
        //     "value": 22
        // }
        if (data && data.length > 0) {
            var that_1 = this;
            var dataArray = [];
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                dataArray.push({
                    "date": obj.date,
                    "name": obj.name,
                    "value": obj.value
                });
            }
            if (this.myChart == null) {
                // 基于准备好的dom，初始化echarts实例
                //this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID) as HTMLDivElement);
                this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]"));
            }
            dataArray['striptype'] = "stripType";
            var changeData = utils_1.Utils.changeData(dataArray, this.styleObj);
            utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
            var newDdata_1 = utils_1.Utils.compareObj(changeData, this.echartData);
            var cacheNewDData = JSON.parse(JSON.stringify(newDdata_1));
            newDdata_1.legend['data'] = [];
            var totalArr_1 = this.getTotalArr(newDdata_1.series);
            newDdata_1.series.forEach(function (item, index) {
                item['stack'] = '总量';
                item.data = that_1.handleData(item, totalArr_1);
                item['label'] = {
                    normal: {
                        show: true,
                        position: 'insideRight',
                        formatter: '{c}%'
                    }
                };
                newDdata_1.legend['data'][index] = item['name'];
            });
            newDdata_1.yAxis[0].data = newDdata_1.yAxis.data; //第一个y轴重新赋值
            //是多条还是一条模拟显示
            if (this.changeObj.result.isMultiple) {
                newDdata_1.series.length = 1;
            }
            //X轴显示百分比
            newDdata_1.xAxis.axisLabel.formatter = '{value}%';
            //处理第二个y轴显示数据
            var temporaryData = [];
            var temporaryDataY = [];
            var yAxis_data2 = [];
            for (var i_1 = 0, j = data.length; i_1 < j; i_1++) {
                if (!utils_1.Utils.isRepeat(temporaryDataY, data[i_1].date)) {
                    temporaryDataY.push(data[i_1].date);
                    temporaryData.push(data[i_1]);
                }
            }
            for (var a = 0; a < temporaryData.length; a++) {
                yAxis_data2.push(temporaryData[a]['crowd_num']);
            }
            newDdata_1["yAxis"][1]["data"] = yAxis_data2;
            console.log("======>newDdata", newDdata_1);
            this.myChart.clear();
            this.myChart.setOption(newDdata_1, true);
        }
        else {
            this.myChart.clear();
        }
    };
    //根据type渲染html
    StackedBarComponent.prototype.setHtmlObj = function (changeObj) {
        var that = this;
    };
    //渲染html
    StackedBarComponent.prototype.renderTabHtml = function (data) {
    };
    //下拉改变
    StackedBarComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    //发送请求
    StackedBarComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    StackedBarComponent.prototype.styleChange = function (style) {
    };
    StackedBarComponent.prototype.loadData = function () {
    };
    Object.defineProperty(StackedBarComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    StackedBarComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.changeObj = changeObj;
        if (!this.isEmptyObject(changeObj.result)) {
            this.setHtmlObj(changeObj.result);
            this.buildBody(changeObj.result);
        }
        else {
            return;
        }
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
        //x轴位置
        if (changeObj.result.topX) {
            this.echartData.xAxis.position = 'top';
        }
    };
    StackedBarComponent.prototype.commonChange = function () {
        var _this = this;
        var _self = this;
        $('#' + this.scopeID).find('div[commonChange]').click(function (event) {
            $('#' + _this.scopeID).find("div[commonSelectList]").show();
        });
        $('#' + this.scopeID).find('div[commonSelectList]').click(function (event) {
            $('#' + _this.scopeID).find("div[commonChange]").html(event.target.innerText);
            _this.hour_type = event.target.dataset.id;
            $('#' + _this.scopeID).find("div[commonSelectList]").hide();
        });
    };
    StackedBarComponent.prototype.buildBody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "stackedBar";
        return this.body;
    };
    return StackedBarComponent;
}(base_component_1.BaseComponent));
exports.StackedBarComponent = StackedBarComponent;
//# sourceMappingURL=stackedBar.component.js.map