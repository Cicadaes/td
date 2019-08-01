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
var CityFilterTemplate = (function (_super) {
    __extends(CityFilterTemplate, _super);
    function CityFilterTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 24px;position:relative;\" class=\"cityFilterComponent\">\n        \n            <div class=\"clrfix\" style=\"width:100%;height: 100%; padding-right: 20px;\" componentFilter>   \n                <span class=\"fl filterButton custom\" style=\"width: 55px; float: right;\">\u81EA\u5B9A\u4E49</span>\n                <span class=\"fl filterButton sameCounty\" style=\"width: 55px; float: right;\">\u540C\u533A\u53BF</span>\n                <span class=\"fl filterButton sameMall\" style=\"width: 55px; float: right;\">\u540C\u5546\u573A</span>\n                <span class=\"fl filterButton defaultFilter currentFilter\" style=\"width: 55px; float: right;\">\u540C\u57CE</span>\n            </div>               \n            \n            <div class=\"component_city clrfix\" componentCity>\n                <div class=\"component_top\">\n                    <div class=\"fr city_right\"><input type=\"text\" placeholder=\"\u8F93\u5165\u68C0\u7D22\u8BCD\" class=\"city_right_search\"></div>\n                    <div class=\"fl city_left\">\n                        \n                    </div>\n                </div>\n                <div class=\"component_city_list clrfix\"><div class=\"brandListBox fl\"><div style=\"text-align:center;padding-top:42%;\">\u6682\u65E0\u6570\u636E</div></div><div class=\"selectList fl\"><div style=\"text-align:center;padding-top:42%;\">\u6682\u65E0\u6570\u636E</div></div></div>\n                <div class=\"component_bottom\">\n                    <div class=\"component_bottom_r fr\">\n                        <a componentCityCancel>\u53D6\u6D88</a>\n                        <a componentCityConfirm>\u786E\u5B9A</a>\n                    </div>\n                    <div class=\"component_bottom_l fl\">\u5DF2\u9009\u62E9<span>0</span>\u4E2A</div>\n                </div>\n            </div>\n        </div>") || this;
    }
    return CityFilterTemplate;
}(template_base_1.BaseTemplate));
exports.CityFilterTemplate = CityFilterTemplate;
//# sourceMappingURL=cityFilter.template.js.map