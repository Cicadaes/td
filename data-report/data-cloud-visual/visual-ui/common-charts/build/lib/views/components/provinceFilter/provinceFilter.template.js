"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by zhaoxue on 2017/3/28.
 */
var template_base_1 = require("../../base/template.base");
var ProvinceFilterTemplate = (function (_super) {
    __extends(ProvinceFilterTemplate, _super);
    function ProvinceFilterTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:112px;height: 24px;position:relative;\" class=\"cityFilterComponent provinceFilterComponent\">\n        \n            <div class=\"clrfix\" style=\"width:100%;height: 100%;\" componentFilter>   \n                <span class=\"fl filterButton currentFilter\">\u7701\u4EFD</span>\n                <span class=\"fl filterButton custom\">\u81EA\u5B9A\u4E49</span>\n            </div>               \n            \n            <div class=\"component_city clrfix component_city_province\" componentCity>\n                <div class=\"component_top\">\n                    <div class=\"fr city_right\"><input type=\"text\" placeholder=\"\u8F93\u5165\u68C0\u7D22\u8BCD\" class=\"city_right_search\"></div>\n                    <div class=\"fl city_left\">\n                        <div class=\"component_top_select_box\" data-type=\"filter-classify\">\n                        <div class=\"component_top_select_title\"></div>\n                        <div class=\"component_top_select_list\" componentCityLeftList></div>\n                    </div>\n                    </div>\n                </div>\n                <div class=\"component_city_list clrfix\">\n                    <div class=\"selectList fl provinceList\"></div>\n                    <div class=\"selectList fl cityList selectFilterIndex2\"></div>\n                    <div class=\"fl storeList selectFilterIndex2\"></div>\n                </div>\n                <div class=\"component_bottom\">\n                    <div class=\"component_bottom_r fr\">\n                        <a componentCityCancel>\u53D6\u6D88</a>\n                        <a componentCityConfirm>\u786E\u5B9A</a>\n                    </div>\n                    <div class=\"component_bottom_l fl\">\u5DF2\u9009\u62E9<span>0</span>\u4E2A</div>\n                </div>\n            </div>\n        </div>") || this;
    }
    return ProvinceFilterTemplate;
}(template_base_1.BaseTemplate));
exports.ProvinceFilterTemplate = ProvinceFilterTemplate;
//# sourceMappingURL=provinceFilter.template.js.map