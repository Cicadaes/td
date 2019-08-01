/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class CityPreviewTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%">
            <div class="container cityPreview" style=>
                <div class="margin_bottom_panel" style="position: relative">
                    <div class="region_top">
                        <ul>
                            <li><span class="zy_icon icon_probe"></span>店铺1</li>
                            <li><span class="icon_flow"></span>本阶段入店客流</li>
                            <li><span class="icon_mom"></span>环比阶段入店客流</li>
                        </ul>
                    </div>
                    <div id="PassengerDistribution_map_div" class="com_dist_map_div" style="height: 600px;"></div>
                    <div class="job_icon_map" style="position: absolute;">
                        <ul>
                            <li><span class="zy_icon icon_location"></span></li>
                            <li><span class="zy_icon icon_add"></span></li>
                            <li><span class="zy_icon icon_minus"></span></li>
                        </ul>
                    </div>
                    <div id="draw_div" style="background: rgba(28,36,56,.8);width: 200px;padding: 10px;border-radius: 5px;color: #fff;">
                        <div class="draw_div_tit">
                           
                        </div>
                        <div class="draw_div_con">
                            <div class="draw_div_top">
                                <b style="float:right;">2017-12-22 ~ 2017-12-22</b>
                                时期
                            </div>
                            <div class="draw_div_traffic draw_div_traffic_flow">
                                <p>
                                    <b class="robe_red" style="float:right;">0</b>
                                    <span class="icon_flow" style="float:left;"></span>
                                    <em>本阶段入店客流</em>
                                </p>
                            </div>
                            <div class="draw_div_traffic draw_div_traffic_mom">
                                <p>
                                    <b class="robe_red" style="float:right;">10</b>
                                    <span class="icon_mom" style="float:left;"></span>
                                    <em>环比阶段入店客流</em>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>`)
    }
}