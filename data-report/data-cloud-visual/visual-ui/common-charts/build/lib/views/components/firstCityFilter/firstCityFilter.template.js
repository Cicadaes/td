"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by nieyechen on 2017/11/15.
 */
var template_base_1 = require("../../base/template.base");
var FirstCityFilterTemplate = (function (_super) {
    __extends(FirstCityFilterTemplate, _super);
    function FirstCityFilterTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:112px;height: 24px;position:relative;\" class=\"firstCityFilterComponent\">\n        \n            <div class=\"clrfix\" style=\"width:100%;height: 100%;\" componentFilter>   \n                <span class=\"fl filterButton defaultFilter currentFilter\">\u57CE\u5E02</span>\n                <span class=\"fl filterButton custom\">\u81EA\u5B9A\u4E49</span>\n            </div>               \n            \n            <div class=\"component_city clrfix\" componentCity>\n                <div class=\"component_top\">\n                    <div class=\"fr city_right\"><input type=\"text\" placeholder=\"\u8F93\u5165\u68C0\u7D22\u8BCD\" class=\"city_right_search\"></div>\n                    <div class=\"fl city_left\">\n                        <div class=\"component_top_select_box\" data-type=\"filter-classify\">\n                        <div class=\"component_top_select_title\"></div>\n                        <div class=\"component_top_select_list\" componentCityLeftList></div>\n                    </div>\n                    </div>\n                </div>\n                <div class=\"component_city_list clrfix\">\n                    <div class=\"brandListBox provinceBox fl\"><div style=\"text-align:center;padding-top:42%;\">\u6682\u65E0\u6570\u636E</div></div>\n                    <div class=\"brandListBox cityBox fl\"><div style=\"text-align:center;padding-top:42%;\">\u6682\u65E0\u6570\u636E</div></div>\n                    <div class=\"selectList brandBox fl\"><div style=\"text-align:center;padding-top:42%;\">\u6682\u65E0\u6570\u636E</div></div>\n                </div>\n                <div class=\"component_bottom\">\n                    <div class=\"component_bottom_r fr\">\n                        <a componentCityCancel>\u53D6\u6D88</a>\n                        <a componentCityConfirm>\u786E\u5B9A</a>\n                    </div>\n                    <div class=\"component_bottom_l fl\">\u5DF2\u9009\u62E9<span>0</span>\u4E2A  \u6700\u591A\u53EF\u9009\u62E9<strong>4</strong>\u4E2A</div>\n                </div>\n            </div>\n        </div>") || this;
    }
    return FirstCityFilterTemplate;
}(template_base_1.BaseTemplate));
exports.FirstCityFilterTemplate = FirstCityFilterTemplate;
//# sourceMappingURL=firstCityFilter.template.js.map