/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {SelectLineTemplate} from "./selectLine.template";
import {Utils} from '../../../../public/scripts/utils';
import {SelectLineModel} from './selectLine.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class SelectedLineComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private lineData: SelectLineModel = null;
    private echartData: any = null;
    private getSoreceData: any = null;
    private styleObj: any = null;
    private changeObj: any = null;
    private body: any = {};
    private scene: any = null;
    private dataConfig: any = {};
    private projectIds: any[] = [];
    private projectNames: any[] = [];

    private dataLength: any = 1;//对比数据的个数
    private height_const = 340;//对比中的一个高度

    private queryId = 0;//对比中的一个高度

    constructor() {
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
                right: this.lineData.legend_right,
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
                },
                // axisPointer: {
                //     show: this.lineData.yAxis_axisPointer_show,
                //     label: {
                //         show: this.lineData.yAxis_axisPointer_label_show
                //     }
                // }
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
                data: this.lineData.series_data,
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
        this.body["requestTitle"] = "selectLine";
        return this.body;
    }

    public setHtmlObj(changeObj: any, index: any): void {

        if (changeObj.scene == "scene_1") {
            this.renderHtml(this.lineData.datasourceSelectKlData, index);
        } else if (changeObj.scene == "scene_2") {
            this.renderHtml(this.lineData.datasourceSelectXsData, index);
        } else {
            $('#' + this.scopeID).find(".chart-selectline")[0]["style"].display = "none";
        }

    }

    public getconfiginformation(event: any, changeObj: any): void {
        this.dataConfig = changeObj.result;
        if (!this.isEmptyObject(changeObj.result)) {
            this.scene = changeObj.result.scene;
            changeObj.result.metricIndex = changeObj.result.metricIndex || 0;
            this.setHtmlObj(changeObj.result, changeObj.result.metricIndex);
            this.setBodyObj(changeObj.result);
        } else {
            return;
        }

        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    }

    public filterChange(event: any, data: any): void {
        if (this.scene == "scene_4") {
            if (data.filter) {
                $("#commonCharts").empty();
                this.projectIds = [];
                this.projectNames = [];
                for (let i = 0; i < data.filter.length; i++) {
                    if (data.filter[i]["field"] == "project_id") {
                        this.projectIds = data.filter[i]["value"].split(",");

                    }
                    if (data.filter[i]["field"] == "projectName") {
                        this.projectNames = data.filter[i]["value"].split(",");
                    }
                }

                for (let j = 0; j < this.projectIds.length; j++) {
                    let str = "";
                    let objOne: any[] = [];
                    $.extend(true, objOne, data);
                    for (let k = 0; k < objOne.filter.length; k++) {
                        if (objOne.filter[k]["field"] == "project_id") {
                            objOne.filter[k]["value"] = this.projectIds[j];
                            this.body.queryId = this.projectIds[j];
                        }
                        str = '<div id="lineWap' + this.projectIds[j] + '" class="lineWap" style="width:100%;height:340px;"><h3 style="width:100%;height:40px;line-height:40px;">' + this.projectNames[j] + '</h3><div id="line' + this.projectIds[j] + '" style="width:100%;height:300px;"></div></div>';
                    }
                    $("#commonCharts").append(str);
                    this.body = DataSourceConfig.mergeBodyByFilter(this.body, objOne);
                    this.postChange(this.body)
                }
            } else {
                for (let j = 0; j < this.projectIds.length; j++) {
                    for (let k = 0; k < this.body.filters.length; k++) {
                        if (this.body.filters[k]["field"] == "project_id") {
                            this.body.filters[k]["value"] = this.projectIds[j];
                            this.body.queryId = this.projectIds[j];
                        }
                    }
                    this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
                    this.postChange(this.body);
                }
            }

            //根据对比数据个数，进行高度缩放，传送增量数据
            let dataLengthNew = 0;
            dataLengthNew = this.projectIds.length;

            if (dataLengthNew > this.dataLength) {
                //增加高度
                this.sendMessage({
                    "op": "plus",
                    "value": (dataLengthNew - this.dataLength) * this.height_const,
                });
            } else if (dataLengthNew < this.dataLength) {
                //减少高度
                this.sendMessage({
                    "op": "minus",
                    "value": (this.dataLength - dataLengthNew) * this.height_const,
                });
            }

            this.dataLength = dataLengthNew;

        } else {
            this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
            this.postChange(this.body);
        }
    }

    private sendMessage(changeObj: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', changeObj)
        );
        super.changeHeightBase(this, sendObj);
    }

    public dataChange(data: any): void {

        if (!data || data.length == 0) {
            $('#' + this.scopeID).find('div[commonCharts]').empty().append('<div class="nodata">暂无数据</div>');
            return;
        }

        if (this.myChart == null) {
            this.init();
        }
        if (data.queryId) {
            this.queryId = data.queryId;
            delete data['queryId'];
            data = data.data;
        }

        data['linetype'] = "linetype";
        let changeData = Utils.changeData(data, this.styleObj);
        Utils.clearSeariesData(changeData, this.echartData.series)
        let newDdata = Utils.compareObj(changeData, this.echartData);
        for (let i = 0; i < this.echartData.series.length; i++) {
            if (this.echartData.series[i]) {
                this.echartData.series[i].type = "line";
                newDdata.series[i].type = "line";
            }
        }

        if (this.queryId) {
            this.initEchart(newDdata);
        } else {
            this.myChart.clear();
            this.myChart.setOption(newDdata, true);
        }

    }

    public initEchart(data: any): void {
        let myChart: any = null;
        let divs = $("#commonCharts").find(".lineWap");
        for (let i = 0; i < divs.length; i++) {
            let div = divs[i].lastChild
            if (div["id"] == "line" + (this.queryId).toString()) {
                myChart = BaseCharts.echarts.init($("#line" + (this.queryId).toString())[0]);
            }
        }
        // 清除图标缓存图表
        myChart.clear();
        // 绘制图表
        myChart.setOption(data);
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

        // let str = "";
        // str = '<div id="selectLineOne" style="width:100%;height: calc(100% - 48px)"></div>';
        // $("#commonCharts").append(str);
        // //基于准备好的dom，初始化echarts实例
        // this.myChart = BaseCharts.echarts.init($("#selectLineOne")[0]);
        // //绘制图表
        // this.myChart.setOption(this.echartData);

        // //commonchange
        // this.commonChange();

        // 基于准备好的dom，初始化echarts实例
        this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonCharts]") as HTMLDivElement);
        // 绘制图表
        this.myChart.setOption(this.echartData);

        //commonchange
        this.commonChange();

    }

    private renderHtml(datasourceData: any, index: any): void {
        let optionList: string = "";

        for (let key in datasourceData) {
            optionList += '<ul>';
            for (let item of datasourceData[key]) {
                optionList += '<li data-id=' + item.id + '>' + item.name + '</li>';
            }
            optionList += '</ul>';
        }

        //把第i项放入已选择框里
        $('#' + this.scopeID).find("div[commonChange]").html(datasourceData["1"][index].name);
        $('#' + this.scopeID).find("div[commonSelectList]").html(optionList);

    }

    private commonChange() {
        let _self = this;

        $('#' + this.scopeID).find('div[commonChange]').click((event: any) => {
            $("div[commonSelectList]").hide();
            $('#' + this.scopeID).find("div[commonSelectList]").show();
            event.stopPropagation();
        });

        $(document).click(function (e) {
            $("div[commonSelectList]").hide();
        })

        $('#' + this.scopeID).find('div[commonSelectList]').click((event: any) => {

            if (event.target.childNodes.length > 1) {
                return;
            }
            $('#' + this.scopeID).find("div[commonChange]").html(event.target.innerText);

            let name = event.target.innerText;
            let sendObj: Object = Object.assign(
                super.transformInput('scopeID', this.scopeID),
                super.transformInput('result', _self.changeBody(_self.body, event.target.dataset.id, name))
            );
            super.onChange(_self, sendObj);

            $('#' + this.scopeID).find("div[commonSelectList]").hide();
        })

        $('#' + this.scopeID).find('div[commonSelected]').find("span").each((i) => {
            $('#' + this.scopeID).find('div[commonSelected]').find("span").eq(i).click((event: any) => {
                $('#' + this.scopeID).find('div[commonSelected]').find("span").eq(i).addClass("selected").siblings().removeClass();
                event.stopPropagation();
            })
        })

    }

    private changeBody(body: any, innerText: any, name: any) {
        body['metrics'] = [];
        let metricArr = innerText.split("|"), obj = {};
        for (let i = 0; i < metricArr.length; i++) {
            obj = {'field': metricArr[i], 'alias': 'value'};
            body['metrics'].push(obj)
        }
        return body;
    }

    private postChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }
}