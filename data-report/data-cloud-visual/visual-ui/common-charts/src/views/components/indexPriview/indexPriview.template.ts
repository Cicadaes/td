/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class IndexPriviewTemplate extends BaseTemplate{

    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height:100%;overflow:hidden">        
             </div>`)
    }
}