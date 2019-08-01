/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {PieTemplate} from "./pie.template";
import {Utils} from '../../../../public/scripts/utils';
import {PieModel} from './pie.model';
import {BaseCharts} from '../../base/base.chart';

export class PieComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    // private chartStyle:any = null;
    private pieData:PieModel = null;
    private echartData:any = null;
    private styleObj:any = null;
    constructor(){
        super();

        let template = new PieTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.pieData = new PieModel();
        this.echartData = {
            backgroundColor: this.pieData.backgroundColor, //背景颜色
            color: this.pieData.color,

            title: {
                show: this.pieData.title_show,
                text: this.pieData.title_text,
                subtext: this.pieData.title_subtext,
                left: this.pieData.title_left,
                top: this.pieData.title_top,
                textStyle: {
                    color: this.pieData.title_textStyle_color
                }
            },

            legend: {  //设置图例
                show: this.pieData.legend_show,
                z: this.pieData.legend_z,
                left: this.pieData.legend_left,
                top: this.pieData.legend_top,
                orient: this.pieData.legend_orient,
                data:this.pieData.legend_data,
                padding: this.pieData.legend_padding,
                itemHeight: this.pieData.legend_itemHeight,
                type: 'scroll',   
                textStyle: {
                    color: this.pieData.legend_textStyle_color,
                    fontFamily: this.pieData.legend_textStyle_fontFamily,
                    fontSize: this.pieData.legend_textStyle_fontSize,
                }
            },

            tooltip : {  // tooltip
                show: this.pieData.tooltip_show,
                trigger: this.pieData.tooltip_trigger,
                formatter: this.pieData.tooltip_formatter,
                textStyle: {
                    color: this.pieData.tooltip_textStyle_color,
                    fontFamily: this.pieData.tooltip_textStyle_fontFamily,
                    fontSize: this.pieData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.pieData.tooltip_backgroundColor
            },

            // visualMap: {
            //     inRange: {
            //         colorLightness: [0, 1]
            //     }
            // },

            series : [{
                name: this.pieData.series_name,
                type: this.pieData.series_type,
                radius : this.pieData.series_radius,
                center: this.pieData.series_center,
                // data: this.pieData.series_data.sort(function (a, b) { return a.value - b.value}),
                // roseType: this.pieData.series_roseType,
                label: {
                    normal: {
                        show: this.pieData.series_label_normal_show,
                        position: this.pieData.series_label_normal_position,
                        formatter: this.pieData.series_label_normal_formatter,
                        textStyle: {
                            // color: this.pieData.series_label_normal_textStyle_color,
                            fontFamily: this.pieData.series_label_normal_textStyle_fontFamily
                        }
                    }
                },
                // itemStyle: {
                //     normal: {
                //         color: '#c23531',
                //         // shadowBlur: this.pieData.series_itemStyle_normal_shadowBlur,
                //         // shadowColor: this.pieData.series_itemStyle_normal_shadowColor
                //     }
                // },

                animationType: this.pieData.series_animationType
            }]
        }

    }

    public beforeShow(): void {

    }

    public afterShow(): void {
        this.init();
    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {
        if (this.myChart) this.myChart.resize();
    }

    public getconfiginformation(event:any,changeObj:any): void{

    }

   public dataChange(data: any): void {
        if(this.myChart==null){
            this.init();
            data['pietype'] = "pieType";
            let changeData = Utils.changeData(data,this.styleObj);
            Utils.clearSeariesData(changeData,this.echartData.series)
            let newDdata = Utils.compareObj(changeData,this.echartData);
            this.myChart.setOption(newDdata,true);
        }else{
             data['pietype'] = "pieType";
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