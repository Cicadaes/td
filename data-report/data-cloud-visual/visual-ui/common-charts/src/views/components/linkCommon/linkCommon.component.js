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
var linkCommon_template_1 = require("./linkCommon.template");
var linkCommon_model_1 = require("./linkCommon.model");
var $ = require("jquery");
var LinkCommonComponent = (function (_super) {
    __extends(LinkCommonComponent, _super);
    function LinkCommonComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.linkCommonData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.eqType = null;
        _this.filterScopeIDObj = null;
        _this.filterListArray = [];
        _this.filterChooseObj = {};
        var template = new linkCommon_template_1.LinkCommonTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.linkCommonData = new linkCommon_model_1.LinkCommonModel();
        return _this;
    }
    LinkCommonComponent.prototype.beforeShow = function () {
    };
    LinkCommonComponent.prototype.afterShow = function () {
        this.init();
    };
    LinkCommonComponent.prototype.beforeDestory = function () {
    };
    LinkCommonComponent.prototype.afterDestory = function () {
    };
    LinkCommonComponent.prototype.resize = function () {
    };
    LinkCommonComponent.prototype.getconfiginformation = function (event, changeObj) {
    };
    LinkCommonComponent.prototype.filterChange = function (event, data) {
    };
    LinkCommonComponent.prototype.dataChange = function (data) {
    };
    LinkCommonComponent.prototype.styleChange = function (style) {
        for (var key in style) {
            switch (key) {
                case 'linkcommon_title_name':
                    $('#' + this.scopeID).find('a[conponentLinkCommon]').html(style[key]);
                    break;
                case 'linkcommon_title_href':
                    $('#' + this.scopeID).find('a[conponentLinkCommon]').attr('href', style[key]);
                    break;
            }
        }
    };
    LinkCommonComponent.prototype.loadData = function () {
    };
    Object.defineProperty(LinkCommonComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    LinkCommonComponent.prototype.init = function () {
        //commonchange
        this.commonChange();
    };
    LinkCommonComponent.prototype.commonChange = function () {
        var _self = this;
        $('#' + this.scopeID).find('div[conponentLinkCommon]').click(function (event) {
        });
    };
    return LinkCommonComponent;
}(base_component_1.BaseComponent));
exports.LinkCommonComponent = LinkCommonComponent;
//# sourceMappingURL=linkCommon.component.js.map