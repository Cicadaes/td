"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
import { HiveDataSourceComponents } from "./../../../../../../../data-cloud-report/ui/src/app/components/factory/pipeline/datain/diconfig/dynamic-operator/dynamic-operator-component/mixin-operator/data-source/hive-data-source/hive-data-source-component";
 * Created by zhaoxue on 2017/3/28.
 */
var base_component_1 = require("../base.component");
var rectFunnel_template_1 = require("./rectFunnel.template");
var rectFunnel_model_1 = require("./rectFunnel.model");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var RectFunnelComponent = (function (_super) {
    __extends(RectFunnelComponent, _super);
    function RectFunnelComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.funnelData = null;
        _this.echartData = null;
        _this.body = null;
        var template = new rectFunnel_template_1.RectFunnelTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.funnelData = new rectFunnel_model_1.RectFunnelModel();
        return _this;
    }
    RectFunnelComponent.prototype.beforeShow = function () {
    };
    RectFunnelComponent.prototype.afterShow = function () {
        this.init();
    };
    RectFunnelComponent.prototype.beforeDestory = function () {
    };
    RectFunnelComponent.prototype.afterDestory = function () {
    };
    RectFunnelComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    RectFunnelComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.body = this.buildbody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    RectFunnelComponent.prototype.dataChange = function (data) {
        if (data && data.length > 0) {
            this.chartData = data;
            this.echartData = [data[0]];
            $('#' + this.scopeID).find('.noData').hide();
            //渲染图表
            if (data.length > 1) {
                this.echartData = [this.chartData[0], this.chartData[0]];
                $('.compareButton', '#' + this.scopeID).removeClass('close').addClass('open');
                $('.compareButton', '#' + this.scopeID).find('span').css('float', 'right');
                $('.selectBox', '#' + this.scopeID).css('visibility', 'visible');
                //渲染对比漏斗图
                this.echartData = [this.chartData[0], this.chartData[0]];
            }
            //渲染下拉框
            this.renderSelectLine(this.chartData);
            //渲染图表
            this.renderRectFunnel(this.echartData);
            //绑定事件
            this.eventBindHtml();
        }
        else {
            $('#' + this.scopeID).find('.noData').show();
            $('#' + this.scopeID).find('.rectFunnelBox').hide();
            $('#' + this.scopeID).find('.rectFunnelLegend').hide();
        }
    };
    //buildbody
    RectFunnelComponent.prototype.buildbody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "rectFunnel";
        return this.body;
    };
    RectFunnelComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    RectFunnelComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    RectFunnelComponent.prototype.styleChange = function (style) {
    };
    RectFunnelComponent.prototype.loadData = function () {
    };
    Object.defineProperty(RectFunnelComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    //渲染图表
    RectFunnelComponent.prototype.renderRectFunnel = function (data) {
        var $rectFunnelBox = $('.rectFunnelBox', '#' + this.scopeID);
        var $rectFunnelLegend = $('.rectFunnelLegend', '#' + this.scopeID);
        //清空图表
        $rectFunnelBox.empty();
        $rectFunnelLegend.empty();
        if (data.length > 1) {
            $rectFunnelBox.addClass('compareFunnel');
        }
        else {
            $rectFunnelBox.removeClass('compareFunnel');
        }
        var seriesData = [];
        for (var n = 0; n < data.length; n++) {
            //渲染漏斗图
            var rectFunnelHtml = '<ul>';
            var legendHtml = '';
            seriesData = [];
            for (var key in data[n]) {
                if (key != 'project_name') {
                    rectFunnelHtml += '<li><span>' + key + '  ' + data[n][key] + '</span></li>';
                    legendHtml += '<li><span class="legend"></span><span>' + key + '</span></li>';
                    seriesData.push(data[n][key]);
                }
            }
            rectFunnelHtml += '</ul>';
            //插入对应的dom
            $rectFunnelBox.append(rectFunnelHtml);
            if (n == (data.length - 1))
                $rectFunnelLegend.append(legendHtml);
            //设置样式
            for (var i = 0; i < seriesData.length; i++) {
                var width = '';
                var color = this.funnelData.color[i];
                width = seriesData[i] / seriesData[0] * 100 + '%';
                if ((seriesData[i] / seriesData[0] * 100) < 21) {
                    if ((seriesData[i] / seriesData[0] * 100) < 0) {
                        width = 31 + seriesData[i] / seriesData[0] * 1000 + '%';
                    }
                    if ((seriesData[i] / seriesData[0] * 1000) < 0) {
                        width = 31 + seriesData[i] / seriesData[0] * 10000 + '%';
                    }
                    if ((seriesData[i] / seriesData[0] * 10000) < 0) {
                        width = 31 + seriesData[i] / seriesData[0] * 100000 + '%';
                    }
                    if ((seriesData[i] / seriesData[0] * 100000) < 0) {
                        width = 31 + seriesData[i] / seriesData[0] * 1000000 + '%';
                    }
                    if ((seriesData[i] / seriesData[0] * 100) > 0) {
                        width = 31 + seriesData[i] / seriesData[0] * 100 + '%';
                    }
                }
                else if ((seriesData[i] / seriesData[0] * 100) < 41) {
                    width = 20 + seriesData[i] / seriesData[0] * 100 + '%';
                }
                $('ul', $rectFunnelBox).eq(n).find('li span').eq(i).css({ 'width': width, 'background': color });
                $rectFunnelLegend.find('.legend').eq(i).css({ 'background': color });
            }
        }
    };
    //渲染下拉框
    RectFunnelComponent.prototype.renderSelectLine = function (data) {
        var $chartSelectlineList = $('.chart-selectline-list', '#' + this.scopeID);
        var selectHtml = '';
        for (var i = 0; i < data.length; i++) {
            selectHtml += '<li>' + data[i]['project_name'] + '</li>';
        }
        $('.chart-selectline-title', '#' + this.scopeID).html(data[0]['project_name']);
        //分别添加到对应的下拉框盒子
        for (var j = 0; j < $chartSelectlineList.length; j++) {
            $chartSelectlineList.eq(j).empty();
            $chartSelectlineList.eq(j).append(selectHtml);
        }
    };
    RectFunnelComponent.prototype.init = function () {
    };
    RectFunnelComponent.prototype.eventBindHtml = function () {
        var that = this;
        $('.compareButton', '#' + that.scopeID).off('click');
        $('.chart-selectline-title', '#' + that.scopeID).off('click');
        $('.chart-selectline-list', '#' + that.scopeID).off('click');
        $('.funnelHelp', '#' + that.scopeID).off('click');
        //切换对比按钮
        $('.compareButton', '#' + that.scopeID).on('click', function (e) {
            if ($(this).hasClass('close')) {
                $(this).removeClass('close').addClass('open');
                $(this).find('span').css('float', 'right');
                $('.selectBox', '#' + that.scopeID).css('visibility', 'visible');
                //渲染对比漏斗图
                that.echartData = [that.chartData[0], that.chartData[0]];
                // 修改对比项目名称
                $('.chart-selectline').find('.chart-selectline-title').html(that.chartData[0]["project_name"]);
                that.renderRectFunnel(that.echartData);
            }
            else {
                $(this).removeClass('open').addClass('close');
                $(this).find('span').css('float', 'left');
                $('.selectBox', '#' + that.scopeID).css('visibility', 'hidden');
                //渲染单个漏斗图
                that.echartData = [that.chartData[0]];
                that.renderRectFunnel(that.echartData);
            }
            e.stopPropagation();
        });
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
            var type = Number($target.parents('.chart-selectline-list').attr('type'));
            $target.parents('.chart-selectline').find('.chart-selectline-title').html($target.html());
            //重新获取数据
            for (var i = 0; i < that.chartData.length; i++) {
                if ($target.html() == that.chartData[i]['project_name']) {
                    that.echartData[type] = that.chartData[i];
                    break;
                }
            }
            //重新渲染漏斗图
            that.renderRectFunnel(that.echartData);
        });
        //点击帮助
        $('.funnelHelp', '#' + that.scopeID).on('click', function (e) {
            e.stopPropagation();
        });
    };
    return RectFunnelComponent;
}(base_component_1.BaseComponent));
exports.RectFunnelComponent = RectFunnelComponent;
//# sourceMappingURL=rectFunnel.component.js.map