/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {AreaTemplate} from "./area.template";
import {Utils} from '../../public/scripts/utils';
import {AreaModel} from './area.model';
import {BaseCharts} from 'datwill-sdk/lib/views/base/base.chart';
import {EventEmitter} from 'datwill-sdk/lib/events/emitter.event';
import {EventType} from 'datwill-sdk/lib/events/type.event';
import * as $ from 'jquery';


export class AreaComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private areaData:AreaModel = null;
    private echartData:any = null;
    private styleObj:any = null;

    constructor(){
        super();

        let template = new AreaTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.areaData = new AreaModel();
        this.echartData = {
            backgroundColor: this.areaData.echart_backgroundColor, //背景颜色
            color: this.areaData.echart_color,

            title: {
                show: this.areaData.title_show,
                text: this.areaData.title_text,
                subtext: this.areaData.title_subtext,
                left: this.areaData.title_left,
                top: this.areaData.title_top,
                textStyle: {
                    color: this.areaData.title_textStyle_color
                }
            },

            legend: {  //设置图例
                show: this.areaData.legend_show,
                z: this.areaData.legend_z,
                left: this.areaData.legend_left,
                top: this.areaData.legend_top,
                orient: this.areaData.legend_orient,
                data:this.areaData.legend_data,
                itemHeight: this.areaData.legend_itemHeight,
                type: 'scroll',
            },

            tooltip : {  // tooltip
                show: this.areaData.tooltip_show,
                trigger: this.areaData.tooltip_trigger,
                formatter: this.areaData.tooltip_formatter,
                axisPointer: {
                    type: this.areaData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: this.areaData.tooltip_textStyle_color,
                    fontFamily: this.areaData.tooltip_textStyle_fontFamily,
                    fontSize: this.areaData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.areaData.tooltip_backgroundColor,
                borderColor: this.areaData.tooltip_borderColor,
                borderWidth: this.areaData.tooltip_borderWidth,
                padding: this.areaData.tooltip_padding,
            },

            grid: {
                show: this.areaData.grid_show,
                left: this.areaData.grid_left,
                right: this.areaData.grid_right,
                bottom: this.areaData.grid_bottom,
                containLabel: this.areaData.grid_containLabel,
                borderColor: this.areaData.grid_borderColor,
                borderWidth: this.areaData.grid_borderWidth
            },


            //线图
            xAxis:  {
                show: this.areaData.xAxis_show,
                type: this.areaData.xAxis_type,
                nameLocation: this.areaData.xAxis_nameLocation,
                nameGap: this.areaData.xAxis_nameGap,
                boundaryGap: this.areaData.xAxis_boundaryGap,
                data: this.areaData.xAxis_data,
                axisLine: {
                    show: this.areaData.xAxis_axisLine_show,
                    lineStyle: {
                        color: this.areaData.xAxis_axisLine_lineStyle_color,
                        width: this.areaData.xAxis_axisLine_lineStyle_width,
                        type: this.areaData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: this.areaData.xAxis_axisTick_show,
                    alignWithLabel: this.areaData.xAxis_axisTick_alignWithLabel,
                    length: this.areaData.xAxis_axisTick_length,
                    lineStyle: {
                        color: this.areaData.xAxis_axisTick_lineStyle_color,
                        width: this.areaData.xAxis_axisTick_lineStyle_width,
                        type: this.areaData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: this.areaData.xAxis_axisLabel_show,
                    margin: this.areaData.xAxis_axisLabel_margin,
                    // interval: 0,
                    rotate:0,
                    textStyle: {
                        color: this.areaData.xAxis_axisLabel_textStyle_color,
                        fontFamily: this.areaData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize:  this.areaData.xAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: this.areaData.xAxis_splitLine_show,
                    lineStyle: {
                        color: this.areaData.xAxis_splitLine_lineStyle_color,
                        width: this.areaData.xAxis_splitLine_lineStyle_width,
                        type: this.areaData.xAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    type: this.areaData.xAxis_axisPointer_type,
                    label: {
                        show: this.areaData.xAxis_axisPointer_label_show,
                    }
                }
            },



            yAxis: {
                show: this.areaData.yAxis_show,
                type: this.areaData.yAxis_type,
                nameLocation: this.areaData.yAxis_nameLocation,
                nameGap: this.areaData.yAxis_nameGap,
                nameRotate: this.areaData.yAxis_nameRotate,
                axisLine: {
                    show: this.areaData.yAxis_axisLine_show,
                    lineStyle: {
                        color: this.areaData.yAxis_axisLine_lineStyle_color,
                        width: this.areaData.yAxis_axisLine_lineStyle_width,
                        type: this.areaData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: this.areaData.yAxis_axisTick_show,
                    alignWithLabel: this.areaData.yAxis_axisTick_alignWithLabel,
                    length: this.areaData.yAxis_axisTick_length,
                    lineStyle: {
                        color: this.areaData.yAxis_axisTick_lineStyle_color,
                        width: this.areaData.yAxis_axisTick_lineStyle_width,
                        type: this.areaData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: this.areaData.yAxis_axisLabel_show,
                    margin: this.areaData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: this.areaData.yAxis_axisLabel_textStyle_color,
                        fontFamily: this.areaData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize:  this.areaData.yAxis_axisLabel_textStyle_fontSize,
                    },
                    formatter: function (value:any, index:any) {
                        var texts:Array<any> = [];
                        var new_num = value;
                        var istype = '';
                        if (value > 9999) {
                            if (value < 1e8) {
                                new_num = (new_num / 1e4 ).toFixed(2).toString();
                                istype = '万';
                            } else if (value >= 1e8) {
                                new_num = (new_num / 1e8).toFixed(2).toString();
                                istype = '亿'
                            }
                        }
                        texts.push(new_num + istype);
                        return texts;
                    }
                },
                //区域中的分割线
                splitLine: {
                    show: this.areaData.yAxis_splitLine_show,
                    lineStyle: {
                        color: this.areaData.yAxis_splitLine_lineStyle_color,
                        width: this.areaData.yAxis_splitLine_lineStyle_width,
                        type: this.areaData.yAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    show: this.areaData.yAxis_axisPointer_show,
                    label: {
                        show: this.areaData.yAxis_axisPointer_label_show
                    }
                }
            },

            series :[{
                name: this.areaData.series_name,
                type:this.areaData.series_type,
                stack: this.areaData.series_stack,
                smooth: this.areaData.series_smooth, //折线曲线
                symbol: this.areaData.series_symbol,
                symbolSize: this.areaData.series_symbolSize,
                showSymbol: this.areaData.series_showSymbol,
                lineStyle: {
                    normal: {
                        // color: this.areaData.series_lineStyle_normal_color,
                        width: this.areaData.series_lineStyle_normal_width,
                        type: this.areaData.series_lineStyle_normal_type
                    },
                },
                itemStyle: {
                    normal: {
                        // color: this.areaData.series_itemStyle_normal_color,
                        borderColor: this.areaData.series_itemStyle_normal_bordercolor,
                        borderWidth: this.areaData.series_itemStyle_normal_borderwidth,
                        borderType: this.areaData.series_itemStyle_normal_bordertype
                    },
                },
                areaStyle: {
                    normal: {
                        // color: this.areaData.series_areaStyle_normal_color,
                        opacity: this.areaData.series_areaStyle_normal_opacity
                    },
                },
                data:this.areaData.series_0_data
            }]
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

    public settingChange(event:any,target:any): void{

    }


    public dataChange(data: any): void {
        data['areatype'] = "areaType";
        let changeData = Utils.changeData(data,this.styleObj);
        Utils.clearSeariesData(changeData,this.echartData.series)
        let newDdata = Utils.compareObj(changeData,this.echartData);
        this.myChart.setOption(newDdata,true);
    }


    public styleChange(style: any): void {
        this.styleObj = style;
        let changeStyle = Utils.addStyle(style);
        Utils.mergeSourceData(changeStyle,this.echartData);
        let newStyle = Utils.compareObj(changeStyle,this.echartData);
        this.myChart.setOption(newStyle,true);
    }

    public loadData(): void {
        this.init();
    }

    public get data():any{
        return this.chartData;
    }

    protected init(): void{

        // 基于准备好的dom，初始化echarts实例
        this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]") as HTMLDivElement);
        // 绘制图表
        this.myChart.setOption(this.echartData)

    }
}