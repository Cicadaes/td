import { Component, OnInit, ViewChild, ElementRef, Injector, OnChanges } from '@angular/core';
import { AddFunnelComponent } from './add-funnel/add-funnel.component';
import { FunnelAnalysisService } from './funnel-analysis.service';
import { BaseComponent } from '../../../common/base-component';
import * as _ from 'lodash';
import { Globals } from 'src/app/utils/globals';

@Component({
    selector: 'app-funnel-analysis',
    templateUrl: './funnel-analysis.component.html',
    styleUrls: ['./funnel-analysis.component.less'],
    providers: [FunnelAnalysisService]
})
export class FunnelAnalysisComponent extends BaseComponent implements OnInit, OnChanges {

    tabList: any = [
        {
            url: '/effect-report/target-achievement',
            name: '目标达成'
        }, {
            url: '/effect-report/funnel-analysis',
            name: '漏斗分析'
        }
    ];
    showTrendCharts: boolean = true;          // 是否是无数据

    colors: any = ['#2D8CF0', '#2DE2C5'];
    campaignId: number;                       // 活动id

    selectedFunnelId: any;                    // 选中的funnelid
    funnelList: any = [];                     // 漏斗列表

    searchCrowdName: string;                  // 人群细分关键字搜索
    allCrowdList: any = [];                   // 人群细分列表（不被过滤）
    generateCrowdList: any = [];              // 人群细分列表
    selectedGenerateCrowd: any = [];          // 选中的细分人群
    selectedCrowdIds: any = [];               // 选中的人群id
    showSelectCrowd: string = 'none';         // 展示细分人群框

    isVisible: boolean = false;               // 新建漏斗弹窗显示
    modalTitle: string;                       // 新建漏斗弹窗title

    defaultFunnel: any = {};                  // 默认漏斗
    cuFunnelId: number;                       // 保存或者修改后的漏斗ID
    fromFlag = false;                         // 判断是不是从修改或者添加页面进入的 (漏斗)

    tempFunnelData: any = {};                 // 存放当前漏斗数据
    legends: any = [];                        // 图例
    steps: any = [];                          // 用于折线图查看第几步到第几步的趋势
    step1: any = [];
    step2: any = [];
    selectedStep1: string = '1';              // 选中的步骤
    selectedStep2: string = '1';              // 选中的步骤

    stepGranularity: string = 'day';          // 步骤转化趋势图的日周月
    lastGranularity: string = 'day';          // 步骤转化趋势图的日周月

    funnelChart: any;                         // 漏斗图表
    transOverview: any = [];                  // 转化概览
    xFunnelData: any = [];
    yFunnelData: any = [];
    funnelSeries: any = [];

    // 步骤转化趋势图 属性
    stepChart: any;
    xData: any = [];
    line1Data: any = [];
    line2Data: any = [];
    lineSeries: any = [];

    // 终点事件转换图 属性
    lastChart: any;
    barXData: any = [];
    barData: any = [];

    @ViewChild(AddFunnelComponent) addFunnelComponent: AddFunnelComponent;

    constructor(private funnelAnalysisService: FunnelAnalysisService,
        private injector: Injector) {
        super(injector);

        const campaignId = this.route.snapshot.params['campaignId'];
        if (campaignId) {
            this.campaignId = parseInt(campaignId);
        }
    }

    ngOnInit() {
        this.getFunnelList();
    }

