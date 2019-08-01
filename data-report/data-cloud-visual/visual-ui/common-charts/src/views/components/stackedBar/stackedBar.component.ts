/**
 * Created by zhaoxue on 2017/3/28.
 */

import {BaseComponent} from "../base.component";
import {StackedBarTemplate} from "./stackedBar.template";
import {Utils} from '../../../../public/scripts/utils';
import {StackedBarModel} from './stackedBar.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class StackedBarComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private stripData: StackedBarModel = null;
    private echartData: any = null;
    private styleObj: any = null;
    private changeObj: any = null;
    private body: any = {};

    private run_date: any = "2017-05";
    private hour_type: any = "2";
    private handleArr: any = [];

    constructor() {
        super();

        let template = new StackedBarTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.stripData = new StackedBarModel();
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
            xAxis: {
                show: this.stripData.xAxis_show,
                max: this.stripData.xAxis_max,
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

            yAxis: [
                {
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
                            color: 'transparent',
                            width: 0,
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
                {
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
                            color: 'transparent',
                            width: 0,
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
                }
            ],

            series: [{
                name: this.stripData.series_name,
                type: this.stripData.series_type,
                //barGap: this.stripData.series_barGap,
                // lineStyle: {
                //     normal: {
                //         // color: this.stripData.series_lineStyle_normal_color,
                //         width: this.stripData.series_lineStyle_normal_width,
                //         type: this.stripData.series_lineStyle_normal_type
                //     },
                // },
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
        if (this.myChart) this.myChart.resize();
    }

    //init
    protected init(): void {
        this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]") as HTMLDivElement);

        // 绘制图表
        this.myChart.setOption(this.echartData)
        //debugger
        //commonchange
        this.commonChange();
    }

    //求和
    public sum(series: any, index: any) {
        var sum = 0;
        for (let i = 0; i < series.length; i++) {
            sum += series[i]['data'][index];
        }
        return sum;
    }

    public getTotalArr(series: any) {
        if (series.length > 0 && series[0]['data']) {
            let totalArr = [];
            for (let i = 0; i < series[0]['data'].length; i++) {
                totalArr[i] = this.sum(series, i);
            }
            return totalArr;
        }

    }

    //处理数据 变百分比
    public handleData(item: any, totalArr: any) {
        let that = this;
        var newDataArr = [];
        for (var i = 0; i < item.data.length; i++) {
            var percentNum = (item.data[i] / totalArr[i] * 100).toFixed(2)
            newDataArr.push(percentNum);

        }
        ;
        //console.log(newDataArr,'newDataArr======');
        that.handleArr = newDataArr;

        return that.handleArr;
    }

    //数据改变
    public dataChange(data: any): void {
        // data =             {
        //     "date": "入店客流",
        //     "name": "3-5km",
        //     "value": 22
        // }
        if (data && data.length > 0) {
            let that = this;
            let dataArray = [];
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                dataArray.push({
                    "date": obj.date,
                    "name": obj.name,
                    "value": obj.value
                });
            }

            if (this.myChart == null) {
                // 基于准备好的dom，初始化echarts实例
                //this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID) as HTMLDivElement);
                this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]") as HTMLDivElement);

            }
            dataArray['striptype'] = "stripType";
            let changeData = Utils.changeData(dataArray, this.styleObj);
            Utils.clearSeariesData(changeData, this.echartData.series)
            let newDdata = Utils.compareObj(changeData, this.echartData);
            let cacheNewDData = JSON.parse(JSON.stringify(newDdata));

            newDdata.legend['data'] = [];
            let totalArr = this.getTotalArr(newDdata.series);
            newDdata.series.forEach(function (item: any, index: any) {
                item['stack'] = '总量';
                item.data = that.handleData(item, totalArr);
                item['label'] = {
                    normal: {
                        show: true,
                        position: 'insideRight',
                        formatter: '{c}%'
                    }
                };
                newDdata.legend['data'][index] = item['name'];
            });
            newDdata.yAxis[0].data = newDdata.yAxis.data;//第一个y轴重新赋值
            //是多条还是一条模拟显示
            // newDdata.series.length = 1;
            //X轴显示百分比
            newDdata.xAxis.axisLabel.formatter = '{value}%';

            //处理第二个y轴显示数据
            let temporaryData: any = [];
            let temporaryDataY: any = [];
            let yAxis_data2: any = [];

            for (let i = 0, j = data.length; i < j; i++) {
                if (!Utils.isRepeat(temporaryDataY, data[i].date)) {
                    temporaryDataY.push(data[i].date);
                    temporaryData.push(data[i]);
                }
            }

            for (let a = 0; a < temporaryData.length; a++) {
                yAxis_data2.push(temporaryData[a]['crowd_num'])
            }
            newDdata[`yAxis`][1]["data"] = yAxis_data2;
            console.log("======>newDdata", newDdata)
            this.myChart.clear();
            this.myChart.setOption(newDdata, true);
        } else {
            this.myChart.clear();
        }

    }

    //根据type渲染html
    public setHtmlObj(changeObj: any): void {
        let that = this;
    }

    //渲染html
    public renderTabHtml(data: any): void {
    }

    //下拉改变
    public filterChange(event: any, data: any): void {
        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body)
    }

    //发送请求
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

    public getconfiginformation(event: any, changeObj: any): void {
        this.changeObj = changeObj;
        if (!this.isEmptyObject(changeObj.result)) {
            this.setHtmlObj(changeObj.result);
            this.buildBody(changeObj.result)
        } else {
            return;
        }

        if (changeObj.result && changeObj.result.readyBuildQuery) {

            this.postChange(this.body);
        }
        //x轴位置
        this.echartData.xAxis.position = 'top';

    }

    private commonChange() {
        let _self = this;

        $('#' + this.scopeID).find('div[commonChange]').click((event: any) => {
            $('#' + this.scopeID).find("div[commonSelectList]").show();
        });

        $('#' + this.scopeID).find('div[commonSelectList]').click((event: any) => {

            $('#' + this.scopeID).find("div[commonChange]").html(event.target.innerText);

            this.hour_type = event.target.dataset.id;

            $('#' + this.scopeID).find("div[commonSelectList]").hide();
        })
    }

    public buildBody(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);

        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "stackedBar";
        return this.body;
    }
}