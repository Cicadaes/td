/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class RectFunnelTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%" class="rectFunnelComponent">
            <div containerHead class="clrfix containerHead">   
                <span class="funnelTitle">转化指标<span>           
                <div class="compareBox clrfix fr">
                    <span class="fl">不同客群指标对比</span>
                    <div class="compareButton close fl"><span></span></div>
                    <span class="funnelHelp fl"></span>
                </div>
            </div>
            
            <div containerRectFunnel class="clrfix" style="width:100%;height:calc(100% - 40px);padding:0 150px 25px;position:relative;">                       
                <div style="width:100%;transform: translateX(50%);position:relative;z-index:1;padding:15px 0;">
                    <div class="selectBox clrfix">
                        <div class="chart-selectline fl">
                            <div class="chart-selectline-title"></div>
                            <div class="chart-selectline-list hide" type="0"><ul></ul></div>
                        </div>
                        <div class="fl" style="line-height:42px;margin:0 24px;">VS</div>
                        <div class="chart-selectline fl">
                            <div class="chart-selectline-title"></div>
                            <div class="chart-selectline-list hide" type="1"><ul></ul></div>
                        </div>
                    </div>
                </div>
                <div style="position:relative;">
                    <div class="noData">暂无数据</div>
                    <div class="rectFunnelBox clrfix"></div>
                    <ul class="rectFunnelLegend"></ul>
                </div>                
            </div>        
        </div>`)
    }
}