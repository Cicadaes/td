"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_base_1 = require("../../base/model.base");
/**
 * Created by nieyechen on 2017/11/15.
 */
var FirstCityFilterModel = (function (_super) {
    __extends(FirstCityFilterModel, _super);
    function FirstCityFilterModel() {
        var _this = _super.apply(this, arguments) || this;
        _this.firstCityFilter = [
            {
                id: 10,
                project_name: "省份",
                city_level: '%%',
                brandCityId: null,
                field: 'province'
            },
            {
                id: 3,
                project_name: "全部城市",
                city_level: '%%',
                brandCityId: '4',
                field: 'province'
            },
            {
                id: 3,
                project_name: "一线城市",
                city_level: '1',
                brandCityId: '4',
                field: 'province'
            },
            {
                id: 3,
                project_name: "二线城市",
                city_level: '2',
                brandCityId: '4',
                field: 'province'
            }
        ];
        return _this;
    }
    return FirstCityFilterModel;
}(model_base_1.BaseModel));
exports.FirstCityFilterModel = FirstCityFilterModel;
//# sourceMappingURL=firstCityFilter.model.js.map