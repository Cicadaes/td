
import { BaseTemplate } from "../../base/template.base";

export class CellsFilterTemplate extends BaseTemplate {
    constructor(scopeID: String) {
        super(`<div component id=${scopeID} style="width:100%;height: 100%;">
        <div class="l cellsLeft" componentFilter>
            <span class="fl filterButton regionFilter currentFilter">region</span>
            <span class="fl filterButton custom ">自定义</span>
        </div> 
        <div class="component_cells clrfix" componentOverall>
            <div class="component_top clrfix">
                <div class="r overall_right"><input type="text" placeholder="输入检索词" class="cells_right_search"></div>
                <div class="l overall_left">
                    <div class="component_top_select" data-type="filter-classify">
                    <div class="component_top_select_title" data-type="filter-classify">按店铺查看</div>
                    <div class="component_top_select_list" componentCellsLeftList></div>
                </div>
                </div>
                <div class="l overall_child"></div>
            </div>
            <div class="clrfix">
                <div class="component_cells_list" style="width: 678px"></div>
                <!--<div class="component_cells_option"></div>-->
            </div>
            <div class="component_bottom">
                <div class="component_bottom_r r">
                    <a componentOverallCancel>取消</a>
                    <a componentOverallConfirm>确定</a>
                </div>
                <div class="component_bottom_l l">已选择<span>0</span>个  最多可选择<strong>100</strong>个</div>
            </div>
        </div>
        </div>`)
    }
}