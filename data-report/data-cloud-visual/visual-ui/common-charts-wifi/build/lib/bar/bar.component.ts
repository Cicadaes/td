/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {BarTemplate} from "./bar.template";
import {Utils} from '../../public/scripts/utils';
import {BarModel} from './bar.model';
import {BaseCharts} from 'datwill-sdk/lib/views/base/base.chart';

export class BarComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private barData:BarModel = null;
    private echartData:any = null;
    private styleObj:any = null;
    constructor(){
        super();

        let template = new BarTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.barData = new BarModel();
        this.echartData = {
            backgroundColor: this.barData.backgroundColor, //背景颜色
            color: this.barData.color, //背景颜色

            title: {
                show: this.barData.title_show,
                text: this.barData.title_text,
                subtext: this.barData.title_subtext,
                left: this.barData.title_left,
                top: this.barData.title_top,
                textStyle: {
                    color: this.barData.title_textStyle_color
                }
            },

            legend: {  //设置图例
                show: this.barData.legend_show,
                z: this.barData.legend_z,
                left: this.barData.legend_left,
                top: this.barData.legend_top,
                orient: this.barData.legend_orient,
                // data:this.barData.legend_data,
                itemHeight: this.barData.legend_itemHeight,
                type: 'scroll',   
            },

            tooltip : {  // tooltip
                show: this.barData.tooltip_show,
                trigger: this.barData.tooltip_trigger,
                formatter: this.barData.tooltip_formatter,
                axisPointer: {
                    type: this.barData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: this.barData.tooltip_textStyle_color,
                    fontFamily: this.barData.tooltip_textStyle_fontFamily,
                    fontSize: this.barData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.barData.tooltip_backgroundColor,
                borderColor: this.barData.tooltip_borderColor,
                borderWidth: this.barData.tooltip_borderWidth,
                padding: this.barData.tooltip_padding,
            },

            grid: {
                show: this.barData.grid_show,
                left: this.barData.grid_left,
                right: this.barData.grid_right,
                bottom: this.barData.grid_bottom,
                containLabel: this.barData.grid_containLabel,
                borderColor: this.barData.grid_borderColor,
                borderWidth: this.barData.grid_borderWidth
            },


            //线图
            xAxis:  {
                show: this.barData.xAxis_show,
                type: this.barData.xAxis_type,
                name: this.barData.xAxis_name,
                nameLocation: this.barData.xAxis_nameLocation,
                nameGap: this.barData.xAxis_nameGap,
                boundaryGap: this.barData.xAxis_boundaryGap,
               
                // data: this.barData.xAxis_data,
                axisLine: {
                    show: this.barData.xAxis_axisLine_show,
                    lineStyle: {
                        color: this.barData.xAxis_axisLine_lineStyle_color,
                        width: this.barData.xAxis_axisLine_lineStyle_width,
                        type: this.barData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: this.barData.xAxis_axisTick_show,
                    alignWithLabel: this.barData.xAxis_axisTick_alignWithLabel,
                    length: this.barData.xAxis_axisTick_length,
                    lineStyle: {
                        color: this.barData.xAxis_axisTick_lineStyle_color,
                        width: this.barData.xAxis_axisTick_lineStyle_width,
                        type: this.barData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: this.barData.xAxis_axisLabel_show,
                    margin: this.barData.xAxis_axisLabel_margin,
                    // interval: 0,
                    rotate: 0,
                    textStyle: {
                        color: this.barData.xAxis_axisLabel_textStyle_color,
                        fontFamily: this.barData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize:  this.barData.xAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: this.barData.xAxis_splitLine_show,
                    lineStyle: {
                        color: this.barData.xAxis_splitLine_lineStyle_color,
                        width: this.barData.xAxis_splitLine_lineStyle_width,
                        type: this.barData.xAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    type: this.barData.xAxis_axisPointer_type,
                    label: {
                        show: this.barData.xAxis_axisPointer_label_show,
                    }
                }
            },



            yAxis: {
                show: this.barData.yAxis_show,
                type: this.barData.yAxis_type,
                name: this.barData.yAxis_name,
                nameLocation: this.barData.yAxis_nameLocation,
                nameRotate: this.barData.yAxis_nameRotate,
                nameGap: this.barData.yAxis_nameGap,
                axisLine: {
                    show: this.barData.yAxis_axisLine_show,
                    lineStyle: {
                        color: this.barData.yAxis_axisLine_lineStyle_color,
                        width: this.barData.yAxis_axisLine_lineStyle_width,
                        type: this.barData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: this.barData.yAxis_axisTick_show,
                    alignWithLabel: this.barData.yAxis_axisTick_alignWithLabel,
                    length: this.barData.yAxis_axisTick_length,
                    lineStyle: {
                        color: this.barData.yAxis_axisTick_lineStyle_color,
                        width: this.barData.yAxis_axisTick_lineStyle_width,
                        type: this.barData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: this.barData.yAxis_axisLabel_show,
                    margin: this.barData.yAxis_axisLabel_margin,
                    // interval: 0,
                     rotate: 0,
                    textStyle: {
                        color: this.barData.yAxis_axisLabel_textStyle_color,
                        fontFamily: this.barData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize:  this.barData.yAxis_axisLabel_textStyle_fontSize,
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
                    show: this.barData.yAxis_splitLine_show,
                    lineStyle: {
                        color: this.barData.yAxis_splitLine_lineStyle_color,
                        width: this.barData.yAxis_splitLine_lineStyle_width,
                        type: this.barData.yAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    show: this.barData.yAxis_axisPointer_show,
                    label: {
                        show: this.barData.yAxis_axisPointer_label_show
                    }
                }
            },

            series : [{
                name: this.barData.series_name,
                type:this.barData.series_type,
                stack: this.barData.series_stack,
                smooth: this.barData.series_smooth, //折线曲线
                symbol: this.barData.series_symbol,
                symbolSize: this.barData.series_symbolSize,
                showSymbol: this.barData.series_showSymbol,
               
                //柱图
                barWidth: this.barData.series_barWidth,
                barMaxWidth: this.barData.series_barMaxWidth,
                barMinHeight: this.barData.series_barMinHeight,
                barGap: this.barData.series_barGap,

                lineStyle: {
                    normal: {
                        // color: this.barData.series_lineStyle_normal_color,
                        width: this.barData.series_lineStyle_normal_width,
                        type: this.barData.series_lineStyle_normal_type
                    },
                },
                itemStyle: {
                    normal: {
                        // color: this.barData.series_itemStyle_normal_color,
                        borderColor: this.barData.series_itemStyle_normal_bordercolor,
                        borderWidth: this.barData.series_itemStyle_normal_borderwidth,
                        borderType: this.barData.series_itemStyle_normal_bordertype
                    },
                },
                areaStyle: {
                    normal: {
                        // color: this.barData.series_areaStyle_normal_color,
                        opacity: this.barData.series_areaStyle_normal_opacity
                    },
                },
                // data:this.barData.series_data
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
        }else{
            data['barype'] = "barType";
            let changeData = Utils.changeData(data,this.styleObj);
            Utils.clearSeariesData(changeData,this.echartData.series)
            let newDdata = Utils.compareObj(changeData,this.echartData);
            this.myChart.setOption(newDdata,true);
        }     
    }


    public styleChange(style: any): void {
          if(this.myChart==null){
              this.init();
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