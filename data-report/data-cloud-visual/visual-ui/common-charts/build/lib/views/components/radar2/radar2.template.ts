/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class Radar2Template extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component=${scopeID} id=${scopeID} style="width:100%;height: 100%" class='radar2Component'>

            <div containerHead class="clrfix containerHead">   
                <span class="funnelTitle">销售雷达<span>                               
                <span class="funnelHelp fr"></span>
            </div>
        
            <div class='radarBox'>
                <div radarContainer style="width: 800px;height: 300px;margin:40px auto;position:relative;">
                    <div radarChart style="width:100%;height: 100%"></div>
                </div>
            </div>
            
        
        </div>`)
    }
}