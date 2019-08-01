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
var part_template_1 = require("./part.template");
var $ = require("jquery");
var PartComponent = (function (_super) {
    __extends(PartComponent, _super);
    function PartComponent() {
        var _this = _super.call(this) || this;
        _this.chartData = null;
        _this.container = null;
        _this.oldValue = '';
        _this.settingObjCode = '';
        _this.partData = [
            {
                name: "销售金额",
                metric: "231,333",
                date: "6.15-6.21",
            },
            {
                name: "订单数",
                metric: "231,333",
                date: "6.15-6.21",
            },
            {
                name: "客单价",
                metric: "231,333",
                date: "6.15-6.21",
            },
            {
                name: "入店客流",
                metric: "231,333",
                date: "6.15-6.21",
            },
            {
                name: "转化率",
                metric: "231,333",
                date: "6.15-6.21",
            },
            {
                name: "VPC",
                metric: "231,333",
                date: "6.15-6.21",
            },
            {
                name: "IPC",
                metric: "231,333",
                date: "6.15-6.21",
            }
        ];
        var template = new part_template_1.PartTemplate('aw6knmndkx24zdrz', PartComponent);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        return _this;
    }
    PartComponent.prototype.beforeShow = function () {
    };
    PartComponent.prototype.afterShow = function () {
    };
    PartComponent.prototype.beforeDestory = function () {
    };
    PartComponent.prototype.afterDestory = function () {
    };
    PartComponent.prototype.resize = function () {
    };
    PartComponent.prototype.settingChange = function (event, target) {
        console.log(target);
        this.getSettingObjChange(target.settingObj);
    };
    PartComponent.prototype.getSettingObjChange = function (settingObj) {
        //把第0项放入已选择框里
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, settingObj.code, settingObj.result), _super.prototype.transformInput.call(this, 'oldValue', this.oldValue));
        _super.prototype.onChange.call(this, this, sendObj);
        console.log(this.partData);
        this.init();
    };
    PartComponent.prototype.dataChange = function (data) {
        data = this.partData;
    };
    PartComponent.prototype.styleChange = function (style) {
    };
    PartComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(PartComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    PartComponent.prototype.init = function () {
        var partContent = '<div class="child">' +
            '<div class="child_list"><span><a>' + this.partData[0].name + '</a></span><span><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b></span></div>' +
            '</div>' + '<div class="child">' +
            '<div class="child_list"><span><a>' + this.partData[0].name + '</a></span><span><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b></span></div>' +
            '<div class="child_list"><span><a>' + this.partData[0].name + '</a></span><span><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b></span></div>' +
            '</div>' + '<div class="child">' +
            '<div class="child_list"><span><a>' + this.partData[0].name + '</a></span><span><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b></span></div>' +
            '<div class="child_list"><span><a>' + this.partData[0].name + '</a></span><span><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b></span></div>' +
            '<div class="child_list"><span><a>' + this.partData[0].name + '</a></span><span><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b></span></div>' +
            '<div class="child_list"><span><a>' + this.partData[0].name + '</a></span><span><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b><b>' + this.partData[0].metric + '<em>' + this.partData[0].date + '</em></b></span></div>' +
            '</div>';
        $(".tree").html(partContent);
    };
    return PartComponent;
}(base_component_1.BaseComponent));
exports.PartComponent = PartComponent;
//# sourceMappingURL=part.component.js.map