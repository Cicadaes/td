/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {ChinaMapTemplate} from "./chinamap.template";
import {Utils} from '../../../../public/scripts/utils';
import {ChinaMapModel} from './chinamap.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class ChinaMapComponent extends BaseComponent {

    private myChart: any = null;
    private chartData: any = null;
    private chartStyle: any = null;
    private chinamapData: ChinaMapModel = null;
    private echartData: any = null;
    private styleObj: any = null;
    private body: any = null;

    constructor() {
        super();

        let template = new ChinaMapTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.chinamapData = new ChinaMapModel();
        function randomData() {
            return Math.round(Math.random() * 1000);
        }

        this.echartData = {
            backgroundColor: this.chinamapData.backgroundColor,
            color: this.chinamapData.color,
            nameMap: {
                'China': '中国'
            },
            title: {
                show: this.chinamapData.title_show,
                text: this.chinamapData.title_text,
                subtext: this.chinamapData.title_subtext,
                left: this.chinamapData.title_left
            },
            tooltip: {
                trigger: this.chinamapData.tooltip_trigger
            },
            legend: {
                orient: this.chinamapData.legend_orient,
                left: this.chinamapData.legend_left,
                top: this.chinamapData.legend_top,
                data: this.chinamapData.legend_data
            },
            visualMap: {
                show: this.chinamapData.visualMap_show,
                min: this.chinamapData.visualMap_min,
                max: this.chinamapData.visualMap_max,
                left: this.chinamapData.visualMap_left,
                top: this.chinamapData.visualMap_top,
                text: this.chinamapData.visualMap_text,           // 文本，默认为数值文本
                orient: this.chinamapData.visualMap_orient,
                itemWidth: this.chinamapData.visualMap_itemWidth,
                itemHeight: this.chinamapData.visualMap_itemHeight,
                calculable: this.chinamapData.visualMap_calculable,
                inRange: {
                    color: this.chinamapData.visualMap_controller_inRange_color,
                    // symbolSize: [30, 100]
                }
                // controller: {
                //     inRange: {
                //         color: this.chinamapData.visualMap_controller_inRange_color,
                //         // symbolSize: [30, 100]
                //     }
                // }
            },
            series: [
                {
                    name: this.chinamapData.series_name,
                    type: this.chinamapData.series_type,
                    mapType: this.chinamapData.series_mapType,
                    roam: this.chinamapData.series_roam,
                    label: {
                        normal: {
                            show: this.chinamapData.series_label_normal_show,
                            textStyle: {
                                color: this.chinamapData.series_label_normal_textStyle_color,
                                fontFamily: this.chinamapData.series_label_normal_textStyle_fontFamily,
                            }
                        },
                        emphasis: {
                            show: this.chinamapData.series_label_emphasis_show
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: this.chinamapData.series_itemStyle_normal_areaColor
                        }
                    },
                    showLegendSymbol: this.chinamapData.series_showLegendSymbol,
                    data: this.chinamapData.series_data

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
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "chinamap";
        return this.body;
    }

    public getconfiginformation(event: any, changeObj: any): void {
        this.body = this.buildbody(changeObj.result);

        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    }

    //处理数据
    public handleData(json: any) {
        let obj = {};
        let arr = [];
        $.extend(true, obj, this.echartData.series[0]);
        for (let n = 0; n < json.length; n++) {
            arr.push(json[n].active_users)
            for (let i = 0; i < this.chinamapData.series_data_map.length; i++) {
                if (json[n].project_name) {
                    if (json[n].project_name == this.chinamapData.series_data_map[i].fullName) {
                        this.chinamapData.series_data_map[i].value = json[n].active_users;
                        if (json[n].project_name == this.chinamapData.series_data_map[i].fullName) {
                            this.echartData.series[0]['data'][i]["name"] = this.chinamapData.series_data_map[i].name;
                            this.echartData.series[0]['data'][i]["value"] = this.chinamapData.series_data_map[i].value;
                        }
                    }
                }

                if (json[n].province) {
                    if (json[n].province == this.chinamapData.series_data_map[i].fullName) {
                        this.chinamapData.series_data_map[i].value = json[n].active_users;
                        if (json[n].province == this.chinamapData.series_data_map[i].fullName) {
                            this.echartData.series[0]['data'][i]["name"] = this.chinamapData.series_data_map[i].name;
                            this.echartData.series[0]['data'][i]["value"] = this.chinamapData.series_data_map[i].value;
                        }
                    }
                }

            }
        }
        let max = Math.max.apply(Math, arr);
        this.echartData.visualMap.max = max;
    }

    //渲染右边表格区
    public renderTables(data: any) {
        $('#' + this.scopeID).find('div[containerRight]').empty();
        let html = "", total = 0, totalLength = 10;
        (data.length <= 10) ? totalLength = data.length : totalLength = 10;
        for (let a = 0; a < data.length; a++) {
            total += data[a].active_users
        }

        for (let i = 0; i < totalLength; i++) {
            if (data[i].project_name) {
                html += '<li><b>' + (i + 1) + '、' + data[i].project_name + '</b><div class="chainMapContentListPercentage"><span style="width:' + ((data[i].active_users / total) * 100).toFixed(2) + '%;background:' + this.echartData.color[i] + '"></span></div><b style="text-align:right;float:right;">' + ((data[i].active_users / total) * 100).toFixed(2) + '%</b></li>'
            }

            if (data[i].province) {
                html += '<li><b>' + (i + 1) + '、' + data[i].province + '</b><div class="chainMapContentListPercentage"><span style="width:' + ((data[i].active_users / total) * 100).toFixed(2) + '%;background:' + this.echartData.color[i] + '"></span></div><b style="text-align:right;float:right;">' + ((data[i].active_users / total) * 100).toFixed(2) + '%</b></li>'
            }
        }

        let containerBox = '<div class="chainMapContentBox"><h3>省份分布top10</h3><div class="chainMapContentList"><ul>' + html + '</ul></div></div>';
        $('#' + this.scopeID).find('div[containerRight]').append(containerBox);

    }

    public dataChange(data: any): void {
        if (data.length == 0) {
            return;
        }

        let array = [];
        for (let i = 0; i < data.length; i++) {
            let obj = data[i];
            if (obj.project_name) {
                if (obj.project_name != "HONG KONG" && obj.project_name != "KUALA LUMPUR" && obj.project_name != "UNKNOWN") {
                    array.push(obj);
                }
            }

            if (obj.province) {
                if (obj.province != "HONG KONG" && obj.province != "KUALA LUMPUR" && obj.province != "UNKNOWN") {
                    array.push(obj);
                }
            }

        }
        data = array;

        this.handleData(data);  // 处理数据  -- 组装chart的结构
        if (this.myChart == null) {
            this.init();
        } else {
            data['chainMap'] = "chainMap";
            //重新渲染表格
            this.renderTables(data);
            //重新渲染柱状图
            console.log(JSON.stringify(this.echartData))
            this.myChart.clear();
            this.myChart.setOption(this.echartData);
        }
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
        if (this.myChart == null) {
            this.init();
            this.styleObj = style;
            let changeStyle = Utils.addStyle(style);
            Utils.mergeSourceData(changeStyle, this.echartData);
            let newStyle = Utils.compareObj(changeStyle, this.echartData);
            this.myChart.setOption(newStyle, true);
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

    protected init(): void {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[containerChainMap]") as HTMLDivElement);
        // 绘制图表
        this.myChart.setOption(this.echartData)

    }
}
