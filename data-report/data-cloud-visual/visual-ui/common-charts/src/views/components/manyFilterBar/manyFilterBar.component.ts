/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {ManyFilterBarTemplate} from "./manyFilterBar.template";
import {Utils} from '../../../../public/scripts/utils';
import {ManyFilterBarModel} from './manyFilterBar.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class ManyFilterBarComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private barData: ManyFilterBarModel = null;
    private echartData: any = null;
    private styleObj: any = null;
    private body: any = null;
    private metricData: any = {};


    private oldValue: Array<any> = [];
    private settingObjCode: string = '';
    private settingArrCode: string = '';

    constructor() {
        super();

        let template = new ManyFilterBarTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.barData = new ManyFilterBarModel();
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
                data: [],
                itemHeight: this.barData.legend_itemHeight,
                itemWidth: this.barData.legend_itemWidth,
                type: 'plain',
                textStyle: {
                    color: this.barData.legend_textStyle_color,
                    fontFamily: this.barData.legend_textStyle_fontFamily,
                    fontSize: this.barData.legend_textStyle_fontSize,
                }
            },

            tooltip: {  // tooltip
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
            xAxis: {
                show: this.barData.xAxis_show,
                type: this.barData.xAxis_type,
                name: this.barData.xAxis_name,
                nameLocation: this.barData.xAxis_nameLocation,
                nameGap: this.barData.xAxis_nameGap,
                boundaryGap: this.barData.xAxis_boundaryGap,

                data: this.barData.xAxis_data,
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
                        fontSize: this.barData.xAxis_axisLabel_textStyle_fontSize,
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
                },
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
                        fontSize: this.barData.yAxis_axisLabel_textStyle_fontSize,
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

            series: [{
                //name: this.barData.series_name,
                type: this.barData.series_type,
                // stack: this.barData.series_stack,
                smooth: this.barData.series_smooth, //折线曲线
                symbol: this.barData.series_symbol,
                symbolSize: this.barData.series_symbolSize,
                showSymbol: this.barData.series_showSymbol,

                //柱图
                // barWidth: this.barData.series_barWidth,
                // barMaxWidth: this.barData.series_barMaxWidth,
                // barMinHeight: this.barData.series_barMinHeight,
                // barGap: this.barData.series_barGap,

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
                data: []
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

    public buildbody(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);
        let date = new Date();
        let yestoday = date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate();
        for(var i = 0; i < this.body.filters.length; i++){
            if(this.body.filters[i].field == "date"){
                this.body.filters[i].value = yestoday;
            }
        }
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "manyFilterBar";
        return this.body;
    }

    public getconfiginformation(event: any, changeObj: any): void {
        this.body = this.buildbody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    }

    //处理数据
    //处理数据
    public handleData(json: any) {
        this.echartData.legend['data'] = [];
        let projectCount = this.body.filters[1]['value'].split(",").length; // 选择店铺的个数

        if (projectCount != 1) {
            //图例legend_data
            let obj = {};
            for(let i = 0; i < json.length; i++){
                if(!obj[json[i]["name"]]){
                    this.echartData.legend['data'].push(json[i]["name"]);
                    obj[json[i]["name"]] = 1;
                }
            }
        } else {
            this.echartData.legend['data'] = ["今日", "昨日", "近7日", "近30日"];
        }


        //数列series_data
        let obj = {};
        $.extend(true, obj, this.echartData.series[0]);

        this.echartData['tooltip']['formatter'] = function (obj: any) {
            let time = obj[0].name;
            let formatterHtml = "";
            if(obj[0].name < 10){
                time = "0" + obj[0].name + ":00 ~ 0" + obj[0].name + ":59";
            }else {
                time = obj[0].name + ":00 ~ " + obj[0].name + ":59";
            }
            for(let i = 0; i < obj.length; i++){
               formatterHtml += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+obj[i].color+'"></span>' + obj[i].seriesName +" : "+ obj[i].data + '<br>';
            }
            
            return time + '<br>' + formatterHtml;
        }

        let count_project = this.echartData.legend['data'].length;
        for (let n = 0; n < count_project; n++) {
            this.echartData.series[n] = {};
            $.extend(true, this.echartData.series[n], obj);
            this.echartData.series[n]['data'] = [];
            this.echartData.series[n].lineStyle['normal']['color'] = this.barData.color[n];
            this.echartData.series[n].itemStyle['normal']['color'] = this.barData.color[n];
            this.echartData.series[n].areaStyle['normal']['color'] = this.barData.color[n];
            this.echartData.series[n]['name'] = this.echartData.legend['data'][n];

            for(let z = 0; z < this.echartData.xAxis['data'].length; z++){
                this.echartData.series[n]['data'][z] = 0;
                for (let m = 0; m < json.length; m++) {
                    if (this.echartData.series[n]['name'] == json[m].name && this.echartData.xAxis['data'][z] == json[m].date) {
                        this.echartData.series[n]['data'][z]= json[m]["value"];
                    }
                }
                

            }
            
        }

    
        if(this.echartData.series.length > count_project){
            this.echartData.series.splice(count_project,this.echartData.series.length);
        }
        
    }

    public dataChange(data: any): void {
        if (data && data.length > 0) {
            this.myChart.clear();
            this.handleData(data);  // 处理数据  -- 组装chart的结构
            if (this.myChart == null) {
                this.init();
            } else {
                data['manyFilterBar'] = "manyFilterBar";
                this.init();
            }
        }else {
            this.myChart.clear();
        }
        
    }

    public filterChange(event: any, data: any): void {
        if(data.metrics){
            data.metrics[0]["alias"] = "value";
            this.metricData = data;
            this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        }else{
            let projectCount = data["filter"][0]['value'].split(",").length;
            (projectCount > 1) ? this.body = this.buildbody({"dscKey": "c_2"}) : this.body = this.buildbody({"dscKey": "c_1"});
            this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
            this.body = DataSourceConfig.mergeBodyByFilter(this.body, this.metricData);
            let date = new Date();
            let mon = date.getMonth() + 1;
            let day = date.getDate();
            let yestoday = date.getFullYear()+"-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
            for(var i = 0; i < this.body.filters.length; i++){
                if(this.body.filters[i].field == "date"){
                    this.body.filters[i].value = yestoday;
                }
            }
        }

        this.postChange(this.body)
    }

    public styleChange(style: any): void {
        if (this.myChart == null) {
            this.init();
        } else {
            this.styleObj = style;
            let changeStyle = Utils.addStyle(style);
            Utils.mergeSourceData(changeStyle, this.echartData);
            let newStyle = Utils.compareObj(changeStyle, this.echartData);
            this.myChart.setOption(newStyle, true);
        }

    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    private changeBody(body: any, innerText: any) {
        body['metrics'] = [
            {'field': innerText, 'alias': 'value'},
        ]
        return body;
    }

    private postChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }

    protected init(): void {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]") as HTMLDivElement);
        // 绘制图表
        this.myChart.setOption(this.echartData);

    }

}