    /**
     * 获取漏斗列表
     */
    getFunnelList() {
        const that = this;
        // 获取漏斗列表
        that.funnelAnalysisService.getFunnelList(this.campaignId).subscribe((data: any) => {
            if (data.code !== 200) {
                this.notification.create('warning', '错误提示', data.message);
                return;
            }
            data = data.data['data'];
            that.funnelList = data;
            if (data && data.length > 0) {
                that.showTrendCharts = true;
                for (let i = 0; i < data.length; i++) {
                    if (that.fromFlag) {
                        if (that.cuFunnelId == data[i].id) {
                            that.selectedFunnelId = data[i].id;
                            that.defaultFunnel = data[i];
                        }
                    }
                    if (data[i].defaultFlag) {
                        that.selectedFunnelId = data[i].id;
                        that.defaultFunnel = data[i];
                    }
                }

                if (null == that.selectedFunnelId) {    // 如果没有默认的，就默认选择第一条数据
                    that.selectedFunnelId = data[0].id;
                    that.defaultFunnel = data[0];
                }
                that.getFunnelView();
            } else {
                that.showTrendCharts = false;
            }
        });

    }

    /**
     * 改变显示漏斗
     * @param data
     */
    changeFunnel(data: any) {
        this.getFunnelView();
    }

    /**
     * 添加漏斗
     */
    addFunnel() {
        this.funnelAnalysisService.funnelId = null;
        this.modalTitle = '新建漏斗';
        this.isVisible = true;
    }

    /**
     * 设置默认漏斗
     * @param funnel
     * @param e
     */
    setDefaultFunnel(funnel: any, e: any) {
        // e.stopPropagation();
        if (funnel['defaultFlag']) {
            return;
        }
        funnel['defaultFlag'] = 1;
        this.funnelAnalysisService.setDefaultFunnel(funnel.id).subscribe(resp => {
            if (resp.code !== 200) {
                this.notification.create('warning', '错误提示', resp.message);
                return;
            }
            this.funnelList.forEach(element => {
                if (element.id !== funnel.id) {
                    element['defaultFlag'] = 0;
                }
            });
        });
    }

    /**
     * 修改漏斗
     * @param funnel
     * @param e
     */
    editFunnel(funnel: any, e: any) {
        // e.stopPropagation();
        this.funnelAnalysisService.funnelId = funnel.id;
        this.modalTitle = '修改漏斗';
        this.isVisible = true;
    }

