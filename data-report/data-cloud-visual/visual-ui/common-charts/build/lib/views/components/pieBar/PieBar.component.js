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
var PieBar_template_1 = require("./PieBar.template");
var utils_1 = require("../../../../public/scripts/utils");
var PieBar_model_1 = require("./PieBar.model");
var BarPie_model_1 = require("./BarPie.model");
var base_chart_1 = require("../../base/base.chart");
var $ = require("jquery");
var path_1 = require("../../../../public/path/path");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var PieBarComponent = (function (_super) {
    __extends(PieBarComponent, _super);
    function PieBarComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.myBarChart = null;
        _this.chartData = null;
        _this.PieBarData = null;
        _this.BarPieData = null;
        _this.echartData = null;
        _this.echartBarPieData = null;
        _this.styleObj = null;
        _this.changeObj = null;
        _this.barPieListData = [];
        _this.pieBaryearMonth = ""; //日期
        _this.pieBarbrand = ""; //品牌
        _this.pieBarchannel = ""; //渠道
        _this.pieBarfilter = []; //过滤条件
        _this.crowdName = ""; //人群名称
        _this.pieBarFilterV = "filterV";
        _this.pieBarTotal = null;
        _this.pieBarMap = {
            "低价值": 0,
            "中价值发展客户": 1,
            "中价值保持客户": 2,
            "中价值挽留客户": 3,
            "中高价值发展客户": 4,
            "中高价值保持客户": 5,
            "中高价值挽留客户": 6,
            "高价值客户": 7
        };
        _this.body = {
            "datasource_id": 53,
            "dimensions": [
                { "field": "class_label" },
                { "field": "member_count" }
            ],
            "filters": [
                { "field": 'year_month', "operator": "=", "value": utils_1.Utils.changeDate(dataSourceConfig_1.DataSourceConfig.getMonthShowFormatDate(), "-", "") },
                { "field": 'brand_name', "operator": "=", "value": "all" },
                { "field": 'channel_name', "operator": "=", "value": "all" }
            ],
            "orderBy": [{ "field": "class_label", "function": "ASC" }]
        };
        var template = new PieBar_template_1.PieBarTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.PieBarData = new PieBar_model_1.PieBarModel();
        _this.BarPieData = new BarPie_model_1.BarPieModel();
        _this.echartData = {
            backgroundColor: _this.PieBarData.backgroundColor,
            color: _this.PieBarData.color,
            title: {
                show: _this.PieBarData.title_show,
                text: _this.PieBarData.title_text,
                subtext: _this.PieBarData.title_subtext,
                left: _this.PieBarData.title_left,
                top: _this.PieBarData.title_top,
                textStyle: {
                    color: _this.PieBarData.title_textStyle_color
                }
            },
            legend: {
                show: _this.PieBarData.legend_show,
                z: _this.PieBarData.legend_z,
                left: _this.PieBarData.legend_left,
                top: _this.PieBarData.legend_top,
                orient: _this.PieBarData.legend_orient,
                data: _this.PieBarData.legend_data,
                padding: _this.PieBarData.legend_padding,
                itemHeight: _this.PieBarData.legend_itemHeight,
                type: 'scroll',
                textStyle: {
                    color: _this.PieBarData.legend_textStyle_color,
                    fontFamily: _this.PieBarData.legend_textStyle_fontFamily,
                    fontSize: _this.PieBarData.legend_textStyle_fontSize,
                }
            },
            tooltip: {
                show: _this.PieBarData.tooltip_show,
                trigger: _this.PieBarData.tooltip_trigger,
                formatter: _this.PieBarData.tooltip_formatter,
                textStyle: {
                    color: _this.PieBarData.tooltip_textStyle_color,
                    fontFamily: _this.PieBarData.tooltip_textStyle_fontFamily,
                    fontSize: _this.PieBarData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.PieBarData.tooltip_backgroundColor
            },
            series: [{
                    name: _this.PieBarData.series_name,
                    type: _this.PieBarData.series_type,
                    radius: _this.PieBarData.series_radius,
                    center: _this.PieBarData.series_center,
                    label: {
                        normal: {
                            show: _this.PieBarData.series_label_normal_show,
                            position: _this.PieBarData.series_label_normal_position,
                            formatter: _this.PieBarData.series_label_normal_formatter,
                            textStyle: {
                                fontFamily: _this.PieBarData.series_label_normal_textStyle_fontFamily
                            }
                        }
                    },
                    animationType: _this.PieBarData.series_animationType
                }]
        };
        _this.echartBarPieData = {
            backgroundColor: _this.BarPieData.backgroundColor,
            color: _this.BarPieData.echart_color,
            tooltip: {},
            grid: {
                show: _this.BarPieData.grid_show,
                left: _this.BarPieData.grid_left,
                right: _this.BarPieData.grid_right,
                bottom: _this.BarPieData.grid_bottom,
                top: _this.BarPieData.grid_top,
                containLabel: _this.BarPieData.grid_containLabel,
                borderColor: _this.BarPieData.grid_borderColor,
                borderWidth: _this.BarPieData.grid_borderWidth
            },
            //线图
            xAxis: {
                show: _this.BarPieData.xAxis_show,
                type: _this.BarPieData.xAxis_type,
                boundaryGap: _this.BarPieData.xAxis_boundaryGap,
                data: _this.BarPieData.xAxis_data,
                name: _this.BarPieData.xAxis_name,
                nameLocation: _this.BarPieData.xAxis_nameLocation,
                nameGap: _this.BarPieData.xAxis_nameGap,
                axisLine: {
                    show: _this.BarPieData.xAxis_axisLine_show,
                    lineStyle: {
                        color: _this.BarPieData.xAxis_axisLine_lineStyle_color,
                        width: _this.BarPieData.xAxis_axisLine_lineStyle_width,
                        type: _this.BarPieData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: _this.BarPieData.xAxis_axisTick_show,
                    alignWithLabel: _this.BarPieData.xAxis_axisTick_alignWithLabel,
                    length: _this.BarPieData.xAxis_axisTick_length,
                    lineStyle: {
                        // color: this.BarPieData.xAxis_axisTick_lineStyle_color,
                        width: _this.BarPieData.xAxis_axisTick_lineStyle_width,
                        type: _this.BarPieData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: _this.BarPieData.xAxis_axisLabel_show,
                    margin: _this.BarPieData.xAxis_axisLabel_margin,
                    textStyle: {
                        color: _this.BarPieData.xAxis_axisLabel_textStyle_color,
                        fontFamily: _this.BarPieData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.BarPieData.xAxis_axisLabel_textStyle_fontSize,
                    }
                },
                //区域中的分割线
                splitLine: {
                    show: _this.BarPieData.xAxis_splitLine_show,
                    lineStyle: {
                        color: _this.BarPieData.xAxis_splitLine_lineStyle_color,
                        width: _this.BarPieData.xAxis_splitLine_lineStyle_width,
                        type: _this.BarPieData.xAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    type: _this.BarPieData.xAxis_axisPointer_type,
                    label: {
                        show: _this.BarPieData.xAxis_axisPointer_label_show,
                    }
                }
            },
            yAxis: {
                show: _this.BarPieData.yAxis_show,
                type: _this.BarPieData.yAxis_type,
                boundaryGap: _this.BarPieData.yAxis_boundaryGap,
                data: _this.BarPieData.yAxis_data,
                name: _this.BarPieData.yAxis_name,
                nameLocation: _this.BarPieData.yAxis_nameLocation,
                nameRotate: _this.BarPieData.yAxis_nameRotate,
                nameGap: _this.BarPieData.yAxis_nameGap,
                axisLine: {
                    show: _this.BarPieData.yAxis_axisLine_show,
                    lineStyle: {
                        color: _this.BarPieData.yAxis_axisLine_lineStyle_color,
                        width: _this.BarPieData.yAxis_axisLine_lineStyle_width,
                        type: _this.BarPieData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: _this.BarPieData.yAxis_axisTick_show,
                    alignWithLabel: _this.BarPieData.yAxis_axisTick_alignWithLabel,
                    length: _this.BarPieData.yAxis_axisTick_length,
                    lineStyle: {
                        color: _this.BarPieData.yAxis_axisTick_lineStyle_color,
                        width: _this.BarPieData.yAxis_axisTick_lineStyle_width,
                        type: _this.BarPieData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: _this.BarPieData.yAxis_axisLabel_show,
                    margin: _this.BarPieData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: _this.BarPieData.yAxis_axisLabel_textStyle_color,
                        fontFamily: _this.BarPieData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.BarPieData.yAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: _this.BarPieData.yAxis_splitLine_show,
                    lineStyle: {
                        color: _this.BarPieData.yAxis_splitLine_lineStyle_color,
                        width: _this.BarPieData.yAxis_splitLine_lineStyle_width,
                        type: _this.BarPieData.yAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    show: _this.BarPieData.yAxis_axisPointer_show,
                    label: {
                        show: _this.BarPieData.yAxis_axisPointer_label_show
                    }
                }
            },
            series: [{
                    name: _this.BarPieData.series_name,
                    type: _this.BarPieData.series_type,
                    stack: 'chart',
                    label: {
                        normal: {
                            position: 'right',
                            show: true,
                            formatter: '{c}%',
                            color: '#000'
                        }
                    },
                    barCategoryGap: '50%',
                    data: _this.BarPieData.series_data
                }, {
                    type: _this.BarPieData.series_type,
                    stack: 'chart',
                    itemStyle: {
                        normal: {
                            color: '#F4F7FB'
                        }
                    },
                    data: []
                }]
        };
        return _this;
    }
    PieBarComponent.prototype.beforeShow = function () {
    };
    PieBarComponent.prototype.afterShow = function () {
    };
    PieBarComponent.prototype.beforeDestory = function () {
    };
    PieBarComponent.prototype.afterDestory = function () {
    };
    PieBarComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
        if (this.myBarChart)
            this.myBarChart.resize();
    };
    PieBarComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    PieBarComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    PieBarComponent.prototype.mergeFilterChange = function (event, target) {
        _super.prototype.onFilterChange.call(this, this, target);
    };
    PieBarComponent.prototype.dataChange = function (data) {
        if (this.myChart == null || this.myBarChart == null) {
            this.init();
        }
        if (data.total > 0) {
            $("#" + this.scopeID).find(".pieBar_all h3").html(utils_1.Utils.changeNumber(data.total));
        }
        else {
            $("#" + this.scopeID).find(".pieBar_all h3").html("0");
        }
        for (var key in data) {
            switch (key) {
                case "pie":
                    this.echartData.series[0]['data'] = data.pie;
                    this.myChart.setOption(this.echartData, true);
                    this.renderPieHtml(data.pie, data.total);
                    break;
                case "bar":
                    var barPieData = [], valArr = [], allBarPieData = [];
                    for (var _i = 0, _a = data.bar; _i < _a.length; _i++) {
                        var item = _a[_i];
                        barPieData.push(item.name);
                    }
                    for (var _b = 0, _c = data.bar; _b < _c.length; _b++) {
                        var item = _c[_b];
                        valArr.push((item.value / data.total * 100).toFixed(2));
                        allBarPieData.push(data.total - item.value);
                    }
                    this.barPieListData = data.bar;
                    this.echartBarPieData.yAxis.data = barPieData;
                    this.echartBarPieData.series[0]['data'] = valArr;
                    // this.echartBarPieData.series[1]['data'] = allBarPieData;
                    this.echartBarPieData.xAxis.axisLabel.formatter = "{value} %";
                    this.myBarChart.setOption(this.echartBarPieData, true);
                    break;
            }
        }
    };
    PieBarComponent.prototype.renderPieHtml = function (data, total) {
        var optionList = "";
        if (total > 0) {
            optionList += '<ul>';
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                optionList += '<li ><span>' + ((item.value / total) * 100).toFixed(2) + "%" + '</span><b></b>' + item.name + '</li>';
            }
            optionList += '</ul>';
        }
        else {
            optionList += '<ul>';
            for (var _a = 0, data_2 = data; _a < data_2.length; _a++) {
                var item = data_2[_a];
                optionList += '<li ><span>' + item.value + '</span><b></b>' + item.name + '</li>';
            }
            optionList += '</ul>';
        }
        $('#' + this.scopeID).find(".pieBar_pie_list").html(optionList);
    };
    PieBarComponent.prototype.styleChange = function (style) {
    };
    PieBarComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(PieBarComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    PieBarComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonPieCharts]"));
        // 绘制图表
        this.myChart.setOption(this.echartData);
        // 基于准备好的dom，初始化echarts实例
        this.myBarChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonBarCharts]"));
        // 绘制图表
        this.myBarChart.setOption(this.echartBarPieData);
        //绑定事件
        this.eventBindHtml();
    };
    //渲染弹框
    PieBarComponent.prototype.renderModal = function (json) {
        var html = '<div class="tableModal pieBarModal">' +
            '<div class="tableModalContent pieBarModalContent">' +
            '<div class="tableModalHeader clrfix">' +
            '<span class="fl">另存人群</span>' +
            '<span class="closeModal fr pieBarCancel">×</span>' +
            '</div>' +
            '<div class="tableModalBody clrfix">' +
            '<div name="crowdName" class="clrfix">' +
            '<div class="pieBar-30 fl">人群命名</div>' +
            '<div class="pieBar-70 fl">' +
            '<input type="text" placeholder="请输入人群名称" class="pieBarInput" pieBarSearch>' +
            '<div class="pieBarErrorTips" pieBarErrorTips></div> ' +
            '</div>' +
            '</div>' +
            '<div class="clrfix" name="date">' +
            '<div class="pieBar-30 fl">日期</div>' +
            '<div class="pieBar-70 fl" pieBarDate></div>' +
            '</div>' +
            '<div name="brand" class="clrfix">' +
            '<div class="pieBar-30 fl">品牌</div>' +
            '<div class="pieBar-70 fl" pieBarBrand></div>' +
            '</div>' +
            '<div class="clrfix" name="qudao">' +
            '<div class="pieBar-30 fl">渠道</div>' +
            '<div class="pieBar-70 fl" pieBarChannel></div>' +
            '</div>' +
            '<div name="" class="clrfix">' +
            '<div class="pieBar-30 fl">筛选</div>' +
            '<div class="pieBar-70 fl" pieBarCheckRadio>  ' +
            '<div class="pieBar-list-data clrfix" pieBarListData>' +
            '<ul></ul>' +
            '</div>' +
            '<div class="pieBarErrorTips" pieBarListErrorTips></div> ' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="tableModalFooter clrfix">' +
            '<button type="button" class="confirm fr pieBarConfirm">确认</button>' +
            '<button type="button" class="cancel fr pieBarCancel">取消</button>' +
            '</div>' +
            '</div> ' +
            '</div>';
        return html;
    };
    PieBarComponent.prototype.renderListHtml = function () {
        if (this.barPieListData.length > 0) {
            var optionList = "";
            for (var _i = 0, _a = this.barPieListData; _i < _a.length; _i++) {
                var item = _a[_i];
                optionList += '<li data-value="' + item.value + '">' + item.name + '</li>';
            }
            $(document.body).find("div[pieBarListData] ul").html(optionList);
        }
        else {
            var optionP = "<p style='line-height: 30px'>暂无数据</p>";
            $(document.body).find("div[pieBarListData] ul").html(optionP);
        }
    };
    //取过滤器的值放入html里
    PieBarComponent.prototype.getFilterData = function ($componentBody) {
        var chart = this.mergeFilterObj['chart'];
        for (var key in chart) {
            switch (key) {
                case "date":
                    $componentBody.find('div[pieBarDate]').html(chart[key]);
                    break;
                case "yearMonth":
                    //日期
                    this.pieBaryearMonth = chart[key];
                    break;
                case "brand":
                    if (chart[key] == "all") {
                        //品牌
                        this.pieBarbrand = "全部品牌";
                    }
                    else {
                        this.pieBarbrand = chart[key];
                    }
                    $componentBody.find('div[pieBarBrand]').html(this.pieBarbrand);
                    break;
                case "channel":
                    if (chart[key] == "all") {
                        //渠道
                        this.pieBarchannel = "全部渠道";
                    }
                    else {
                        this.pieBarchannel = chart[key];
                    }
                    $componentBody.find('div[pieBarChannel]').html(this.pieBarchannel);
                    break;
            }
        }
    };
    ;
    //绑定事件
    PieBarComponent.prototype.eventBindHtml = function () {
        var _self = this;
        $(document).ready(function () {
            var $componentBody = $(document.body);
            //另存人群
            $('#' + _self.scopeID).find('.pieBar_saveCrowdBtn').click(function (event) {
                $('.modal-backdrop-report-form').remove();
                //渲染弹框
                var modal = _self.renderModal('');
                $componentBody.append(modal);
                _self.crowdName = null;
                $('.pieBarModal').show();
                //根据DATA返回的数据渲染list
                _self.renderListHtml();
                //取过滤器的值放入html里
                _self.getFilterData($componentBody);
                $(document.body).append("<div class='modal-backdrop modal-backdrop-report-form'></div>");
                event.stopPropagation();
            });
            //输入人群命名
            $componentBody.on('keyup', 'input[pieBarSearch]', function (event) {
                var keyUpText = $(event.target).val().trim();
                if (keyUpText.length <= 0) {
                    $componentBody.find("input[pieBarSearch]").addClass("pieBarErrorBorder");
                    $componentBody.find("div[pieBarErrorTips]").text("人群名称不能为空");
                }
                else {
                    $componentBody.find("input[pieBarSearch]").removeClass("pieBarErrorBorder");
                    $componentBody.find("div[pieBarErrorTips]").text("");
                }
                _self.crowdName = keyUpText;
                event.stopPropagation();
            });
            //选择筛选条件
            $componentBody.on('click', 'div[pieBarListData]', function (event) {
                var $target = $(event.target);
                if (!$target.hasClass("pieBarChoose")) {
                    $target.addClass("pieBarChoose");
                    _self.pieBarfilter.push($target.text());
                    _self.pieBarTotal += parseInt($target.attr('data-value'));
                }
                else {
                    $target.removeClass("pieBarChoose");
                    //从数组里删除
                    _self.removePieBarFilterArray($target.text());
                    _self.pieBarTotal -= parseInt($target.attr('data-value'));
                }
                if (_self.pieBarfilter.length > 0) {
                    $componentBody.find("div[pieBarListErrorTips]").text("");
                }
                event.stopPropagation();
            });
            //确认
            $componentBody.on('click', '.pieBarConfirm', function (event) {
                if (!_self.crowdName) {
                    $componentBody.find("input[pieBarSearch]").addClass("pieBarErrorBorder");
                    $componentBody.find("div[pieBarErrorTips]").text("人群名称不能为空");
                }
                else if (_self.barPieListData.length <= 0) {
                    $componentBody.find("div[pieBarListErrorTips]").text("筛选值暂无数据，无法另存为人群");
                }
                else if (_self.pieBarfilter.length <= 0) {
                    $componentBody.find("div[pieBarListErrorTips]").text("请至少选择一个筛选值，否则无法另存为人群");
                }
                else if (_self.pieBarTotal <= 0) {
                    $componentBody.find("div[pieBarListErrorTips]").text("客户数量为0，无法另存为人群");
                }
                else {
                    var saveBrandValue = "", saveChannelValue = "";
                    if (_self.pieBarbrand == "全部品牌") {
                        saveBrandValue = "ALL";
                    }
                    else {
                        saveBrandValue = _self.pieBarbrand;
                    }
                    if (_self.pieBarchannel == "全部渠道") {
                        saveChannelValue = "ALL";
                    }
                    else {
                        saveChannelValue = _self.pieBarchannel;
                    }
                    //发送请求
                    var buildQueryObj = Object.assign(_self.transformInput('crowdName', _self.crowdName), //人群名称
                    _self.transformInput('yearMonth', _self.pieBaryearMonth), //日期
                    _self.transformInput('brand', saveBrandValue), //品牌
                    _self.transformInput('channel', saveChannelValue), //渠道
                    _self.transformInput('filterV', _self.decidepieBarMap().toString()) //过滤条件
                    );
                    $.ajax({
                        //开发地址
                        url: path_1.PATHJSON.urlHostRFM + '/dmp-web/crowd/crowds/saveRFCrowd',
                        dataType: 'JSON',
                        contentType: 'application/json',
                        type: 'POST',
                        data: JSON.stringify(buildQueryObj),
                        success: function (data) {
                            $('.modal-backdrop-report-form').remove();
                            $('.pieBarModal').remove();
                        },
                        error: function (data) {
                            var msg = data.responseJSON.msg;
                            $componentBody.find("input[pieBarSearch]").addClass("pieBarErrorBorder");
                            $componentBody.find("div[pieBarErrorTips]").text(msg);
                        }
                    });
                }
                event.stopPropagation();
            });
            //取消
            $componentBody.on('click', '.pieBarCancel', function (event) {
                $('.modal-backdrop-report-form').remove();
                $('.pieBarModal').remove();
                event.stopPropagation();
            });
        });
    };
    PieBarComponent.prototype.decidepieBarMap = function () {
        var pieBarKeyMap = [];
        if (this.pieBarfilter.length > 0) {
            for (var key in this.pieBarMap) {
                for (var i = 0; i < this.pieBarfilter.length; i++) {
                    if (key == this.pieBarfilter[i]) {
                        pieBarKeyMap.push(this.pieBarMap[key]);
                    }
                }
            }
        }
        return pieBarKeyMap;
    };
    PieBarComponent.prototype.removePieBarFilterArray = function ($target) {
        if (this.pieBarfilter.length > 0) {
            for (var i = (this.pieBarfilter.length) - 1; i >= 0; i--) {
                if (this.pieBarfilter[i] == $target) {
                    this.pieBarfilter.splice(i, 1);
                }
            }
        }
    };
    PieBarComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    return PieBarComponent;
}(base_component_1.BaseComponent));
exports.PieBarComponent = PieBarComponent;
//# sourceMappingURL=PieBar.component.js.map