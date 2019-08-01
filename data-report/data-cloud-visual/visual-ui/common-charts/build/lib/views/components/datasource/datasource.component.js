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
var datasource_template_1 = require("./datasource.template");
var datasource_model_1 = require("./datasource.model");
var $ = require("jquery");
var DatasourceComponent = (function (_super) {
    __extends(DatasourceComponent, _super);
    function DatasourceComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.datasourceData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.styleObj = null;
        var template = new datasource_template_1.DatasourceTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.datasourceData = new datasource_model_1.DatasourceModel();
        return _this;
    }
    DatasourceComponent.prototype.beforeShow = function () {
    };
    DatasourceComponent.prototype.afterShow = function () {
        this.init();
    };
    DatasourceComponent.prototype.beforeDestory = function () {
    };
    DatasourceComponent.prototype.afterDestory = function () {
    };
    DatasourceComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    DatasourceComponent.prototype.getconfiginformation = function (event, changeObj) {
        $('#' + this.scopeID).find('div[commonChange]').html("testName");
        if (changeObj.result) {
            $('#' + this.scopeID).find('textarea[commonConfigBody]').val(JSON.stringify(changeObj.result));
        }
    };
    DatasourceComponent.prototype.dataChange = function (data) {
        $('#' + this.scopeID).find('textarea[commonConfigData]').val(JSON.stringify(data));
    };
    DatasourceComponent.prototype.styleChange = function (style) {
    };
    DatasourceComponent.prototype.filterChange = function (event, data) {
        for (var key in data) {
            if (key == "filter") {
                this.postQuery['filters'] = [
                    { "field": "project_type", "operator": "=", "value": "1" },
                    { 'field': 'date', 'operator': '>=', 'value': data[key].start },
                    { 'field': 'date', 'operator': '<=', 'value': data[key].end },
                ];
            }
        }
        $('#' + this.scopeID).find('textarea[commonConfigBody]').val(JSON.stringify(this.postQuery));
        this.postChange(this.postQuery);
    };
    DatasourceComponent.prototype.loadData = function () {
    };
    Object.defineProperty(DatasourceComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    DatasourceComponent.prototype.init = function () {
        //commonchange
        console.log(6666);
        this.commonChange();
    };
    DatasourceComponent.prototype.commonChange = function () {
        var _self = this;
        $('#' + _self.scopeID).find('div[commonConfigButton]').click(function (event) {
            _self.postQuery = $('#' + _self.scopeID).find('textarea[commonConfigBody]').val();
            if (_self.postQuery !== "") {
                _self.postQuery = JSON.parse(_self.postQuery);
            }
            else {
                _self.postQuery = {};
            }
            _self.postChange(_self.postQuery);
        });
    };
    DatasourceComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    return DatasourceComponent;
}(base_component_1.BaseComponent));
exports.DatasourceComponent = DatasourceComponent;
//# sourceMappingURL=datasource.component.js.map