/**
 * Created by zhaoxue on 2017/3/28.
 */

import {BaseComponent} from "../base.component";
import {CityHorizontalBarTemplate} from "./cityHorizontalBar.template";
import {Utils} from '../../../../public/scripts/utils';
import {CityHorizontalBarModel} from './cityHorizontalBar.model';
import {BaseCharts} from '../../base/base.chart';
import {DataSourceConfig} from "../../../dataSourceConfig";
import * as $ from 'jquery';

export class CityHorizontalBarComponent extends BaseComponent {
    private myChartFirst: any = null;
    private myChartSecond: any = null;
    private myChartThird: any = null;
    private myChartFourth: any = null;
    private chartData: any = null;
    private stripData: CityHorizontalBarModel = null;
    private echartData: any = null;
    private styleObj: any = null;
    private body: any = null;
    private scene: any = null;

    constructor() {
        super();

        let template = new CityHorizontalBarTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.stripData = new CityHorizontalBarModel();
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
                data: this.stripData.legend_data,
                itemHeight: this.stripData.legend_itemHeight,
                type: 'scroll',
            },

            tooltip: {  // tooltip
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
                padding: this.stripData.tooltip_padding,
            },

            grid: {
                show: this.stripData.grid_show,
                top: this.stripData.grid_top,
                left: this.stripData.grid_left,
                right: this.stripData.grid_right,
                bottom: this.stripData.grid_bottom,
                containLabel: this.stripData.grid_containLabel,
                borderColor: this.stripData.grid_borderColor,
                borderWidth: this.stripData.grid_borderWidth
            },

