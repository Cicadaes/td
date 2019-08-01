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
var upload_template_1 = require("./upload.template");
var upload_model_1 = require("./upload.model");
var UploadComponent = (function (_super) {
    __extends(UploadComponent, _super);
    function UploadComponent() {
        var _this = _super.call(this) || this;
        _this.myPrimeui = null;
        _this.chartData = null;
        _this.uploadData = null;
        _this.echartData = null;
        var template = new upload_template_1.UploadTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.uploadData = new upload_model_1.UploadModel();
        return _this;
    }
    UploadComponent.prototype.beforeShow = function () {
    };
    UploadComponent.prototype.afterShow = function () {
    };
    UploadComponent.prototype.beforeDestory = function () {
    };
    UploadComponent.prototype.afterDestory = function () {
    };
    UploadComponent.prototype.resize = function () {
    };
    UploadComponent.prototype.dataChange = function (data) {
        console.log(data, 1111);
    };
    UploadComponent.prototype.styleChange = function (style) {
    };
    UploadComponent.prototype.loadData = function () {
        this.init();
        console.log(this.uploadData, "uuuuuuuuuuuuuu");
    };
    Object.defineProperty(UploadComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    UploadComponent.prototype.init = function () {
    };
    return UploadComponent;
}(base_component_1.BaseComponent));
exports.UploadComponent = UploadComponent;
//# sourceMappingURL=upload.component.js.map