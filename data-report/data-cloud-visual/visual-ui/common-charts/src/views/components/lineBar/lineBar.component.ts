/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {LineBarTemplate} from "./lineBar.template";
import {Utils} from '../../../../public/scripts/utils';
import {LineBarModel} from './lineBar.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class LineBarComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private lineBarData: LineBarModel = null;
    private echartData: any = null;
    private getSoreceData: any = null;
    private styleObj: any = null;
    private changeObj: any = null;
    private body: any = {
        "datasource_id": 52,
        "dimensions": [
            {"field": "score", "alias": "date"},
            {
                "field": "ROUND(count/total*100,2)",
                "alias": "percent"
            },
            {"field": "average_R"},
            {"field": "average_F"},
            {"field": "average_M"}
        ],
        "filters": [
            {
                "field": 'year_month',
                "operator": "=",
                "value": Utils.changeDate(DataSourceConfig.getMonthShowFormatDate(), "-", "")
            },
            {"field": 'brand_name', "operator": "=", "value": "all"},
            {"field": 'channel_name', "operator": "=", "value": "all"}
        ],
        "orderBy": [{"field": "score", "function": "ASC"}]
    };

    constructor() {
        super();
        let template = new LineBarTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.lineBarData = new LineBarModel();
        this.echartData = {
            backgroundColor: this.lineBarData.backgroundColor, //背景颜色
            color: this.lineBarData.color,

            textStyle: {
                color: this.lineBarData.textStyle_color,
                fontFamily: this.lineBarData.textStyle_fontFamily,
                fontSize: this.lineBarData.textStyle_fontSize,
            },

            title: {
                show: this.lineBarData.title_show,
                text: this.lineBarData.title_text,
                subtext: this.lineBarData.title_subtext,
                left: this.lineBarData.title_left,
                top: this.lineBarData.title_top,
                // textStyle: {
                //     color: this.lineBarData.title_textStyle_color
                // }
            },

            legend: {  //设置图例
                show: this.lineBarData.legend_show,
                z: this.lineBarData.legend_z,
                left: this.lineBarData.legend_left,
                top: this.lineBarData.legend_top,
                orient: this.lineBarData.legend_orient,
                data: this.lineBarData.legend_data,
                itemHeight: this.lineBarData.legend_itemHeight,
                itemWidth: this.lineBarData.legend_itemWidth,
                type: 'scroll',
                textStyle: {
                    color: this.lineBarData.legend_textStyle_color,
                    fontFamily: this.lineBarData.legend_textStyle_fontFamily,
                    fontSize: this.lineBarData.legend_textStyle_fontSize,
                }
            },

            tooltip: {  // tooltip
                show: this.lineBarData.tooltip_show,
                trigger: this.lineBarData.tooltip_trigger,
                formatter: this.lineBarData.tooltip_formatter,
                axisPointer: {
                    type: this.lineBarData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: this.lineBarData.tooltip_textStyle_color,
                    fontFamily: this.lineBarData.tooltip_textStyle_fontFamily,
                    fontSize: this.lineBarData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.lineBarData.tooltip_backgroundColor,
                borderColor: this.lineBarData.tooltip_borderColor,
                borderWidth: this.lineBarData.tooltip_borderWidth,
                padding: this.lineBarData.tooltip_padding,
            },

            grid: {
                show: this.lineBarData.grid_show,
                left: this.lineBarData.grid_left,
                right: this.lineBarData.grid_right,
                top: "60",
                bottom: this.lineBarData.grid_bottom,
                containLabel: this.lineBarData.grid_containLabel,
                borderColor: this.lineBarData.grid_borderColor,
                borderWidth: this.lineBarData.grid_borderWidth
            },

            //线图
            xAxis: {
                show: this.lineBarData.xAxis_show,
                type: this.lineBarData.xAxis_type,
                boundaryGap: this.lineBarData.xAxis_boundaryGap,
                data: this.lineBarData.xAxis_data,
                name: this.lineBarData.xAxis_name,
                nameLocation: this.lineBarData.xAxis_nameLocation,
                nameGap: this.lineBarData.xAxis_nameGap,
                axisLine: {
                    show: this.lineBarData.xAxis_axisLine_show,
                    lineStyle: {
                        color: this.lineBarData.xAxis_axisLine_lineStyle_color,
                        width: this.lineBarData.xAxis_axisLine_lineStyle_width,
                        type: this.lineBarData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: this.lineBarData.xAxis_axisTick_show,
                    alignWithLabel: this.lineBarData.xAxis_axisTick_alignWithLabel,
                    length: this.lineBarData.xAxis_axisTick_length,
                    lineStyle: {
                        width: this.lineBarData.xAxis_axisTick_lineStyle_width,
                        type: this.lineBarData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: this.lineBarData.xAxis_axisLabel_show,
                    margin: this.lineBarData.xAxis_axisLabel_margin,
                    rotate: 0,
                    textStyle: {
                        color: this.lineBarData.xAxis_axisLabel_textStyle_color,
                        fontFamily: this.lineBarData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: this.lineBarData.xAxis_axisLabel_textStyle_fontSize,
                    }
                },
                //区域中的分割线
                splitLine: {
                    show: this.lineBarData.xAxis_splitLine_show,
                    lineStyle: {
                        color: this.lineBarData.xAxis_splitLine_lineStyle_color,
                        width: this.lineBarData.xAxis_splitLine_lineStyle_width,
                        type: this.lineBarData.xAxis_splitLine_lineStyle_type
                    },
                }
            },

            yAxis: [{
                show: this.lineBarData.yAxis_show,
                type: this.lineBarData.yAxis_type,
                name: this.lineBarData.yAxis_name,
                nameLocation: this.lineBarData.yAxis_nameLocation,
                nameTextStyle: {
                    color: "#fff"
                },
                nameGap: this.lineBarData.yAxis_nameGap,
                min: this.lineBarData.yAxis_min,
                max: this.lineBarData.yAxis_max,
                axisLine: {
                    show: this.lineBarData.yAxis_axisLine_show,
                    lineStyle: {
                        color: this.lineBarData.yAxis_axisLine_lineStyle_color,
                        width: this.lineBarData.yAxis_axisLine_lineStyle_width,
                        type: this.lineBarData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: this.lineBarData.yAxis_axisTick_show,
                    alignWithLabel: this.lineBarData.yAxis_axisTick_alignWithLabel,
                    length: this.lineBarData.yAxis_axisTick_length,
                    lineStyle: {
                        width: this.lineBarData.yAxis_axisTick_lineStyle_width,
                        type: this.lineBarData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: this.lineBarData.yAxis_axisLabel_show,
                    margin: this.lineBarData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: this.lineBarData.yAxis_axisLabel_textStyle_color,
                        fontFamily: this.lineBarData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: this.lineBarData.yAxis_axisLabel_textStyle_fontSize,
                    },
                    formatter: '{value}'
                },
                //区域中的分割线
                splitLine: {
                    show: this.lineBarData.yAxis_splitLine_show,
                    lineStyle: {
                        color: this.lineBarData.yAxis_splitLine_lineStyle_color,
                        width: this.lineBarData.yAxis_splitLine_lineStyle_width,
                        type: this.lineBarData.yAxis_splitLine_lineStyle_type
                    },
                },
                interval: 1,
            }, {
                show: this.lineBarData.yAxis_show,
                type: this.lineBarData.yAxis_type,
                name: this.lineBarData.yAxis_1_name,
                nameLocation: this.lineBarData.yAxis_nameLocation,
                nameTextStyle: {
                    color: "#fff"
                },
                nameGap: this.lineBarData.yAxis_nameGap,
                min: this.lineBarData.yAxis_1_min,
                max: this.lineBarData.yAxis_1_max,
                axisLine: {
                    show: this.lineBarData.yAxis_axisLine_show,
                    lineStyle: {
                        color: this.lineBarData.yAxis_axisLine_lineStyle_color,
                        width: this.lineBarData.yAxis_axisLine_lineStyle_width,
                        type: this.lineBarData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: this.lineBarData.yAxis_axisTick_show,
                    alignWithLabel: this.lineBarData.yAxis_axisTick_alignWithLabel,
                    length: this.lineBarData.yAxis_axisTick_length,
                    lineStyle: {
                        width: this.lineBarData.yAxis_axisTick_lineStyle_width,
                        type: this.lineBarData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: this.lineBarData.yAxis_axisLabel_show,
                    margin: this.lineBarData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: this.lineBarData.yAxis_axisLabel_textStyle_color,
                        fontFamily: this.lineBarData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: this.lineBarData.yAxis_axisLabel_textStyle_fontSize,
                    },
                    formatter: '{value} %'
                },
                //区域中的分割线
                splitLine: {
                    show: this.lineBarData.yAxis_splitLine_show,
                    lineStyle: {
                        color: this.lineBarData.yAxis_splitLine_lineStyle_color,
                        width: this.lineBarData.yAxis_splitLine_lineStyle_width,
                        type: this.lineBarData.yAxis_splitLine_lineStyle_type
                    },
                },
                interval: 5
            }],

            series: [{
                name: this.lineBarData.series_name,
                type: this.lineBarData.series_type,
                barMaxWidth: '40',
                smooth: this.lineBarData.series_smooth, //折线曲线
                symbol: this.lineBarData.series_symbol,
                symbolSize: this.lineBarData.series_symbolSize,
                showSymbol: this.lineBarData.series_showSymbol,
                label: {
                    normal: {
                        show: this.lineBarData.series_label_normal_show,
                        position: 'top'
                    }
                },
                lineStyle: {
                    normal: {
                        width: this.lineBarData.series_lineStyle_normal_width,
                        type: this.lineBarData.series_lineStyle_normal_type
                    },
                },
                data: this.lineBarData.series_data
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

    public getconfiginformation(event: any, changeObj: any): void {
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    }

    public filterChange(event: any, data: any): void {
        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body)
    }

    public mergeFilterChange(event: any, target: any): void {
        super.onFilterChange(this, target);
    }

    public dataChange(data: any): void {
        if (this.myChart == null) {
            this.init();
        }
        // if(data.total > 0){
        //     $("#"+this.scopeID).find("div[commonTotal] span").html(Utils.changeNumber(data.total));
        // }else{
        //     $("#"+this.scopeID).find("div[commonTotal] span").html("0");
        // }
        data['lineBartype'] = "lineBartype";
        let changeData = Utils.changeData(data, this.styleObj);
        Utils.clearSeariesData(changeData, this.echartData.series)
        let newDdata = Utils.compareObj(changeData, this.echartData);
        this.myChart.setOption(newDdata, true);
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {
        this.init();
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