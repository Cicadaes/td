/**
 * Created by zhaoxue on 2017-03-31.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_base_1 = require("../../base/model.base");
var PriviewModel = (function (_super) {
    __extends(PriviewModel, _super);
    function PriviewModel() {
        var _this = _super.apply(this, arguments) || this;
        /** font title html*/
        _this.title_html = "Mobile App";
        /** font title color*/
        _this.title_color = "red";
        /** font title fontSize*/
        _this.title_fontSize = '16px';
        /** font value html*/
        _this.value_html = "ddddddddddddddddddd";
        /** font value color*/
        _this.value_color = "#ccc";
        /** font value fontSize*/
        _this.value_fontSize = '13px';
        _this.backgroundColor = "#fff";
        return _this;
    }
    return PriviewModel;
}(model_base_1.BaseModel));
exports.PriviewModel = PriviewModel;
//# sourceMappingURL=priview.model.js.map