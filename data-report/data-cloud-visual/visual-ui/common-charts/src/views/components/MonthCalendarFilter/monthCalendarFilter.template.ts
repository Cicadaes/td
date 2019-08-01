
import { BaseTemplate } from "../../base/template.base";

export class MonthCalendarFilterTemplate extends BaseTemplate {
    constructor(scopeID: String) {
        super(`<div component id=${scopeID} style="width:100%;height: 100%;">
                    <div class="clrfix filter-box" style="position: relative">
                        <div id="calendar" class="fl filter-calendar monthCalendarFilter" style="z-index:9999;width:94px;position: absolute;right: 0;">
                            
                        </div>
                        <div class="calendar-text" style="position:absolute;top:0;right:20px;width:596px;height:24px;">
                            <div class="monthCalendar_button r">对比月份</div>
                            <ul class="monthCalendar_list">
                                
                            </ul>
                        </div>
                    </div>
                </div>`)
    }
}