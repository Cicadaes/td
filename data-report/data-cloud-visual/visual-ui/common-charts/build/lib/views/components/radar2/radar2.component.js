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
var radar2_template_1 = require("./radar2.template");
var radar2_model_1 = require("./radar2.model");
var base_chart_1 = require("../../base/base.chart");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var Radar2Component = (function (_super) {
    __extends(Radar2Component, _super);
    function Radar2Component() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.radarData = null;
        _this.echartData = null;
        _this.body = null;
        _this.clearEchartData = null;
        var template = new radar2_template_1.Radar2Template(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.radarData = new radar2_model_1.Radar2Model();
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
                center: _this.radarData.radar_center,
                radius: _this.radarData.radar_radius,
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
    Radar2Component.prototype.beforeShow = function () {
    };
    Radar2Component.prototype.afterShow = function () {
        this.init();
    };
    Radar2Component.prototype.beforeDestory = function () {
    };
    Radar2Component.prototype.afterDestory = function () {
    };
    Radar2Component.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    Radar2Component.prototype.getconfiginformation = function (event, changeObj) {
        this.body = this.buildbody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    //buildbody
    Radar2Component.prototype.buildbody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "radar2";
        return this.body;
    };
    //渲染下拉框
    Radar2Component.prototype.renderSelectLine = function (data) {
        for (var key in data) {
            var selectHtml = '<div class="chart-selectline fl"><div class="chart-selectline-title">' + data[key][0]['name'] + '</div>';
            if (key != '1') {
                selectHtml += '<div class="chart-selectline-list hide" type="0"><ul>';
                for (var i = 0; i < data[key].length; i++) {
                    selectHtml += '<li code="' + data[key][i]['id'] + '" type="' + key + '">' + data[key][i]['name'] + '</li>';
                }
                selectHtml += '</ul></div>';
            }
            selectHtml += '</div>';
            $('div[radarContainer]', '#' + this.scopeID).append(selectHtml);
        }
    };
    //处理数据
    Radar2Component.prototype.handleData = function (json) {
        var total = [];
        var dataArr = [[]];
        var max = [[]];
        var originalData = [{}];
        $.extend(true, originalData, json);
        // //图例legend_data
        this.clearEchartData.legend['data'] = [];
        for (var i = 0; i < json.length; i++) {
            this.clearEchartData.legend['data'][i] = {
                name: json[i][this.body.dimensions[0]['field']],
                icon: 'rect',
                textStyle: {
                    color: this.radarData.color[i]
                }
            };
            total[i] = 0;
            dataArr[i] = [];
            for (var key in originalData[i]) {
                if (key != "project_name") {
                    total[i] = total[i] + originalData[i][key];
                    dataArr[i].push(originalData[i][key]);
                }
            }
        }
        // 处理没有可比性的数值
        for (var k = 0; k < originalData.length; k++) {
            max[k] = Math.max.apply(Math, dataArr[k]);
            for (var key in originalData[k]) {
                for (var i = 0; i < this.radarData.dimensionData["3"].length; i++) {
                    if (key.indexOf(this.radarData.dimensionData["3"][i].name) != -1) {
                        total[k] = total[k] - originalData[k][key];
                        originalData[k][key] = (max[k] / 100 * originalData[k][key]).toFixed(2);
                        total[k] = total[k] + Number(originalData[k][key]);
                    }
                }
                for (var j = 0; j < this.radarData.dimensionData["4"].length; j++) {
                    if (key.indexOf(this.radarData.dimensionData["4"][j].name) != -1) {
                        total[k] = total[k] - originalData[k][key];
                        originalData[k][key] = Number((total[k] / (this.body.metrics.length - 1)).toFixed(2));
                    }
                }
            }
        }
        //数列series_data
        var obj = {};
        $.extend(true, obj, this.clearEchartData.series[0]['data'][0]);
        this.clearEchartData['tooltip']['formatter'] = function (params) {
            var formatterHtml = "";
            for (var i = 0; i < json.length; i++) {
                if (json[i]["project_name"] == params["name"]) {
                    for (var key in json[i]) {
                        if (key != "project_name") {
                            formatterHtml += key + " : " + (json[i][key]).toLocaleString() + '<br>';
                        }
                    }
                }
            }
            return params["name"] + '<br>' + formatterHtml;
        };
        for (var m = 0; m < json.length; m++) {
            this.clearEchartData.series[0]['data'][m] = {};
            $.extend(true, this.clearEchartData.series[0]['data'][m], obj);
            this.clearEchartData.series[0]['data'][m]['value'] = [];
            this.clearEchartData.radar['indicator'] = [];
            this.clearEchartData.series[0].lineStyle['normal']['color'] = this.radarData.color[m];
            this.clearEchartData.series[0].itemStyle['normal']['color'] = this.radarData.color[m];
            this.clearEchartData.series[0]['data'][m]['name'] = this.clearEchartData.legend['data'][m]['name'];
            for (var k = 0; k < this.body.metrics.length; k++) {
                this.clearEchartData.series[0]['data'][m]['value'].push(originalData[m][this.body['metrics'][k]['alias']]);
                this.clearEchartData.series[0]['data'][m].lineStyle['normal']['color'] = this.radarData.color[m];
                this.clearEchartData.series[0]['data'][m].itemStyle['normal']['color'] = this.radarData.color[m];
                this.clearEchartData.radar['indicator'][k] = {};
                this.clearEchartData.radar['indicator'][k]['name'] = this.body['metrics'][k]['alias'];
                this.clearEchartData.radar['indicator'][k]['color'] = 'transparent';
            }
        }
        var valueArr = [];
        for (var n = 0; n < this.clearEchartData.series[0]['data'].length; n++) {
            if (this.clearEchartData.series[0]['data'][n]['value']) {
                valueArr = valueArr.concat(this.clearEchartData.series[0]['data'][n]['value']);
            }
        }
        for (var l = 0; l < this.clearEchartData.radar['indicator'].length; l++) {
            this.clearEchartData.radar['indicator'][l]['max'] = Math.max.apply(null, valueArr);
        }
    };
    Radar2Component.prototype.dataChange = function (data) {
        this.myChart.clear();
        this.chartData = data;
        this.clearEchartData = {};
        $.extend(true, this.clearEchartData, this.echartData);
        this.handleData(data);
        this.myChart.setOption(this.clearEchartData);
    };
    Radar2Component.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    Radar2Component.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    Radar2Component.prototype.styleChange = function (style) {
    };
    Radar2Component.prototype.loadData = function () {
    };
    Object.defineProperty(Radar2Component.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    Radar2Component.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.querySelector('div[radarChart]'));
        //初始化下拉框
        this.renderSelectLine(this.radarData.dimensionData);
        //绑定事件
        this.eventBindHtml();
    };
    Radar2Component.prototype.eventBindHtml = function () {
        var _this = this;
        var that = this;
        //显示、隐藏下拉框
        $('.chart-selectline-title', '#' + that.scopeID).on('click', function (e) {
            var $target = $(e.target);
            var $chartSelectlineList = $target.siblings('.chart-selectline-list');
            if ($chartSelectlineList.hasClass('hide')) {
                $('.chart-selectline-list').removeClass('open').addClass('hide');
                $chartSelectlineList.removeClass('hide').addClass('open');
            }
            else if ($chartSelectlineList.hasClass('open')) {
                $('.chart-selectline-list').removeClass('open').addClass('hide');
            }
            e.stopPropagation();
        });
        $(document).click(function (e) {
            $('.chart-selectline-list').removeClass('open').addClass('hide');
        });
        //选择下拉列表
        $('.chart-selectline-list', '#' + that.scopeID).on('click', 'li', function (e) {
            var $target = $(e.target);
            var type = Number($target.attr('type'));
            $target.parents('.chart-selectline').find('.chart-selectline-title').html($target.html());
            //重新buildbody,onchange
            that.body.metrics[type - 1] = {
                "field": $target.attr('code'),
                "alias": $target.html()
            };
            var sendObj = Object.assign(_super.prototype.transformInput.call(_this, 'scopeID', that.scopeID), _super.prototype.transformInput.call(_this, 'result', that.body));
            _super.prototype.onChange.call(_this, that, sendObj);
        });
        //点击帮助
        $('.funnelHelp', '#' + that.scopeID).on('click', function (e) {
            e.stopPropagation();
        });
    };
    return Radar2Component;
}(base_component_1.BaseComponent));
exports.Radar2Component = Radar2Component;
//# sourceMappingURL=radar2.component.js.map