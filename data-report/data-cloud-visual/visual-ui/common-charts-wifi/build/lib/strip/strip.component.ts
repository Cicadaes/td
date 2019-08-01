/**
 * Created by zhaoxue on 2017/3/28.
 */

import {BaseComponent} from "../base.component";
import {StripTemplate} from "./strip.template";
import {Utils} from '../../public/scripts/utils';
import {StripModel} from './strip.model';
import {BaseCharts} from 'datwill-sdk/lib/views/base/base.chart';

export class StripComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private stripData:StripModel = null;
    private echartData:any = null;
    private styleObj:any = null;
    constructor(){
        super();

        let template = new StripTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.stripData = new StripModel();
        this.echartData = {
            backgroundColor: this.stripData.backgroundColor, //背景颜色
            color: this.stripData.echart_color,


            title: {
                show: this.stripData.title_show,
                text: this.stripData.title_text,
                subtext: this.stripData.title_subtext,
                left: this.stripData.title_left,
                top: this.stripData.title_top,
                textStyle: {
                    color: this.stripData.title_textStyle_color
                }
            },

            legend: {  //设置图例
                show: this.stripData.legend_show,
                z: this.stripData.legend_z,
                left: this.stripData.legend_left,
                top: this.stripData.legend_top,
                orient: this.stripData.legend_orient,
                data:this.stripData.legend_data,
                itemHeight: this.stripData.legend_itemHeight,
                type: 'scroll',   
            },

            tooltip : {  // tooltip
                show: this.stripData.tooltip_show,
                trigger: this.stripData.tooltip_trigger,
                formatter: this.stripData.tooltip_formatter,
                axisPointer: {
                    type: this.stripData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: this.stripData.tooltip_textStyle_color,
                    fontFamily: this.stripData.tooltip_textStyle_fontFamily,
                    fontSize: this.stripData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.stripData.tooltip_backgroundColor,
                borderColor: this.stripData.tooltip_borderColor,
                borderWidth: this.stripData.tooltip_borderWidth,
                padding: this.stripData.tooltip_padding,
            },

            grid: {
                show: this.stripData.grid_show,
                left: this.stripData.grid_left,
                right: this.stripData.grid_right,
                bottom: this.stripData.grid_bottom,
                containLabel: this.stripData.grid_containLabel,
                borderColor: this.stripData.grid_borderColor,
                borderWidth: this.stripData.grid_borderWidth
            },


            //线图
            xAxis:  {
                show: this.stripData.xAxis_show,
                type: this.stripData.xAxis_type,
                boundaryGap: this.stripData.xAxis_boundaryGap,
                data: this.stripData.xAxis_data,
                name: this.stripData.xAxis_name,
                nameLocation:  this.stripData.xAxis_nameLocation,
                nameGap: this.stripData.xAxis_nameGap,
                axisLine: {
                    show: this.stripData.xAxis_axisLine_show,
                    lineStyle: {
                        color: this.stripData.xAxis_axisLine_lineStyle_color,
                        width: this.stripData.xAxis_axisLine_lineStyle_width,
                        type: this.stripData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: this.stripData.xAxis_axisTick_show,
                    alignWithLabel: this.stripData.xAxis_axisTick_alignWithLabel,
                    length: this.stripData.xAxis_axisTick_length,
                    lineStyle: {
                        // color: this.stripData.xAxis_axisTick_lineStyle_color,
                        width: this.stripData.xAxis_axisTick_lineStyle_width,
                        type: this.stripData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: this.stripData.xAxis_axisLabel_show,
                    margin: this.stripData.xAxis_axisLabel_margin,
                    // interval: 0,
                    rotate:0,
                    textStyle: {
                        color: this.stripData.xAxis_axisLabel_textStyle_color,
                        fontFamily: this.stripData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize:  this.stripData.xAxis_axisLabel_textStyle_fontSize,
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
                    show: this.stripData.xAxis_splitLine_show,
                    lineStyle: {
                        color: this.stripData.xAxis_splitLine_lineStyle_color,
                        width: this.stripData.xAxis_splitLine_lineStyle_width,
                        type: this.stripData.xAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    type: this.stripData.xAxis_axisPointer_type,
                    label: {
                        show: this.stripData.xAxis_axisPointer_label_show,
                    }
                }
            },



            yAxis: {
                show: this.stripData.yAxis_show,
                type: this.stripData.yAxis_type,
                boundaryGap: this.stripData.yAxis_boundaryGap,
                data: this.stripData.yAxis_data,
                name: this.stripData.yAxis_name,
                nameLocation: this.stripData.yAxis_nameLocation,
                nameRotate: this.stripData.yAxis_nameRotate,
                nameGap: this.stripData.yAxis_nameGap,
                axisLine: {
                    show: this.stripData.yAxis_axisLine_show,
                    lineStyle: {
                        color: this.stripData.yAxis_axisLine_lineStyle_color,
                        width: this.stripData.yAxis_axisLine_lineStyle_width,
                        type: this.stripData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: this.stripData.yAxis_axisTick_show,
                    alignWithLabel: this.stripData.yAxis_axisTick_alignWithLabel,
                    length: this.stripData.yAxis_axisTick_length,
                    lineStyle: {
                        color: this.stripData.yAxis_axisTick_lineStyle_color,
                        width: this.stripData.yAxis_axisTick_lineStyle_width,
                        type: this.stripData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: this.stripData.yAxis_axisLabel_show,
                    margin: this.stripData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: this.stripData.yAxis_axisLabel_textStyle_color,
                        fontFamily: this.stripData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize:  this.stripData.yAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: this.stripData.yAxis_splitLine_show,
                    lineStyle: {
                        color: this.stripData.yAxis_splitLine_lineStyle_color,
                        width: this.stripData.yAxis_splitLine_lineStyle_width,
                        type: this.stripData.yAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    show: this.stripData.yAxis_axisPointer_show,
                    label: {
                        show: this.stripData.yAxis_axisPointer_label_show
                    }
                }
            },

            series : [{
                name: this.stripData.series_name,
                type:this.stripData.series_type,
                barGap:this.stripData.series_barGap,
                lineStyle: {
                    normal: {
                        // color: this.stripData.series_lineStyle_normal_color,
                        width: this.stripData.series_lineStyle_normal_width,
                        type: this.stripData.series_lineStyle_normal_type
                    },
                },
                itemStyle: {
                    normal: {
                        // color: this.stripData.series_itemStyle_normal_color,
                        borderColor: this.stripData.series_itemStyle_normal_bordercolor,
                        borderWidth: this.stripData.series_itemStyle_normal_borderwidth,
                        borderType: this.stripData.series_itemStyle_normal_bordertype

                    },
                },
                areaStyle: {
                    normal: {
                        // color: this.stripData.series_areaStyle_normal_color,
                        opacity: this.stripData.series_areaStyle_normal_opacity
                    },
                },
                data:this.stripData.series_data
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
            data['striptype'] = "stripType";
            let changeData = Utils.changeData(data,this.styleObj);
            Utils.clearSeariesData(changeData,this.echartData.series)
            let newDdata = Utils.compareObj(changeData,this.echartData);
            this.myChart.setOption(newDdata,true);
        }else{
             data['striptype'] = "stripType";
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