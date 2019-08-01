/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {FunnelTemplate} from "./funnel.template";
import {Utils} from '../../public/scripts/utils';
import {FunnelModel} from './funnel.model';
import {BaseCharts} from 'datwill-sdk/lib/views/base/base.chart';


export class FunnelComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private funnelData:FunnelModel = null;
    private echartData:any = null;
    constructor(){
        super();

        let template = new FunnelTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.funnelData = new FunnelModel();
        this.echartData = {
            backgroundColor: this.funnelData.backgroundColor, //背景颜色

            title: {
                show: this.funnelData.title_show,
                text: this.funnelData.title_text,
                subtext: this.funnelData.title_subtext,
                left: this.funnelData.title_left,
                top: this.funnelData.title_top,
                textStyle: {
                    color: this.funnelData.title_textStyle_color
                }
            },

            legend: {  //设置图例
                show: this.funnelData.legend_show,
                z: this.funnelData.legend_z,
                left: this.funnelData.legend_left,
                top: this.funnelData.legend_top,
                orient: this.funnelData.legend_orient,
                data:this.funnelData.legend_data,
            },

            tooltip : {  // tooltip
                show: this.funnelData.tooltip_show,
                trigger: this.funnelData.tooltip_trigger,
                formatter: this.funnelData.tooltip_formatter,
                axisPointer: {
                    type: this.funnelData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: this.funnelData.tooltip_textStyle_color,
                    fontFamily: this.funnelData.tooltip_textStyle_fontFamily,
                    fontSize: this.funnelData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.funnelData.tooltip_backgroundColor,
                borderColor: this.funnelData.tooltip_borderColor,
                borderWidth: this.funnelData.tooltip_borderWidth,
                padding: this.funnelData.tooltip_padding,
            },

            grid: {
                show: this.funnelData.grid_show,
                left: this.funnelData.grid_left,
                right: this.funnelData.grid_right,
                bottom: this.funnelData.grid_bottom,
                containLabel: this.funnelData.grid_containLabel,
                borderColor: this.funnelData.grid_borderColor,
                borderWidth: this.funnelData.grid_borderWidth
            },

           series : [{
                name: this.funnelData.series_name,
                type:this.funnelData.series_type,
                stack: this.funnelData.series_stack,
                smooth: this.funnelData.series_smooth, //折线曲线
                symbol: this.funnelData.series_symbol,
                symbolSize: this.funnelData.series_symbolSize,
                showSymbol: this.funnelData.series_showSymbol,
                left: '5%',
                top: 70,
                bottom: 20,
                width: '90%',
                sort: 'descending',
                gap: 2,

                label: {
                   normal: {
                       show: true,
                       position: 'inside'
                   },
                   emphasis: {
                       textStyle: {
                           fontSize: 20
                       }
                   }
                },

                lineStyle: {
                    normal: {
                        color: this.funnelData.series_lineStyle_normal_color,
                        width: this.funnelData.series_lineStyle_normal_width,
                        type: this.funnelData.series_lineStyle_normal_type
                    },
                },
                itemStyle: {
                    normal: {
                        color: this.funnelData.series_itemStyle_normal_color,
                        borderColor: this.funnelData.series_itemStyle_normal_bordercolor,
                        borderWidth: this.funnelData.series_itemStyle_normal_borderwidth,
                        borderType: this.funnelData.series_itemStyle_normal_bordertype
                    },
                },
                areaStyle: {
                    normal: {
                        color: this.funnelData.series_areaStyle_normal_color,
                        opacity: this.funnelData.series_areaStyle_normal_opacity
                    },
                },
                data:this.funnelData.series_data
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
        this.chartData = data;
        // var myChartData = this.myChart.getOption();
        let newDdata = Utils.compareObj(data,this.echartData);

        this.myChart.setOption(newDdata);

    }

    public styleChange(style: any): void {

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