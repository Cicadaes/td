/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class LineBarTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%;position: relative;">
            <!--<div commonTotal style="position: absolute; left: 30px; top: 10px; color: #80848f">总计 <span style="color: #1c2438;font-size: 18px"></span></div>-->
            <div commonCharts  style="width:100%;height:100%;"></div>
        </div>`)
    }
}