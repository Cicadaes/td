/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class PieBarTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%;position: relative;">
            <div class="pieBar_saveCrowdBtn r">另存人群</div>
            <div class="pieBar_list">
                <div class="pieBar"><b></b>价值分类</div>
                <div class="pieBar_con" style="width: 80%;">
                    <div class="pieBar_all"><h3></h3><h4>总计</h4></div>
                    <div commonPieCharts  style="width:100%;height:100%;"></div>
                </div>
                <div style="margin-left: -10%; width: 30%;" class="pieBar_con">
                    <div class="pieBar_pie_list"></div>
                </div>
            </div>
            <div  class="pieBar_list">
                <div class="pieBar"><b></b>价值细分类</div>
                <div commonBarCharts  style="width:100%;height:calc(100% - 56px);"></div>
            </div>
        </div>`)
    }
}