
import { BaseTemplate } from "../../base/template.base";

export class FilterTemplate extends BaseTemplate {
    constructor(scopeID: String) {
        super(`<div component id=${scopeID} style="width:100%;height: 100%;">
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
                        <div id="calendar" class="fl filter-calendar" style="z-index:9999;width:240px;">
                            
                        </div>
                        <div class="calendar-text" style="position:absolute;top:0;left:98px;width:240px;height:32px;">
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