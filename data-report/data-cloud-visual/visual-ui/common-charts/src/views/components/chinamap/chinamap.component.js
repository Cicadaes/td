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
var chinamap_template_1 = require("./chinamap.template");
var utils_1 = require("../../../../public/scripts/utils");
var chinamap_model_1 = require("./chinamap.model");
var base_chart_1 = require("../../base/base.chart");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var ChinaMapComponent = (function (_super) {
    __extends(ChinaMapComponent, _super);
    function ChinaMapComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.chartStyle = null;
        _this.chinamapData = null;
        _this.echartData = null;
        _this.styleObj = null;
        _this.body = null;
        var template = new chinamap_template_1.ChinaMapTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.chinamapData = new chinamap_model_1.ChinaMapModel();
        function randomData() {
            return Math.round(Math.random() * 1000);
        }
        _this.echartData = {
            backgroundColor: _this.chinamapData.backgroundColor,
            color: _this.chinamapData.color,
            nameMap: {
                'China': '中国'
            },
            title: {
                show: _this.chinamapData.title_show,
                text: _this.chinamapData.title_text,
                subtext: _this.chinamapData.title_subtext,
                left: _this.chinamapData.title_left
            },
            tooltip: {
                trigger: _this.chinamapData.tooltip_trigger
            },
            legend: {
                orient: _this.chinamapData.legend_orient,
                left: _this.chinamapData.legend_left,
                top: _this.chinamapData.legend_top,
                data: _this.chinamapData.legend_data
            },
            visualMap: {
                show: _this.chinamapData.visualMap_show,
                min: _this.chinamapData.visualMap_min,
                max: _this.chinamapData.visualMap_max,
                left: _this.chinamapData.visualMap_left,
                top: _this.chinamapData.visualMap_top,
                text: _this.chinamapData.visualMap_text,
                orient: _this.chinamapData.visualMap_orient,
                itemWidth: _this.chinamapData.visualMap_itemWidth,
                itemHeight: _this.chinamapData.visualMap_itemHeight,
                calculable: _this.chinamapData.visualMap_calculable,
                inRange: {
                    color: _this.chinamapData.visualMap_controller_inRange_color,
                }
            },
            series: [
                {
                    name: _this.chinamapData.series_name,
                    type: _this.chinamapData.series_type,
                    mapType: _this.chinamapData.series_mapType,
                    roam: _this.chinamapData.series_roam,
                    label: {
                        normal: {
                            show: _this.chinamapData.series_label_normal_show,
                            textStyle: {
                                color: _this.chinamapData.series_label_normal_textStyle_color,
                                fontFamily: _this.chinamapData.series_label_normal_textStyle_fontFamily,
                            }
                        },
                        emphasis: {
                            show: _this.chinamapData.series_label_emphasis_show
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: _this.chinamapData.series_itemStyle_normal_areaColor
                        }
                    },
                    showLegendSymbol: _this.chinamapData.series_showLegendSymbol,
                    data: _this.chinamapData.series_data
                }
            ]
        };
        return _this;
    }
    ChinaMapComponent.prototype.beforeShow = function () {
    };
    ChinaMapComponent.prototype.afterShow = function () {
        this.init();
    };
    ChinaMapComponent.prototype.beforeDestory = function () {
    };
    ChinaMapComponent.prototype.afterDestory = function () {
    };
    ChinaMapComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    ChinaMapComponent.prototype.buildbody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "chinamap";
        return this.body;
    };
    ChinaMapComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.body = this.buildbody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    //处理数据
    ChinaMapComponent.prototype.handleData = function (json) {
        var obj = {};
        var arr = [];
        $.extend(true, obj, this.echartData.series[0]);
        for (var n = 0; n < json.length; n++) {
            arr.push(json[n].active_users);
            for (var i = 0; i < this.chinamapData.series_data_map.length; i++) {
                if (json[n].project_name) {
                    if (json[n].project_name == this.chinamapData.series_data_map[i].fullName) {
                        this.chinamapData.series_data_map[i].value = json[n].active_users;
                        if (json[n].project_name == this.chinamapData.series_data_map[i].fullName) {
                            this.echartData.series[0]['data'][i]["name"] = this.chinamapData.series_data_map[i].name;
                            this.echartData.series[0]['data'][i]["value"] = this.chinamapData.series_data_map[i].value;
                        }
                    }
                }
                if (json[n].province) {
                    if (json[n].province == this.chinamapData.series_data_map[i].fullName) {
                        this.chinamapData.series_data_map[i].value = json[n].active_users;
                        if (json[n].province == this.chinamapData.series_data_map[i].fullName) {
                            this.echartData.series[0]['data'][i]["name"] = this.chinamapData.series_data_map[i].name;
                            this.echartData.series[0]['data'][i]["value"] = this.chinamapData.series_data_map[i].value;
                        }
                    }
                }
            }
        }
        var max = Math.max.apply(Math, arr);
        this.echartData.visualMap.max = max;
    };
    //渲染右边表格区
    ChinaMapComponent.prototype.renderTables = function (data) {
        $('#' + this.scopeID).find('div[containerRight]').empty();
        var html = "", total = 0, totalLength = 10;
        (data.length <= 10) ? totalLength = data.length : totalLength = 10;
        for (var a = 0; a < data.length; a++) {
            total += data[a].active_users;
        }
        for (var i = 0; i < totalLength; i++) {
            if (data[i].project_name) {
                html += '<li><b>' + (i + 1) + '、' + data[i].project_name + '</b><div class="chainMapContentListPercentage"><span style="width:' + ((data[i].active_users / total) * 100).toFixed(2) + '%;background:' + this.echartData.color[i] + '"></span></div><b style="text-align:right;float:right;">' + ((data[i].active_users / total) * 100).toFixed(2) + '%</b></li>';
            }
            if (data[i].province) {
                html += '<li><b>' + (i + 1) + '、' + data[i].province + '</b><div class="chainMapContentListPercentage"><span style="width:' + ((data[i].active_users / total) * 100).toFixed(2) + '%;background:' + this.echartData.color[i] + '"></span></div><b style="text-align:right;float:right;">' + ((data[i].active_users / total) * 100).toFixed(2) + '%</b></li>';
            }
        }
        var containerBox = '<div class="chainMapContentBox"><h3>省份分布top10</h3><div class="chainMapContentList"><ul>' + html + '</ul></div></div>';
        $('#' + this.scopeID).find('div[containerRight]').append(containerBox);
    };
    ChinaMapComponent.prototype.dataChange = function (data) {
        if (data.length == 0) {
            return;
        }
        var array = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            if (obj.project_name) {
                if (obj.project_name != "HONG KONG" && obj.project_name != "KUALA LUMPUR" && obj.project_name != "UNKNOWN") {
                    array.push(obj);
                }
            }
            if (obj.province) {
                if (obj.province != "HONG KONG" && obj.province != "KUALA LUMPUR" && obj.province != "UNKNOWN") {
                    array.push(obj);
                }
            }
        }
        data = array;
        this.handleData(data); // 处理数据  -- 组装chart的结构
        if (this.myChart == null) {
            this.init();
        }
        else {
            data['chainMap'] = "chainMap";
            //重新渲染表格
            this.renderTables(data);
            //重新渲染柱状图
            console.log(JSON.stringify(this.echartData));
            this.myChart.clear();
            this.myChart.setOption(this.echartData);
        }
    };
    ChinaMapComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    ChinaMapComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    ChinaMapComponent.prototype.styleChange = function (style) {
        if (this.myChart == null) {
            this.init();
            this.styleObj = style;
            var changeStyle = utils_1.Utils.addStyle(style);
            utils_1.Utils.mergeSourceData(changeStyle, this.echartData);
            var newStyle = utils_1.Utils.compareObj(changeStyle, this.echartData);
            this.myChart.setOption(newStyle, true);
        }
        else {
            this.styleObj = style;
            var changeStyle = utils_1.Utils.addStyle(style);
            utils_1.Utils.mergeSourceData(changeStyle, this.echartData);
            var newStyle = utils_1.Utils.compareObj(changeStyle, this.echartData);
            this.myChart.setOption(newStyle, true);
        }
    };
    ChinaMapComponent.prototype.loadData = function () {
    };
    Object.defineProperty(ChinaMapComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    ChinaMapComponent.prototype.init = function () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChainMap]"));
        // 绘制图表
        this.myChart.setOption(this.echartData);
    };
    return ChinaMapComponent;
}(base_component_1.BaseComponent));
exports.ChinaMapComponent = ChinaMapComponent;
//# sourceMappingURL=chinamap.component.js.map