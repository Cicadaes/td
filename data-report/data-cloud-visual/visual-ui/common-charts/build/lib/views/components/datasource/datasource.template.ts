/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class DatasourceTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%">
            <div class="component_title clrfix">
                <div class="left" componentTitle>已选数据源</div>
                <div class="chart-selectline left">
                    <div class="chart-selectline-title none" commonChange></div>
                </div>
            </div>
            <div class="chart-textarea-style"><textarea commonConfigBody></textarea></div>
            <div commonConfigButton class="chart-post-button">应用</div>
            <div class="chart-textarea-style"><textarea commonConfigData></textarea></div>
        </div>`)
    }
}