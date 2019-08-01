/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "datwill-sdk/lib/views/base/template.base";

export class LineTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div id='drf2jh2j5tskbbda' style="width:100%;height: 100%">
            <!--<div commonChange style="margin-bottom:15px;border: 1px solid #3c3f41; border-radius: 5px; background: #fff; padding: 5px 10px; cursor: pointer;">请选择</div>-->
            <!--<div commonSelectList style="position: absolute; left: 0; top: 32px; z-index: 2; display: none; width: 100%; border: 1px solid #3c3f41; border-radius: 5px; background: #fff; padding: 10px; cursor: pointer;"></div>-->
            <div commonCharts  style="width:100%;height: 100%"></div>
        </div>`)
    }
}