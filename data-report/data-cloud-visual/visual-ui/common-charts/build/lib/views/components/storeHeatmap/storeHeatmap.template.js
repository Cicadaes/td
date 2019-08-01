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
var StoreHeatmapTemplate = (function (_super) {
    __extends(StoreHeatmapTemplate, _super);
    function StoreHeatmapTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n            <!--<div class=\"component_title clrfix stack-bar\">-->\n                <!--<div class=\"left\" componentTitleFont></div>-->\n                <!--<div class=\"chart-selectline left\">-->\n                    <!--<div class=\"chart-selectline-title\" commonChange>\u8BF7\u9009\u62E9</div>-->\n                    <!--<div commonSelectList class=\"chart-selectline-list\"></div>-->\n                <!--</div>-->\n            <!--</div>-->\n            <div class=\"container\" style=\"padding: 0;\">\n                <div class=\"margin_bottom_panel\">\n                    <div id=\"map-canvas\" class=\"trend clearfix\" style=\"height:736px; width:1280px; padding: 0;\">\n                        <img id=\"backImg\" src=\"images/store_default.png\" style=\"width: 100%; height: 100%;\"/>\n                    </div>\n                </div>\n            </div>\n        </div>") || this;
    }
    return StoreHeatmapTemplate;
}(template_base_1.BaseTemplate));
exports.StoreHeatmapTemplate = StoreHeatmapTemplate;
//# sourceMappingURL=storeHeatmap.template.js.map