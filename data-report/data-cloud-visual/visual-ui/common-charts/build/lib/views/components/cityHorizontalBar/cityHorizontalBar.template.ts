/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class CityHorizontalBarTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%">
                <div class = "containerLeftTit containercityHorizontalTit"><span></span>城市级别</div>
                <div containerChartWap class="cityHorizontalChartWap">
                    <div class="cityHorizontalBarWap">
                        <h3 class="cityHorizontalBarWapTit cityHorizontalBarWapTitFirst"><i>全部城市</i><b></b></h3>
                        <div containerChartFirst style="width:100%;height:calc(100% - 30px);"></div>
                    </div>
                    <div  class="cityHorizontalBarWap">
                        <h3 class="cityHorizontalBarWapTit cityHorizontalBarWapTitSecond"><i>一线城市</i><b></b></h3>
                        <div containerChartSecond style="width:100%;height:calc(100% - 30px);"></div>
                    </div>
                    <div   class="cityHorizontalBarWap">
                        <h3 class="cityHorizontalBarWapTit cityHorizontalBarWapTitThird"><i>二线城市</i><b></b></h3>
                        <div containerChartThird style="width:100%;height:calc(100% - 30px);"></div>
                    </div>
                    <div  class="cityHorizontalBarWap">
                        <h3 class="cityHorizontalBarWapTit cityHorizontalBarWapTitFourth"><i>三线城市</i><b></b></h3>
                        <div containerChartFourth style="width:100%;height:calc(100% - 30px);"></div>
                    </div>
                </div>
           
        </div>`)
    }
}