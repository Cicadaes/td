/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class ManyFilterBarTemplate extends BaseTemplate {
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%">
            <div class="component_title clrfix">
            </div>
            <div commonCharts  style="width:100%;height: calc(100% - 48px)"></div>
        </div>`)
    }
}