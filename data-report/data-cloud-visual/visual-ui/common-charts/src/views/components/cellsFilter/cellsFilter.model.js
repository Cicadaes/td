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
var CellsFilterModel = (function (_super) {
    __extends(CellsFilterModel, _super);
    function CellsFilterModel() {
        var _this = _super.apply(this, arguments) || this;
        _this.cellsFilterShopArray = [
            {
                id: "1",
                project_name: "按店铺查看",
                type: "shop"
            },
            {
                id: "11",
                project_name: "按城市查看",
                type: "city"
            },
            {
                id: "5",
                project_name: "按大区查看",
                type: "region"
            },
            {
                id: "6",
                project_name: "按品牌查看",
                type: "brand"
            }
        ];
        return _this;
    }
    return CellsFilterModel;
}(model_base_1.BaseModel));
exports.CellsFilterModel = CellsFilterModel;
//# sourceMappingURL=cellsFilter.model.js.map