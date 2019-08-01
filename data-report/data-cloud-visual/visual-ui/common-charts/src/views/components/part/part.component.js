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
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var PartComponent = (function (_super) {
    __extends(PartComponent, _super);
    function PartComponent() {
        var _this = _super.call(this) || this;
        _this.chartData = null;
        _this.container = null;
        _this.body = {
            'filters': []
        };
        var template = new part_template_1.PartTemplate(_this.scopeID);
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
    PartComponent.prototype.buildBody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "part";
        return this.body;
    };
    PartComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.buildBody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    PartComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    PartComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    PartComponent.prototype.dataChange = function (data) {
        this.partdata = data;
        this.init();
    };
    PartComponent.prototype.loadData = function () {
    };
    Object.defineProperty(PartComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    PartComponent.prototype.addCompany = function (data) {
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
    PartComponent.prototype.init = function () {
        var arr = [], arr1, arr2, arr3, obj1 = {}, obj2 = {}, obj3 = {}, partOne = "", partTwo = "", partThree = "";
        for (var key in this.partdata) {
            arr.push(key);
            arr1 = arr.slice(0, 1);
            arr2 = arr.slice(1, 3);
            arr3 = arr.slice(3);
            for (var j = 0; j < arr1.length; j++) {
                if (arr1[j] == key) {
                    var value1 = this.partdata[key][0]['metric'];
                    var tipValue1 = this.partdata[key][0]['metric'];
                    if ((this.partdata[key][0]['metric']).toString().indexOf("%") == -1) {
                        value1 = this.addCompany(value1);
                        tipValue1 = (this.partdata[key][0]['metric']).toLocaleString();
                    }
                    var value2 = this.partdata[key][1]['metric'];
                    var tipValue2 = this.partdata[key][1]['metric'];
                    if ((this.partdata[key][1]['metric']).toString().indexOf("%") == -1) {
                        value2 = this.addCompany(value2);
                        tipValue2 = (this.partdata[key][1]['metric']).toLocaleString();
                    }
                    partOne += '<div class="_child_list"><span><a>' + key + '</a></span><span><b title="' + tipValue1 + '">' + value1 + '</b><em>' + this.partdata[key][0].date + '</em></br><b title="' + tipValue2 + '">' + value2 + '</b>' + '<em>' + this.partdata[key][1].date + '</em></span></div>';
                }
            }
            for (var n = 0; n < arr2.length; n++) {
                if (arr2[n] == key) {
                    var value1 = this.partdata[key][0]['metric'];
                    var tipValue1 = this.partdata[key][0]['metric'];
                    if ((this.partdata[key][0]['metric']).toString().indexOf("%") == -1) {
                        value1 = this.addCompany(value1);
                        tipValue1 = (this.partdata[key][0]['metric']).toLocaleString();
                    }
                    var value2 = this.partdata[key][1]['metric'];
                    var tipValue2 = this.partdata[key][1]['metric'];
                    if ((this.partdata[key][1]['metric']).toString().indexOf("%") == -1) {
                        value2 = this.addCompany(value2);
                        tipValue2 = (this.partdata[key][1]['metric']).toLocaleString();
                    }
                    partTwo += '<div class="_child_list"><span><a>' + key + '</a></span><span><b title="' + tipValue1 + '">' + value1 + '</b><em>' + this.partdata[key][0].date + '</em></br><b title="' + tipValue2 + '">' + value2 + '</b>' + '<em>' + this.partdata[key][1].date + '</em></span></div>';
                }
            }
            for (var x = 0; x < arr3.length; x++) {
                if (arr3[x] == key) {
                    var value1 = this.partdata[key][0]['metric'];
                    var tipValue1 = this.partdata[key][0]['metric'];
                    if ((this.partdata[key][0]['metric']).toString().indexOf("%") == -1) {
                        value1 = this.addCompany(value1);
                        tipValue1 = (this.partdata[key][0]['metric']).toLocaleString();
                    }
                    var value2 = this.partdata[key][1]['metric'];
                    var tipValue2 = this.partdata[key][1]['metric'];
                    if ((this.partdata[key][1]['metric']).toString().indexOf("%") == -1) {
                        value2 = this.addCompany(value2);
                        tipValue2 = (this.partdata[key][1]['metric']).toLocaleString();
                    }
                    partThree += '<div class="_child_list"><span><a>' + key + '</a></span><span><b title="' + tipValue1 + '">' + value1 + '</b><em>' + this.partdata[key][0].date + '</em></br><b title="' + tipValue2 + '">' + value2 + '</b>' + '<em>' + this.partdata[key][1].date + '</em></span></div>';
                }
            }
        }
        var partContent = '<div class="child">' + partOne +
            '</div>' + '<div class="child">' + partTwo +
            '</div>' + '<div class="child">' + partThree +
            '</div>';
        $(".tree").html(partContent);
        $("._child_list").each(function () {
            if (parseFloat($(this).find("b").eq(0).text()) >= parseFloat($(this).find("b").eq(1).text())) {
                $(this).find("b").eq(0).removeClass().addClass("up");
            }
            else {
                $(this).find("b").eq(0).removeClass().addClass("down");
            }
        });
    };
    return PartComponent;
}(base_component_1.BaseComponent));
exports.PartComponent = PartComponent;
//# sourceMappingURL=part.component.js.map