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
var table_template_1 = require("./table.template");
var table_model_1 = require("./table.model");
var $ = require("jquery");
var TableComponent = (function (_super) {
    __extends(TableComponent, _super);
    function TableComponent() {
        var _this = _super.call(this) || this;
        _this.chartData = null;
        _this.tableData = null;
        _this.colLength = null;
        _this.jsondata = {
            "head": { "col1": "门户网站", "col2": "注册用户", "col3": "pv", "col4": "uv", "col5": "5", "col6": "6" },
            "data": [{ "col1": "凤凰网", "col2": "20", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "搜狐", "col2": "30", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" }]
        };
        var template = new table_template_1.TableTemplate(_this.scopeID, TableComponent);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.tableData = new table_model_1.TableModel();
        return _this;
    }
    TableComponent.prototype.beforeShow = function () {
    };
    TableComponent.prototype.afterShow = function () {
    };
    TableComponent.prototype.beforeDestory = function () {
    };
    TableComponent.prototype.afterDestory = function () {
    };
    TableComponent.prototype.resize = function () {
    };
    // public dataChange(data: any): void {
    //     console.log(data, 1111);
    //     // let jsondata = this.handledata(data);
    //     //
    //     // this.getTableInfo(jsondata)
    // }
    TableComponent.prototype.dataChange = function (data) {
        console.log(data);
        data['tabletype'] = "tabletype";
        //  内容
    };
    TableComponent.prototype.styleChange = function (style) {
    };
    TableComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(TableComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    TableComponent.prototype.init = function () {
        console.log(this.scopeID, this.tableData);
        this.colLength = this.getObjLength(this.tableData.table1_Data.head);
        this.getTableInfo(this.tableData.table1_Data);
        //渲染tablefoot
        if (this.tableData.foottype) {
            this.creatTableFooter(this.tableData);
        }
        this.setTableWidth(this.tableData.table1_Data);
    };
    TableComponent.prototype.getObjLength = function (obj) {
        if (obj === void 0) { obj = {}; }
        var length = 0;
        for (var i in obj) {
            length++;
        }
        return length;
    };
    TableComponent.prototype.in_array = function (a, v) {
        var i = 0;
        for (i = 0; i < a.length; i++) {
            if (v === a[i]) {
                return i;
            }
        }
        return -1;
    };
    TableComponent.prototype.handledata = function (json) {
        var TdObj = json.table_Data;
        var col = [];
        var date = [];
        var type = [];
        var ObjArr = {};
        // $.each(TdObj, (i: any, n: any) => {
        TdObj.prototype.each = function (i, n) {
            for (var p in n) {
                if (-1 == this.in_array(col, p)) {
                    col.push(p);
                }
                if (p == col[0] && (-1 == this.in_array(date, n[p]))) {
                    date.push(n[p]);
                    ObjArr[n[p]] = new Object();
                }
                if (col.length > 1 && p == col[1] && (-1 == this.in_array(type, n[p]))) {
                    type.push(n[p]);
                    ObjArr[n[col[0]]][n[p]] = null;
                }
                if (col.length > 2 && p == col[2]) {
                    ObjArr[n[col[0]]][n[col[1]]] = n[p];
                }
            }
        };
        console.log(ObjArr);
        //var arr1 = [""].concat(date);
        ObjArr.head = new Object();
        ObjArr.head["col1"] = "";
        for (var z = 0; z < date.length; z++) {
            ObjArr.head["col" + (z + 2)] = [date[z]];
        }
        //ObjArr.head.push(arr1);
        ObjArr.data = [];
        for (var m = 0; m < type.length; m++) {
            var row = new Object();
            row["col1"] = type[m];
            for (var z = 0; z < date.length; z++) {
                if ("" != ObjArr[date[z]] && ObjArr[date[z]][type[m]]) {
                    row["col" + (z + 2)] = ObjArr[date[z]][type[m]] ? ObjArr[date[z]][type[m]] : "";
                }
                else {
                    row["col" + (z + 2)] = 0;
                }
            }
            ObjArr.data.push(row);
        }
        console.log(ObjArr);
        return ObjArr;
    };
    ;
    TableComponent.prototype.getTableInfo = function (json) {
        $("#" + this.scopeID).empty();
        var table = "<table class='table'>";
        var tableHead = json.head;
        table += "<thead><tr style='background:#3385ff;'>";
        //console.log(tableHead);
        for (var p in tableHead) {
            table += "<th>" + tableHead[p] + "</th>";
        }
        table += "</tr></thead><tbody id='bd'>";
        //获取需要展示的数据
        var start = (this.tableData.pageNumber - 1) * this.tableData.pageSize;
        var end = start + this.tableData.pageSize;
        var typeData = json.data.slice(start, end);
        $.each(typeData, function (i, n) {
            //var tData = "";
            var trColor;
            if (i % 2 == 0) {
                trColor = "even";
            }
            else {
                trColor = "odd";
            }
            table += "<tr class='" + trColor + "'>";
            //console.log(n)
            if (1) {
                for (var d in n) {
                    table += "<td>" + n[d] + "</td>";
                }
            }
            table += "</tr>";
        });
        table += "</tbody></table>";
        $("#" + this.scopeID).append(table);
    };
    ;
    //创建tabelfooter
    TableComponent.prototype.creatTableFooter = function (json) {
        switch (json.foottype) {
            case "paginate":
                this.renderPaginate(json);
                break;
            case "loadmore":
                this.loadMoreData(json);
                break;
        }
    };
    ;
    //渲染分页
    TableComponent.prototype.renderPaginate = function (json) {
        var pagination = "<div class='table_pagination clrfix'>";
        //每页显示
        pagination += "<div class='table_pagePer fl'><span class='fl'>每页显示</span><div class='table_pageSizeBox fl'><span class='table_pageSize'>10条</span><i class='triangle_icon'></i><ul class='table_sizeList'>";
        //显示条数列表
        for (var i = 0; i < json.pageCount.length; i++) {
            pagination += "<li>" + json.pageCount[i] + "</li>";
        }
        pagination += "</ul></div></div>";
        //首页
        pagination += "<div class='table_page fr'><span class='table_first fl'>首页</span><ul class='table_pages fl'>";
        //显示分页
        for (var i = 1; i <= json.totalPage; i++) {
            var classname = json.pageNumber == i ? "table_currentPage" : "";
            pagination += "<li class=fl '" + classname + "'>" + (i) + "</li>";
        }
        //显示末页
        pagination += "</ul><span class='table_last fl'>末页</span></div>";
        //插入容器内
        $("#" + this.scopeID).append(pagination);
    };
    //设置表格宽度
    TableComponent.prototype.setTableWidth = function (json) {
        var width = $("#" + this.scopeID).find("table").width();
        var tdWidth = width / this.colLength;
        $("#" + this.scopeID).find("td").width(tdWidth);
    };
    //渲染加载更多
    TableComponent.prototype.loadMoreData = function (json) {
    };
    return TableComponent;
}(base_component_1.BaseComponent));
exports.TableComponent = TableComponent;
//# sourceMappingURL=table.component.js.map