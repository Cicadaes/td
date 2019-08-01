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
var OverallFilterModel = (function (_super) {
    __extends(OverallFilterModel, _super);
    function OverallFilterModel() {
        var _this = _super.apply(this, arguments) || this;
        _this.overallFilterShopArray = [
            {
                id: 1,
                project_name: "按店铺查看"
            },
            {
                id: 11,
                project_name: "按城市查看"
            },
            {
                id: 5,
                project_name: "按大区查看"
            },
            {
                id: 6,
                project_name: "按品牌查看"
            }
        ];
        _this.liteArray = [
            {
                id: 1,
                project_name: "按店铺查看"
            }
        ];
        return _this;
    }
    return OverallFilterModel;
}(model_base_1.BaseModel));
exports.OverallFilterModel = OverallFilterModel;
//# sourceMappingURL=overallFilter.model.js.map