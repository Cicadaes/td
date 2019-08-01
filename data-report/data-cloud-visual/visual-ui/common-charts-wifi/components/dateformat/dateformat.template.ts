/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "datwill-sdk/lib/views/base/template.base";

export class DateformatTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%；display:table">
                    <div style="display: table-cell;vertical-align: middle;padding: 0 13px;font-family: '微软雅黑'">
                        <p-datepicker dateFormat="yy-mm-dd"></p-datepicker>
                     </div>
                </div>`)
    }
}