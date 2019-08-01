/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class OverallFilterTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%">
            <div class="component_title clrfix">
                <div class="left" componentFilter><span class="overall_filter_icon"></span></div>
                <div class="overallSelected"></div>
                <!--<div componentDatasourceHelp class="component_help r component_icon" style="display: block;">-->
                    <!--<span class="icon_help_button"></span>-->
                    <!--<p componentDatasourceHelpText></p>-->
                <!--</div>-->
            </div>
            <div class="component_overall clrfix" componentOverall>
                <div class="component_top">
                    <div class="r overall_right"><input type="text" placeholder="输入检索词" class="overall_right_search"></div>
                    <div class="l overall_left">
                        <div class="component_top_select" data-type="filter-classify">
                        <div class="component_top_select_title" data-type="filter-classify" componentTitleSelected>按店铺查看</div>
                        <div class="component_top_select_list" componentOverallLeftList></div>
                    </div>
                    </div>
                    <div class="l overall_child"></div>
                </div>
                <div class="component_overall_list">
                    <div class="component_overall_none"></div>
                    <ul></ul>
                </div>
                <div class="component_bottom">
                    <div class="component_bottom_r r">
                        <a componentOverallCancel>取消</a>
                        <a componentOverallConfirm>确定</a>
                    </div>
                    <div class="component_bottom_l l">已选择<span>0</span>个  最多可选择<strong></strong>个<em style="color: #f00; padding-left:15px"></em></div>
                </div>
            </div>
        </div>`)
    }
}