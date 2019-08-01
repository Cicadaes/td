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
var ProvinceFilterModel = (function (_super) {
    __extends(ProvinceFilterModel, _super);
    function ProvinceFilterModel() {
        var _this = _super.apply(this, arguments) || this;
        _this.provinceFilterShopArray = [
            {
                id: 10,
                project_name: "省份",
                field: 'province'
            },
            {
                id: 3,
                project_name: "城市",
                field: 'city'
            },
            {
                id: 1,
                project_name: "店铺",
                field: 'store'
            }
        ];
        return _this;
    }
    return ProvinceFilterModel;
}(model_base_1.BaseModel));
exports.ProvinceFilterModel = ProvinceFilterModel;
//# sourceMappingURL=provinceFilter.model.js.map