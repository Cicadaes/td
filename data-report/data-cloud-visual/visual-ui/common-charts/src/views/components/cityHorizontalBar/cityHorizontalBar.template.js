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
var CityHorizontalBarTemplate = (function (_super) {
    __extends(CityHorizontalBarTemplate, _super);
    function CityHorizontalBarTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n                <div class = \"containerLeftTit containercityHorizontalTit\"><span></span>\u57CE\u5E02\u7EA7\u522B</div>\n                <div containerChartWap class=\"cityHorizontalChartWap\">\n                    <div class=\"cityHorizontalBarWap\">\n                        <h3 class=\"cityHorizontalBarWapTit cityHorizontalBarWapTitFirst\"><i>\u5168\u90E8\u57CE\u5E02</i><b></b></h3>\n                        <div containerChartFirst style=\"width:100%;height:calc(100% - 30px);\"></div>\n                    </div>\n                    <div  class=\"cityHorizontalBarWap\">\n                        <h3 class=\"cityHorizontalBarWapTit cityHorizontalBarWapTitSecond\"><i>\u4E00\u7EBF\u57CE\u5E02</i><b></b></h3>\n                        <div containerChartSecond style=\"width:100%;height:calc(100% - 30px);\"></div>\n                    </div>\n                    <div   class=\"cityHorizontalBarWap\">\n                        <h3 class=\"cityHorizontalBarWapTit cityHorizontalBarWapTitThird\"><i>\u4E8C\u7EBF\u57CE\u5E02</i><b></b></h3>\n                        <div containerChartThird style=\"width:100%;height:calc(100% - 30px);\"></div>\n                    </div>\n                    <div  class=\"cityHorizontalBarWap\">\n                        <h3 class=\"cityHorizontalBarWapTit cityHorizontalBarWapTitFourth\"><i>\u4E09\u7EBF\u57CE\u5E02</i><b></b></h3>\n                        <div containerChartFourth style=\"width:100%;height:calc(100% - 30px);\"></div>\n                    </div>\n                </div>\n           \n        </div>") || this;
    }
    return CityHorizontalBarTemplate;
}(template_base_1.BaseTemplate));
exports.CityHorizontalBarTemplate = CityHorizontalBarTemplate;
//# sourceMappingURL=cityHorizontalBar.template.js.map