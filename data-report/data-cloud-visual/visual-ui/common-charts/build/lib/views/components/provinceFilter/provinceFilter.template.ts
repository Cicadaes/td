/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class ProvinceFilterTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:112px;height: 24px;position:relative;" class="cityFilterComponent provinceFilterComponent">
        
            <div class="clrfix" style="width:100%;height: 100%;" componentFilter>   
                <span class="fl filterButton currentFilter">省份</span>
                <span class="fl filterButton custom">自定义</span>
            </div>               
            
            <div class="component_city clrfix component_city_province" componentCity>
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
                    <div class="selectList fl provinceList"></div>
                    <div class="selectList fl cityList selectFilterIndex2"></div>
                    <div class="fl storeList selectFilterIndex2"></div>
                </div>
                <div class="component_bottom">
                    <div class="component_bottom_r fr">
                        <a componentCityCancel>取消</a>
                        <a componentCityConfirm>确定</a>
                    </div>
                    <div class="component_bottom_l fl">已选择<span>0</span>个</div>
                </div>
            </div>
        </div>`)
    }
}