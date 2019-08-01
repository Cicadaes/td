"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_component_1 = require("../base.component");
var indexPriview_template_1 = require("./indexPriview.template");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var IndexPriviewComponent = (function (_super) {
    __extends(IndexPriviewComponent, _super);
    function IndexPriviewComponent() {
        var _this = _super.call(this) || this;
        _this.chartData = null;
        _this.container = null;
        _this.Data = null;
        _this.changeObj = null;
        _this.body = {
            'filters': [],
            "settingZero": true
        };
        _this.dataLength = 4; //对比数据的个数
        _this.height_const = 31; //对比中的一个高度
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
    IndexPriviewComponent.prototype.buildBody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "indexPriview";
        return this.body;
    };
    IndexPriviewComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.buildBody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    IndexPriviewComponent.prototype.dataChange = function (data) {
        this.Data = data;
        this.initHtml();
        //根据对比数据个数，进行高度缩放，传送增量数据
        var dataLengthNew = 0;
        if (data["近7日入店客流"] && data["近7日入店客流"].project) {
            var list = data["近7日入店客流"].project;
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                dataLengthNew++;
            }
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
    IndexPriviewComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
    };
    IndexPriviewComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    IndexPriviewComponent.prototype.sendMessage = function (changeObj) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', changeObj));
        _super.prototype.changeHeightBase.call(this, this, sendObj);
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
    IndexPriviewComponent.prototype.addCompany = function (data) {
        var projectCount = data;
        var reg = /%+/;
        if (!reg.test(projectCount)) {
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
        }
        return projectCount;
    };
    IndexPriviewComponent.prototype.initHtml = function () {
        var html = "", arr = [], project = "";
        if ((typeof this.Data) === 'object') {
            for (var key in this.Data) {
                var projectHtml = "", project_1 = "";
                var total = this.addCompany(this.Data[key].total.total);
                var beforeTotal = this.addCompany(this.Data[key].before.before_total);
                if (this.Data[key].project.length <= 0) {
                    project_1 = '<p class="dataNull">暂无数据</p>';
                }
                else {
                    for (var i = 0; i < this.Data[key].project.length; i++) {
                        var projectCount = this.addCompany(this.Data[key].project[i].project_count);
                        // let projectCount = this.Data[key].project[i].project_count;
                        // let reg=/%+/;
                        // if(!reg.test(projectCount)){
                        //     if(projectCount >= 1000 && projectCount < 1000000){
                        //         if(projectCount < 100000){
                        //             projectCount = projectCount.toLocaleString();
                        //         }else {
                        //             projectCount = projectCount/1000 + "K";
                        //         }
                        //     }else if(projectCount >= 1000000 && projectCount < 100000000){
                        //         projectCount = projectCount/1000000 + "M";
                        //     }else if (projectCount >= 100000000){
                        //         projectCount = (projectCount/100000000).toLocaleString() + "B";
                        //     }
                        // }
                        if (this.Data[key].project[i].percentage) {
                            projectHtml += '<li><b title = "' + this.Data[key].project[i].project_name + '">' + this.Data[key].project[i].project_name + '</b><span title = "' + this.Data[key].project[i].project_count.toLocaleString() + '">' + projectCount + '</span><strong title = "' + this.Data[key].project[i].percentage + '">' + this.Data[key].project[i].percentage + '</strong></li>';
                        }
                        else {
                            //if (this.Data[key].project[i].percentage) {
                            projectHtml += '<li><b title = "' + this.Data[key].project[i].project_name + '">' + this.Data[key].project[i].project_name + '</b><span title = "' + this.Data[key].project[i].project_count.toLocaleString() + '" >' + projectCount + '</span><strong></strong></li>';
                        }
                    }
                }
                var pro = void 0;
                if (projectHtml != "") {
                    pro = projectHtml;
                }
                else {
                    pro = project_1;
                }
                html += '<div class="indexPriview">' +
                    '<p>' + key + '</p><ul class="data">' +
                    '<li><b title = "' + this.Data[key].total.total.toLocaleString() + '">' + total + '</b><span>' + this.Data[key].total.time + '</span></li>' +
                    '<li><b title = "' + this.Data[key].before.before_total.toLocaleString() + '">' + beforeTotal + '</b><span>' + this.Data[key].before.before_time + '</span></li>' +
                    '</ul><ul class="type">' + pro + '</ul></div>';
                arr.push(key);
            }
        }
        else {
            html = "";
        }
        $('#' + this.scopeID).html(html);
        var len = arr.length;
        $(".indexPriview").css("width", (100 / len) + "%");
    };
    return IndexPriviewComponent;
}(base_component_1.BaseComponent));
exports.IndexPriviewComponent = IndexPriviewComponent;
//# sourceMappingURL=indexPriview.component.js.map