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
var indexPriview_template_1 = require("./indexPriview.template");
var $ = require("jquery");
var IndexPriviewComponent = (function (_super) {
    __extends(IndexPriviewComponent, _super);
    function IndexPriviewComponent() {
        var _this = _super.call(this) || this;
        _this.chartData = null;
        _this.container = null;
        _this.Data = null;
        var template = new indexPriview_template_1.IndexPriviewTemplate(_this.scopeID);
        _this.element = _this.render(template);
        return _this;
    }
    IndexPriviewComponent.prototype.beforeShow = function () {
    };
    IndexPriviewComponent.prototype.afterShow = function () {
    };
    IndexPriviewComponent.prototype.beforeDestory = function () {
    };
    IndexPriviewComponent.prototype.afterDestory = function () {
    };
    IndexPriviewComponent.prototype.resize = function () {
    };
    IndexPriviewComponent.prototype.settingChange = function (event, target) {
        _super.prototype.onChange.call(this, this, {});
        this.initHtml();
    };
    IndexPriviewComponent.prototype.dataChange = function (data) {
        this.Data = data;
    };
    IndexPriviewComponent.prototype.styleChange = function (style) {
    };
    IndexPriviewComponent.prototype.loadData = function () {
    };
    Object.defineProperty(IndexPriviewComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    IndexPriviewComponent.prototype.initHtml = function () {
        var html = "";
        var arr = [];
        for (var key in this.Data) {
            var brandHtml = "";
            for (var i = 0; i < this.Data[key].brand.length; i++) {
                if (this.Data[key].brand[i].active_hour_users && this.Data[key].brand[i].percentage) {
                    brandHtml += '<li><b>' + this.Data[key].brand[i].brand + '</b><span>' + this.Data[key].brand[i].active_hour_users + '</span><strong>' + this.Data[key].brand[i].percentage + '</strong></li>';
                }
                else {
                    if (this.Data[key].brand[i].percentage) {
                        brandHtml += '<li><b>' + this.Data[key].brand[i].brand + '</b><strong>' + this.Data[key].brand[i].percentage + '</strong></li>';
                    }
                    else {
                        brandHtml += '<li><b>' + this.Data[key].brand[i].brand + '</b><span>' + this.Data[key].brand[i].active_hour_users + '</span></li>';
                    }
                }
            }
            html += '<div class="indexPriview">' +
                '<p>' + key + '</p><ul class="data">' +
                '<li><b>' + this.Data[key].total.total + '</b><span>' + this.Data[key].total.time + '</span></li>' +
                '<li><b>' + this.Data[key].before.before_total + '</b><span>' + this.Data[key].before.before_time + '</span></li>' +
                '</ul><ul class="type">' + brandHtml + '</ul></div>';
            arr.push(key);
        }
        $('#' + this.scopeID).html(html);
        var len = arr.length;
        $(".indexPriview").css("width", (100 / len) + "%");
        console.log((100 / len) + "%");
    };
    return IndexPriviewComponent;
}(base_component_1.BaseComponent));
exports.IndexPriviewComponent = IndexPriviewComponent;
//# sourceMappingURL=indexPriview.component.js.map