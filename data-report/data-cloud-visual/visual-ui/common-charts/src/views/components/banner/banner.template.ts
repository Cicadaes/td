/**
 * Created by zhaoxue on 2017-03-31.
 */
import {BaseTemplate} from "../../base/template.base";

export class BannerTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component scopeID=${scopeID} style="width:100%;height: 100%;">
                 <div container style="width:100%;height: 100%;position:absolute"></div>
                </div>`)
    }
}