/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "datwill-sdk/lib/views/base/template.base";

export class ScatterTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component=${scopeID} id=${scopeID} class='scatterComponent' style="width:100%;height: 100%;background:#fff;">
            <div containerHead class="clrfix containerHead" style="height:40px;line-height:40px;">
                <span class="fl" style="font-size:14px;font-weight:bold;font-family: PingFangSC-Medium;">四象限分布图</span>              
                <span class="fr filterButton custom">自定义</span>
                <span class="fr filterButton region currentFilter">Region</span>
            </div>
            <div containerLeft style="width:65%;height:calc(100% - 40px);padding:24px;float:left">
                <div containerXY class='containerXY clrfix' style="width:100%;height:30px;margin-bottom:20px;">
                    <span class='fl'>X轴</span><div class='indicator'><div class='indicatorBox fl'><span></span><i class='triangle_icon'></i></div><div class='indicatorItems' name='indicatorX'></div></div>
                    <span class='fl'>Y轴</span><div class='indicator'><div class='indicatorBox fl'><span></span><i class='triangle_icon'></i></div><div class='indicatorItems' name='indicatorY'></div></div>
                </div>
                <div containerScatter style="width:100%;height:calc(100% - 30px);"></div>
            </div>
            <div containerRight style="width:35%;height:calc(100% - 40px);float:left;padding:24px 0 10px 24px;"></div>
        </div>`)
    }
}