/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {PieBarTemplate} from "./PieBar.template";
import {Utils} from '../../../../public/scripts/utils';
import {PieBarModel} from './PieBar.model';
import {BarPieModel} from './BarPie.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {PATHJSON} from '../../../../public/path/path';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class PieBarComponent extends BaseComponent {
    private myChart: any = null;//饼图
    private myBarChart: any = null;//条图
    private chartData: any = null;
    private PieBarData: PieBarModel = null;
    private BarPieData: BarPieModel = null;
    private echartData: any = null;//饼图
    private echartBarPieData: any = null;//条图
    private styleObj: any = null;
    private changeObj: any = null;
    private barPieListData: Array<any> = [];
    private pieBaryearMonth: any = "";//日期
    private pieBarbrand: any = "";//品牌
    private pieBarchannel: any = "";//渠道
    private pieBarfilter: Array<any> = [];//过滤条件
    private crowdName: any = "";//人群名称
    private pieBarFilterV: any = "filterV";
    private pieBarTotal: number = null;
    private pieBarMap: Object = {
        "低价值": 0,
        "中价值发展客户": 1,
        "中价值保持客户": 2,
        "中价值挽留客户": 3,
        "中高价值发展客户": 4,
        "中高价值保持客户": 5,
        "中高价值挽留客户": 6,
        "高价值客户": 7
    };

    private body: any = {
        "datasource_id": 53,
        "dimensions": [
            {"field": "class_label"},
            {"field": "member_count"}
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
        "orderBy": [{"field": "class_label", "function": "ASC"}]
    };

    constructor() {
        super();
        let template = new PieBarTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.PieBarData = new PieBarModel();
        this.BarPieData = new BarPieModel();

        //饼图
        this.echartData = {
            backgroundColor: this.PieBarData.backgroundColor, //背景颜色
            color: this.PieBarData.color,

            title: {
                show: this.PieBarData.title_show,
                text: this.PieBarData.title_text,
                subtext: this.PieBarData.title_subtext,
                left: this.PieBarData.title_left,
                top: this.PieBarData.title_top,
                textStyle: {
                    color: this.PieBarData.title_textStyle_color
                }
            },

            legend: {  //设置图例
                show: this.PieBarData.legend_show,
                z: this.PieBarData.legend_z,
                left: this.PieBarData.legend_left,
                top: this.PieBarData.legend_top,
                orient: this.PieBarData.legend_orient,
                data: this.PieBarData.legend_data,
                padding: this.PieBarData.legend_padding,
                itemHeight: this.PieBarData.legend_itemHeight,
                type: 'scroll',
                textStyle: {
                    color: this.PieBarData.legend_textStyle_color,
                    fontFamily: this.PieBarData.legend_textStyle_fontFamily,
                    fontSize: this.PieBarData.legend_textStyle_fontSize,
                }
            },

            tooltip: {  // tooltip
                show: this.PieBarData.tooltip_show,
                trigger: this.PieBarData.tooltip_trigger,
                formatter: this.PieBarData.tooltip_formatter,
                textStyle: {
                    color: this.PieBarData.tooltip_textStyle_color,
                    fontFamily: this.PieBarData.tooltip_textStyle_fontFamily,
                    fontSize: this.PieBarData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.PieBarData.tooltip_backgroundColor
            },

            series: [{
                name: this.PieBarData.series_name,
                type: this.PieBarData.series_type,
                radius: this.PieBarData.series_radius,
                center: this.PieBarData.series_center,
                label: {
                    normal: {
                        show: this.PieBarData.series_label_normal_show,
                        position: this.PieBarData.series_label_normal_position,
                        formatter: this.PieBarData.series_label_normal_formatter,
                        textStyle: {
                            fontFamily: this.PieBarData.series_label_normal_textStyle_fontFamily
                        }
                    }
                },

                animationType: this.PieBarData.series_animationType
            }]
        };

        //条图
        this.echartBarPieData = {
            backgroundColor: this.BarPieData.backgroundColor, //背景颜色
            color: this.BarPieData.echart_color,

            tooltip: {},

            grid: {
                show: this.BarPieData.grid_show,
                left: this.BarPieData.grid_left,
                right: this.BarPieData.grid_right,
                bottom: this.BarPieData.grid_bottom,
                top: this.BarPieData.grid_top,
                containLabel: this.BarPieData.grid_containLabel,
                borderColor: this.BarPieData.grid_borderColor,
                borderWidth: this.BarPieData.grid_borderWidth
            },

            //线图
            xAxis: {
                show: this.BarPieData.xAxis_show,
                type: this.BarPieData.xAxis_type,
                boundaryGap: this.BarPieData.xAxis_boundaryGap,
                data: this.BarPieData.xAxis_data,
                name: this.BarPieData.xAxis_name,
                nameLocation: this.BarPieData.xAxis_nameLocation,
                nameGap: this.BarPieData.xAxis_nameGap,
                axisLine: {
                    show: this.BarPieData.xAxis_axisLine_show,
                    lineStyle: {
                        color: this.BarPieData.xAxis_axisLine_lineStyle_color,
                        width: this.BarPieData.xAxis_axisLine_lineStyle_width,
                        type: this.BarPieData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: this.BarPieData.xAxis_axisTick_show,
                    alignWithLabel: this.BarPieData.xAxis_axisTick_alignWithLabel,
                    length: this.BarPieData.xAxis_axisTick_length,
                    lineStyle: {
                        // color: this.BarPieData.xAxis_axisTick_lineStyle_color,
                        width: this.BarPieData.xAxis_axisTick_lineStyle_width,
                        type: this.BarPieData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: this.BarPieData.xAxis_axisLabel_show,
                    margin: this.BarPieData.xAxis_axisLabel_margin,
                    textStyle: {
                        color: this.BarPieData.xAxis_axisLabel_textStyle_color,
                        fontFamily: this.BarPieData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: this.BarPieData.xAxis_axisLabel_textStyle_fontSize,
                    }
                },
                //区域中的分割线
                splitLine: {
                    show: this.BarPieData.xAxis_splitLine_show,
                    lineStyle: {
                        color: this.BarPieData.xAxis_splitLine_lineStyle_color,
                        width: this.BarPieData.xAxis_splitLine_lineStyle_width,
                        type: this.BarPieData.xAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    type: this.BarPieData.xAxis_axisPointer_type,
                    label: {
                        show: this.BarPieData.xAxis_axisPointer_label_show,
                    }
                }
            },

            yAxis: {
                show: this.BarPieData.yAxis_show,
                type: this.BarPieData.yAxis_type,
                boundaryGap: this.BarPieData.yAxis_boundaryGap,
                data: this.BarPieData.yAxis_data,
                name: this.BarPieData.yAxis_name,
                nameLocation: this.BarPieData.yAxis_nameLocation,
                nameRotate: this.BarPieData.yAxis_nameRotate,
                nameGap: this.BarPieData.yAxis_nameGap,
                axisLine: {
                    show: this.BarPieData.yAxis_axisLine_show,
                    lineStyle: {
                        color: this.BarPieData.yAxis_axisLine_lineStyle_color,
                        width: this.BarPieData.yAxis_axisLine_lineStyle_width,
                        type: this.BarPieData.yAxis_axisLine_lineStyle_type,
                    },
                },
                //y轴刻度
                axisTick: {
                    show: this.BarPieData.yAxis_axisTick_show,
                    alignWithLabel: this.BarPieData.yAxis_axisTick_alignWithLabel,
                    length: this.BarPieData.yAxis_axisTick_length,
                    lineStyle: {
                        color: this.BarPieData.yAxis_axisTick_lineStyle_color,
                        width: this.BarPieData.yAxis_axisTick_lineStyle_width,
                        type: this.BarPieData.yAxis_axisTick_lineStyle_type,
                    }
                },
                //y轴label
                axisLabel: {
                    show: this.BarPieData.yAxis_axisLabel_show,
                    margin: this.BarPieData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: this.BarPieData.yAxis_axisLabel_textStyle_color,
                        fontFamily: this.BarPieData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: this.BarPieData.yAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: this.BarPieData.yAxis_splitLine_show,
                    lineStyle: {
                        color: this.BarPieData.yAxis_splitLine_lineStyle_color,
                        width: this.BarPieData.yAxis_splitLine_lineStyle_width,
                        type: this.BarPieData.yAxis_splitLine_lineStyle_type
                    },
                },
                axisPointer: {
                    show: this.BarPieData.yAxis_axisPointer_show,
                    label: {
                        show: this.BarPieData.yAxis_axisPointer_label_show
                    }
                }
            },

            series: [{
                name: this.BarPieData.series_name,
                type: this.BarPieData.series_type,
                stack: 'chart',
                label: {
                    normal: {
                        position: 'right',
                        show: true,
                        formatter: '{c}%',
                        color: '#000'
                    }
                },
                barCategoryGap: '50%',
                data: this.BarPieData.series_data
            }, {
                type: this.BarPieData.series_type,
                stack: 'chart',
                itemStyle: {
                    normal: {
                        color: '#F4F7FB'
                    }
                },
                data: []
            }]
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
        if (this.myBarChart) this.myBarChart.resize();
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
        if (this.myChart == null || this.myBarChart == null) {
            this.init();
        }
        if (data.total > 0) {
            $("#" + this.scopeID).find(".pieBar_all h3").html(Utils.changeNumber(data.total));
        } else {
            $("#" + this.scopeID).find(".pieBar_all h3").html("0");
        }
        for (let key in data) {
            switch (key) {
                case "pie":
                    this.echartData.series[0]['data'] = data.pie;
                    this.myChart.setOption(this.echartData, true);
                    this.renderPieHtml(data.pie, data.total)
                    break;
                case "bar":
                    let barPieData: any = [],
                        valArr: any = [],
                        allBarPieData: any = [];
                    for (let item of data.bar) {
                        barPieData.push(item.name);
                    }
                    for (let item of data.bar) {
                        valArr.push((item.value / data.total * 100).toFixed(2));
                        allBarPieData.push(data.total - item.value);

                    }
                    this.barPieListData = data.bar;
                    this.echartBarPieData.yAxis.data = barPieData;
                    this.echartBarPieData.series[0]['data'] = valArr;
                    // this.echartBarPieData.series[1]['data'] = allBarPieData;
                    this.echartBarPieData.xAxis.axisLabel.formatter = "{value} %";
                    this.myBarChart.setOption(this.echartBarPieData, true);
                    break;
            }
        }
    }

    private renderPieHtml(data: any, total: any) {
        let optionList: string = "";

        if (total > 0) {
            optionList += '<ul>';
            for (let item of data) {
                optionList += '<li ><span>' + ((item.value / total) * 100).toFixed(2) + "%" + '</span><b></b>' + item.name + '</li>';
            }
            optionList += '</ul>';
        } else {
            optionList += '<ul>';
            for (let item of data) {
                optionList += '<li ><span>' + item.value + '</span><b></b>' + item.name + '</li>';
            }
            optionList += '</ul>';
        }

        $('#' + this.scopeID).find(".pieBar_pie_list").html(optionList);
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
        this.myChart = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonPieCharts]") as HTMLDivElement);
        // 绘制图表
        this.myChart.setOption(this.echartData);

        // 基于准备好的dom，初始化echarts实例
        this.myBarChart = BaseCharts.echarts.init(document.getElementById(this.scopeID).querySelector("div[commonBarCharts]") as HTMLDivElement);
        // 绘制图表
        this.myBarChart.setOption(this.echartBarPieData);

        //绑定事件
        this.eventBindHtml();

    }

    //渲染弹框
    private renderModal(json: any) {

        let html = '<div class="tableModal pieBarModal">' +
            '<div class="tableModalContent pieBarModalContent">' +
            '<div class="tableModalHeader clrfix">' +
            '<span class="fl">另存人群</span>' +
            '<span class="closeModal fr pieBarCancel">×</span>' +
            '</div>' +
            '<div class="tableModalBody clrfix">' +
            '<div name="crowdName" class="clrfix">' +
            '<div class="pieBar-30 fl">人群命名</div>' +
            '<div class="pieBar-70 fl">' +
            '<input type="text" placeholder="请输入人群名称" class="pieBarInput" pieBarSearch>' +
            '<div class="pieBarErrorTips" pieBarErrorTips></div> ' +
            '</div>' +
            '</div>' +
            '<div class="clrfix" name="date">' +
            '<div class="pieBar-30 fl">日期</div>' +
            '<div class="pieBar-70 fl" pieBarDate></div>' +
            '</div>' +
            '<div name="brand" class="clrfix">' +
            '<div class="pieBar-30 fl">品牌</div>' +
            '<div class="pieBar-70 fl" pieBarBrand></div>' +
            '</div>' +
            '<div class="clrfix" name="qudao">' +
            '<div class="pieBar-30 fl">渠道</div>' +
            '<div class="pieBar-70 fl" pieBarChannel></div>' +
            '</div>' +
            '<div name="" class="clrfix">' +
            '<div class="pieBar-30 fl">筛选</div>' +
            '<div class="pieBar-70 fl" pieBarCheckRadio>  ' +
            '<div class="pieBar-list-data clrfix" pieBarListData>' +
            '<ul></ul>' +
            '</div>' +
            '<div class="pieBarErrorTips" pieBarListErrorTips></div> ' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="tableModalFooter clrfix">' +
            '<button type="button" class="confirm fr pieBarConfirm">确认</button>' +
            '<button type="button" class="cancel fr pieBarCancel">取消</button>' +
            '</div>' +
            '</div> ' +
            '</div>'

        return html;
    }

    private renderListHtml() {
        if (this.barPieListData.length > 0) {
            let optionList: any = "";
            for (let item of this.barPieListData) {
                optionList += '<li data-value="' + item.value + '">' + item.name + '</li>'
            }
            $(document.body).find("div[pieBarListData] ul").html(optionList);

            let $componentBody = $(document.body).find('.stage');
            let _that = this;
            //选择筛选条件
            $componentBody.find('div[pieBarListData]').on('click', (event: any) => {
                let $target = $(event.target);

                if (!$target.hasClass("pieBarChoose")) {
                    $target.addClass("pieBarChoose");
                    _that.pieBarfilter.push($target.text());
                    _that.pieBarTotal += parseInt($target.attr('data-value'));
                } else {
                    $target.removeClass("pieBarChoose");
                    //从数组里删除
                    _that.removePieBarFilterArray($target.text());
                    _that.pieBarTotal -= parseInt($target.attr('data-value'));
                }
                if (_that.pieBarfilter.length > 0) {
                    $componentBody.find("div[pieBarListErrorTips]").text("");
                }
                event.stopPropagation();
            });
        } else {
            let optionP: any = "<p style='line-height: 30px'>暂无数据</p>";
            $(document.body).find("div[pieBarListData] ul").html(optionP);
        }
    }

    //取过滤器的值放入html里
    private getFilterData($componentBody: any) {
        let chart: Object = this.mergeFilterObj['chart'];
        for (let key in chart) {
            switch (key) {
                case "date":
                    $componentBody.find('div[pieBarDate]').html(chart[key]);
                    break;
                case "yearMonth":
                    //日期
                    this.pieBaryearMonth = chart[key];
                    break;
                case "brand":
                    if (chart[key] == "all") {
                        //品牌
                        this.pieBarbrand = "全部品牌"
                    } else {
                        this.pieBarbrand = chart[key]
                    }
                    $componentBody.find('div[pieBarBrand]').html(this.pieBarbrand);

                    break;
                case "channel":
                    if (chart[key] == "all") {
                        //渠道
                        this.pieBarchannel = "全部渠道"
                    } else {
                        this.pieBarchannel = chart[key]
                    }
                    $componentBody.find('div[pieBarChannel]').html(this.pieBarchannel);

                    break;
            }
        }
    };

    //绑定事件
    private eventBindHtml() {
        let _self = this;
        $(document).ready(function () {

            let $componentBody = $(document.body).find('.stage');
            //另存人群
            $('#' + _self.scopeID).find('.pieBar_saveCrowdBtn').click((event: any) => {
                $('.modal-backdrop-report-form').remove();
                //渲染弹框
                let modal = _self.renderModal('');
                $componentBody.append(modal);

                _self.crowdName = null;
                $('.pieBarModal').show();
                //根据DATA返回的数据渲染list
                _self.renderListHtml();
                //取过滤器的值放入html里
                _self.getFilterData($componentBody);
                $(document.body).find('.stage').append("<div class='modal-backdrop modal-backdrop-report-form'></div>");
                event.stopPropagation();
            })

            //输入人群命名
            $componentBody.on('keyup', 'input[pieBarSearch]', (event: any) => {
                let keyUpText = $(event.target).val().trim();
                if (keyUpText.length <= 0) {
                    $componentBody.find("input[pieBarSearch]").addClass("pieBarErrorBorder");
                    $componentBody.find("div[pieBarErrorTips]").text("人群名称不能为空")
                } else {
                    $componentBody.find("input[pieBarSearch]").removeClass("pieBarErrorBorder");
                    $componentBody.find("div[pieBarErrorTips]").text("")
                }
                _self.crowdName = keyUpText;
                event.stopPropagation();
            })

            //确认
            $componentBody.on('click', '.pieBarConfirm', (event: any) => {
                if (!_self.crowdName) {
                    $componentBody.find("input[pieBarSearch]").addClass("pieBarErrorBorder");
                    $componentBody.find("div[pieBarErrorTips]").text("人群名称不能为空")
                } else if (_self.barPieListData.length <= 0) {
                    $componentBody.find("div[pieBarListErrorTips]").text("筛选值暂无数据，无法另存为人群");
                } else if (_self.pieBarfilter.length <= 0) {
                    $componentBody.find("div[pieBarListErrorTips]").text("请至少选择一个筛选值，否则无法另存为人群");
                } else if (_self.pieBarTotal <= 0) {
                    $componentBody.find("div[pieBarListErrorTips]").text("客户数量为0，无法另存为人群");
                } else {
                    let saveBrandValue: string = "",
                        saveChannelValue: string = "";
                    if (_self.pieBarbrand == "全部品牌") {
                        saveBrandValue = "ALL"
                    } else {
                        saveBrandValue = _self.pieBarbrand;
                    }
                    if (_self.pieBarchannel == "全部渠道") {
                        saveChannelValue = "ALL"
                    } else {
                        saveChannelValue = _self.pieBarchannel;
                    }
                    //发送请求
                    let buildQueryObj: any = Object.assign(
                        _self.transformInput('crowdName', _self.crowdName),//人群名称
                        _self.transformInput('yearMonth', _self.pieBaryearMonth),//日期
                        _self.transformInput('brand', saveBrandValue),//品牌
                        _self.transformInput('channel', saveChannelValue),//渠道
                        _self.transformInput('filterV', _self.decidepieBarMap().toString())//过滤条件
                    );

                    $.ajax({
                        //开发地址
                        url: PATHJSON.urlHostRFM + '/dmp-web/crowd/crowds/saveRFCrowd',
                        dataType: 'JSON',
                        contentType: 'application/json',
                        type: 'POST',
                        data: JSON.stringify(buildQueryObj),
                        success: function (data: any) {
                            $('.modal-backdrop-report-form').remove();
                            $('.pieBarModal').remove();
                        },
                        error: function (data: any) {
                            let msg = data.responseJSON.msg;
                            $componentBody.find("input[pieBarSearch]").addClass("pieBarErrorBorder");
                            $componentBody.find("div[pieBarErrorTips]").text(msg)
                        }
                    })
                }

                event.stopPropagation();
            })

            //取消
            $componentBody.on('click', '.pieBarCancel', (event: any) => {
                $('.modal-backdrop-report-form').remove();
                $('.pieBarModal').remove();
                event.stopPropagation();
            })
        })

    }

    private decidepieBarMap() {
        let pieBarKeyMap: Array<any> = [];
        if (this.pieBarfilter.length > 0) {
            for (let key in this.pieBarMap) {
                for (let i = 0; i < this.pieBarfilter.length; i++) {
                    if (key == this.pieBarfilter[i]) {
                        pieBarKeyMap.push(this.pieBarMap[key]);
                    }
                }
            }
        }
        return pieBarKeyMap;
    }

    private removePieBarFilterArray($target: any) {
        if (this.pieBarfilter.length > 0) {
            for (let i = (this.pieBarfilter.length) - 1; i >= 0; i--) {
                if (this.pieBarfilter[i] == $target) {
                    this.pieBarfilter.splice(i, 1)
                }
            }
        }
    }

    private postChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }
}