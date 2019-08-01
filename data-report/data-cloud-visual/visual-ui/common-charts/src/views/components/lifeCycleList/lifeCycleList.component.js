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
var lifeCycleList_template_1 = require("./lifeCycleList.template");
var utils_1 = require("../../../../public/scripts/utils");
var lifeCycleList_model_1 = require("./lifeCycleList.model");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var path_1 = require("../../../../public/path/path");
var LifeCycleListComponent = (function (_super) {
    __extends(LifeCycleListComponent, _super);
    function LifeCycleListComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.lineData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.styleObj = null;
        _this.changeObj = null;
        _this.body = {};
        _this.filterScopeIDObj = null;
        _this.renderTitleBoolean = false;
        _this.saveFilterObj = {
            brand: "ALL",
            channel: "ALL",
            start: dataSourceConfig_1.DataSourceConfig.getValueFormatDate(30),
            end: dataSourceConfig_1.DataSourceConfig.getValueFormatDate(1)
        };
        var template = new lifeCycleList_template_1.LifeCycleListTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.lineData = new lifeCycleList_model_1.LifeCycleListModel();
        return _this;
    }
    LifeCycleListComponent.prototype.beforeShow = function () {
    };
    LifeCycleListComponent.prototype.afterShow = function () {
        this.init();
    };
    LifeCycleListComponent.prototype.beforeDestory = function () {
    };
    LifeCycleListComponent.prototype.afterDestory = function () {
    };
    LifeCycleListComponent.prototype.resize = function () {
    };
    LifeCycleListComponent.prototype.setBodyObj = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "LifeCycleList";
        return this.body;
    };
    LifeCycleListComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            this.filterScopeIDObj = changeObj.result;
            this.setBodyObj(changeObj.result);
        }
        else {
            return;
        }
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    LifeCycleListComponent.prototype.saveFilterChange = function (data) {
        if (data.filterDate) {
            this.saveFilterObj.start = data.filterDate.start;
            this.saveFilterObj.end = data.filterDate.end;
        }
        if (data.filter) {
            for (var _i = 0, _a = data.filter; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.field == "brand") {
                    this.saveFilterObj.brand = item.value;
                }
                if (item.field == "channel") {
                    this.saveFilterObj.channel = item.value;
                }
            }
        }
    };
    LifeCycleListComponent.prototype.filterChange = function (event, data) {
        this.saveFilterChange(data);
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.renderTitleBoolean = false;
        this.postChange(this.body);
    };
    LifeCycleListComponent.prototype.mergeFilterChange = function (event, target) {
        _super.prototype.onFilterChange.call(this, this, target);
    };
    LifeCycleListComponent.prototype.dataChange = function (data) {
        if (!this.renderTitleBoolean) {
            this.renderHtml(data);
        }
    };
    LifeCycleListComponent.prototype.styleChange = function (style) {
    };
    LifeCycleListComponent.prototype.loadData = function () {
    };
    Object.defineProperty(LifeCycleListComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    LifeCycleListComponent.prototype.init = function () {
        this.renderlist();
    };
    LifeCycleListComponent.prototype.renderlist = function () {
        var option = "<dl>\n                    <dt><h3>注册期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"1\"><h4>停留注册期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li><h4>注册浅度访客</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li><h4>注册深度访客</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"2\" class=\"lifeCycleList_one\"><h4>新客户期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"5\" class=\"lifeCycleList_two\"><h4>休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"6\" class=\"lifeCycleList_three\"><h4>流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl>\n                    <dt><h3>新客户期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"2\"><h4>停留新客户期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"3\" class=\"lifeCycleList_one\"><h4>成长期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"5\" class=\"lifeCycleList_two\"><h4>休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"6\" class=\"lifeCycleList_three\"><h4>流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl>\n                    <dt><h3>成长期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"3\"><h4>停留成长期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"4\" class=\"lifeCycleList_one\"><h4>稳定期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"5\" class=\"lifeCycleList_two\"><h4>休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"6\" class=\"lifeCycleList_three\"><h4>流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl>\n                    <dt><h3>稳定期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"4\"><h4>停留稳定期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"5\" class=\"lifeCycleList_two\"><h4>休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"6\" class=\"lifeCycleList_three\"><h4>流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl  class=\"lifeCycleList_xmq\">\n                    <dt><h3>休眠期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"5\"><h4>停留休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li><h4>休眠浅度访客</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li><h4>休眠深度访客</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"2\" class=\"lifeCycleList_one\"><h4>新客户期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"3\" class=\"lifeCycleList_two\"><h4>成长期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"4\" class=\"lifeCycleList_three\"><h4>稳定期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"6\" class=\"lifeCycleList_four\"><h4>流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"7\" class=\"lifeCycleList_five\"><h4>召回期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl class=\"lifeCycleList_lsq\">\n                    <dt><h3>流失期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"6\"><h4>停留流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"2\" class=\"lifeCycleList_one\"><h4>新客户期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"3\" class=\"lifeCycleList_two\"><h4>成长期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"4\" class=\"lifeCycleList_three\"><h4>稳定期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"7\" class=\"lifeCycleList_four\"><h4>召回期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl>\n                    <dt><h3>召回期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"7\"><h4>停留召回期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"3\" class=\"lifeCycleList_two\"><h4>成长期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"5\" class=\"lifeCycleList_three\"><h4>休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>";
        $('#' + this.scopeID).find("div[commonLifeCycleList]").html(option);
    };
    LifeCycleListComponent.prototype.renderHtml = function (data) {
        var $dl = $('#' + this.scopeID).find("div[commonLifeCycleList] dl");
        if (data.length > 0) {
            for (var i = 0; i < $dl.length; i++) {
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var item = data_1[_i];
                    if ((i + 1) == parseInt(item.name)) {
                        $($dl[i]).find('dt h4').text(utils_1.Utils.parseFormatNum(item.value, 0));
                        $($dl[i]).find('dt span em').text(item.value_占比);
                        this.getListData(item.name, item.value);
                    }
                }
            }
            this.renderTitleBoolean = true;
        }
        else {
            this.renderlist();
            this.renderTitleBoolean = false;
        }
    };
    LifeCycleListComponent.prototype.getListData = function (cycle, value) {
        var _self = this;
        //发送请求
        $.ajax({
            //开发地址
            url: path_1.PATHJSON.urlHostLifeCycleList + '/dmp-web/modeLifeCycle/portrait' + "?brand=" + _self.saveFilterObj.brand + "&channel=" + _self.saveFilterObj.channel + "&calculatedDateBegin=" + _self.saveFilterObj.start + "&calculatedDateEnd=" + _self.saveFilterObj.end + "&cycle=" + cycle,
            type: 'GET',
            success: function (data) {
                _self.renderListHtml(JSON.parse(data), cycle, value);
            },
            error: function (data) {
                // data = [{"cycle":"1","value":2000}];
                // console.log("22222",cycle,value)
            }
        });
    };
    LifeCycleListComponent.prototype.renderListHtml = function (data, cycle, value) {
        var $dl = $('#' + this.scopeID).find("div[commonLifeCycleList] dl");
        for (var i = 0; i < $dl.length; i++) {
            if (data.length > 0) {
                for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                    var item = data_2[_i];
                    if ((i + 1) == cycle) {
                        var $li = $($dl[i]).find('ul li');
                        for (var k = 0; k < $li.length; k++) {
                            var $litype = $($li[k]).attr("data-type");
                            if (item.cycle == $litype) {
                                $($li[k]).find('p b').text(utils_1.Utils.parseFormatNum(item.value, 0));
                                $($li[k]).find('p span em').text((parseInt(item.value) / parseInt(value) * 100).toFixed(2));
                            }
                        }
                    }
                }
            }
            else {
                if ((i + 1) == cycle) {
                    var $li = $($dl[i]).find('ul li');
                    for (var k = 0; k < $li.length; k++) {
                        $($li[k]).find('p b').text("--");
                        $($li[k]).find('p span em').text(0);
                    }
                }
            }
        }
    };
    LifeCycleListComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    return LifeCycleListComponent;
}(base_component_1.BaseComponent));
exports.LifeCycleListComponent = LifeCycleListComponent;
//# sourceMappingURL=lifeCycleList.component.js.map