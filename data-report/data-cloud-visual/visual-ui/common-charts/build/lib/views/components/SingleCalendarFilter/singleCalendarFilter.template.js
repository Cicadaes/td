"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_base_1 = require("../../base/template.base");
var SingleCalendarFilterTemplate = (function (_super) {
    __extends(SingleCalendarFilterTemplate, _super);
    function SingleCalendarFilterTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%;\">\n                    <div class=\"clrfix filter-box\">\n                        <div id=\"singleCalendar\" class=\"fl filter-calendar dayCalendarFilter\" style=\"z-index:9999;width:180px;\">\n                            \n                        </div>\n                        <div class=\"calendar-text\" style=\"position:absolute;top:0;left:0;width:180px;height:32px;\">\n                            <span id=\"date-calendar\" class=\"date-calendar\" style=\"width: 170px\"></span>\n                            <span class=\"icon-calendar\"></span>\n                            <a href=\"javascript:;\" class=\"date-btn\" id=\"date-btn\">\n                                <i class='triangle_icon'></i>\n                            </a>\n                        </div>\n                    </div>\n                </div>") || this;
    }
    return SingleCalendarFilterTemplate;
}(template_base_1.BaseTemplate));
exports.SingleCalendarFilterTemplate = SingleCalendarFilterTemplate;
//# sourceMappingURL=singleCalendarFilter.template.js.map