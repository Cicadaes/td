
import { BaseTemplate } from "../../base/template.base";

export class DayCalendarFilterTemplate extends BaseTemplate {
    constructor(scopeID: String) {
        super(`<div component id=${scopeID} style="width:100%;height: 100%;">
                    <div class="clrfix filter-box">
                        <div id="dayCalendar" class="fl filter-calendar dayCalendarFilter" style="z-index:9999;width:240px;">
                            
                        </div>
                        <div class="calendar-text" style="position:absolute;top:0;width:240px;height:32px;">
                            <span id="date-calendar" class="date-calendar" ></span>
                            <span class="icon-calendar"></span>
                            <a href="javascript:;" class="date-btn" id="date-btn">
                                <i class='triangle_icon'></i>
                            </a>
                        </div>
                    </div>
                </div>`)
    }
}