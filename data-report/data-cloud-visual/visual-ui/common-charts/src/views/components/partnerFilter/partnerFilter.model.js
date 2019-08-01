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
var PartnerFilterModel = (function (_super) {
    __extends(PartnerFilterModel, _super);
    function PartnerFilterModel() {
        var _this = _super.apply(this, arguments) || this;
        _this.partnerFilterChannelArray = [
            {
                id: "8",
                project_name: "渠道",
            },
            {
                id: "7",
                project_name: "商场",
            },
            {
                id: "1",
                project_name: "店铺",
                type: "region"
            }
        ];
        return _this;
    }
    return PartnerFilterModel;
}(model_base_1.BaseModel));
exports.PartnerFilterModel = PartnerFilterModel;
//# sourceMappingURL=partnerFilter.model.js.map