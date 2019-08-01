/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class StackedBarTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%">
            <div commonCharts  style="width:100%;height: calc(100%)"></div>
        </div>`)
    }
}
// <div class="chart-selectline left">
//     <div class="chart-selectline-title" commonChange>请选择</div>
//     <div commonSelectList class="chart-selectline-list"></div>
// </div>