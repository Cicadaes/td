/**
 * Created by zhaoxue on 2017/3/28.
 */

import {BaseComponent} from "../base.component";
import {StripTemplate} from "./strip.template";
import {Utils} from '../../../../public/scripts/utils';
import {StripModel} from './strip.model';
import {BaseCharts} from '../../base/base.chart';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class StripComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private stripData: StripModel = null;
    private echartData: any = null;
    private styleObj: any = null;
    private body: any = null;
    private scene: any = null;
    private dataConfig: any = {};
    private body_change: any = null;

    private bodyDist: any = {
        "metric_change_1": {
            "metrics": [
                {
                    "field": "duration_new_5"
                },
                {
                    "field": "duration_new_15"
                },
                {
                    "field": "duration_new_30"
                },
                {
                    "field": "duration_new_60"
                },
                {
                    "field": "duration_old_5"
                },
                {
                    "field": "duration_old_15"
                },
                {
                    "field": "duration_old_30"
                },
                {
                    "field": "duration_old_60"
                }
            ]
        },
        "metric_change_3": {
            "metrics": [
                {
                    "field": "high_active_5"
                },
                {
                    "field": "high_active_15"
                },
                {
                    "field": "high_active_30"
                },
                {
                    "field": "high_active_60"
                },
                {
                    "field": "middle_active_5"
                },
                {
                    "field": "middle_active_15"
                },
                {
                    "field": "middle_active_30"
                },
                {
                    "field": "middle_active_60"
                },
                {
                    "field": "low_active_5"
                },
                {
                    "field": "low_active_15"
                },
                {
                    "field": "low_active_30"
                },
                {
                    "field": "low_active_60"
                },
                {
                    "field": "sleep_active_5"
                },
                {
                    "field": "sleep_active_15"
                },
                {
                    "field": "sleep_active_30"
                },
                {
                    "field": "sleep_active_60"
                }
            ]
        }
    };

    constructor() {
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
                right: this.stripData.legend_right,
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

    public getconfiginformation(event: any, changeObj: any): void {
        this.dataConfig = changeObj.result;
        this.scene = changeObj.result.scene;
        this.body = this.buildbody(changeObj.result);

        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    }

    public dataChange(data: any): void {
        if(data.length == 0){
            this.myChart.clear();
            return;
        }
        let dataArray = [];
        if (this.scene == "scene_2") {
            this.echartData.tooltip.formatter = "{b0}: {c0}";
            this.echartData.legend.show = false;

            for (let i = data.length - 1; i >= 0; i--) {
                let obj = data[i];
                dataArray.push({
                    "date": obj.area_name,
                    "value": obj.metric_value
                });
            }
        } else if (this.scene == "scene_1" && data.length > 0) {
            this.echartData.tooltip.formatter = "";
            this.echartData.legend.show = true;
            let obj = data[0];
            if (!this.body_change || this.body_change == "metric_change_1") {
                dataArray.push({
                    "date": "1min",
                    "name": "新客",
                    "value": obj["duration_new_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "新客",
                    "value": obj["duration_new_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "新客",
                    "value": obj["duration_new_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "新客",
                    "value": obj["duration_new_60"]
                });

                dataArray.push({
                    "date": "1min",
                    "name": "老客",
                    "value": obj["duration_old_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "老客",
                    "value": obj["duration_old_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "老客",
                    "value": obj["duration_old_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "老客",
                    "value": obj["duration_old_60"]
                });
            }
            else if (this.body_change == "metric_change_3") {
                dataArray.push({
                    "date": "1min",
                    "name": "高活跃客群",
                    "value": obj["high_active_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "高活跃客群",
                    "value": obj["high_active_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "高活跃客群",
                    "value": obj["high_active_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "高活跃客群",
                    "value": obj["high_active_60"]
                });

                // "middle_active_5":0,"middle_active_15":0,"middle_active_30":0,"middle_active_60":0,
                dataArray.push({
                    "date": "1min",
                    "name": "中活跃客群",
                    "value": obj["middle_active_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "中活跃客群",
                    "value": obj["middle_active_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "中活跃客群",
                    "value": obj["middle_active_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "中活跃客群",
                    "value": obj["middle_active_60"]
                });

                // "low_active_5":0,"low_active_15":0,"low_active_30":0,"low_active_60":0,
                dataArray.push({
                    "date": "1min",
                    "name": "低活跃客群",
                    "value": obj["low_active_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "低活跃客群",
                    "value": obj["low_active_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "低活跃客群",
                    "value": obj["low_active_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "低活跃客群",
                    "value": obj["low_active_60"]
                });

                // "sleep_active_5":0,"sleep_active_15":0,"sleep_active_30":0,"sleep_active_60":0}]
                dataArray.push({
                    "date": "1min",
                    "name": "沉睡客群",
                    "value": obj["sleep_active_5"]
                });
                dataArray.push({
                    "date": "1-5min",
                    "name": "沉睡客群",
                    "value": obj["sleep_active_15"]
                });
                dataArray.push({
                    "date": "5-15min",
                    "name": "沉睡客群",
                    "value": obj["sleep_active_30"]
                });
                dataArray.push({
                    "date": ">15min",
                    "name": "沉睡客群",
                    "value": obj["sleep_active_60"]
                });
            }
        } else if (this.scene == "scene_3" && data.length > 0) {
            this.echartData.tooltip.formatter = "";
            this.echartData.legend.show = true;
            let obj = data[0];
            dataArray.push({
                "date": "1次",
                "name": "老客",
                "value": obj["time_old_1"]
            });
            dataArray.push({
                "date": "2-3次",
                "name": "老客",
                "value": obj["time_old_2"]
            });
            dataArray.push({
                "date": "4-5次",
                "name": "老客",
                "value": obj["time_old_3"]
            });
            dataArray.push({
                "date": ">5次",
                "name": "老客",
                "value": obj["time_old_5"]
            });
        }

        if (this.myChart == null) {
            // 基于准备好的dom，初始化echarts实例
            this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID) as HTMLDivElement);
        }

        dataArray['striptype'] = "stripType";
        let changeData = Utils.changeData(dataArray, this.styleObj);
        Utils.clearSeariesData(changeData, this.echartData.series)
        let newDdata = Utils.compareObj(changeData, this.echartData);
        newDdata["series"][0]["label"] = {
            "normal": {
                "position": 'right',
                "show": true,
                "formatter": '{c}',
                "color": '#76818e'
            }
        };
        this.myChart.setOption(newDdata, true);
    }

    public filterChange(event: any, data: any): void {
        if (data.body_change) {
            this.body_change = data.body_change;
            if (this.bodyDist[data.body_change]) {
                this.body = DataSourceConfig.mergeBodyByFilter(this.body, this.bodyDist[data.body_change]);
            }
        } else {
            this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        }
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
        this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID) as HTMLDivElement);

        // 绘制图表
        this.myChart.setOption(this.echartData)

    }

    //buildBody
    public buildbody(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);

        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "strip";
        return this.body;
    }
}