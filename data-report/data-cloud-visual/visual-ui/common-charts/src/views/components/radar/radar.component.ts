/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {RadarTemplate} from "./radar.template";
import {Utils} from '../../../../public/scripts/utils';
import {RadarModel} from './radar.model';
import {BaseCharts} from '../../base/base.chart';

export class RadarComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private radarData:RadarModel = null;
    private echartData:any = null;
    constructor(){
        super();

        let template = new RadarTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.radarData = new RadarModel();
        this.echartData = {
            backgroundColor: this.radarData.backgroundColor, //背景颜色

            title: {
                show: this.radarData.title_show,
                text: this.radarData.title_text,
                subtext: this.radarData.title_subtext,
                left: this.radarData.title_left,
                top: this.radarData.title_top,
                textStyle: {
                    color: this.radarData.title_textStyle_color
                }
            },

            legend: {  //设置图例
                show: this.radarData.legend_show,
                z: this.radarData.legend_z,
                left: this.radarData.legend_left,
                top: this.radarData.legend_top,
                orient: this.radarData.legend_orient,
                data:this.radarData.legend_data,
            },

            //雷达图
            radar: {
                shape: this.radarData.radar_shape,
                // center: this.radarData.radar_center,
                // radius: this.radarData.radar_radius,
                indicator: this.radarData.radar_indicator,
            },

            tooltip : {  // tooltip
                show: this.radarData.tooltip_show,
                trigger: this.radarData.tooltip_trigger,
                formatter: this.radarData.tooltip_formatter,
                axisPointer: {
                    type: this.radarData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: this.radarData.tooltip_textStyle_color,
                    fontFamily: this.radarData.tooltip_textStyle_fontFamily,
                    fontSize: this.radarData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.radarData.tooltip_backgroundColor,
                borderColor: this.radarData.tooltip_borderColor,
                borderWidth: this.radarData.tooltip_borderWidth,
                padding: this.radarData.tooltip_padding,
            },

            grid: {
                show: this.radarData.grid_show,
                left: this.radarData.grid_left,
                right: this.radarData.grid_right,
                bottom: this.radarData.grid_bottom,
                containLabel: this.radarData.grid_containLabel,
                borderColor: this.radarData.grid_borderColor,
                borderWidth: this.radarData.grid_borderWidth
            },


            //线图
           series : [{
                name: this.radarData.series_name,
                type:this.radarData.series_type,
                stack: this.radarData.series_stack,
                smooth: this.radarData.series_smooth, //折线曲线
                symbol: this.radarData.series_symbol,
                symbolSize: this.radarData.series_symbolSize,
                showSymbol: this.radarData.series_showSymbol,


                lineStyle: {
                    normal: {
                        color: this.radarData.series_lineStyle_normal_color,
                        width: this.radarData.series_lineStyle_normal_width,
                        type: this.radarData.series_lineStyle_normal_type
                    },
                },
                itemStyle: {
                    normal: {
                        color: this.radarData.series_itemStyle_normal_color,
                        borderColor: this.radarData.series_itemStyle_normal_bordercolor,
                        borderWidth: this.radarData.series_itemStyle_normal_borderwidth,
                        borderType: this.radarData.series_itemStyle_normal_bordertype,
                    },
                },
                areaStyle: {
                    normal: {
                        type: this.radarData.series_areaStyle_normal_type,
                        // color: this.radarData.series_areaStyle_normal_color,
                        opacity: this.radarData.series_areaStyle_normal_opacity
                    },
                },
                data:this.radarData.series_data
            }
            ]
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
        this.chartData = data;
        // var myChartData = this.myChart.getOption();
        let newDdata = Utils.compareObj(data,this.echartData);

        this.myChart.setOption(newDdata);

    }

    public styleChange(style: any): void {

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