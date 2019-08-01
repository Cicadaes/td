/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class CityFilterTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 24px;position:relative;" class="cityFilterComponent">
        
            <div class="clrfix" style="width:100%;height: 100%; padding-right: 20px;" componentFilter>   
                <span class="fl filterButton custom" style="width: 55px; float: right;">自定义</span>
                <span class="fl filterButton sameCounty" style="width: 55px; float: right;">同区县</span>
                <span class="fl filterButton sameMall" style="width: 55px; float: right;">同商场</span>
                <span class="fl filterButton defaultFilter currentFilter" style="width: 55px; float: right;">同城</span>
            </div>               
            
            <div class="component_city clrfix" componentCity>
                <div class="component_top">
                    <div class="fr city_right"><input type="text" placeholder="输入检索词" class="city_right_search"></div>
                    <div class="fl city_left">
                        
                    </div>
                </div>
                <div class="component_city_list clrfix"><div class="brandListBox fl"><div style="text-align:center;padding-top:42%;">暂无数据</div></div><div class="selectList fl"><div style="text-align:center;padding-top:42%;">暂无数据</div></div></div>
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