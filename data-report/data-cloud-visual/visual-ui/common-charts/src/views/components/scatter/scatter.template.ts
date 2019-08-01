/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class ScatterTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component=${scopeID} id=${scopeID} class='scatterComponent' style="width:100%;height: 100%;background:#fff;border-radius:5px;padding-right:20px;">
            
            <div containerLeft style="width:65%;height:calc(100% - 30px);padding:24px;float:left;position:relative;">
                <div containerXY class='containerXY clrfix' style="width:100%;height:30px;margin-bottom:20px;">
                    <span class='fl'>X轴</span><div class='indicator'><div class='indicatorBox fl'><span></span><i class='triangle_icon'></i></div><div class='indicatorItems' name='indicatorX'></div></div>
                    <span class='fl'>Y轴</span><div class='indicator'><div class='indicatorBox fl'><span></span><i class='triangle_icon'></i></div><div class='indicatorItems' name='indicatorY'></div></div>
                </div>
                    <b ScatterQuadrantA class="quadrantRegion" style="position: absolute; right: 36px;top: 112px;z-index: 1;font-weight: bold;">A区</b>
                    <b ScatterQuadrantB class="quadrantRegion" style="position:absolute;left:calc(3% + 56px);top:112px;z-index: 1;font-weight: bold;">B区</b>
                    <b ScatterQuadrantC class="quadrantRegion" style="position:absolute;left:calc(3% + 56px);bottom:8%;z-index: 1;font-weight: bold;">C区</b>
                    <b ScatterQuadrantD class="quadrantRegion" style="position:absolute;right:36px;bottom:8%;z-index: 1;">D区</b>
                </b>
                <div containerScatter style="width:100%;height:calc(100% - 30px);display:none;">
                    
                </div>    
                <div containerNodata style="width:100%;height:calc(100% - 30px);"><div style="width:100%;padding-top:10%;text-align:center">暂无数据</div></div>
                
            </div>
            <div containerRight style="width:35%;height:calc(100% - 30px);float:left;padding:24px 0 10px 24px;"></div>
        </div>`)
    }
}