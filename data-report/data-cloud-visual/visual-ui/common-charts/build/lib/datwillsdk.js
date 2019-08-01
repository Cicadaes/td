/**
 * Created by wangshouyun on 2017/3/2.
 */
"use strict";
var stage_container_1 = require("./views/containers/stage/stage.container");
var report_data_1 = require("./../public/report_data");
var base_list_1 = require("./views/components/base.list");
var component_container_1 = require("./views/containers/component/component.container");
var eventbroker_1 = require("./eventbroker");
var emitter_event_1 = require("./events/emitter.event");
var type_event_1 = require("./events/type.event");
var path_1 = require("../public/path/path");
var DatWillSDK = (function () {
    function DatWillSDK() {
        this._eventBroker = null;
        this.stageData = null;
        this.parameter = {};
        this.stage = null;
        emitter_event_1.EventEmitter.register(type_event_1.EventType.COMONRENDER, this.onRender, this);
    }
    DatWillSDK.getInstance = function () {
        if (!DatWillSDK._instance) {
            DatWillSDK._instance = new DatWillSDK();
            DatWillSDK._instance._eventBroker = new eventbroker_1.EventBroker();
        }
        return DatWillSDK._instance;
    };
    DatWillSDK.prototype.createStage = function (querySelect) {
        this.removeAll();
        this.stage = new stage_container_1.StageContainer(querySelect);
    };
    DatWillSDK.prototype.createPage = function () {
        this.changePage(null);
    };
    Object.defineProperty(DatWillSDK.prototype, "preViewModel", {
        set: function (bl) {
            if (this.stage) {
                this.stage.preViewModel = bl;
            }
        },
        enumerable: true,
        configurable: true
    });
    DatWillSDK.prototype.saveStageData = function (data) {
        this._eventBroker.stageDataArray = data;
    };
    DatWillSDK.prototype.onRender = function (event, chart) {
        this.changePage(this._eventBroker.stageDataArray[chart.eqType]);
    };
    DatWillSDK.prototype.changePage = function (data) {
        this.removeAll();
        if (data != null) {
            this.renderData(data);
        }
    };
    DatWillSDK.prototype.removeAll = function () {
        if (this.stage) {
            this.stage.removeAllChild();
        }
        this._eventBroker.removeRegister();
        emitter_event_1.EventEmitter.register(type_event_1.EventType.COMONRENDER, this.onRender, this);
        if (this.stage && this.stage.messenger) {
            emitter_event_1.EventEmitter.register(type_event_1.EventType.MESSAGE_CHANGE, this.stage.messageHandler, this.stage);
        }
        if (this.stage) {
            this.stage.rebindevent();
        }
    };
    DatWillSDK.prototype.renderData = function (data) {
        var _this = this;
        if (data.components == null)
            return;
        this.stageData = data;
        this.stage.stageData = this.stageData;
        if (data.size) {
            this.stage.historySize = { width: data.size.width, height: data.size.height };
        }
        var scaleValue = (this.stage.width / this.stage.historyWidth).toFixed(2);
        for (var _i = 0, _a = this.stageData.components; _i < _a.length; _i++) {
            var component = _a[_i];
            var chartStyle = component.chart.style;
            var configure_style = void 0;
            if (component.chart.style.data.configure_style && component.chart.style.data.configure_style["0"].name) {
                configure_style = JSON.parse(component.chart.style.data.configure_style["0"].name);
            }
            if (configure_style && configure_style.layout_x == "zoom") {
                chartStyle.data["component_x"] = "20";
                chartStyle.data["component_width"] = "" + (this.stage.width - 40);
            }
            else if (configure_style && configure_style.layout_x == "zoom_1") {
                chartStyle.data["component_x"] = "20";
                chartStyle.data["component_width"] = "" + Math.round((this.stage.width - 50) / 2);
            }
            else if (configure_style && configure_style.layout_x == "zoom_2") {
                chartStyle.data["component_x"] = "" + Math.round((this.stage.width - 50) / 2 + 20 + 10);
                chartStyle.data["component_width"] = "" + Math.round((this.stage.width - 50) / 2);
            }
            else if (configure_style && configure_style.layout_x == "full") {
                chartStyle.data["component_x"] = "0";
                chartStyle.data["component_width"] = "" + (this.stage.width - 5);
            }
            else if (configure_style && configure_style.layout_x == "right") {
                chartStyle.data["component_x"] = "" + (this.stage.width - parseInt(chartStyle.data["component_width"]) - 20);
            }
            else if (configure_style && configure_style.layout_x == "fix") {
            }
            else {
                if (chartStyle.data && chartStyle.data["component_width"]) {
                    chartStyle.data["component_width"] = "" + parseInt(chartStyle.data["component_width"]) * scaleValue;
                }
                if (chartStyle.data && chartStyle.data["component_x"]) {
                    chartStyle.data["component_x"] = "" + parseInt(chartStyle.data["component_x"]) * scaleValue;
                }
                else if (chartStyle.data) {
                    chartStyle.data["component_x"] = "0";
                }
            }
        }
        this.stage.historyWidth = this.stage.width;
        var _loop_1 = function (component) {
            var chartStyle = component.chart.style;
            if (chartStyle.data && chartStyle.data["title_name"]) {
                chartStyle.data["title_name_titleValue"] = chartStyle.data["title_name"]["titleValue"];
                chartStyle.data["title_name_textValue"] = chartStyle.data["title_name"]["textValue"];
            }
            var chartDataSource = component.chart.dataSource;
            var chartConponent = base_list_1.BaseComponentList.getComponentByType(String(component.chart.type));
            //给组件赋值名称
            var viewName = chartConponent.constructor.name;
            if (viewName.endsWith("Component")) {
                var index = viewName.indexOf("Component");
                viewName = viewName.substring(0, index);
            }
            chartConponent.viewName = viewName;
            if (chartConponent) {
                var componentContainer_1 = new component_container_1.ComponentContainer(this_1.stage, chartConponent, component.chart.uuid);
                componentContainer_1.chartStyle = chartStyle;
                componentContainer_1.x = chartStyle.box.point.x;
                componentContainer_1.y = chartStyle.box.point.y;
                componentContainer_1.width = chartStyle.box.size.width;
                componentContainer_1.height = chartStyle.box.size.height;
                componentContainer_1.layer = chartStyle.box.layer;
                componentContainer_1.type = component.chart.type;
                this_1.stage.addChild(componentContainer_1);
                //存储过滤器
                this_1.saveStageFilter(component.chart, componentContainer_1['component']);
                setTimeout(function () {
                    componentContainer_1.getconfiginformation("", {
                        scopeID: component.chart.uuid,
                        result: _this.setConfigObject(chartDataSource),
                        parameter: _this.parameter
                    });
                }, 200);
                setTimeout(function () {
                    componentContainer_1.styleChange({
                        scopeID: component.chart.uuid,
                        result: chartStyle.data
                    });
                }, 100);
                setTimeout(function () {
                    componentContainer_1.getFilterMethod = _this.parameter.getFilterMethod;
                }, 100);
            }
        };
        var this_1 = this;
        for (var _b = 0, _c = this.stageData.components; _b < _c.length; _b++) {
            var component = _c[_b];
            _loop_1(component);
        }
        setTimeout(function () {
            _this._eventBroker.initData(_this.data);
            _this.stage.refresh();
        }, 200);
        if (this.parameter && this.parameter.projectId) {
            emitter_event_1.EventEmitter.trigger(type_event_1.EventType.OVERALLFILTERCHANGE, {
                result: this.parameter
            });
        }
    };
    DatWillSDK.prototype.saveStageFilter = function (chart, componentContainer) {
        if (chart.dataSource.data['configure'].length > 0) {
            var dataSourceChart = chart.dataSource.data['configure'][0].name;
            if (dataSourceChart !== "") {
                if (JSON.parse(dataSourceChart).topLevelFilter) {
                    componentContainer['topLevelFilter'] = JSON.parse(dataSourceChart).topLevelFilter;
                }
                if (JSON.parse(dataSourceChart).chartScopeID) {
                    this._eventBroker.stageFilterComponent.push(componentContainer);
                }
            }
        }
    };
    DatWillSDK.prototype.setConfigObject = function (chartDataSource) {
        var setConfigObj = null, fieldValue = null;
        if (chartDataSource.data && chartDataSource.data !== undefined) {
            fieldValue = chartDataSource.data["configure"][0].name;
            if (fieldValue !== "") {
                setConfigObj = JSON.parse(fieldValue);
            }
            else {
                setConfigObj = {};
            }
        }
        return setConfigObj;
    };
    Object.defineProperty(DatWillSDK.prototype, "data", {
        get: function () {
            var reportData = new report_data_1.ReportData();
            var stageData = {};
            stageData['backgroundColor'] = "";
            stageData['backgroundImage'] = "";
            stageData['size'] = {
                width: this.stage.width,
                height: this.stage.height
            };
            stageData['components'] = [];
            var chartList = this.stage.allChildren;
            for (var _i = 0, chartList_1 = chartList; _i < chartList_1.length; _i++) {
                var chart = chartList_1[_i];
                var chartData = {
                    chart: {
                        uuid: chart.scopeID,
                        type: chart.type,
                        style: {
                            box: {
                                size: {
                                    width: chart.width,
                                    height: chart.height
                                },
                                point: {
                                    x: chart.x,
                                    y: chart.y
                                },
                                layer: chart.layer
                            }
                        }
                    }
                };
                stageData['components'].push(chartData);
            }
            reportData.stages.push(stageData);
            return reportData;
        },
        enumerable: true,
        configurable: true
    });
    DatWillSDK.prototype.getParameter = function (parameter) {
        this.parameter = parameter;
    };
    DatWillSDK.prototype.renderReport = function (domStr, reportId, messenger) {
        this.createStage(domStr);
        if (this.stage && messenger) {
            this.stage.messenger = messenger;
        }
        emitter_event_1.EventEmitter.register(type_event_1.EventType.MESSAGE_CHANGE, this.stage.messageHandler, this.stage);
        var url_host = path_1.PATHJSON.urlHost();
        if (window["url_host"]) {
            url_host = window["url_host"];
        }
        url_host += "/visual-web";
        this.sendRequest(url_host, reportId);
    };
    DatWillSDK.prototype.sendRequest = function (url_host, reportId) {
        url_host = "/wreport_datareport";
        var _self = this;
        $.ajax({
            url: url_host + '/report/reports/' + reportId,
            dataType: 'JSON',
            contentType: 'application/json',
            type: 'GET',
            success: function (data) {
                _self.stageConfig = data.formatAndTheme.format;
                _self.saveStageData(data.stages);
                _self.changePage(data.stages[0]);
            },
            error: function (data) {
                if (data.status == '401') {
                    _self.registLogin(url_host);
                }
                else {
                    console.error('请求失败' + data);
                }
            },
            beforeSend: function () {
                // console.log('正在加载中...');
            }
        });
    };
    DatWillSDK.prototype.registLogin = function (url_host) {
        $.ajax({
            url: "/wreport_datareport/user/login",
            type: 'GET',
            success: function (data) {
                document.location.href = data.service + document.location.origin + data.redirect + document.location.href;
            },
            error: function (data) {
                debugger;
                document.location.href = data.service + document.location.origin + data.redirect + document.location.href;
            },
            beforeSend: function () {
            }
        });
    };
    return DatWillSDK;
}());
DatWillSDK._instance = null;
exports.DatWillSDK = DatWillSDK;
//# sourceMappingURL=datwillsdk.js.map