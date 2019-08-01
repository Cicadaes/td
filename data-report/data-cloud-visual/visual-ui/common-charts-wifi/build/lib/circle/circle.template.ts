/**
 * Created by zhaoxue on 2017-03-31.
 */
import {BaseTemplate} from "datwill-sdk/lib/views/base/template.base";

export class CircleTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component scopeID=${scopeID} style="width:100%;height: 100%;">
                 <div container style="width:100%;height: 100%;position:absolute;border-radius:50%;"></div>
                </div>`)
    }
}