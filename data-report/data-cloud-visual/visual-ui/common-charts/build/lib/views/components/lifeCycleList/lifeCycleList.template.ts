/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class LifeCycleListTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%">
            <div class="component_lifeCycleList clrfix" commonLifeCycleList>
                
                
            </div>
        </div>`)
    }
}