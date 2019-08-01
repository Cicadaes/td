/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class StoreHeatmapTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%">
            <!--<div class="component_title clrfix stack-bar">-->
                <!--<div class="left" componentTitleFont></div>-->
                <!--<div class="chart-selectline left">-->
                    <!--<div class="chart-selectline-title" commonChange>请选择</div>-->
                    <!--<div commonSelectList class="chart-selectline-list"></div>-->
                <!--</div>-->
            <!--</div>-->
            <div class="container" style="padding: 0;">
                <div class="margin_bottom_panel">
                    <div id="map-canvas" class="trend clearfix" style="height:736px; width:1280px; padding: 0;">
                        <img id="backImg" src="images/store_default.png" style="width: 100%; height: 100%;"/>
                    </div>
                </div>
            </div>
        </div>`)
    }
}