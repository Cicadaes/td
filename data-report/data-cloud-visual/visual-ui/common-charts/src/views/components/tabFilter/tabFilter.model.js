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
var TabFilterModel = (function (_super) {
    __extends(TabFilterModel, _super);
    function TabFilterModel() {
        var _this = _super.apply(this, arguments) || this;
        _this.tabFilterArray = [
            {
                id: 0,
                name: "东直门银座JJ"
            }, {
                id: 1,
                name: "东直门银座VM"
            }, {
                id: 2,
                name: "东直门银座SL"
            }
        ];
        return _this;
    }
    return TabFilterModel;
}(model_base_1.BaseModel));
exports.TabFilterModel = TabFilterModel;
//# sourceMappingURL=tabFilter.model.js.map