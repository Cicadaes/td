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
var selectLine_template_1 = require("./selectLine.template");
var utils_1 = require("../../../../public/scripts/utils");
var selectLine_model_1 = require("./selectLine.model");
var base_chart_1 = require("../../base/base.chart");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var SelectedLineComponent = (function (_super) {
    __extends(SelectedLineComponent, _super);
    function SelectedLineComponent() {
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
        _this.dataConfig = {};
        _this.projectIds = [];
        _this.projectNames = [];
        _this.dataLength = 1; //对比数据的个数
        _this.height_const = 340; //对比中的一个高度
        _this.queryId = 0; //对比中的一个高度
        var template = new selectLine_template_1.SelectLineTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.lineData = new selectLine_model_1.SelectLineModel();
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
                right: _this.lineData.legend_right,
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
                formatter: _this.lineData.tooltip_formatter,
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
                },
                axisPointer: {
                    type: _this.lineData.xAxis_axisPointer_type,
                    label: {
                        show: _this.lineData.xAxis_axisPointer_label_show,
                    }
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
                },
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
                    data: _this.lineData.series_data,
                }
            ]
        };
        return _this;
    }
    SelectedLineComponent.prototype.beforeShow = function () {
    };
    SelectedLineComponent.prototype.afterShow = function () {
        this.init();
    };
    SelectedLineComponent.prototype.beforeDestory = function () {
    };
    SelectedLineComponent.prototype.afterDestory = function () {
    };
    SelectedLineComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    SelectedLineComponent.prototype.setBodyObj = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "selectLine";
        return this.body;
    };
    SelectedLineComponent.prototype.setHtmlObj = function (changeObj, index) {
        if (changeObj.scene == "scene_1") {
            this.renderHtml(this.lineData.datasourceSelectKlData, index);
        }
        else if (changeObj.scene == "scene_2") {
            this.renderHtml(this.lineData.datasourceSelectXsData, index);
        }
        else {
            $('#' + this.scopeID).find(".chart-selectline")[0]["style"].display = "none";
        }
    };
    SelectedLineComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.dataConfig = changeObj.result;
        if (!this.isEmptyObject(changeObj.result)) {
            this.scene = changeObj.result.scene;
            changeObj.result.metricIndex = changeObj.result.metricIndex || 0;
            this.setHtmlObj(changeObj.result, changeObj.result.metricIndex);
            this.setBodyObj(changeObj.result);
        }
        else {
            return;
        }
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    SelectedLineComponent.prototype.filterChange = function (event, data) {
        if (this.scene == "scene_4") {
            if (data.filter) {
                $("#commonCharts").empty();
                this.projectIds = [];
                this.projectNames = [];
                for (var i = 0; i < data.filter.length; i++) {
                    if (data.filter[i]["field"] == "project_id") {
                        this.projectIds = data.filter[i]["value"].split(",");
                    }
                    if (data.filter[i]["field"] == "projectName") {
                        this.projectNames = data.filter[i]["value"].split(",");
                    }
                }
                for (var j = 0; j < this.projectIds.length; j++) {
                    var str = "";
                    var objOne = [];
                    $.extend(true, objOne, data);
                    for (var k = 0; k < objOne.filter.length; k++) {
                        if (objOne.filter[k]["field"] == "project_id") {
                            objOne.filter[k]["value"] = this.projectIds[j];
                            this.body.queryId = this.projectIds[j];
                        }
                        str = '<div id="lineWap' + this.projectIds[j] + '" class="lineWap" style="width:100%;height:340px;"><h3 style="width:100%;height:40px;line-height:40px;">' + this.projectNames[j] + '</h3><div id="line' + this.projectIds[j] + '" style="width:100%;height:300px;"></div></div>';
                    }
                    $("#commonCharts").append(str);
                    this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, objOne);
                    this.postChange(this.body);
                }
            }
            else {
                for (var j = 0; j < this.projectIds.length; j++) {
                    for (var k = 0; k < this.body.filters.length; k++) {
                        if (this.body.filters[k]["field"] == "project_id") {
                            this.body.filters[k]["value"] = this.projectIds[j];
                            this.body.queryId = this.projectIds[j];
                        }
                    }
                    this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
                    this.postChange(this.body);
                }
            }
            //根据对比数据个数，进行高度缩放，传送增量数据
            var dataLengthNew = 0;
            dataLengthNew = this.projectIds.length;
            if (dataLengthNew > this.dataLength) {
                //增加高度
                this.sendMessage({
                    "op": "plus",
                    "value": (dataLengthNew - this.dataLength) * this.height_const,
                });
            }
            else if (dataLengthNew < this.dataLength) {
                //减少高度
                this.sendMessage({
                    "op": "minus",
                    "value": (this.dataLength - dataLengthNew) * this.height_const,
                });
            }
            this.dataLength = dataLengthNew;
        }
        else {
            this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
            this.postChange(this.body);
        }
    };
    SelectedLineComponent.prototype.sendMessage = function (changeObj) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', changeObj));
        _super.prototype.changeHeightBase.call(this, this, sendObj);
    };
    SelectedLineComponent.prototype.dataChange = function (data) {
        if (this.myChart == null) {
            this.init();
        }
        if (data.queryId) {
            this.queryId = data.queryId;
            delete data['queryId'];
            data = data.data;
        }
        data['linetype'] = "linetype";
        var changeData = utils_1.Utils.changeData(data, this.styleObj);
        utils_1.Utils.clearSeariesData(changeData, this.echartData.series);
        var newDdata = utils_1.Utils.compareObj(changeData, this.echartData);
        for (var i = 0; i < this.echartData.series.length; i++) {
            if (this.echartData.series[i]) {
                this.echartData.series[i].type = "line";
                newDdata.series[i].type = "line";
            }
        }
        if (this.queryId) {
            this.initEchart(newDdata);
        }
        else {
            this.myChart.clear();
            this.myChart.setOption(newDdata, true);
        }
    };
    SelectedLineComponent.prototype.initEchart = function (data) {
        var myChart = null;
        var divs = $("#commonCharts").find(".lineWap");
        for (var i = 0; i < divs.length; i++) {
            var div = divs[i].lastChild;
            if (div["id"] == "line" + (this.queryId).toString()) {
                myChart = base_chart_1.BaseCharts.echarts.init($("#line" + (this.queryId).toString())[0]);
            }
        }
        // 清除图标缓存图表
        myChart.clear();
        // 绘制图表
        myChart.setOption(data);
    };
    SelectedLineComponent.prototype.styleChange = function (style) {
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
    SelectedLineComponent.prototype.loadData = function () {
    };
    Object.defineProperty(SelectedLineComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    SelectedLineComponent.prototype.init = function () {
        // let str = "";
        // str = '<div id="selectLineOne" style="width:100%;height: calc(100% - 48px)"></div>';
        // $("#commonCharts").append(str);
        // //基于准备好的dom，初始化echarts实例
        // this.myChart = BaseCharts.echarts.init($("#selectLineOne")[0]);
        // //绘制图表
        // this.myChart.setOption(this.echartData);
        // //commonchange
        // this.commonChange();
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]"));
        // 绘制图表
        this.myChart.setOption(this.echartData);
        //commonchange
        this.commonChange();
    };
    SelectedLineComponent.prototype.renderHtml = function (datasourceData, index) {
        var optionList = "";
        for (var key in datasourceData) {
            optionList += '<ul>';
            for (var _i = 0, _a = datasourceData[key]; _i < _a.length; _i++) {
                var item = _a[_i];
                optionList += '<li data-id=' + item.id + '>' + item.name + '</li>';
            }
            optionList += '</ul>';
        }
        //把第i项放入已选择框里
        $('#' + this.scopeID).find("div[commonChange]").html(datasourceData["1"][index].name);
        $('#' + this.scopeID).find("div[commonSelectList]").html(optionList);
    };
    SelectedLineComponent.prototype.commonChange = function () {
        var _this = this;
        var _self = this;
        $('#' + this.scopeID).find('div[commonChange]').click(function (event) {
            $("div[commonSelectList]").hide();
            $('#' + _this.scopeID).find("div[commonSelectList]").show();
            event.stopPropagation();
        });
        $(document).click(function (e) {
            $("div[commonSelectList]").hide();
        });
        $('#' + this.scopeID).find('div[commonSelectList]').click(function (event) {
            if (event.target.childNodes.length > 1) {
                return;
            }
            $('#' + _this.scopeID).find("div[commonChange]").html(event.target.innerText);
            var name = event.target.innerText;
            var sendObj = Object.assign(_super.prototype.transformInput.call(_this, 'scopeID', _this.scopeID), _super.prototype.transformInput.call(_this, 'result', _self.changeBody(_self.body, event.target.dataset.id, name)));
            _super.prototype.onChange.call(_this, _self, sendObj);
            $('#' + _this.scopeID).find("div[commonSelectList]").hide();
        });
        $('#' + this.scopeID).find('div[commonSelected]').find("span").each(function (i) {
            $('#' + _this.scopeID).find('div[commonSelected]').find("span").eq(i).click(function (event) {
                $('#' + _this.scopeID).find('div[commonSelected]').find("span").eq(i).addClass("selected").siblings().removeClass();
                event.stopPropagation();
            });
        });
    };
    SelectedLineComponent.prototype.changeBody = function (body, innerText, name) {
        body['metrics'] = [];
        var metricArr = innerText.split("|"), obj = {};
        for (var i = 0; i < metricArr.length; i++) {
            obj = { 'field': metricArr[i], 'alias': 'value' };
            body['metrics'].push(obj);
        }
        return body;
    };
    SelectedLineComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    return SelectedLineComponent;
}(base_component_1.BaseComponent));
exports.SelectedLineComponent = SelectedLineComponent;
//# sourceMappingURL=selectLine.component.js.map