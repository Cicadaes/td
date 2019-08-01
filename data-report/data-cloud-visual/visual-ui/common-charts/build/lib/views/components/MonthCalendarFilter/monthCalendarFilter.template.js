"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_base_1 = require("../../base/template.base");
var MonthCalendarFilterTemplate = (function (_super) {
    __extends(MonthCalendarFilterTemplate, _super);
    function MonthCalendarFilterTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%;\">\n                    <div class=\"clrfix filter-box\" style=\"position: relative\">\n                        <div id=\"calendar\" class=\"fl filter-calendar monthCalendarFilter\" style=\"z-index:9999;width:94px;position: absolute;right: 0;\">\n                            \n                        </div>\n                        <div class=\"calendar-text\" style=\"position:absolute;top:0;right:20px;width:596px;height:24px;\">\n                            <div class=\"monthCalendar_button r\">\u5BF9\u6BD4\u6708\u4EFD</div>\n                            <ul class=\"monthCalendar_list\">\n                                \n                            </ul>\n                        </div>\n                    </div>\n                </div>") || this;
    }
    return MonthCalendarFilterTemplate;
}(template_base_1.BaseTemplate));
exports.MonthCalendarFilterTemplate = MonthCalendarFilterTemplate;
//# sourceMappingURL=monthCalendarFilter.template.js.map