/**
 * Created by zhaoxue on 2017-03-31.
 */
import {BaseTemplate} from "../../base/template.base";

export class PriviewTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component scopeID=${scopeID} style="width:100%;height: 100%;display: table;">
                 <div container style="display: table-cell;vertical-align: middle;padding: 0 13px;font-family: '微软雅黑'">
                    <h3 containerh3 style="color:#ccc;font-size:16px;"></h3>   
                     <h4 containerh4 style="color:#666;font-size:26px;"></h4>
                 </div>                   

                </div>`)
    }
}