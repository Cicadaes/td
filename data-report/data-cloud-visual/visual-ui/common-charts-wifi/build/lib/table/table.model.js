"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_base_1 = require("datwill-sdk/lib/views/base/model.base");
/**
 * Created by zhaoxue on 2017-03-29.
 */
var TableModel = (function (_super) {
    __extends(TableModel, _super);
    function TableModel() {
        var _this = _super.apply(this, arguments) || this;
        _this.table1_Data = {
            "head": { "col1": "门户网站", "col2": "注册用户", "col3": "pv", "col4": "uv", "col5": "5", "col6": "6" },
            "data": [{ "col1": "凤凰网", "col2": "20", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "搜狐", "col2": "30", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" }
            ]
        };
        _this.backgroundColor = '#fff';
        _this.echart_color = ['#EB8E4A', '#5AC99E', '#3399FF', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
        _this.pageSize = 5;
        _this.pageNumber = 1;
        _this.totalPage = 2;
        _this.totalNumber = 6;
        _this.direction = 0;
        _this.foottype = "paginate";
        _this.pageCount = ['10条', '15条', '20条'];
        return _this;
    }
    return TableModel;
}(model_base_1.BaseModel));
exports.TableModel = TableModel;
//# sourceMappingURL=table.model.js.map