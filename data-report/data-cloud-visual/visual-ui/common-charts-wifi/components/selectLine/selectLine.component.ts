/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {SelectLineTemplate} from "./selectLine.template";
import {Utils} from '../../public/scripts/utils';
import {SelectLineModel} from './selectLine.model';
import {BaseCharts} from 'datwill-sdk/lib/views/base/base.chart';
import * as $ from 'jquery';


export class SelectedLineComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private lineData:SelectLineModel = null;
    private echartData:any = null;
    private getSoreceData:any = null;
    private styleObj:any = null;
    private oldValue:Array<any> = [];
    private settingObjCode:string = '';
    private settingArrCode:string = '';

    constructor(){
        super();

        let template = new SelectLineTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.lineData = new SelectLineModel();
        this.echartData = {
            backgroundColor: this.lineData.backgroundColor, //背景颜色
            color: this.lineData.color,

            textStyle: {
                color: this.lineData.textStyle_color,
                fontFamily: this.lineData.textStyle_fontFamily,
                fontSize: this.lineData.textStyle_fontSize,
            },

            title: {
                show: this.lineData.title_show,
                text: this.lineData.title_text,
                subtext: this.lineData.title_subtext,
                left: this.lineData.title_left,
                top: this.lineData.title_top,
                // textStyle: {
                //     color: this.lineData.title_textStyle_color
                // }
            },

            legend: {  //设置图例
                show: this.lineData.legend_show,
                z: this.lineData.legend_z,
                left: this.lineData.legend_left,
                top: this.lineData.legend_top,
                orient: this.lineData.legend_orient,
                data:this.lineData.legend_data,
                itemHeight: this.lineData.legend_itemHeight,
                type: 'scroll',
                textStyle: {
                    color: this.lineData.legend_textStyle_color
                }
            },

            tooltip : {  // tooltip
                show: this.lineData.tooltip_show,
                trigger: this.lineData.tooltip_trigger,
                formatter: this.lineData.tooltip_formatter,
                axisPointer: {
                    type: this.lineData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: this.lineData.tooltip_textStyle_color,
                    fontFamily: this.lineData.tooltip_textStyle_fontFamily,
                    fontSize: this.lineData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.lineData.tooltip_backgroundColor,
                borderColor: this.lineData.tooltip_borderColor,
                borderWidth: this.lineData.tooltip_borderWidth,
                padding: this.lineData.tooltip_padding,
            },

            grid: {
                show: this.lineData.grid_show,
                left: this.lineData.grid_left,
                right: this.lineData.grid_right,
                bottom: this.lineData.grid_bottom,
                containLabel: this.lineData.grid_containLabel,
                borderColor: this.lineData.grid_borderColor,
                borderWidth: this.lineData.grid_borderWidth
            },


            //线图
            xAxis:  {
                show: this.lineData.xAxis_show,
                type: this.lineData.xAxis_type,
                boundaryGap: this.lineData.xAxis_boundaryGap,
                data: this.lineData.xAxis_data,
                name: this.lineData.xAxis_name,
                nameLocation:  this.lineData.xAxis_nameLocation,
                nameGap: this.lineData.xAxis_nameGap,
                axisLine: {
                    show: this.lineData.xAxis_axisLine_show,
                    lineStyle: {
                        color: this.lineData.xAxis_axisLine_lineStyle_color,
                        width: this.lineData.xAxis_axisLine_lineStyle_width,
                        type: this.lineData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: this.lineData.xAxis_axisTick_show,
                    alignWithLabel: this.lineData.xAxis_axisTick_alignWithLabel,
                    length: this.lineData.xAxis_axisTick_length,
                    lineStyle: {
                        // color: this.lineData.xAxis_axisTick_lineStyle_color,
                        width: this.lineData.xAxis_axisTick_lineStyle_width,
                        type: this.lineData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: this.lineData.xAxis_axisLabel_show,
                    margin: this.lineData.xAxis_axisLabel_margin,
                    // interval: 0,
                    rotate: 0,
                    textStyle: {
                        // color: this.lineData.xAxis_axisLabel_textStyle_color,
                        fontFamily: this.lineData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize:  this.lineData.xAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: this.lineData.xAxis_splitLine_show,
                    lineStyle: {
                        color: this.lineData.xAxis_splitLine_lineStyle_color,
                        width: this.lineData.xAxis_splitLine_lineStyle_width,
                        type: this.lineData.xAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    type: this.lineData.xAxis_axisPointer_type,
                    label: {
                        show: this.lineData.xAxis_axisPointer_label_show,
                    }
                }
            },



            yAxis: {
                show: this.lineData.yAxis_show,
                type: this.lineData.yAxis_type,
                name: this.lineData.yAxis_name,
                nameLocation: this.lineData.yAxis_nameLocation,
                nameGap: this.lineData.yAxis_nameGap,
                min: this.lineData.yAxis_min,
                max: this.lineData.yAxis_max,
                axisLine: {
                    show: this.lineData.yAxis_axisLine_show,
                    lineStyle: {
                        color: this.lineData.yAxis_axisLine_lineStyle_color,
                        width: this.lineData.yAxis_axisLine_lineStyle_width,
                        type: this.lineData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: this.lineData.yAxis_axisTick_show,
                    alignWithLabel: this.lineData.yAxis_axisTick_alignWithLabel,
                    length: this.lineData.yAxis_axisTick_length,
                    lineStyle: {
                        // color: this.lineData.yAxis_axisTick_lineStyle_color,
                        width: this.lineData.yAxis_axisTick_lineStyle_width,
                        type: this.lineData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: this.lineData.yAxis_axisLabel_show,
                    margin: this.lineData.yAxis_axisLabel_margin,
                    textStyle: {
                        // color: this.lineData.yAxis_axisLabel_textStyle_color,
                        fontFamily: this.lineData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize:  this.lineData.yAxis_axisLabel_textStyle_fontSize,
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
                    show: this.lineData.yAxis_splitLine_show,
                    lineStyle: {
                        color: this.lineData.yAxis_splitLine_lineStyle_color,
                        width: this.lineData.yAxis_splitLine_lineStyle_width,
                        type: this.lineData.yAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    show: this.lineData.yAxis_axisPointer_show,
                    label: {
                        show: this.lineData.yAxis_axisPointer_label_show
                    }
                }
            },

            series : [{
                name: this.lineData.series_name,
                type:this.lineData.series_type,
                stack: this.lineData.series_stack,
                smooth: this.lineData.series_smooth, //折线曲线
                symbol: this.lineData.series_symbol,
                symbolSize: this.lineData.series_symbolSize,
                showSymbol: this.lineData.series_showSymbol,
                label: {
                    normal: {
                        show: this.lineData.series_label_normal_show,
                    }
                },
                lineStyle: {
                    normal: {
                        // color: this.lineData.series_lineStyle_normal_color,
                        width: this.lineData.series_lineStyle_normal_width,
                        type: this.lineData.series_lineStyle_normal_type
                    },
                },
                itemStyle: {
                    normal: {
                        // color: this.lineData.series_itemStyle_normal_color,
                        // borderColor: this.lineData.series_itemStyle_normal_bordercolor,
                        borderWidth: this.lineData.series_itemStyle_normal_borderwidth,
                        borderType: this.lineData.series_itemStyle_normal_bordertype
                    },
                },
                areaStyle: {
                    normal: {
                        color: this.lineData.series_areaStyle_normal_color,
                    },
                },
                data:this.lineData.series_data,
                // markLine : {
                //     silent: false,
                //     data: [
                //         {type: 'average', name: '平均值'}
                //     ],
                //     label: {
                //         normal: {
                //             show: false
                //         }
                //     }
                // }
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

    public settingChange(event:any,target:any): void{

        let optionList:string = "";

        for(let item of target.settingObj.result){
            optionList += '<ul>';
            optionList += '<li>' + item.name + '</li>';
            optionList += '</ul>';
        }

        $("div[commonSelectList]").html(optionList);

        this.getSettingObjChange(target.settingObj)
    }

    private getSettingObjChange(settingObj:any){
        //把第0项放入已选择框里
        $("div[commonChange]").html(settingObj.result[0].name);

        this.settingArrCode =  (settingObj.code.split("_"))[0];
        let sendObj:Object = Object.assign(
            super.transformInput(this.settingArrCode,[super.transformInput(settingObj.code,settingObj.result[0].name)]),
            super.transformInput('oldValue',this.oldValue)
        );

        super.onChange(this,sendObj);

        this.oldValue = [settingObj.result[0].name];
        this.settingObjCode = settingObj.code;
    }

    public dataChange(data: any): void {
        if(this.myChart==null){
            this.init();
            data['linetype'] = "linetype";
            let changeData = Utils.changeData(data,this.styleObj);
            Utils.clearSeariesData(changeData,this.echartData.series)
            let newDdata = Utils.compareObj(changeData,this.echartData);
            this.myChart.setOption(newDdata,true);
        }else{
            data['linetype'] = "linetype";
            let changeData = Utils.changeData(data,this.styleObj);
            Utils.clearSeariesData(changeData,this.echartData.series)
            let newDdata = Utils.compareObj(changeData,this.echartData);
            this.myChart.setOption(newDdata,true);
        }


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
        this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]") as HTMLDivElement);
        // 绘制图表
        this.myChart.setOption(this.echartData);

        //commonchange
        this.commonChange();

    }

    private commonChange(){
        let _self = this;

        $('#'+this.scopeID).find('div[commonChange]').click((event:any)=>{
            $("div[commonSelectList]").show();
        });

        $('#'+this.scopeID).find('div[commonSelectList]').click((event:any)=>{
            $("div[commonChange]").html(event.target.innerText);

            let sendObj:Object = Object.assign(
                super.transformInput(this.settingArrCode,[super.transformInput(_self.settingObjCode,event.target.innerText)]),
                super.transformInput('oldValue',_self.oldValue)
            );

            super.onChange(this,sendObj);
            this.oldValue = [event.target.innerText];
            $("div[commonSelectList]").hide();
        })
    }
}