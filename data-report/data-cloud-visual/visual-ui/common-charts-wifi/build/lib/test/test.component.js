"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by wangshouyun on 2017/3/20.
 */
var base_component_1 = require("../base.component");
var test_template_1 = require("./test.template");
var TestComponent = (function (_super) {
    __extends(TestComponent, _super);
    function TestComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        var template = new test_template_1.TestTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        return _this;
    }
    TestComponent.prototype.afterShow = function () {
    };
    TestComponent.prototype.afterDestory = function () {
    };
    TestComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    TestComponent.prototype.dataChange = function (data) {
    };
    TestComponent.prototype.styleChange = function (style) {
    };
    TestComponent.prototype.loadData = function () {
        this.init();
    };
    TestComponent.prototype.getData = function () {
    };
    TestComponent.prototype.init = function () {
    };
    return TestComponent;
}(base_component_1.BaseComponent));
exports.TestComponent = TestComponent;
//# sourceMappingURL=test.component.js.map