"use strict";
/**
 * Created by zhaoxue on 2017-09-11.
 */
var $ = require("jquery");
var emitter_event_1 = require("./events/emitter.event");
var type_event_1 = require("./events/type.event");
var path_1 = require("../public/path/path");
var EventBroker = (function () {
    function EventBroker() {
        this.stageData = null;
        this.stageDataArray = [];
        this.stageFilterComponent = [];
        this.targetTopLevelFilter = false;
        emitter_event_1.EventEmitter.register(type_event_1.EventType.COMONCHANGE, this.onChange, this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.COMONFILTERCHANGE, this.onFilterChange, this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.SEND_MESSAGE, this.sendMessage, this);
    }
    EventBroker.prototype.removeRegister = function () {
        this.stageFilterComponent = [];
        emitter_event_1.EventEmitter.restoreListeners();
        emitter_event_1.EventEmitter.register(type_event_1.EventType.COMONCHANGE, this.onChange, this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.COMONFILTERCHANGE, this.onFilterChange, this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.SEND_MESSAGE, this.sendMessage, this);
    };
    EventBroker.prototype.initData = function (data) {
        this.stageData = data.components;
    };
    //判断
    EventBroker.prototype.onChange = function (event, target, changeObj) {
        if (changeObj.scopeID == target.scopeID) {
            (function (self) {
                self.postSettingData(target, changeObj);
            })(this);
        }
    };
    //判断
    EventBroker.prototype.sendMessage = function (event, changeObj) {
        var filterObj = changeObj['filterObj'];
        for (var key in filterObj) {
            if (key == 'chartScopeID') {
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.FILTERCHANGE, {
                    scopeID: changeObj.scopeID,
                    result: changeObj.result,
                    chartScopeId: filterObj[key],
                    stageFilter: this.stageFilterComponent
                });
            }
            if (key == 'message') {
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.MESSAGE_CHANGE, {
                    target: filterObj[key],
                    result: changeObj.result
                });
            }
        }
    };
    //合并filter数据
    EventBroker.prototype.onFilterChange = function (event, chart, target) {
        var saveFilterArray = [], filterBool = false;
        //判断顶级的过滤器是否为true
        this.decideFilterBool();
        for (var _i = 0, _a = target.filterScopeIDObj.chartScopeID; _i < _a.length; _i++) {
            var j = _a[_i];
            if (j == chart.scopeID) {
                //设置时间
                chart.mergeDateObj = target.mergeDateObj;
                //设置过滤器
                if (target.mergeFilterObj !== null && target.mergeFilterObj['filter'] !== null) {
                    if (chart.mergeFilterObj == null || target.rfmChart) {
                        chart.mergeFilterObj = target.mergeFilterObj;
                    }
                    else {
                        for (var _b = 0, _c = chart.mergeFilterObj['filter']; _b < _c.length; _b++) {
                            var t = _c[_b];
                            for (var _d = 0, _e = target.mergeFilterObj['filter']; _d < _e.length; _d++) {
                                var p = _e[_d];
                                if (t.field == p.field && t.value !== p.value) {
                                    t.value = p.value;
                                }
                                saveFilterArray.push(p);
                            }
                        }
                        filterBool = true;
                    }
                }
            }
        }
        if (filterBool) {
            chart.mergeFilterObj['filter'] = this.compareFilterArray(saveFilterArray);
        }
        if (this.targetTopLevelFilter) {
            emitter_event_1.EventEmitter.trigger(type_event_1.EventType.FILTERCHANGE, {
                scopeID: chart.scopeID,
                result: this.mergeFilterResult(chart),
                filterChange: true
            });
        }
    };
    EventBroker.prototype.decideFilterBool = function () {
        if (this.stageFilterComponent.length > 0) {
            for (var _i = 0, _a = this.stageFilterComponent; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.topLevelFilter) {
                    this.targetTopLevelFilter = true;
                }
            }
        }
    };
    EventBroker.prototype.mergeFilterResult = function (target) {
        var mergeFilter;
        if (target.mergeDateObj !== null && target.mergeFilterObj !== null) {
            mergeFilter = Object.assign(target.mergeDateObj, target.mergeFilterObj);
        }
        else if (target.mergeDateObj !== null) {
            mergeFilter = target.mergeDateObj;
        }
        else if (target.mergeFilterObj !== null) {
            mergeFilter = target.mergeFilterObj;
        }
        return mergeFilter;
    };
    EventBroker.prototype.decideFilterScopeID = function (arr, scopeId) {
        if (arr.length > 0) {
            for (var i = 0, j = arr.length; i < j; i++) {
                if (arr[i] == scopeId) {
                    arr.splice(i, 1);
                }
            }
        }
        return arr;
    };
    EventBroker.prototype.compareFilterArray = function (saveFilterArray) {
        var ret = [];
        for (var i = 0, j = saveFilterArray.length; i < j; i++) {
            if (ret.indexOf(saveFilterArray[i]) === -1) {
                ret.push(saveFilterArray[i]);
            }
        }
        return ret;
    };
    //对应成功发送post请求成功后返回数据
    EventBroker.prototype.postSettingData = function (target, changeObj) {
        var url_host = path_1.PATHJSON.urlHost();
        if (window["url_host"]) {
            url_host = window["url_host"];
        }
        url_host += "/visual-web";
        url_host = "/wreport_datareport";
        var _self = this;
        switch (target.downloadBoolean) {
            case false:
                $.ajax({
                    //开发地址
                    url: url_host + '/report/dataSources/id/data',
                    dataType: 'JSON',
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(changeObj.result),
                    success: function (data) {
                        $("#" + target.scopeID).find(".before_loading").remove();
                        emitter_event_1.EventEmitter.trigger(type_event_1.EventType.DATACHANGE, {
                            scopeID: target.scopeID,
                            result: data
                        });
                    },
                    error: function (data) {
                        // alert('请求失败' + data)
                    },
                    beforeSend: function () {
                        if (target.filterScopeIDObj) {
                            return;
                        }
                        else {
                            var loadding = "";
                            loadding += '<div class="before_loading">' +
                                '<div class="loadEffect">' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '</div>' +
                                '</div>';
                            $("#" + target.scopeID).append(loadding);
                        }
                        // alert('正在加载中...');
                    }
                });
                break;
            case true:
                $.ajax({
                    //开发地址
                    url: url_host + '/report/dataSources/id/data/downloadExcel',
                    dataType: 'JSON',
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(changeObj.result),
                    success: function (data) {
                        window.open(url_host + "/" + data);
                    },
                    error: function (data) {
                        // alert('请求失败' + data)
                    },
                });
                break;
        }
    };
    return EventBroker;
}());
exports.EventBroker = EventBroker;
//# sourceMappingURL=eventbroker.js.map