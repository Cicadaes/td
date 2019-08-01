"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by wangshouyun on 2017/3/9.
 */
var model_abstract_1 = require("./model.abstract");
var BaseModel = (function (_super) {
    __extends(BaseModel, _super);
    function BaseModel() {
        return _super.apply(this, arguments) || this;
    }
    return BaseModel;
}(model_abstract_1.AModel));
exports.BaseModel = BaseModel;
//# sourceMappingURL=model.base.js.map