            //线图
            xAxis: {
                show: this.stripData.xAxis_show,
                type: this.stripData.xAxis_type,
                boundaryGap: this.stripData.xAxis_boundaryGap,
                data: this.stripData.xAxis_data,
                name: this.stripData.xAxis_name,
                nameLocation: this.stripData.xAxis_nameLocation,
                nameGap: this.stripData.xAxis_nameGap,
                axisLine: {
                    show: this.stripData.xAxis_axisLine_show,
                    lineStyle: {
                        color: this.stripData.xAxis_axisLine_lineStyle_color,
                        width: this.stripData.xAxis_axisLine_lineStyle_width,
                        type: this.stripData.xAxis_axisLine_lineStyle_type,
                    },
                },
                splitNumber: 2,
                //x轴刻度
                axisTick: {
                    show: this.stripData.xAxis_axisTick_show,
                    alignWithLabel: this.stripData.xAxis_axisTick_alignWithLabel,
                    length: this.stripData.xAxis_axisTick_length,
                    lineStyle: {
                        width: this.stripData.xAxis_axisTick_lineStyle_width,
                        type: this.stripData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: this.stripData.xAxis_axisLabel_show,
                    margin: this.stripData.xAxis_axisLabel_margin,
                    rotate: 0,
                    textStyle: {
                        color: this.stripData.xAxis_axisLabel_textStyle_color,
                        fontFamily: this.stripData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: this.stripData.xAxis_axisLabel_textStyle_fontSize,
                    },
                    formatter: function (value: any, index: any) {
                        var texts: Array<any> = [];
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
                        fontSize: this.stripData.yAxis_axisLabel_textStyle_fontSize,
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

            series: [{
                    name: this.stripData.series_name,
                    type: this.stripData.series_type,
                    barGap: this.stripData.series_barGap,
                    stack: 'chart',
                    label: {
                        normal: {
                            position: 'right',
                            show: true,
                            formatter: '{c}',
                            color: '#000'
                        }
                    },
                    "barWidth":20,
                    data: this.stripData.series_data
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
        if (this.myChartFirst) this.myChartFirst.resize();
        if (this.myChartSecond) this.myChartSecond.resize();
        if (this.myChartThird) this.myChartThird.resize();
        if (this.myChartFourth) this.myChartFourth.resize();
    }

    public getconfiginformation(event: any, changeObj: any): void {
        this.scene = changeObj.result.scene;
        this.body = this.buildbody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    }

    public handleData(jsonArr: any,index: any): void {
        let proportion = jsonArr["proportion"];
        let name = jsonArr["name"];
        //(proportion != undefined || proportion != null)?proportion = proportion:proportion = "";
        $('#'+this.scopeID).find('.cityHorizontalBarWapTit').eq(index).find("i").text(name);
        $('#'+this.scopeID).find('.cityHorizontalBarWapTit').eq(index).find("b").text(proportion);
    }

    public dataChange(data: any): void {
        if(!data || data.length == 0){
            return;
        }
        if(data && data.length > 0) {
            this.echartData.tooltip.formatter = "{b0}: {c0}";
            this.echartData.legend.show = false;
            for(let i = 0; i < data.length; i++){
                this.handleData(data[i],i); 
            }
        }
        let dataArray1 = [];
        let dataArray2 = [];
        let dataArray3 = [];
        let dataArray4 = [];
        
        let data0 = data[0]["data"];
        let data1 = data[1]["data"];
        let data2 = data[2]["data"];
        let data3 = data[3]["data"];
        for (let i = data0.length - 1; i >= 0; i--) {
            dataArray1.push({
                 "date": data0[i].name,
                "value": data0[i].value
            });
        }
        for (let i = data1.length - 1; i >= 0; i--) {
            dataArray2.push({
                 "date": data1[i].name,
                "value": data1[i].value
            });
        }
        for (let i = data2.length - 1; i >= 0; i--) {
            dataArray3.push({
                 "date": data2[i].name,
                "value": data2[i].value
            });
        }
        for (let i = data3.length - 1; i >= 0; i--) {
            dataArray4.push({
                "date": data3[i].name,
                "value": data3[i].value
            });
        }

        if (this.myChartFirst == null) {
            // 基于准备好的dom，初始化echarts实例
            this.myChartFirst = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartFirst]") as HTMLDivElement);
        }
         if (this.myChartSecond == null) {
            // 基于准备好的dom，初始化echarts实例
            this.myChartSecond = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartSecond]") as HTMLDivElement);
        }
         if (this.myChartThird == null) {
            // 基于准备好的dom，初始化echarts实例
            this.myChartThird = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartThird]") as HTMLDivElement);
        }
         if (this.myChartFourth == null) {
            // 基于准备好的dom，初始化echarts实例
            this.myChartFourth = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartFourth]") as HTMLDivElement);
        }

        //dataArray1['cityhorizontalbartype'] = "cityhorizontalbartype";
        dataArray1['striptype'] = "stripType";
        dataArray2['striptype'] = "striptype";
        dataArray3['striptype'] = "striptype";
        dataArray4['striptype'] = "striptype";

        let changeData1 = Utils.changeData(dataArray1, this.styleObj);
        Utils.clearSeariesData(changeData1, this.echartData.series)
        let newDdata1 = Utils.compareObj(changeData1, this.echartData);
        if(newDdata1["series"] != 0){
            newDdata1["series"][0]["label"] = {
                "normal":{
                    "position": 'right',
                    "show": true,
                    "formatter": '{c}',
                    "color": '#76818e'
                }
            };
            newDdata1["series"][0]["barWidth"] = 14;
        }
        
        this.myChartFirst.setOption(newDdata1, true);

        let changeData2 = Utils.changeData(dataArray2, this.styleObj);
        Utils.clearSeariesData(changeData2, this.echartData.series)
        let newDdata2 = Utils.compareObj(changeData2, this.echartData);
        if(newDdata2["series"] != 0){
            newDdata2["series"][0]["label"] = {
                "normal":{
                    "position": 'right',
                    "show": true,
                    "formatter": '{c}',
                    "color": '#76818e'
                }
            };
            newDdata2["series"][0]["barWidth"] = 14;
        }
        this.myChartSecond.setOption(newDdata2, true);


        let changeData3 = Utils.changeData(dataArray3, this.styleObj);
        Utils.clearSeariesData(changeData3, this.echartData.series)
        let newDdata3 = Utils.compareObj(changeData3, this.echartData);
        if(newDdata3["series"] != 0){
            newDdata3["series"][0]["label"] = {
                "normal":{
                    "position": 'right',
                    "show": true,
                    "formatter": '{c}',
                    "color": '#76818e'
                }
            };
            newDdata3["series"][0]["barWidth"] = 14;
        }
        this.myChartThird.setOption(newDdata3, true);


        let changeData4 = Utils.changeData(dataArray4, this.styleObj);
        Utils.clearSeariesData(changeData4, this.echartData.series)
        let newDdata4 = Utils.compareObj(changeData4, this.echartData);
        if(newDdata4["series"] != 0){
            newDdata4["series"][0]["label"] = {
                "normal":{
                    "position": 'right',
                    "show": true,
                    "formatter": '{c}',
                    "color": '#76818e'
                }
            };
            newDdata4["series"][0]["barWidth"] = 14;
        }
        //console.log("====>newDdata4",JSON.stringify(newDdata4))
        this.myChartFourth.setOption(newDdata4, true);
    }

    public filterChange(event: any, data: any): void {
        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body)
    }

    private postChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    protected init(): void {
        // 基于准备好的dom，初始化echarts实例
        this.myChartFirst = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartFirst]") as HTMLDivElement);
        this.myChartFirst.setOption(this.echartData);　// 绘制图表
        this.myChartSecond = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartSecond]") as HTMLDivElement);
        this.myChartSecond.setOption(this.echartData);　// 绘制图表
        this.myChartThird = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartThird]") as HTMLDivElement);
        this.myChartThird.setOption(this.echartData);　// 绘制图表
        this.myChartFourth = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChartFourth]") as HTMLDivElement);
        this.myChartFourth.setOption(this.echartData);  // 绘制图表

    }

    //buildBody
    public buildbody(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "cityHorizontalBar";
        return this.body;
    }
}