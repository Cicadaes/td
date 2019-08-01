/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {ChinaMapTemplate} from "./chinamap.template";
import {Utils} from '../../public/scripts/utils';
import {ChinaMapModel} from './chinamap.model';
import {BaseCharts} from 'datwill-sdk/lib/views/base/base.chart';


export class ChinaMapComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private chartStyle:any = null;
    private chinamapData:ChinaMapModel = null;
    private echartData:any = null;
    private styleObj:any = null;
    constructor(){
        super();

        let template = new ChinaMapTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.chinamapData = new ChinaMapModel();
        function randomData() {
            return Math.round(Math.random()*1000);
        }
        this.echartData = {
            backgroundColor: this.chinamapData.backgroundColor,
            color: this.chinamapData.color,

            title: {
                show: this.chinamapData.title_show,
                text: this.chinamapData.title_text,
                subtext: this.chinamapData.title_subtext,
                left: this.chinamapData.title_left
            },
            tooltip: {
                trigger: this.chinamapData.tooltip_trigger
            },
            legend: {
                orient: this.chinamapData.legend_orient,
                left: this.chinamapData.legend_left,
                top: this.chinamapData.legend_top,
                data: this.chinamapData.legend_data
            },
            visualMap: {
                show: this.chinamapData.visualMap_show,
                min: this.chinamapData.visualMap_min,
                max: this.chinamapData.visualMap_max,
                left: this.chinamapData.visualMap_left,
                top: this.chinamapData.visualMap_top,
                text: this.chinamapData.visualMap_text,           // 文本，默认为数值文本
                orient: this.chinamapData.visualMap_orient,
                itemWidth: this.chinamapData.visualMap_itemWidth,
                itemHeight: this.chinamapData.visualMap_itemHeight,
                calculable: this.chinamapData.visualMap_calculable,
                controller: {
                    inRange: {
                        color: this.chinamapData.visualMap_controller_inRange_color,
                        // symbolSize: [30, 100]
                    }
                }
            },
            series: [
                {
                    name: this.chinamapData.series_name,
                    type: this.chinamapData.series_type,
                    mapType: this.chinamapData.series_mapType,
                    roam: this.chinamapData.series_roam,
                    label: {
                        normal: {
                            show: this.chinamapData.series_label_normal_show,
                            textStyle: {
                                color: this.chinamapData.series_label_normal_textStyle_color,
                                fontFamily: this.chinamapData.series_label_normal_textStyle_fontFamily,
                            }
                        },
                        emphasis: {
                            show: this.chinamapData.series_label_emphasis_show
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: this.chinamapData.series_itemStyle_normal_areaColor
                        },
                        // emphasis: {
                        //     areaColor: this.chinamapData.series_itemStyle_emphasis_areaColor
                        // }
                    },
                    showLegendSymbol: this.chinamapData.series_showLegendSymbol,
                    data: this.chinamapData.series_data
                }
            ]

        }

    }

    public beforeShow(): void {

    }


    public afterShow(): void {

    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {
        if (this.myChart) this.myChart.resize();
    }

     public dataChange(data: any): void {
        if(this.myChart==null){
            this.init();
            data['maptype'] = "mapType";
            let changeData = Utils.changeData(data,this.styleObj);
            Utils.clearSeariesData(changeData,this.echartData.series)
            let newDdata = Utils.compareObj(changeData,this.echartData);
            this.myChart.setOption(newDdata,true);
        }else{
            data['maptype'] = "mapType";
            let changeData = Utils.changeData(data,this.styleObj);
            Utils.clearSeariesData(changeData,this.echartData.series)
            let newDdata = Utils.compareObj(changeData,this.echartData);
            this.myChart.setOption(newDdata,true);
        }
       
       
    }


   public styleChange(style: any): void {
          if(this.myChart==null){
              this.init();
               this.styleObj = style;
            let changeStyle = Utils.addStyle(style);
           Utils.mergeSourceData(changeStyle,this.echartData);
           let newStyle = Utils.compareObj(changeStyle,this.echartData);
           this.myChart.setOption(newStyle,true);
        }else{
            this.styleObj = style;
            let changeStyle = Utils.addStyle(style);
           Utils.mergeSourceData(changeStyle,this.echartData);
           let newStyle = Utils.compareObj(changeStyle,this.echartData);
           this.myChart.setOption(newStyle,true);
        }
        
      
    }
    public loadData(): void {
        this.init();
    }

    public get data():any{
        return this.chartData;
    }

    protected init(): void{
        // 基于准备好的dom，初始化echarts实例
        this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID) as HTMLDivElement);
        // 绘制图表
        this.myChart.setOption(this.echartData)

    }
}