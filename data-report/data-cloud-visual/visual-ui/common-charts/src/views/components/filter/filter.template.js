"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_base_1 = require("../../base/template.base");
var FilterTemplate = (function (_super) {
    __extends(FilterTemplate, _super);
    function FilterTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%;\">\n                    <div class=\"clrfix filter-box\">\n                        <div class=\"fl filter-choice\">\n                            <span class=\"show-date\">\u6309\u5929\u67E5\u770B</span>\n                            <i class='triangle_icon'></i>\n                            <ul class=\"filter-choice-list\">\n                                <li data-type=\"day\">\u6309\u5929\u67E5\u770B</li>\n                                <li data-type=\"week\">\u6309\u5468\u67E5\u770B</li>\n                                <li data-type=\"month\">\u6309\u6708\u67E5\u770B</li>\n                            </ul>\n                        </div>\n                        <div id=\"calendar\" class=\"fl filter-calendar\" style=\"z-index:9999;width:240px;\">\n                            \n                        </div>\n                        <div class=\"calendar-text\" style=\"position:absolute;top:0;left:98px;width:240px;height:32px;\">\n                            <span id=\"date-calendar\" class=\"date-calendar\" ></span>\n                            <span class=\"icon-calendar\"></span>\n                            <a href=\"javascript:;\" class=\"date-btn\" id=\"date-btn\">\n                                <i class='triangle_icon'></i>\n                            </a>\n                        </div>\n                    </div>\n                </div>") || this;
    }
    return FilterTemplate;
}(template_base_1.BaseTemplate));
exports.FilterTemplate = FilterTemplate;
//# sourceMappingURL=filter.template.js.map