"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by tommy on 2017/10/16.
 */
var base_component_1 = require("../base.component");
var storeHeatmap_template_1 = require("./storeHeatmap.template");
var base_chart_1 = require("../../base/base.chart");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var $ = require("jquery");
var StoreHeatmapComponent = (function (_super) {
    __extends(StoreHeatmapComponent, _super);
    function StoreHeatmapComponent() {
        var _this = _super.call(this) || this;
        _this.bmap = null;
        _this.chartData = null;
        _this.lineData = null;
        _this.echartData = null;
        _this.BMap = null;
        _this.getSoreceData = null;
        _this.styleObj = null;
        _this.setchangeObj = null;
        _this.body = {
            'dimensions': null,
            'metrics': null,
            'filters': null
        };
        _this.h337 = null;
        _this.heatmapInstance = null;
        _this.res_data = [{ "x": 64, "y": 34 }];
        _this.bg_width = null;
        _this.bg_height = null;
        _this.bg_zoom = null;
        var template = new storeHeatmap_template_1.StoreHeatmapTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.lineData = {};
        _this.echartData = {};
        if (base_chart_1.BaseCharts.h337) {
            _this.h337 = base_chart_1.BaseCharts.h337;
        }
        return _this;
    }
    StoreHeatmapComponent.prototype.beforeShow = function () {
    };
    StoreHeatmapComponent.prototype.afterShow = function () {
        this.init();
    };
    StoreHeatmapComponent.prototype.beforeDestory = function () {
    };
    StoreHeatmapComponent.prototype.afterDestory = function () {
    };
    StoreHeatmapComponent.prototype.resize = function () {
        //if (this.myChart) this.myChart.resize();
    };
    StoreHeatmapComponent.prototype.setHtmlObj = function (changeObj) {
    };
    StoreHeatmapComponent.prototype.getconfiginformation = function (event, changeObj) {
        var per = 0.575;
        var originHeight = 736;
        var originWidth = 1280;
        var dom = $('#' + this.scopeID);
        this.bg_width = dom.width();
        this.bg_height = this.bg_width * per;
        this.bg_zoom = this.bg_width / originWidth;
        //0.575 = 736 / 1280;
        $('#map-canvas').width(this.bg_width);
        $('#map-canvas').height(this.bg_height);
        //height:660px; width:1147px;
        var dataLengthNew = 0;
        if (this.bg_height > originHeight) {
            //增加高度
            this.sendMessage({
                "op": "plus",
                "value": (this.bg_height - originHeight),
            });
        }
        else if (this.bg_height < originHeight) {
            //减少高度
            this.sendMessage({
                "op": "minus",
                "value": (originHeight - this.bg_height),
            });
        }
        this.heatmapInstance = this.h337.create({
            container: document.getElementById('map-canvas')
        });
        this.setchangeObj = changeObj.result;
        this.setHtmlObj(changeObj.result);
        this.buildBody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
        this.draw(this.res_data);
    };
    StoreHeatmapComponent.prototype.draw = function (res_data) {
        var points = [];
        for (var i = 0; i < res_data.length; i++) {
            var obj = res_data[i];
            if (obj.x < 0 || obj.y < 0) {
                continue;
            }
            points.push({
                x: obj.x * this.bg_zoom * 50,
                y: this.bg_height - obj.y * this.bg_zoom * 50,
                value: 3
            });
        }
        var data = {
            max: 10,
            data: points
        };
        this.heatmapInstance.setData(data);
    };
    StoreHeatmapComponent.prototype.buildBody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "storeHeatmap";
    };
    StoreHeatmapComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
        if (data.filter) {
            for (var i = 0; i < data.filter.length; i++) {
                var obj = data.filter[i];
                if (obj.field == 'project_id') {
                    $.ajax({
                        url: '/wreport_new/api/projectPlaces/selectSingle?projectId=' + obj.value,
                        dataType: 'JSON',
                        contentType: 'application/json',
                        type: 'get',
                        success: function (data) {
                            if (data && data.picUrl) {
                                $("#backImg").attr('src', "/wreport_new/pic/" + data.picUrl);
                            }
                        },
                        error: function (data) {
                        },
                    });
                }
            }
        }
    };
    StoreHeatmapComponent.prototype.dataChange = function (data) {
        if (data && data.length > 0) {
            this.draw(data);
        }
        else {
            this.heatmapInstance.setData({
                data: []
            });
        }
    };
    StoreHeatmapComponent.prototype.styleChange = function (style) {
    };
    StoreHeatmapComponent.prototype.loadData = function () {
    };
    Object.defineProperty(StoreHeatmapComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    StoreHeatmapComponent.prototype.init = function () {
        this.renderTabHtml([{
                id: '1',
                name: '场地一'
            }, {
                id: '2',
                name: '场地二'
            }]);
        this.commonChange();
    };
    StoreHeatmapComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    StoreHeatmapComponent.prototype.sendMessage = function (changeObj) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', changeObj));
        _super.prototype.changeHeightBase.call(this, this, sendObj);
    };
    StoreHeatmapComponent.prototype.commonChange = function () {
        // let _self = this;
        //
        // $('#' + this.scopeID).find('div[commonChange]').click((event: any) => {
        //     $('#' + this.scopeID).find("div[commonSelectList]").show();
        // });
        //
        // $('#' + this.scopeID).find('div[commonSelectList]').click((event: any) => {
        //
        //     $('#' + this.scopeID).find("div[commonChange]").html(event.target.innerText);
        //
        //     //this.hour_type = event.target.dataset.id;
        //
        //     $('#' + this.scopeID).find("div[commonSelectList]").hide();
        // })
    };
    //渲染html
    StoreHeatmapComponent.prototype.renderTabHtml = function (data) {
        var optionList = "";
        optionList += '<ul>';
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var item = data_1[_i];
            optionList += '<li data-id=' + item.id + '>' + item.name + '</li>';
        }
        optionList += '</ul>';
        //把第0项放入已选择框里
        $('#' + this.scopeID).find("div[commonChange]").html(data[0].name);
        $('#' + this.scopeID).find("div[commonSelectList]").html(optionList);
    };
    return StoreHeatmapComponent;
}(base_component_1.BaseComponent));
exports.StoreHeatmapComponent = StoreHeatmapComponent;
//# sourceMappingURL=storeHeatmap.component.js.map