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
var passengerFlowPriview_template_1 = require("./passengerFlowPriview.template");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var PassengerFlowPriviewComponent = (function (_super) {
    __extends(PassengerFlowPriviewComponent, _super);
    function PassengerFlowPriviewComponent() {
        var _this = _super.call(this) || this;
        _this.chartData = null;
        _this.container = null;
        _this.Data = null;
        _this.changeObj = null;
        _this.body = {
            'filters': []
        };
        _this.dataLength = 1; //对比数据的个数
        _this.height_const = 176; //对比中的一个高度
        var template = new passengerFlowPriview_template_1.PassengerFlowPriviewTemplate(_this.scopeID);
        _this.element = _this.render(template);
        return _this;
    }
    PassengerFlowPriviewComponent.prototype.beforeShow = function () {
    };
    PassengerFlowPriviewComponent.prototype.afterShow = function () {
    };
    PassengerFlowPriviewComponent.prototype.beforeDestory = function () {
    };
    PassengerFlowPriviewComponent.prototype.afterDestory = function () {
    };
    PassengerFlowPriviewComponent.prototype.resize = function () {
    };
    PassengerFlowPriviewComponent.prototype.buildbody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "passengerFlowPriview";
        return this.body;
    };
    PassengerFlowPriviewComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.body = this.buildbody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    PassengerFlowPriviewComponent.prototype.dataChange = function (data) {
        this.Data = data;
        console.log(data);
        this.initHtml();
        //根据对比数据个数，进行高度缩放，传送增量数据
        var dataLengthNew = 0;
        for (var key in data) {
            dataLengthNew++;
        }
        if (dataLengthNew > this.dataLength) {
            //增加高度
            this.sendMessage({
                "op": "plus",
                "value": (dataLengthNew - this.dataLength) * this.height_const,
            });
        }
        else if (dataLengthNew < this.dataLength) {
            //减少高度
            this.sendMessage({
                "op": "minus",
                "value": (this.dataLength - dataLengthNew) * this.height_const,
            });
        }
        this.dataLength = dataLengthNew;
    };
    PassengerFlowPriviewComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    PassengerFlowPriviewComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    PassengerFlowPriviewComponent.prototype.sendMessage = function (changeObj) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', changeObj));
        _super.prototype.changeHeightBase.call(this, this, sendObj);
    };
    PassengerFlowPriviewComponent.prototype.styleChange = function (style) {
    };
    PassengerFlowPriviewComponent.prototype.loadData = function () {
    };
    Object.defineProperty(PassengerFlowPriviewComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    PassengerFlowPriviewComponent.prototype.init = function () {
    };
    PassengerFlowPriviewComponent.prototype.addCompany = function (data) {
        var projectCount = data;
        if (projectCount >= 1000 && projectCount < 1000000) {
            if (projectCount < 100000) {
                projectCount = projectCount.toLocaleString();
            }
            else {
                projectCount = (projectCount / 1000).toFixed(1) + "k";
            }
        }
        else if (projectCount >= 1000000 && projectCount < 100000000) {
            projectCount = (projectCount / 1000000).toFixed(1) + "mil";
        }
        else if (projectCount >= 100000000) {
            projectCount = (projectCount / 100000000).toFixed(1).toLocaleString() + "bil";
        }
        return projectCount;
    };
    PassengerFlowPriviewComponent.prototype.initHtml = function () {
        var html = "", htmlWap = "", arr = [];
        if ((typeof this.Data) === 'object') {
            for (var key in this.Data) {
                var obj = this.Data[key];
                arr = [];
                html = "";
                for (var one in obj) {
                    var total = this.addCompany(obj[one].total);
                    html += '<div class="indexPriview passengerFlowPriview">' +
                        '<p>' + one + '</p><ul class="data">' +
                        '<li><b title="' + (obj[one].total).toLocaleString() + '">' + total + '</b><span>' + obj[one].time + '</span></li>' +
                        '</ul></div>';
                    arr.push(one);
                }
                htmlWap += '<div class="indexPriviewWap"><div class="component_title clrfix"><div class="left" componentTitleFont>指标概览</div><b class="projectTitName">' + key + '</b><span class="funnelHelp fl"></span><span class="downloadBtn"></span></div>' + html + '</div>';
            }
        }
        else {
            htmlWap = "";
        }
        $('#' + this.scopeID).html(htmlWap);
        var len = arr.length;
        $(".indexPriview").css("width", (100 / len) + "%");
    };
    return PassengerFlowPriviewComponent;
}(base_component_1.BaseComponent));
exports.PassengerFlowPriviewComponent = PassengerFlowPriviewComponent;
//# sourceMappingURL=passengerFlowPriview.component.js.map