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
var CityFilterModel = (function (_super) {
    __extends(CityFilterModel, _super);
    function CityFilterModel() {
        var _this = _super.apply(this, arguments) || this;
        _this.cityFilterShopArray = [
            {
                id: 1,
                project_name: "同商场",
                field: 'mall'
            },
            {
                id: 1,
                project_name: "同区县",
                field: 'county'
            }
        ];
        return _this;
    }
    return CityFilterModel;
}(model_base_1.BaseModel));
exports.CityFilterModel = CityFilterModel;
//# sourceMappingURL=cityFilter.model.js.map