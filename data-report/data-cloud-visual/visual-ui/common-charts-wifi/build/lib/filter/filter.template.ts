
import { BaseTemplate } from "datwill-sdk/lib/views/base/template.base";

export class FilterTemplate extends BaseTemplate {
    constructor(scopeID: String) {
        super(`<div component id=${scopeID} style="width:100%;height: 100%;overflow: hidden;">
                    <div class="clrfix filter-box">
                        <div class="fl filter-choice">
                            <span class="show-date">按天查看</span>
                            <i class='triangle_icon'></i>
                            <ul class="filter-choice-list">
                                <li data-type="day">按天查看</li>
                                <li data-type="week">按周查看</li>
                                <li data-type="month">按月查看</li>
                            </ul>
                        </div>
                        <div id="calendar" class="fl filter-calendar">
                            <span id="date-calendar" class="date-calendar" ></span>
                            <a href="javascript:;" class="date-btn" id="date-btn">
                                <i class='triangle_icon'></i>
                            </a>
                        </div>
                        
                    </div>
                </div>`)
    }
}