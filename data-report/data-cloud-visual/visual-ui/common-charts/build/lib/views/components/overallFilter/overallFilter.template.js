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
var OverallFilterTemplate = (function (_super) {
    __extends(OverallFilterTemplate, _super);
    function OverallFilterTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n            <div class=\"component_title clrfix\">\n                <div class=\"left\" componentFilter><span class=\"overall_filter_icon\"></span></div>\n                <div class=\"overallSelected\"></div>\n                <!--<div componentDatasourceHelp class=\"component_help r component_icon\" style=\"display: block;\">-->\n                    <!--<span class=\"icon_help_button\"></span>-->\n                    <!--<p componentDatasourceHelpText></p>-->\n                <!--</div>-->\n            </div>\n            <div class=\"component_overall clrfix\" componentOverall>\n                <div class=\"component_top\">\n                    <div class=\"r overall_right\"><input type=\"text\" placeholder=\"\u8F93\u5165\u68C0\u7D22\u8BCD\" class=\"overall_right_search\"></div>\n                    <div class=\"l overall_left\">\n                        <div class=\"component_top_select\" data-type=\"filter-classify\">\n                        <div class=\"component_top_select_title\" data-type=\"filter-classify\" componentTitleSelected>\u6309\u5E97\u94FA\u67E5\u770B</div>\n                        <div class=\"component_top_select_list\" componentOverallLeftList></div>\n                    </div>\n                    </div>\n                    <div class=\"l overall_child\"></div>\n                </div>\n                <div class=\"component_overall_list\">\n                    <div class=\"component_overall_none\"></div>\n                    <ul></ul>\n                </div>\n                <div class=\"component_bottom\">\n                    <div class=\"component_bottom_r r\">\n                        <a componentOverallCancel>\u53D6\u6D88</a>\n                        <a componentOverallConfirm>\u786E\u5B9A</a>\n                    </div>\n                    <div class=\"component_bottom_l l\">\u5DF2\u9009\u62E9<span>0</span>\u4E2A  \u6700\u591A\u53EF\u9009\u62E9<strong></strong>\u4E2A<em style=\"color: #f00; padding-left:15px\"></em></div>\n                </div>\n            </div>\n        </div>") || this;
    }
    return OverallFilterTemplate;
}(template_base_1.BaseTemplate));
exports.OverallFilterTemplate = OverallFilterTemplate;
//# sourceMappingURL=overallFilter.template.js.map