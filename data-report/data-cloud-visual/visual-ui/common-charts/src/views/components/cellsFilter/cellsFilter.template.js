"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_base_1 = require("../../base/template.base");
var CellsFilterTemplate = (function (_super) {
    __extends(CellsFilterTemplate, _super);
    function CellsFilterTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%;\">\n        <div class=\"l cellsLeft\" componentFilter>\n            <span class=\"fl filterButton regionFilter currentFilter\">region</span>\n            <span class=\"fl filterButton custom \">\u81EA\u5B9A\u4E49</span>\n        </div> \n        <div class=\"component_cells clrfix\" componentOverall>\n            <div class=\"component_top clrfix\">\n                <div class=\"r overall_right\"><input type=\"text\" placeholder=\"\u8F93\u5165\u68C0\u7D22\u8BCD\" class=\"cells_right_search\"></div>\n                <div class=\"l overall_left\">\n                    <div class=\"component_top_select\" data-type=\"filter-classify\">\n                    <div class=\"component_top_select_title\" data-type=\"filter-classify\">\u6309\u5E97\u94FA\u67E5\u770B</div>\n                    <div class=\"component_top_select_list\" componentCellsLeftList></div>\n                </div>\n                </div>\n                <div class=\"l overall_child\"></div>\n            </div>\n            <div class=\"clrfix\">\n                <div class=\"component_cells_list\" style=\"width: 678px\"></div>\n                <!--<div class=\"component_cells_option\"></div>-->\n            </div>\n            <div class=\"component_bottom\">\n                <div class=\"component_bottom_r r\">\n                    <a componentOverallCancel>\u53D6\u6D88</a>\n                    <a componentOverallConfirm>\u786E\u5B9A</a>\n                </div>\n                <div class=\"component_bottom_l l\">\u5DF2\u9009\u62E9<span>0</span>\u4E2A  \u6700\u591A\u53EF\u9009\u62E9<strong>100</strong>\u4E2A</div>\n            </div>\n        </div>\n        </div>") || this;
    }
    return CellsFilterTemplate;
}(template_base_1.BaseTemplate));
exports.CellsFilterTemplate = CellsFilterTemplate;
//# sourceMappingURL=cellsFilter.template.js.map