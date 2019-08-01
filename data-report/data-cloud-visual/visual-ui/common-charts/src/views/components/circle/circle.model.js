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
var CircleModel = (function (_super) {
    __extends(CircleModel, _super);
    function CircleModel() {
        var _this = _super.apply(this, arguments) || this;
        /** background*/
        _this.backgroundColor = "#5697F1";
        return _this;
    }
    return CircleModel;
}(model_base_1.BaseModel));
exports.CircleModel = CircleModel;
//# sourceMappingURL=circle.model.js.map