/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {LineTemplate} from "./line.template";
import {Utils} from '../../../../public/scripts/utils';
import {LineModel} from './line.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";


export class LineComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private lineData: LineModel = null;
    private echartData: any = null;
    private getSoreceData: any = null;
    private styleObj: any = null;
    private changeObj: any = null;
    private body: any = {};
    private scene: any = null;

    constructor(){
        super();

        let template = new LineTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.lineData = new LineModel();
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
                data: this.lineData.legend_data,
                itemHeight: this.lineData.legend_itemHeight,
                itemWidth: this.lineData.legend_itemWidth,
                type: 'scroll',
                textStyle: {
                    color: this.lineData.legend_textStyle_color,
                    fontFamily: this.lineData.legend_textStyle_fontFamily,
                    fontSize: this.lineData.legend_textStyle_fontSize,
                }
            },

            tooltip: {  // tooltip
                show: this.lineData.tooltip_show,
                trigger: this.lineData.tooltip_trigger,
                formatter: function(params:any,index:any){
                    let tooltipData:string = "",
                        total:number = 0;
                    for(let j of params){
                        total = total + parseInt(j.value)
                    }
                    tooltipData += '<div class="line_tooltip">'
                    tooltipData += '<p>' + params[0].axisValue + '</p>'
                    tooltipData += '<ul>'
                    for(let p of params){
                        let rose = total > 0 ? ((parseInt(p.value)/total) * 100).toFixed(2) : 0;
                        tooltipData += '<li><em style="float: right; padding-left: 20px">' + rose + '%</em>' + p.marker + ' <b>'+ p.seriesName +' : ' + Utils.parseFormatNum(p.value,0) + ' </b></li>'
                    }
                    tooltipData += '</ul>'
                    tooltipData += '</div>'
                    return tooltipData;
                },
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
            xAxis: {
                show: this.lineData.xAxis_show,
                type: this.lineData.xAxis_type,
                boundaryGap: this.lineData.xAxis_boundaryGap,
                data: this.lineData.xAxis_data,
                name: this.lineData.xAxis_name,
                nameLocation: this.lineData.xAxis_nameLocation,
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
                        color: this.lineData.xAxis_axisLabel_textStyle_color,
                        fontFamily: this.lineData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: this.lineData.xAxis_axisLabel_textStyle_fontSize,
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
                        color: this.lineData.yAxis_axisLabel_textStyle_color,
                        fontFamily: this.lineData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: this.lineData.yAxis_axisLabel_textStyle_fontSize,
                    },
                    formatter: function (value: any, index: any) {
                        var texts: Array<any> = [];
                        var new_num = value;
                        var istype = '';
                        if (value > 9999) {
                            if (value < 1e8) {
                                new_num = (new_num / 1e4).toFixed(2).toString();
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
                }
            },

            series: [{
                name: this.lineData.series_name,
                type: this.lineData.series_type,
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
                data: this.lineData.series_data
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

    public setBodyObj(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);

        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "line";
        return this.body;
    }


    public getconfiginformation(event: any, changeObj: any): void {
        if (!this.isEmptyObject(changeObj.result)) {
            this.scene = changeObj.result.scene;
            this.setBodyObj(changeObj.result);

        } else {
            return;
        }

        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    }

    public filterChange(event: any, data: any): void {
        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body)
    }

    public mergeFilterChange(event:any,target: any): void {
        super.onFilterChange(this,target);
    }

    public dataChange(data: any): void {
        if (this.myChart == null) {
            this.init();
        }
        data['linetype'] = "linetype";
        let changeData = Utils.changeData(Utils.handleLifeCycleMap(data,"name"), this.styleObj);
        Utils.clearSeariesData(changeData, this.echartData.series)
        let newDdata = Utils.compareObj(changeData, this.echartData);
        this.myChart.setOption(newDdata, true);
    }

    public styleChange(style: any): void {
        if (this.myChart == null) {
            this.init();
        }
        for (let key in style) {
            if (key == 'title_second_font') {
                $('#' + this.scopeID).find('div[componentTitleFont]').html(style[key])
            }
        }
        let newStyle = Utils.compareObj(style, this.echartData);
        this.myChart.setOption(newStyle, true);
    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    protected init(): void {

        // 基于准备好的dom，初始化echarts实例
        this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]") as HTMLDivElement);
        // 绘制图表
        this.myChart.setOption(this.echartData);
    }

    private postChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }
}