    /**
     * 删除漏斗
     * @param funnel
     * @param e
     */
    deleteFunnel(funnel: any, e: any) {
        // e.stopPropagation();
        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: `确定要删除漏斗"${funnel.funnelName}"？`,
            nzOnOk: () => {
                this.funnelAnalysisService.deleteFunnel(funnel.id).subscribe(resp => {
                    if (resp.code !== 200) {
                        this.notification.create('warning', '错误提示', resp.message);
                    } else {
                        this.notification.create('success', '提示', '操作成功');
                        this.selectedFunnelId = null;
                        this.getFunnelList();
                    }
                });
            }
        });
    }

    /**
     * 保存漏斗
     */
    saveFunnelStep() {
        // 步骤重复
        if (this.addFunnelComponent.checkParam()) {
            return;
        }

        const param = {
            'campaignId': this.campaignId,
            'funnelName': this.addFunnelComponent.funnelName,
            'funnelStepList': this.addFunnelComponent.funnelStepList
        };
        if (this.funnelAnalysisService.funnelId) {
            param['id'] = this.funnelAnalysisService.funnelId;
            param['defaultFlag'] = this.addFunnelComponent.funnelDetail['defaultFlag'];
            this.funnelAnalysisService.updateFunnel(param).subscribe((resp: any) => {
                if (resp.code === 200) {
                    this.defaultFunnel = resp['data'];
                    this.cuFunnelId = this.defaultFunnel['id'];
                    this.isVisible = false;
                    this.globals.resetBodyStyle();
                    this.fromFlag = true;
                    this.notification.create('success', '提示', '修改成功');
                    this.getFunnelList();
                } else {
                    this.notification.create('warning', '错误提示', resp.message);
                }
            });
        } else {
            this.funnelAnalysisService.saveFunnel(param).subscribe(resp => {
                if (resp.code === 200) {
                    this.defaultFunnel = resp['data'];
                    this.cuFunnelId = this.defaultFunnel['id'];
                    this.isVisible = false;
                    this.fromFlag = true;
                    this.notification.create('success', '提示', '新建成功');
                    this.getFunnelList();
                } else {
                    this.notification.create('warning', '错误提示', resp.message);
                }
            });
        }
    }

    /**
     * 关闭漏斗弹框
     */
    handleCancel() {
        this.isVisible = false;
        this.globals.resetBodyStyle();
    }

    /**
     * 展示人群弹框
     */
    showCrowdDialog() {
        this.showSelectCrowd = 'block';
        this.funnelAnalysisService.getGenerateCrowd(this.campaignId).subscribe(resp => {
            if (resp.code !== 200) {
                this.notification.create('warning', '错误提示', resp.message);
            }
            resp['data'].forEach(element => {
                if (this.selectedCrowdIds.indexOf(element['id']) > -1) {
                    element['checked'] = true;
                }
            });
            this.allCrowdList = resp['data'];
            this.generateCrowdList = resp['data'];
        });
    }

    /**
     * 过滤生成人群
     */
    fliterGenerateCrowd() {
        const that = this;
        const filtered: any[] = [];
        for (let i = 0; i < that.allCrowdList.length; i++) {
            const crowd = that.allCrowdList[i];
            if (crowd.refName.indexOf(that.searchCrowdName) != -1) {
                filtered.push(crowd);
            }
        }
        this.generateCrowdList = filtered;
    }

    /**
     * 选中细分人群
     * @param data 人群信息
     */
    checkGenerateCrowd(data: any) {
        if (!data['checked']) {
            if (this.selectedGenerateCrowd && this.selectedGenerateCrowd.length == 2) {
                return;
            }
            data['checked'] = true;
            this.selectedGenerateCrowd.push(data);
        } else {
            data['checked'] = false;
            for (let i = 0; i < this.selectedGenerateCrowd.length; i++) {
                const element = this.selectedGenerateCrowd[i];
                if (data['id'] === element['id']) {
                    this.selectedGenerateCrowd.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * 取消选择人群细分
     */
    closeCrowdDialog() {
        if (this.selectedCrowdIds.length != this.selectedGenerateCrowd.length) {
            this.selectedGenerateCrowd = [];
            this.generateCrowdList.forEach(element => {
                if (this.selectedCrowdIds.indexOf(element['id']) > -1) {
                    this.selectedGenerateCrowd.push(element);
                }
            });
        }
        this.searchCrowdName = '';
        this.showSelectCrowd = 'none';
    }

    // 设置图表的图例颜色；
    setLegendColor(colors: any, status: boolean) {
        const that = this;
        if (status) {
            that.funnelChartOption['color'] = colors;
            that.stepChartOption['color'] = colors;
            that.lastChartOption['color'] = colors;
        } else {
            that.funnelChartOption['color'] = ['#2D8CF0'];
            that.stepChartOption['color'] = ['#2D8CF0'];
            that.lastChartOption['color'] = ['#2D8CF0'];
        }
    }

    /**
     * 保存选择人群细分
     */
    saveGenerateCrowd() {

        const legendcolors: any[] = [], crowdIds = [];

        const crowdList = this.selectedGenerateCrowd;
        for (let i = 0; i < crowdList.length; i++) {
            crowdList[i]['color'] = this.colors[i];
            legendcolors.push(this.colors[i]);
            crowdIds.push(crowdList[i]['id']);
        }
        // 设置图表的图例颜色；
        if (crowdList.length > 0) {
            this.setLegendColor(legendcolors, true);
        } else {
            this.setLegendColor(legendcolors, false);
        }
        this.selectedCrowdIds = crowdIds;
        this.getFunnelView();
        this.searchCrowdName = '';
        this.showSelectCrowd = 'none';
    }

    /**
     * 细分人群选择重置
     */
    cancelChoice() {
        this.selectedGenerateCrowd = [];
        this.generateCrowdList.forEach(element => {
            element['checked'] = false;
        });
    }

    // 获取转换概览
    getFunnelView() {
        const that = this;
        const param = {
            campaignId: this.campaignId,
            funnelId: that.selectedFunnelId,
            crowdIds: that.selectedCrowdIds
        };
        that.funnelAnalysisService.getFunnelConvertOverview(param).subscribe(resp => {
            if (resp.code !== 200) {
                this.notification.create('warning', '错误提示', resp.message);
                return;
            }
            that.funnelSeries = [];
            that.tempFunnelData = resp['data'];
            that.formatFunnelViewData(resp['data']);
            that.funnelChartOption.series = that.funnelSeries;
            that.funnelChartOption.legend.data = that.legends;
            that.funnelChart = _.cloneDeep(that.funnelChartOption);

            that.trendLineCharts();
            that.lastEventTrendCharts();
        });
    }

    // 趋势分析折线图
    trendLineCharts() {
        const that = this;
        // line图
        const param = {
            'campaignId': this.campaignId,
            'crowdIds': that.selectedCrowdIds,
            'granularity': that.stepGranularity
        };
        const eventIds = [];
        // 获取eventId列表
        eventIds.push(that.tempFunnelData[0].funnelConvertOverviewEventStepItem[+that.selectedStep1 - 1].eventId);
        eventIds.push(that.tempFunnelData[0].funnelConvertOverviewEventStepItem[+that.selectedStep2 - 1].eventId);
        param['eventIds'] = eventIds;
        that.funnelAnalysisService.getTrendChart(param).subscribe(data => {
            if (data.code !== 200) {
                this.notification.create('warning', '错误提示', data.message);
                return;
            }
            data = data['data'];
            // 图表数据置为空
            that.xData = [];
            const legends = [];
            that.lineSeries = [];
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    that.line1Data = [];
                    legends.push({
                        name: data[i]['crowdName'] || '' + '转化率',
                        icon: 'circle'
                    });
                    const chartsData = data[i]['items'];
                    const tempData: any = {};
                    for (let j = 0; j < chartsData.length; j++) {
                        Object.assign(tempData, chartsData[j]);
                    }
                    for (let key in tempData) {
                        that.line1Data.push(tempData[key]);
                        if (that.xData.length < chartsData.length) {
                            if (that.stepGranularity === 'day') {
                                // that.xData.push(moment(key).format("YYYY-MM-DD"));
                                // that.xData.push(key);
                                const time = `${key.substr(0, 4)}-${key.substr(4, 2)}-${key.substr(6, 2)}`;
                                that.xData.push(time);
                            } else {
                                if (that.stepGranularity === 'month') {
                                    key = (+key + 1) + '';
                                }
                                that.xData.push(key);
                            }
                        }
                    }
                    that.buildTrendCharts(data[i]['crowdName'], that.line1Data);
                }
            }
            that.stepChartOption.xAxis[0].data = that.xData;
            that.stepChartOption.legend.data = legends; // 图表的指示
            that.stepChartOption.series = that.lineSeries;
            that.stepChart = _.cloneDeep(that.stepChartOption);
        });
    }

    // 终点事件累计完成趋势图
    lastEventTrendCharts() {
        const that = this;
        const param = {
            campaignId: this.campaignId,
            crowdIds: that.selectedCrowdIds,
            granularity: that.lastGranularity
        };
        that.funnelAnalysisService.getLastEventChart(that.tempFunnelData[0].funnelConvertOverviewEventStepItem[that.tempFunnelData[0].funnelConvertOverviewEventStepItem.length - 1].eventId, param)
            .subscribe(data => {
                if (data.code !== 200) {
                    this.notification.create('warning', '错误提示', data.message);
                    return;
                }
                data = data['data'];
                // 图表数据置为空
                that.barData = [];
                that.barXData = [];
                const legends = [];
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        legends.push({
                            name: data[i]['crowdName'] || '用户数',
                            icon: 'circle'
                        });
                        const chartsData = data[i]['items'];
                        const tempData = [];
                        const obejectData: any = {};
                        for (let j = 0; j < chartsData.length; j++) {
                            Object.assign(obejectData, chartsData[j]);
                        }
                        for (let key in obejectData) {
                            tempData.push(obejectData[key]);
                            if (that.barXData.length < chartsData.length) {
                                if (that.lastGranularity === 'day') {
                                    // that.barXData.push(moment(key).format("YYYY-MM-DD"));
                                    // that.barXData.push(key);
                                    const time = `${key.substr(0, 4)}-${key.substr(4, 2)}-${key.substr(6, 2)}`;
                                    that.barXData.push(time);
                                } else {
                                    if (that.lastGranularity === 'month') {
                                        key = (+key + 1) + '';
                                    }
                                    that.barXData.push(key);
                                }
                            }
                        }
                        that.barData.push({
                            name: data[i]['crowdName'] || '用户数',
                            type: 'line',
                            barWidth: '28',
                            data: tempData
                        });
                    }
                }
                that.lastChartOption.xAxis[0].data = that.barXData;
                that.lastChartOption.legend['data'] = legends;
                that.lastChartOption.series = that.barData;
                that.lastChart = _.cloneDeep(that.lastChartOption);
            });
    }

    buildTrendCharts(crowdName: any, data: any) {
        const serie = {
            smooth: true,
            name: crowdName || '' + '转化率',
            type: 'line',
            data: data
        };
        this.lineSeries.push(serie);
    }

    /**
     * 格式化漏斗转化概览数据
     * @param data
     */
    formatFunnelViewData(data: any) {
        const that = this;
        // 初始化
        that.transOverview = [];
        that.yFunnelData = [];
        that.legends = [];
        for (let i = 0; i < data.length; i++) {

            that.legends.push({
                name: data[i]['crowdName'],
                icon: 'circle'
            }); // 图表的指示

            const viewData = data[i]['funnelConvertOverviewEventStepItem'];
            if (that.selectedGenerateCrowd.length === 0) {
                const view = {};

                view['startDeviceCount'] = viewData[0].val;
                view['endDeviceCount'] = viewData[viewData.length - 1].val;

                view['wholeConvertRate'] = +(isNaN(+viewData[viewData.length - 1].val / +viewData[0].val) || !viewData[0].val ? 0 : (+viewData[viewData.length - 1].val / +viewData[0].val) * 100).toFixed(2) + '%';

                that.transOverview.push(view);
            } else {
                for (let j = 0; j < that.selectedGenerateCrowd.length; j++) {
                    if (data[i]['crowdId'] == that.selectedGenerateCrowd[j]['id']) {
                        const view = {};
                        view['color'] = that.selectedGenerateCrowd[j]['color'];
                        view['startDeviceCount'] = viewData[0].val;
                        view['endDeviceCount'] = viewData[viewData.length - 1].val;
                        view['wholeConvertRate'] = +(isNaN(+viewData[viewData.length - 1].val / +viewData[0].val) || !viewData[0].val ? 0 : (+viewData[viewData.length - 1].val / +viewData[0].val) * 100).toFixed(4) + '%';
                        that.transOverview.push(view);
                    }
                }
            }
            that.formatFunnelData(data[i]['crowdName'], viewData);
        }
        // 如果为两个柱状图对比 修改markPoint
        if (data.length === 2) {
            const markPoint = {
                symbol: 'image://assets/images/funnel2_tip.png',
                symbolSize: [110, 24],
                label: {
                    normal: {
                        offset: [-25, -3],
                        textStyle: {
                            color: '#2D8CF0'
                        },
                        formatter: function (params: any) {
                            return params.data.value + '%';
                        }
                    },
                    emphasis: {
                        offset: [-25, -3],
                        textStyle: {
                            color: '#2D8CF0'
                        },
                        formatter: function (params: any) {
                            return params.data.value + '%';
                        }
                    }
                }
            };
            that.funnelSeries[0]['markPoint'] = Object.assign(that.funnelSeries[0]['markPoint'], markPoint);
            const markPoint2 = {
                symbol: 'image://assets/images/funnel2_tip.png',
                symbolSize: [110, 24],
                symbolOffset: ['-100%', ' -231%'],
                label: {
                    normal: {
                        offset: [25, -3],
                        textStyle: {
                            color: '#2DE2C5'
                        },
                        formatter: function (params: any) {
                            return params.data.value + '%';
                        }
                    },
                    emphasis: {
                        offset: [25, -3],
                        textStyle: {
                            color: '#2DE2C5'
                        },
                        formatter: function (params: any) {
                            return params.data.value + '%';
                        }
                    }
                }
            };
            that.funnelSeries[1]['markPoint'] = Object.assign(that.funnelSeries[1]['markPoint'], markPoint2);
        }

        that.funnelChartOption.yAxis[0].data = that.yFunnelData;
    }

    // 处理接口返回的漏斗数据
    formatFunnelData(crowdName: any, data: any) {
        const that = this;
        that.xFunnelData = [];
        that.steps = [];
        const markPointData = [];
        if (that.yFunnelData.length) {
            that.yFunnelData.reverse();
        }
        for (let i = 0; i < data.length; i++) {
            if (data.length > that.yFunnelData.length) {
                that.yFunnelData.push(data[i]['stepOrder'] + '.' + data[i]['stepName']);
            }
            const arry = [];
            arry.push(data.length - 1 - i);
            arry.push(data[i]['val']);
            arry.push(data[i]['convertRate']);
            arry.push(data[i]['totalConvertRate']);
            that.xFunnelData.push(arry);
            that.steps.push({ 
                label: data[i]['stepOrder'], value: data[i]['stepOrder'] 
            });
            if (i > 0) {
                const json = {
                    value: data[i]['convertRate'],
                    yAxis: data.length - i - 1,
                    x: '100%'
                };
                markPointData.push(json);
            }
        }
        // 反转数据
        // that.xFunnelData.reverse();
        that.yFunnelData.reverse();
        that.buildFunnelCharts(crowdName, that.xFunnelData, markPointData);
        // init趋势步骤
        that.initTrendStep();
    }

    buildFunnelCharts(crowdName: any, data: any, markPointData: any) {
        const serie = {
            name: crowdName,
            type: 'bar',
            barWidth: '16',
            encode: {
                x: 1,
                y: 0,
                tooltip: [1, 2, 3],
                label: 3
            },
            markPoint: {
                label: {
                    normal: {
                        textStyle: {
                            color: '#000'
                        },
                        show: true,
                        offset: [0, -3],
                        formatter: function (params: any) {
                            return params.data.value + '%';
                        }
                    },
                    emphasis: {
                        show: true,
                        offset: [0, -3],
                        formatter: function (params: any) {
                            return params.data.value + '%';
                        }
                    }
                },
                silent: true,
                symbolSize: [50, 24],
                symbolOffset: ['-100%', '-150%'],
                symbol: 'image://assets/images/funnel_tip.png',
                data: markPointData
            },
            data: data
        };
        this.funnelSeries.push(serie);
    }

    /**
     * 初始化趋势分析的步骤
     */
    initTrendStep() {
        const that = this;
        that.selectedStep1 = that.steps[0]['value'];
        that.selectedStep2 = that.steps[that.steps.length - 1]['value'];
        that.step1 = that.steps.slice(0, +that.selectedStep2 - 1);
        that.step2 = that.steps.slice(+that.selectedStep1);
    }

    /**
     * 改变趋势分析的步骤
     * @param data
     */
    changeTrendStep(data: any) {
        const that = this;
        that.step1 = that.steps.slice(0, +that.selectedStep2 - 1);
        that.step2 = that.steps.slice(+that.selectedStep1);
        that.trendLineCharts();
    }

    /**
     * 改变步骤转化趋势图的日周月
     * @param data
     */
    changeStepGranularity(data: any) {
        this.trendLineCharts();
    }

    /**
     * 改变终点事件趋势图的日周月
     * @param data
     */
    changeLastGranularity(data: any) {
        this.lastEventTrendCharts();
    }

    // 漏斗图表
    funnelChartOption = {
        color: ['#2D8CF0'],
        label: {
            normal: {
                show: false,
                position: 'top',
                textStyle: {
                    color: '#000'
                },
                formatter: function (params: any) {
                    const text = params.data[2] + '%';
                    return text;
                }
            },
            emphasis: {
                show: false,
                position: 'top',
                textStyle: {
                    color: '#000'
                },
                formatter: function (params: any) {
                    const text = params.data[2] + '%';
                    return text;
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(23,35,61,0.85)',
            padding: [16, 20],
            extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);',
            textStyle: {
                color: '#fff'
            },
            position: function(pos, params, dom, rect, size){
                let obj = {top: pos[1]};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
            },
            // 提示框配置
            formatter: function (params: any) {
                const formatNumber = function (number: string) {
                    number = number + '';
                    if (!/^[0-9]*$/.test(number)) {
                        return number;
                    }
                    const length = Math.floor(number.length / 3);
                    const tempNumber = number.split('');
                    for (let i = 0; i < length; i++) {
                        tempNumber.splice(-(((i + 1) * 3) + i), 0, ',');
                    }
                    if (tempNumber[0] == ',') {
                        tempNumber.shift();
                    }
                    return tempNumber.join('');
                };
                let res: string = '';
                let users: string = '<div style="display: inline-block;"><p style="border-bottom: 1px solid #dfe7f2;padding-bottom: 10px;margin-bottom: 16px;"><span style="margin-left: 14px;">用户数</span></p>';
                let steps: string = '<div style="display: inline-block;"><p style="border-bottom: 1px solid #dfe7f2;padding-bottom: 10px;margin-bottom: 16px;"><span>步骤间转化率</span></p>';
                let rate: string = '<div style="display: inline-block;"><p style="border-bottom: 1px solid #dfe7f2;padding: 0 10px 10px 10px;margin-bottom: 16px;"><span>该步转化率</span></p>';
                for (let i = 0; i < params.length; i++) {
                    users += `<p><span style="color:${params[i].color};padding-right: 5px;">●</span><span>` + formatNumber(params[i].data[1]) + `</span></p>`;
                    steps += `<p><span>${params[i].dataIndex == 0 ? '--' : (params[i].data[2] || 0).toFixed(2) + '%'}</span></p>`;
                    rate += `<p style="padding: 0 10px;"><span>${params[i].data[3]}%</span></p>`;
                }
                users += '</div>';
                steps += '</div>';
                rate += '</div>';
                res += users + rate + steps;
                return res;
            },
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            right: 22,
            top: 12,
            data: ''
        },
        grid: {
            top: '45',
            left: '150',
            right: '40',
            bottom: '30',
            // containLabel: true
            containLabel: false
        },
        xAxis: [{
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    width: 1,
                    color: '#f2f7ff'
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#dfe7f2',
                    width: 1
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#657180',
                }
            }
        }],
        yAxis: [{
            type: 'category',
            data: this.yFunnelData,
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    width: 1,
                    color: '#f2f7ff'
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#dfe7f2',
                    width: 1
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                margin: 135,
                textStyle: {
                    color: '#657180',
                    align: 'left'
                },
                // formater y轴数据，一行最多显示十个
                formatter: function (params: any) {
                    let newParamsName = ''; // 最终拼接成的字符串
                    const paramsNameNumber = params.length - 2; // 实际标签的个数(减的2是遍历数据的时候，新加的  步骤数+“.”+名称)
                    const provideNumber = 10; // 每行能显示的字的个数
                    const rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
                    /**
                     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                     */
                    // 条件等同于rowNumber>1
                    if (paramsNameNumber > provideNumber) {
                        /** 循环每一行,p表示行 */
                        for (let p = 0; p < rowNumber; p++) {
                            let tempStr = ''; // 表示每一次截取的字符串
                            const start = p * provideNumber; // 开始截取的位置
                            const end = start + 2 + provideNumber; // 结束截取的位置
                            if (p == 0) { // 处理第一行数据 截取步骤数+“.”以后的数据
                                tempStr = params.substring(start, end) + '\n';
                            } else if (p == rowNumber - 1) { // 此处特殊处理最后一行的索引值
                                // 最后一次不换行
                                // tempStr = params.substring(start, paramsNameNumber);
                                tempStr = params.substring(start + 2, params.length);
                            } else {
                                tempStr = params.substring(start + 2, end) + '\n';
                            }
                            newParamsName += tempStr; // 最终拼成的字符串
                        }

                    } else {
                        newParamsName = params;
                    }
                    return newParamsName;
                },
            }
        }],
        series: ''
    };

    // 步骤转化趋势图配置
    stepChartOption = {
        color: ['#2D8CF0'],
        // 图例
        legend: {
            top: 24,
            right: 16,
            data: this.legends
        },
        // 数据提示框配置
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(23,35,61,0.85)',
            padding: [16, 20],
            extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);',
            textStyle: {
                color: '#fff'
            },
            // 提示框配置
            formatter: function (params: any) {
                let res = '<div style="border-bottom:1px solid #dfe7f2;padding-bottom:12px;">时间<span style="margin-left:70px;">' + params[0].name + '</span></div>';
                for (let i = 0; i < params.length; i++) {
                    res += '<p style="margin-top:12px;"><span style="color:' + params[i].color + ';margin-right:8px;">●</span>' + params[i].seriesName + '<span style="color: #2D8CF0;margin-left:90px;">' + params[i].value + '%' + '</span></p>';
                }
                return res;
            },
        },
        grid: {
            top: '70',
            left: '25',
            right: '22',
            bottom: '3',
            containLabel: true,
            height: '170'
        },
        // x轴配置
        xAxis: [{
            type: 'category',
            data: this.xData,
            name: '',
            boundaryGap: true, // x坐标轴是否留白
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#dfe7f2',
                    width: 1
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#657180',
                }
            }
        }],
        // Y轴配置
        yAxis: [{
            type: 'value',
            axisLine: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    width: 1,
                    color: '#f2f7ff'
                }
            },

            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#657180',
                },
                formatter: '{value} %'
            }
        }],
        // 图表Series数据序列配置
        series: this.lineSeries

    };

    // 趋势图配置
    lastChartOption = {
        color: ['#2D8CF0'],
        legend: {
            top: 12,
            right: 16,
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(23,35,61,0.85)',
            padding: [16, 20],
            extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);',
            textStyle: {
                color: '#fff'
            },
            // 提示框配置
            formatter: function (params: any) {
                let res = '<div style="border-bottom:1px solid #dfe7f2;padding-bottom:12px;">时间<span style="margin-left:70px;">' + params[0].name + '</span></div>';
                for (let i = 0; i < params.length; i++) {
                    res += '<p style="margin-top:12px;"><span style="color:' + params[i].color + ';margin-right:8px;">●</span>' + params[i].seriesName + '<span style="color: #2D8CF0;margin-left:90px;">' + Number(params[i].value).toLocaleString() + '</span></p>';
                }
                return res;
            }
        },
        grid: {
            top: '56',
            left: '20',
            right: '20',
            bottom: '3',
            containLabel: true,
            height: '180'
        },
        xAxis: [{
            type: 'category',
            data: ['20170529', '20170530', '20170531', '20170601', '20170602', '20170603', '20170604'],
            name: '',
            boundaryGap: true, // x坐标轴是否留白
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#dfe7f2',
                    width: 1
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#657180',

                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'solid',
                    width: 1,
                    color: '#f2f7ff'
                }
            },

            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#657180',

                }
            }
        }],
        series: ''
    };
}
