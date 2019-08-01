"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_base_1 = require("../../base/model.base");
/**
 * Created by zhaoxue on 2017-03-29.
 */
var TableModel = (function (_super) {
    __extends(TableModel, _super);
    function TableModel() {
        var _this = _super.apply(this, arguments) || this;
        _this.table_Data = {
            // "head": {"col1": "门户网站", "col2": "注册用户", "col3": "pv", "col4": "uv", "col5": "5", "col6": "6"},
            "data": [{ "col1": "凤凰网", "col2": "20", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "搜狐", "col2": "30", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" },
                { "col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6" }
            ]
        };
        _this.tableRFM_indicators = [
            {
                'id': 'monetary',
                'name': '累计购买金额'
            },
            {
                'id': 'member_count',
                'name': '累计人数'
            }
        ];
        _this.data1 = [
            { "R": "R<=30", "F": "F=1", "monetary": 1600.0 },
            { "R": "R<=30", "F": "F=2", "monetary": 1650.0 },
            { "R": "R<=30", "F": "F=3", "monetary": 1800.0 },
            { "R": "R<=30", "F": "F=4", "monetary": 1360.0 },
            { "R": "R<=30", "F": "F=5", "monetary": 1050.0 },
            { "R": "R<=30", "F": "total", "monetary": 7460.0 },
            { "R": "30<R≤90", "F": "F=1", "monetary": 1460.0 },
            { "R": "30<R≤90", "F": "F=2", "monetary": 1780.0 },
            { "R": "30<R≤90", "F": "F=3", "monetary": 1150.0 },
            { "R": "30<R≤90", "F": "F=4", "monetary": 780.0 },
            { "R": "30<R≤90", "F": "F=5", "monetary": 930.0 },
            { "R": "30<R≤90", "F": "total", "monetary": 6100.0 },
            { "R": "90<R≤180", "F": "F=1", "monetary": 1640.0 },
            { "R": "90<R≤180", "F": "F=2", "monetary": 1180.0 },
            { "R": "90<R≤180", "F": "F=3", "monetary": 1450.0 },
            { "R": "90<R≤180", "F": "F=4", "monetary": 1820.0 },
            { "R": "90<R≤180", "F": "F=5", "monetary": 1370.0 },
            { "R": "90<R≤180", "F": "total", "monetary": 7460.0 },
            { "R": "180<R≤360", "F": "F=1", "monetary": 1710.0 },
            { "R": "180<R≤360", "F": "F=2", "monetary": 480.0 },
            { "R": "180<R≤360", "F": "F=3", "monetary": 770.0 },
            { "R": "180<R≤360", "F": "F=4", "monetary": 920.0 },
            { "R": "180<R≤360", "F": "F=5", "monetary": 1870.0 },
            { "R": "180<R≤360", "F": "total", "monetary": 5750.0 },
            { "R": "R>360", "F": "F=1", "monetary": 1040.0 },
            { "R": "R>360", "F": "F=2", "monetary": 1280.0 },
            { "R": "R>360", "F": "F=3", "monetary": 1090.0 },
            { "R": "R>360", "F": "F=4", "monetary": 990.0 },
            { "R": "R>360", "F": "F=5", "monetary": 1660.0 },
            { "R": "R>360", "F": "total", "monetary": 6060.0 },
            { "R": "total", "F": "F=1", "monetary": 7450.0 },
            { "R": "total", "F": "F=2", "monetary": 6370.0 },
            { "R": "total", "F": "F=3", "monetary": 6260.0 },
            { "R": "total", "F": "F=4", "monetary": 5870.0 },
            { "R": "total", "F": "F=5", "monetary": 6880.0 },
            { "R": "total", "F": "total", "monetary": 32830.0 }
        ];
        _this.backgroundColor = '#fff';
        _this.options = {
            'hasSelectLine': true,
            'pageSize': 10,
            'pageNumber': 2,
            'totalPage': 16,
            'totalNumber': 160,
            'count': 3,
            'foottype': 'paginate',
            'pageCount': [10, 15, 20] //每页显示数量
        };
        return _this;
    }
    return TableModel;
}(model_base_1.BaseModel));
exports.TableModel = TableModel;
//# sourceMappingURL=table.model.js.map