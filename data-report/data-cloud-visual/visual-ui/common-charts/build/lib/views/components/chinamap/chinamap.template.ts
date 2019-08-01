/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class ChinaMapTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%">
            <div class="component_title clrfix">
                <div class="left" componentTitleFont></div>
            </div>
           <div containerLeft style="width:70%;height:calc(100% - 40px);padding:24px;float:left">
                <div class = "containerLeftTit"><span></span>地域分布</div>
                <div containerChainMap style="width:100%;height:calc(100% - 10px);"></div>
            </div>
            <div containerRight style="width:30%;height:calc(100% - 40px);float:left;padding:24px 0 10px 24px;"></div>
        </div>`)
    }
}