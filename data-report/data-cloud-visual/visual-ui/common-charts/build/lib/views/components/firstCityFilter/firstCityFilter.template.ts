/**
 * Created by nieyechen on 2017/11/15.
 */
import {BaseTemplate} from "../../base/template.base";

export class FirstCityFilterTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:112px;height: 24px;position:relative;" class="firstCityFilterComponent">
        
            <div class="clrfix" style="width:100%;height: 100%;" componentFilter>   
                <span class="fl filterButton defaultFilter currentFilter">城市</span>
                <span class="fl filterButton custom">自定义</span>
            </div>               
            
            <div class="component_city clrfix" componentCity>
                <div class="component_top">
                    <div class="fr city_right"><input type="text" placeholder="输入检索词" class="city_right_search"></div>
                    <div class="fl city_left">
                        <div class="component_top_select_box" data-type="filter-classify">
                        <div class="component_top_select_title"></div>
                        <div class="component_top_select_list" componentCityLeftList></div>
                    </div>
                    </div>
                </div>
                <div class="component_city_list clrfix">
                    <div class="brandListBox provinceBox fl"><div style="text-align:center;padding-top:42%;">暂无数据</div></div>
                    <div class="brandListBox cityBox fl"><div style="text-align:center;padding-top:42%;">暂无数据</div></div>
                    <div class="selectList brandBox fl"><div style="text-align:center;padding-top:42%;">暂无数据</div></div>
                </div>
                <div class="component_bottom">
                    <div class="component_bottom_r fr">
                        <a componentCityCancel>取消</a>
                        <a componentCityConfirm>确定</a>
                    </div>
                    <div class="component_bottom_l fl">已选择<span>0</span>个  最多可选择<strong>4</strong>个</div>
                </div>
            </div>
        </div>`)
    }
}