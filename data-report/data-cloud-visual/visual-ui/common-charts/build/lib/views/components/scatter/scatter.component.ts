/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {ScatterTemplate} from "./scatter.template";
import {Utils} from '../../../../public/scripts/utils';
import {ScatterModel} from './scatter.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class ScatterComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private scatterData: ScatterModel = null;
    private echartData: any = null;
    private tableData: any = null;
    private seriesName: any = null;
    private seriesData: any = null;
    private averageX: any = null;
    private averageY: any = null;
    private settingObjCode: any = [];
    private oldValue: any = [];
    private body: any = null;
    private projectName: any = '项目';
    private datasourceId: any = null;

    constructor() {
        super();
        let template = new ScatterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.scatterData = new ScatterModel();
        // this.handleData(this.scatterData);
        this.echartData = {
            backgroundColor: this.scatterData.backgroundColor, //背景颜色

            title: {
                show: this.scatterData.title_show,
                text: this.scatterData.title_text,
                subtext: this.scatterData.title_subtext,
                left: this.scatterData.title_left,
                top: this.scatterData.title_top,
                textStyle: {
                    color: this.scatterData.title_textStyle_color
                }
            },

            legend: {  //设置图例
                show: this.scatterData.legend_show,
                z: this.scatterData.legend_z,
                left: this.scatterData.legend_left,
                top: this.scatterData.legend_top,
                orient: this.scatterData.legend_orient,
                data: this.scatterData.legend_data,
                itemWidth: this.scatterData.legend_itemWidth,
                itemHeight: this.scatterData.legend_itemHeight
            },

            tooltip: {  // tooltip
                show: this.scatterData.tooltip_show,
                trigger: this.scatterData.tooltip_trigger,
                formatter: this.scatterData.tooltip_formatter,
                axisPointer: {
                    type: this.scatterData.tooltip_axisPointer_type
                },
                textStyle: {
                    color: this.scatterData.tooltip_textStyle_color,
                    fontFamily: this.scatterData.tooltip_textStyle_fontFamily,
                    fontSize: this.scatterData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.scatterData.tooltip_backgroundColor,
                borderColor: this.scatterData.tooltip_borderColor,
                borderWidth: this.scatterData.tooltip_borderWidth,
                padding: this.scatterData.tooltip_padding
            },

            //x轴
            xAxis: {
                show: this.scatterData.xAxis_show,
                min: this.scatterData.xAxis_min,
                max: this.scatterData.xAxis_max,
                type: this.scatterData.xAxis_type,
                boundaryGap: this.scatterData.xAxis_boundaryGap,
                axisLine: {
                    show: this.scatterData.xAxis_axisLine_show,
                    lineStyle: {
                        color: this.scatterData.xAxis_axisLine_lineStyle_color,
                        width: this.scatterData.xAxis_axisLine_lineStyle_width,
                        type: this.scatterData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: this.scatterData.xAxis_axisTick_show,
                    alignWithLabel: this.scatterData.xAxis_axisTick_alignWithLabel,
                    length: this.scatterData.xAxis_axisTick_length,
                    lineStyle: {
                        color: this.scatterData.xAxis_axisTick_lineStyle_color,
                        width: this.scatterData.xAxis_axisTick_lineStyle_width,
                        type: this.scatterData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: this.scatterData.xAxis_axisLabel_show,
                    margin: this.scatterData.xAxis_axisLabel_margin,
                    // interval: 0,
                    rotate: 0,
                    textStyle: {
                        color: this.scatterData.xAxis_axisLabel_textStyle_color,
                        fontFamily: this.scatterData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: this.scatterData.xAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: this.scatterData.xAxis_splitLine_show,
                    lineStyle: {
                        color: this.scatterData.xAxis_splitLine_lineStyle_color,
                        width: this.scatterData.xAxis_splitLine_lineStyle_width,
                        type: this.scatterData.xAxis_splitLine_lineStyle_type
                    },
                }
                // axisPointer: {
                //     type: this.scatterData.xAxis_axisPointer_type,
                //     label: {
                //         show: this.scatterData.xAxis_axisPointer_label_show,
                //     }
                // }
            },

            //y轴
            yAxis: {
                show: this.scatterData.yAxis_show,
                type: this.scatterData.yAxis_type,
                min: this.scatterData.yAxis_min,
                max: this.scatterData.yAxis_max,
                scale: this.scatterData.yAxis_scale,
                axisLine: {
                    show: this.scatterData.yAxis_axisLine_show
                    // lineStyle: {
                    //     color: this.scatterData.yAxis_axisLine_lineStyle_color,
                    //     width: this.scatterData.yAxis_axisLine_lineStyle_width,
                    //     type: this.scatterData.yAxis_axisLine_lineStyle_type,
                    // },
                },
                //y轴刻度
                axisTick: {
                    show: this.scatterData.yAxis_axisTick_show
                    // alignWithLabel: this.scatterData.yAxis_axisTick_alignWithLabel,
                    // length: this.scatterData.yAxis_axisTick_length,
                    // lineStyle: {
                    //     color: this.scatterData.yAxis_axisTick_lineStyle_color,
                    //     width: this.scatterData.yAxis_axisTick_lineStyle_width,
                    //     type: this.scatterData.yAxis_axisTick_lineStyle_type,
                    // }
                },
                //y轴label
                axisLabel: {
                    show: this.scatterData.yAxis_axisLabel_show,
                    margin: this.scatterData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: this.scatterData.yAxis_axisLabel_textStyle_color,
                        fontFamily: this.scatterData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: this.scatterData.yAxis_axisLabel_textStyle_fontSize,
                    }
                },
                //区域中的分割线
                splitLine: {
                    show: this.scatterData.yAxis_splitLine_show,
                    lineStyle: {
                        color: this.scatterData.yAxis_splitLine_lineStyle_color,
                        width: this.scatterData.yAxis_splitLine_lineStyle_width,
                        type: this.scatterData.yAxis_splitLine_lineStyle_type
                    },
                }
                // axisPointer: {
                //     show: this.scatterData.yAxis_axisPointer_show,
                //     label: {
                //         show: this.scatterData.yAxis_axisPointer_label_show
                //     }
                // }
            },

            grid: {
                show: this.scatterData.grid_show,
                left: this.scatterData.grid_left,
                right: this.scatterData.grid_right,
                bottom: this.scatterData.grid_bottom,
                containLabel: this.scatterData.grid_containLabel,
                borderColor: this.scatterData.grid_borderColor,
                borderWidth: this.scatterData.grid_borderWidth
            },

            //象限图
            series: [{
                name: this.scatterData.series[0].name,
                type: this.scatterData.series[0].type,

                symbolSize: this.scatterData.series[0].symbolSize,
                data: [],
                label: this.scatterData.series[0].label,

                itemStyle: {
                    normal: {
                        color: this.scatterData.series[0].itemStyle.normal.color,
                        borderWidth: this.scatterData.series[0].itemStyle.normal.borderWidth,
                        borderColor: this.scatterData.series[0].itemStyle.normal.borderColor,
                        borderType: this.scatterData.series[0].itemStyle.normal.borderType
                    }
                },

                markLine: {
                    lineStyle: {
                        normal: {
                            type: this.scatterData.series[0]['markLine'].lineStyle.normal.type,
                            color: this.scatterData.series[0]['markLine'].lineStyle.normal.color,
                            width: this.scatterData.series[0]['markLine'].lineStyle.normal.width
                        }
                    },
                    data: [
                        {
                            name: this.scatterData.series[0]['markLine'].data[0].name,
                            yAxis: this.averageY
                        }, {
                            name: this.scatterData.series[0]['markLine'].data[1].name,
                            xAxis: this.averageX
                        }
                    ],
                    symbol: this.scatterData.series[0]['markLine'].symbol,
                    symbolSize: this.scatterData.series[0]['markLine'].symbolSize,
                    label: {
                        normal: {
                            show: this.scatterData.series[0]['markLine'].label.normal.show
                        }
                    },
                    silent: this.scatterData.series[0]['markLine'].silent
                },
                markArea: {
                    silent: this.scatterData.series[0]['markArea'].silent,
                    itemStyle: {
                        normal: {
                            color: this.scatterData.series[0]['markArea'].itemStyle.normal.color,
                            borderWidth: this.scatterData.series[0]['markArea'].itemStyle.normal.borderWidth,
                            borderType: this.scatterData.series[0]['markArea'].itemStyle.normal.borderType
                        }
                    },
                    data: this.scatterData.series[0]['markArea'].data,
                    label: {
                        normal: {
                            position: this.scatterData.series[0]['markArea'].label.normal.position
                        }
                    }

                }

            }, {
                name: this.scatterData.series[1].name,
                type: this.scatterData.series[1].type,

                symbolSize: this.scatterData.series[1].symbolSize,
                data: [],
                label: this.scatterData.series[1].label,

                itemStyle: {
                    normal: {
                        color: this.scatterData.series[1].itemStyle.normal.color,
                        borderWidth: this.scatterData.series[1].itemStyle.normal.borderWidth,
                        borderColor: this.scatterData.series[1].itemStyle.normal.borderColor,
                        borderType: this.scatterData.series[1].itemStyle.normal.borderType
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            type: this.scatterData.series[1]['markLine'].lineStyle.normal.type,
                            color: this.scatterData.series[1]['markLine'].lineStyle.normal.color,
                            width: this.scatterData.series[1]['markLine'].lineStyle.normal.width
                        }
                    },
                    data: [
                        {
                            name: this.scatterData.series[1]['markLine'].data[0].name,
                            yAxis: this.averageY
                        }, {
                            name: this.scatterData.series[1]['markLine'].data[1].name,
                            xAxis: this.averageX
                        }
                    ],
                    symbol: this.scatterData.series[1]['markLine'].symbol,
                    symbolSize: this.scatterData.series[1]['markLine'].symbolSize,
                    label: {
                        normal: {
                            show: this.scatterData.series[1]['markLine'].label.normal.show
                        }
                    },
                    silent: this.scatterData.series[1]['markLine'].silent
                }
            }, {
                name: this.scatterData.series[2].name,
                type: this.scatterData.series[2].type,

                symbolSize: this.scatterData.series[2].symbolSize,
                data: [],
                label: this.scatterData.series[2].label,

                itemStyle: {
                    normal: {
                        color: this.scatterData.series[2].itemStyle.normal.color,
                        borderWidth: this.scatterData.series[2].itemStyle.normal.borderWidth,
                        borderColor: this.scatterData.series[2].itemStyle.normal.borderColor,
                        borderType: this.scatterData.series[2].itemStyle.normal.borderType
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            type: this.scatterData.series[2]['markLine'].lineStyle.normal.type,
                            color: this.scatterData.series[2]['markLine'].lineStyle.normal.color,
                            width: this.scatterData.series[2]['markLine'].lineStyle.normal.width
                        }
                    },
                    data: [
                        {
                            name: this.scatterData.series[2]['markLine'].data[0].name,
                            yAxis: this.averageY
                        }, {
                            name: this.scatterData.series[2]['markLine'].data[1].name,
                            xAxis: this.averageX
                        }
                    ],
                    symbol: this.scatterData.series[2]['markLine'].symbol,
                    symbolSize: this.scatterData.series[2]['markLine'].symbolSize,
                    label: {
                        normal: {
                            show: this.scatterData.series[2]['markLine'].label.normal.show
                        }
                    },
                    silent: this.scatterData.series[2]['markLine'].silent
                }
            }, {
                name: this.scatterData.series[3].name,
                type: this.scatterData.series[3].type,

                symbolSize: this.scatterData.series[3].symbolSize,
                data: [],
                label: this.scatterData.series[3].label,

                itemStyle: {
                    normal: {
                        color: this.scatterData.series[3].itemStyle.normal.color,
                        borderWidth: this.scatterData.series[3].itemStyle.normal.borderWidth,
                        borderColor: this.scatterData.series[3].itemStyle.normal.borderColor,
                        borderType: this.scatterData.series[3].itemStyle.normal.borderType
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            type: this.scatterData.series[3]['markLine'].lineStyle.normal.type,
                            color: this.scatterData.series[3]['markLine'].lineStyle.normal.color,
                            width: this.scatterData.series[3]['markLine'].lineStyle.normal.width
                        }
                    },
                    data: [
                        {
                            name: this.scatterData.series[3]['markLine'].data[0].name,
                            yAxis: this.averageY
                        }, {
                            name: this.scatterData.series[3]['markLine'].data[1].name,
                            xAxis: this.averageX
                        }
                    ],
                    symbol: this.scatterData.series[3]['markLine'].symbol,
                    symbolSize: this.scatterData.series[3]['markLine'].symbolSize,
                    label: {
                        normal: {
                            show: this.scatterData.series[3]['markLine'].label.normal.show
                        }
                    },
                    silent: this.scatterData.series[3]['markLine'].silent
                }
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

    // public settingChange(event:any,target:any): void{

    //拿到配置的指标重新渲染
    // this.renderContainerXY(target.settingObj.result,target.settingObj.code);
    // this.saveSettingObjCode(target.settingObj.code);
    // this.setDefaltIndicators();

    //绑定事件
    // this.eventBindHtml();
    // }

    //保存code
    // public saveSettingObjCode(code:any){       
    //     this.settingObjCode[code.charAt(code.length -1) -1] = code;
    // }

    public getconfiginformation(event: any, changeObj: any): void {
        if (!this.isEmptyObject(changeObj)) {
            //设置默认指标
            if (changeObj.result.nameType) {
                this.projectName = changeObj.result.nameType;
            }
            this.setDefaltIndicators(changeObj);
        } else {
            return;
        }
    }

    //buildBody
    public buildbody(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);
        this.datasourceId = this.body.datasource_id;
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "scatter";
        return this.body;
    }

    public getProjectName(filterArr: any) {

        for (let j = 0; j < filterArr.length; j++) {
            let filter = filterArr[j];
            if (filter['field'] == 'projectType') {
                return this.scatterData.projectInfo[filter['value']]
            }
        }

    }

    public resize(): void {
        if (this.myChart) this.myChart.resize();
    }

    public dataChange(data: any): void {
        if (data && data.length > 0) {
            this.chartData = data;
            // var myChartData = this.myChart.getOption();       
            this.scatterData.data = data;
            $('div[containerScatter]', '#' + this.scopeID).show();
            $('div[containerNodata]', '#' + this.scopeID).hide();
            $(".quadrantRegion", '#' + this.scopeID).show();

            //处理data
            this.handleData(this.scatterData);
            this.scatterData.legend_data = this.echartData.legend.data = this.seriesName;

            let indicatorXName = this.scatterData.indicatorXName;
            let indicatorYName = this.scatterData.indicatorYName;
            let projectName = this.projectName;
            this.echartData['tooltip']['formatter'] = function (obj: any) {
                let value = obj.value;
                let xValue = (value[0] + '').replace(/(\d{1,2})(?=(\d{3})+$)/g, '$1,');
                let yValue = (value[1] + '').replace(/(\d{1,2})(?=(\d{3})+$)/g, '$1,');
                return '品牌：' + obj.seriesName + '<br>' +
                    projectName + '：' + value[2] + '<br>' +
                    indicatorXName + '：' + xValue + '<br>' +
                    '排名：' + value[3] + '<br>' +
                    indicatorYName + '：' + yValue + '<br>' +
                    '排名：' + value[4]
            }

            //重置图表配置的series
            let obj = {};
            $.extend(true, obj, this.echartData.series[0]);
            this.echartData.series = [];
            for (let i = 0; i < this.seriesData.length; i++) {
                this.echartData.series[i] = {};
                $.extend(true, this.echartData.series[i], obj);
                this.echartData.series[i].name = this.seriesName[i];
                this.echartData.series[i].data = this.seriesData[i];
                this.echartData.series[i]['itemStyle'].normal['color'] = this.scatterData.echart_color[i];
                this.echartData.series[i]['itemStyle'].normal['borderColor'] = this.scatterData.echart_color[i];
                this.echartData.series[i]['markLine']['data'][0].yAxis = this.averageY;
                this.echartData.series[i]['markLine']['data'][1].xAxis = this.averageX;
            }

            this.myChart = BaseCharts.echarts.init(this.element.querySelector("div[containerScatter]") as HTMLDivElement);
            // 清除图标缓存
            this.myChart.clear();
            //重新渲染象限图
            this.myChart.setOption(this.echartData);

            //重新渲染表格      
            this.renderTables(this.tableData, 5);

        } else {
            $(".quadrantRegion", '#' + this.scopeID).hide();
            $('div[containerScatter]', '#' + this.scopeID).hide();
            $('div[containerNodata]', '#' + this.scopeID).show();
            $('div[containerRight]', '#' + this.scopeID).empty();
        }
        //绑定事件
        this.eventBindHtml();
    }

    public filterChange(event: any, data: any): void {

        let dataNew = JSON.parse(JSON.stringify(data));

        if (!dataNew.datasource_id) {
            dataNew.datasource_id = this.datasourceId;
        }

        let tmpName = null;
        if (dataNew.filter && dataNew.filter.length > 0) tmpName = this.getProjectName(dataNew.filter);

        if (tmpName) {
            this.projectName = tmpName;
        }
        this.body = DataSourceConfig.mergeBodyByFilter(this.body, dataNew);
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
        // let changeStyle = Utils.addStyle(style);
        // Utils.mergeSourceData(changeStyle,this.echartData);
        // let newStyle = Utils.compareObj(changeStyle,this.echartData);
        // this.myChart.setOption(newStyle,true);
    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    //处理数据
    public handleData(json: any) {



        //获取几个数列
        this.getSeriesInfo(this.scatterData);

        //数据分区
        this.tableData = this.assortDataToQuadrant(json);

        //数据排名
        this.rankData(json, this.tableData);

        //数据默认降序排列
        this.tableData.forEach(function (obj: any, index: any) {
            if (obj.data) {
                obj.data.sort(function (a: any, b: any) {
                    return b[json.indicatorX] - a[json.indicatorX];
                })
            }
        })

        //数据分类
        this.seriesData = this.makeDataToSeries(json, this.tableData);
    }

    //数据排名
    public rankData(json: any, tableData: any) {
        if (tableData) {
            //X轴降序排名
            tableData.forEach(function (obj: any, index: any) {
                if (obj.data) {
                    obj.data.sort(function (a: any, b: any) {
                        return b[json.indicatorX] - a[json.indicatorX];
                    })
                }
            })
            tableData.forEach(function (obj: any, index: any) {
                if (obj.data) {
                    let rankX = 1;
                    for (let i = 0; i < obj.data.length; i++) {
                        if (i > 0 && obj.data[i][json.indicatorX] != obj.data[i - 1][json.indicatorX]) {
                            rankX = i + 1;
                        }
                        obj.data[i]['rankX'] = rankX;
                    }
                }
            })

            //Y轴降序排名
            tableData.forEach(function (obj: any, index: any) {
                if (obj.data) {
                    obj.data.sort(function (a: any, b: any) {
                        return b[json.indicatorY] - a[json.indicatorY];
                    })
                }
            })

            tableData.forEach(function (obj: any, index: any) {
                let rankY = 1;
                for (let j = 0; j < obj.data.length; j++) {
                    if (j > 0 && obj.data[j][json.indicatorY] != obj.data[j - 1][json.indicatorY]) {
                        rankY = j + 1;
                    }
                    obj.data[j]['rankY'] = rankY;
                }
            })
        }
    }

    //获取series数列对应的数组
    public getSeriesInfo(json: any) {
        let hashtable = {};
        let seriesName = []
        for (let i = 0; i < json.data.length; i++) {
            if (!hashtable[json.data[i].brand]) {
                hashtable[json.data[i].brand] = 1;
                seriesName.push(json.data[i].brand);
            }
        }
        this.seriesName = seriesName;
    }

    //将数据分区
    public assortDataToQuadrant(json: any) {
        let sumX: number = 0;
        let sumY: number = 0;
        json.data.forEach(function (obj: any) {
            sumX += obj[json.indicatorX];
            sumY += obj[json.indicatorY];
        })
        this.averageX = sumX / json.data.length;
        this.averageY = sumY / json.data.length;

        let arr: any = [{
            head: ['A区', json.indicatorXName, json.indicatorYName],
            data: []
        }, {
            head: ['B区', json.indicatorXName, json.indicatorYName],
            data: []
        }, {
            head: ['C区', json.indicatorXName, json.indicatorYName],
            data: []
        }, {
            head: ['D区', json.indicatorXName, json.indicatorYName],
            data: []
        }];
        let that = this;
        json.data.forEach(function (obj: any) {
            if (obj[json.indicatorX] >= that.averageX && obj[json.indicatorY] >= that.averageY) {
                //A区                
                arr[0].data.push(obj);
            } else if (obj[json.indicatorX] < that.averageX && obj[json.indicatorY] >= that.averageY) {
                //B区
                arr[1].data.push(obj);
            } else if (obj[json.indicatorX] <= that.averageX && obj[json.indicatorY] < that.averageY) {
                //C区
                arr[2].data.push(obj);
            } else if (obj[json.indicatorX] > that.averageX && obj[json.indicatorY] < that.averageY) {
                //D区
                arr[3].data.push(obj);
            }
        })
        return arr;
    }

    //数据分类
    public makeDataToSeries(json: any, tableData: any) {
        let arr: any = [], seriesName = this.seriesName;
        for (let i = 0; i < seriesName.length; i++) {
            arr.push([]);
        }

        if (tableData) {
            tableData.forEach(function (obj: any) {
                if (obj.data) {
                    for (let j = 0; j < obj.data.length; j++) {
                        for (let i = 0; i < seriesName.length; i++) {
                            if (obj.data[j].brand == seriesName[i]) {
                                let infoArr = []
                                infoArr[0] = obj.data[j][json.indicatorX];
                                infoArr[1] = obj.data[j][json.indicatorY];
                                infoArr[2] = obj.data[j]['project_name'];
                                infoArr[3] = obj.data[j]['rankX'];
                                infoArr[4] = obj.data[j]['rankY'];
                                arr[i].push(infoArr);
                            }
                        }
                    }
                }
            })
        }
        return arr;
    }

    protected init(): void {

        //渲染xy轴指标数据源
        this.renderContainerXY(this.scatterData.indicators, 'X');
        this.renderContainerXY(this.scatterData.indicators, 'Y');

        // 基于准备好的dom，初始化echarts实例
        // this.myChart = BaseCharts.echarts.init(this.element.querySelector("div[containerScatter]") as HTMLDivElement);

    }

    //渲染xy轴指标数据源
    public renderContainerXY(data: any, code: any) {
        if (code == 'X') {
            let $container = $(this.element).find('div[name="indicatorX"]');
            $container.empty();
            this.renderListByArr($container, data, 'X');
        } else if (code == 'Y') {
            let $container = $(this.element).find('div[name="indicatorY"]');
            $container.empty();
            this.renderListByArr($container, data, 'Y');
        }
    }

    //根据给的数组及code渲染下拉列表面板
    public renderListByArr(container: any, arr: any, str: any) {

        let html = ''
        for (let i = 0; i < arr.length; i++) {
            html += "<div class='itemBox'><span style='display:block'>" + arr[i].name + "</span><ul class='clrfix'>"
            for (let j = 0; j < arr[i].list.length; j++) {
                html += "<li class='fl'><input type='radio' id='" + arr[i].list[j].id + str + "' name='" + str + "' value='" + arr[i].list[j].id + "' /><label for='" + arr[i].list[j].id + str + "'>" + arr[i].list[j].name + "</label></li>"
            }
            html += "</div>"
        }
        container.append(html);
        return container;

    }

    //渲染右边表格区
    public renderTables(data: any, defaulsCount: any) {
        $('#' + this.scopeID).find('div[containerRight]').empty();
        let containerBox = '<div class="contentBox">';
        for (let i = 0; i < data.length; i++) {
            containerBox += '<div class="tableBox clrfix"><table index="' + i + '"><thead><tr>';

            //生成thead
            for (let j = 0; j < data[i].head.length; j++) {
                let sortable = ''
                if (j != 0) {
                    let indicator = j == 1 ? 'indicatorX' : 'indicatorY';
                    if (indicator == 'indicatorX') {
                        sortable = '<span class="sortable sort_down" colName=' + indicator + '><i class="triangleUp"></i><i class="triangleDown"></i></span>';
                    } else {
                        sortable = '<span class="sortable" colName=' + indicator + '><i class="triangleUp"></i><i class="triangleDown"></i></span>';
                    }
                }
                containerBox += '<th><div>' + data[i].head[j] + sortable + '</div></th>';
            }

            //生成tbody
            containerBox += '</tr></thead><tbody>';
            let index = 1
            let rowCount = data[i].data.length > 5 ? defaulsCount : data[i].data.length;
            for (let k = 0; k < rowCount; k++) {
                //生成tr         
                containerBox += '<tr><td title="' + data[i].data[k]['project_name'] + '"><span>' + index + ' </span>' + data[i].data[k]['project_name'] + '</td><td>' + (data[i].data[k][this.scatterData.indicatorX]).toLocaleString() + '</td>' + '<td>' + (data[i].data[k][this.scatterData.indicatorY]).toLocaleString() + '</td></tr>';
                index++;
            }
            //生成悬浮操作按钮
            containerBox += '<tbody></table><div class="operator" ><span class="toggleOpen open"></span><span class="download"></span></div></div>';

        }

        containerBox += '</div>';
        $('#' + this.scopeID).find('div[containerRight]').append(containerBox);

    }

    //重新渲染tbody
    public renderTbody(data: any, table: any) {
        $(table).find('tbody').empty();//清空

        //渲染tbody
        let tbody = '';
        let index = 1;
        for (let k = 0; k < data.length; k++) {
            //生成tr和td
            tbody += '<tr><td title="' + data[k]['project_name'] + '"><span>' + index + ' </span>' + data[k]['project_name'] + '</td><td>' + (data[k][this.scatterData.indicatorX]).toLocaleString() + '</td><td>' + (data[k][this.scatterData.indicatorY]).toLocaleString() + '</td></tr>';

            index++;
        }
        $(table).find('tbody').eq(0).append(tbody);

    }

    //初始化XY轴指标
    public setDefaltIndicators(changeObj: any) {
        let $inputX = $(this.element).find('div[name="indicatorX"]').find('#active_usersX');
        let $inputY = $(this.element).find('div[name="indicatorY"]').find('#sales_amountY');
        $inputX.prop('checked', true);
        $inputY.prop('checked', true);

        this.scatterData['indicatorXName'] = $inputX.siblings('label').text();
        this.settingObjCode[0] = this.scatterData['indicatorX'] = $inputX.val();
        $inputX.parents('.indicator').find('.indicatorBox > span').html(this.scatterData['indicatorXName']);
        this.scatterData['indicatorYName'] = $inputY.siblings('label').text();
        this.settingObjCode[1] = this.scatterData['indicatorY'] = $inputY.val();
        $inputY.parents('.indicator').find('.indicatorBox > span').html(this.scatterData['indicatorYName']);

        //当X、Y轴坐标都返回后触发onChange
        if (this.settingObjCode[0] && this.settingObjCode[1]) {
            // let codeArr = [{},{}];
            // codeArr[0][this.settingObjCode[0]] = this.scatterData['indicatorX'] + '[' +  this.scatterData['indicatorXName'] + ']';
            // codeArr[1][this.settingObjCode[1]] = this.scatterData['indicatorY'] + '[' +  this.scatterData['indicatorYName'] + ']';

            this.body = this.buildbody(changeObj.result);
            this.body['metrics'] = [
                {'field': $inputX.val()},
                {'field': $inputY.val()}
            ]
            if (changeObj.result && changeObj.result.readyBuildQuery) {
                this.postChange(this.body);
            }

        }
        // this.oldValue['indicatorX'] = $inputX.val();
        // this.oldValue['indicatorY'] = $inputY.val();
    }

    private eventBindHtml() {
        let that = this;
        //解绑事件
        $('div[containerxy]', '#' + that.scopeID).find('.indicatorBox').off('click');
        $('div[containerxy]', '#' + that.scopeID).find('.indicatorItems').off('click');
        $('.contentBox', '#' + that.scopeID).find('table').off('mouseenter');
        $('.contentBox', '#' + that.scopeID).find('.tableBox').off('mouseleave');
        $('.contentBox', '#' + that.scopeID).find('.toggleOpen').off('click');
        $('.contentBox', '#' + that.scopeID).find('.sortable').off('click');

        //绑定事件     
        //1.显示隐藏指标面板
        $('div[containerxy]', '#' + that.scopeID).find('.indicatorBox').on('click', function (e) {
            $('.indicatorItems').hide();
            $(this).siblings('.indicatorItems').show();
            e.stopPropagation();
        })

        $(document).click(function (e) {
            $('.indicatorItems').hide();
        })

        //2.选中某个指标
        $('div[containerxy] ', '#' + that.scopeID).find('.indicatorItems').click((e: any) => {
            let $input = $(e.target).siblings('input');
            let indicator = $input.parents('.indicatorItems').attr('name');

            if (e.target.nodeName == 'LABEL' && that.scatterData[indicator] != $input.val()) {

                that.scatterData[indicator] = $input.val();
                that.scatterData[indicator + 'Name'] = $(e.target).text();
                $input.parents('.indicator').find('.indicatorBox > span').html(that.scatterData[indicator + 'Name']);
                $('.indicatorItems').hide();

                //请求数据，重新渲染
                //  let codeArr = [{}];
                let key = indicator == 'indicatorX' ? 0 : 1;
                //  codeArr[0][this.settingObjCode[key]] = this.scatterData[indicator] +'[' + that.scatterData[indicator+'Name'] + ']';               

                //  let sendObj:Object = Object.assign(
                //     super.transformInput(that.settingObjCode[0].split('_')[0],codeArr),
                //     super.transformInput('oldValue',[that.oldValue[indicator]])
                //  );

                that.body['metrics'][key]['field'] = $input.val();

                let sendObj: Object = Object.assign(
                    super.transformInput('scopeID', that.scopeID),
                    super.transformInput('result', that.body)
                );
                super.onChange(that, sendObj);
                //  that.oldValue[indicator] = that.scatterData[indicator];
            }
            e.stopPropagation();
        })

        //3.鼠标进入表格；
        $('.contentBox', '#' + that.scopeID).find('table').on('mouseenter', function (e) {
            $('.operator').hide()
            $(this).siblings('.operator').show();
        });

        //4.鼠标离开
        $('.contentBox', '#' + that.scopeID).find('.tableBox').on('mouseleave', function (e) {
            $(this).find('.operator').hide();
        });

        //5.table展开、收起切换
        $('.contentBox', '#' + that.scopeID).find('.toggleOpen').on('click', function (e) {
            let index: number = 0;
            let tableData: any = null;
            if ($(this).hasClass('open')) {
                $('.tableBox', '#' + that.scopeID).find('.toggleOpen').removeClass('close');
                $('.tableBox', '#' + that.scopeID).hide();
                $(this).parents('.tableBox').show();
                $(this).removeClass('open').addClass('close');
                //重新渲染当前表格全部数据
                index = Number($(this).parents('.tableBox').find('table').attr('index'));
                tableData = that.tableData[index].data;
            } else {
                $(this).removeClass('close').addClass('open');
                $('.tableBox', '#' + that.scopeID).show();
                //重新渲染当前表格默认部分数据
                index = Number($(this).parents('.tableBox').find('table').attr('index'));
                tableData = that.tableData[index].data.slice(0, 5);
            }
            that.renderTbody(tableData, $(this).parents('.tableBox').find('table'))
            // e.stopPropagation();    
        })

        //6.点击数据排序
        $('.contentBox', '#' + that.scopeID).find('.sortable').on('click', function (e) {
            let $table = $(this).parents('table');
            let index: number = 0;
            let tableData: any = null;
            let $this = $(this);
            if ($table.siblings('.operator').find('.toggleOpen').hasClass('open')) {
                index = Number($table.attr('index'));
                tableData = that.tableData[index].data.slice(0, 5);
            } else {
                index = Number($table.attr('index'));
                tableData = that.tableData[index].data.slice(0);
            }
            //排序
            if ($(this).hasClass('sort_down')) {
                //升序
                tableData.sort(function (a: any, b: any) {
                    return a[that.scatterData[$this.attr('colName')]] - b[that.scatterData[$this.attr('colName')]];
                })

                $table.find('.sortable').removeClass('sort_up').removeClass('sort_down');
                $(this).addClass('sort_up');
            } else {
                //降序
                tableData.sort(function (a: any, b: any) {
                    return b[that.scatterData[$this.attr('colName')]] - a[that.scatterData[$this.attr('colName')]];
                })
                $table.find('.sortable').removeClass('sort_up').removeClass('sort_down');
                $(this).addClass('sort_down');
            }

            that.renderTbody(tableData, $table);
        })

    }

}