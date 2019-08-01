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
var CityPreviewTemplate = (function (_super) {
    __extends(CityPreviewTemplate, _super);
    function CityPreviewTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n            <div class=\"container cityPreview\" style=>\n                <div class=\"margin_bottom_panel\" style=\"position: relative\">\n                    <div class=\"region_top\">\n                        <ul>\n                            <li><span class=\"zy_icon icon_probe\"></span>\u5E97\u94FA1</li>\n                            <li><span class=\"icon_flow\"></span>\u672C\u9636\u6BB5\u5165\u5E97\u5BA2\u6D41</li>\n                            <li><span class=\"icon_mom\"></span>\u73AF\u6BD4\u9636\u6BB5\u5165\u5E97\u5BA2\u6D41</li>\n                        </ul>\n                    </div>\n                    <div id=\"PassengerDistribution_map_div\" class=\"com_dist_map_div\" style=\"height: 600px;\"></div>\n                    <div class=\"job_icon_map\" style=\"position: absolute;\">\n                        <ul>\n                            <li><span class=\"zy_icon icon_location\"></span></li>\n                            <li><span class=\"zy_icon icon_add\"></span></li>\n                            <li><span class=\"zy_icon icon_minus\"></span></li>\n                        </ul>\n                    </div>\n                    <div id=\"draw_div\" style=\"background: rgba(28,36,56,.8);width: 200px;padding: 10px;border-radius: 5px;color: #fff;\">\n                        <div class=\"draw_div_tit\">\n                           \n                        </div>\n                        <div class=\"draw_div_con\">\n                            <div class=\"draw_div_top\">\n                                <b style=\"float:right;\">2017-12-22 ~ 2017-12-22</b>\n                                \u65F6\u671F\n                            </div>\n                            <div class=\"draw_div_traffic draw_div_traffic_flow\">\n                                <p>\n                                    <b class=\"robe_red\" style=\"float:right;\">0</b>\n                                    <span class=\"icon_flow\" style=\"float:left;\"></span>\n                                    <em>\u672C\u9636\u6BB5\u5165\u5E97\u5BA2\u6D41</em>\n                                </p>\n                            </div>\n                            <div class=\"draw_div_traffic draw_div_traffic_mom\">\n                                <p>\n                                    <b class=\"robe_red\" style=\"float:right;\">10</b>\n                                    <span class=\"icon_mom\" style=\"float:left;\"></span>\n                                    <em>\u73AF\u6BD4\u9636\u6BB5\u5165\u5E97\u5BA2\u6D41</em>\n                                </p>\n                            </div>\n                        </div>\n\n                    </div>\n                </div>\n            </div>\n        </div>") || this;
    }
    return CityPreviewTemplate;
}(template_base_1.BaseTemplate));
exports.CityPreviewTemplate = CityPreviewTemplate;
//# sourceMappingURL=cityPreview.template.js.map