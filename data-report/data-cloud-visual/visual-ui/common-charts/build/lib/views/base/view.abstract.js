"use strict";
var emitter_event_1 = require("../../events/emitter.event");
var type_event_1 = require("../../events/type.event");
/**
 * Created by wangshouyun on 2017/3/7.
 */
var AView = (function () {
    function AView() {
        this.getObject = false;
        this.datasource_id = null;
        this.itemObj = null;
        this.postQuery = null;
        this.mergeFilterObj = null;
        this.mergeDateObj = null;
        this.downloadBoolean = false;
    }
    AView.prototype.beforeShow = function () {
    };
    AView.prototype.afterShow = function () {
    };
    AView.prototype.beforeDestory = function () {
    };
    AView.prototype.afterDestory = function () {
    };
    AView.prototype.resize = function () {
    };
    AView.prototype.getconfiginformation = function (event, changeObj) {
    };
    AView.prototype.dataChange = function (data) {
    };
    AView.prototype.onChange = function (event, changeObj) {
        emitter_event_1.EventEmitter.trigger(type_event_1.EventType.COMONCHANGE, event, changeObj);
    };
    AView.prototype.changeHeightBase = function (event, msgObj) {
        emitter_event_1.EventEmitter.trigger(type_event_1.EventType.CHANGE_HEIGHT, msgObj);
    };
    AView.prototype.sendMessageBase = function (event, msgObj) {
        emitter_event_1.EventEmitter.trigger(type_event_1.EventType.SEND_MESSAGE, msgObj);
    };
    AView.prototype.onRender = function (event, type) {
        emitter_event_1.EventEmitter.trigger(type_event_1.EventType.COMONRENDER, event, type);
    };
    AView.prototype.onFilterChange = function (event, target) {
        emitter_event_1.EventEmitter.trigger(type_event_1.EventType.COMONFILTERCHANGE, event, target);
    };
    AView.prototype.styleChange = function (style) {
    };
    AView.prototype.loadData = function () {
    };
    AView.prototype.getData = function () {
        return null;
    };
    AView.prototype.transformInput = function (key, val) {
        var o = {};
        o[key] = val;
        return o;
    };
    AView.prototype.isEmptyObject = function (obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    };
    AView.prototype.filterChange = function (event, data) {
    };
    AView.prototype.mergeFilterChange = function (event, data) {
    };
    AView.prototype.overallFilterChange = function (event, data) {
    };
    AView.prototype.downloadData = function () {
    };
    return AView;
}());
exports.AView = AView;
//# sourceMappingURL=view.abstract.js.map