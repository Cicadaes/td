import {Component, OnInit, Injector, ViewChild, ElementRef, OnChanges, Input} from '@angular/core';
import {BaseComponent} from '../../../common/base-component';
import {TargetAchievementService} from './target-achievement.service';
import {ChartComponent} from '../../../common/chart/chart.component';

@Component({
    selector: 'app-target-achievement',
    templateUrl: './target-achievement.component.html',
    styleUrls: ['./target-achievement.component.less'],
    providers: [TargetAchievementService]
})
export class TargetAchievementComponent extends BaseComponent implements OnInit, OnChanges {

    @ViewChild('report_email') report_email: ElementRef;

    @ViewChild('report_push') report_push: ElementRef;

    @ViewChild('report_sms') report_sms: ElementRef;

    @Input() campaignName: any;

    tabList: any = [
        {
            url: '/effect-report/target-achievement',
            name: '目标达成'
        }, {
            url: '/effect-report/funnel-analysis',
            name: '漏斗分析'
        }
    ];

    @ViewChild(ChartComponent) chartComponent: ChartComponent;

    campaignId: any;

    indiList: any = [];

    detailList: any = [];

    compareList: any = [];
    compareListOld: any = [];

    trendPerMap: any = {};

    chartOption: any = {};

    compareState: any = false; // 对比弹框是否显示
    compareShowState: any = false; // 对比状态面板(点击确定后变化)
    compareChooseIds: any = ''; // 对比条件参数，没有值代表all
    compareChooseIdsOld: any = '';

    compareChooseList: any = []; // 对比列表
    compareChooseShow: any = []; // 显示在对比细分后面的字样

    targetIdCurrent: any;

    reportObj: any = {};

    haveData: any = false;
    errorTip: any = '';

    constructor(private targetAchievementService: TargetAchievementService,
                private injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        const campaignId = this.route.snapshot.params['campaignId'];
        if (campaignId) {
            this.campaignId = parseInt(campaignId);
        }

        let _that = this;
        this.chartOption = {
            color: ['#2D8CF0', '#2DE2C5', '#FCC45F', '#FF8454', '#DB425A', '#34508C', '#5BB6FD', '#56D08B', '#B3E768', '#71808F'],
            legend: {
                top: 6,
                right: 14,
                icon: 'rect',
                itemWidth: 16,
                itemHeight: 4,
                borderRadius: 2,
                padding: 0,
                itemGap: 10,
                color: '#495060',
                data: ['PV达成']
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
                    let text = '达成 / 达成率';
                    if (_that.compareShowState) {
                        text = '贡献 / 贡献率';
                    }
                    let res = '<div style="border-bottom:1px solid #dfe7f2;padding-bottom:12px;width: 280px;">' +
                        '<span style="">' +
                        params[0].name +
                        '</span>' +
                        '<span style="float: right;">' +
                        text +
                        '</span>' +
                        '</div>';
                    for (let i = 0; i < params.length - 1; i++) {
                        res += '<p style="margin-top:12px;">' +
                            '<span style="color:' + params[i].color + ';margin-right:8px;">●</span>' +
                            params[i].seriesName +
                            '<span style="color: #2D8CF0; float: right;">' +
                            _that.toThousandStr(params[i].value) + ' / ' +
                            _that.trendPerMap[params[i].seriesName][params[0].name] + '%' +
                            '</span>' +
                            '</p>';
                    }
                    return res;
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    lineStyle: {
                        color: '#DDDEE1',
                        width: 0
                    }
                },
                axisTick: {
                    alignWithLabel: true,
                    length: 6,
                    lineStyle: {
                        color: '#DDDEE1'
                    }
                },
                axisLabel: {
                    margin: 18,
                    textStyle: {
                        fontFamily: 'HelveticaNeue',
                        fontSize: 12,
                        color: '#80848F',
                        fontWeight: 'normal'
                    }
                },
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    margin: 18,
                    fontFamily: 'HelveticaNeue',
                    fontSize: 12,
                    color: '#80848F',
                    fontWeight: 'normal'
                }
            },
            grid: {
                top: 36,
                left: 0,
                bottom: 10,
                right: 14,
                containLabel: true
            },
            series: [
                {
                    type: 'line',
                    symbol: 'none',
                    name: 'PV达成',
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                }
            ]
        };

        this.getOverview();
        this.getDetail();
        this.getCompareList();
    }

    private getCompareList() {
        const _that = this;
        this.targetAchievementService.getCompareList(this.campaignId).subscribe((response: any) => {
            if (response && response.data && response.data.pipelineInfoVo) {
                _that.compareList = response.data.pipelineInfoVo;
            }
        });
    }

    private getTrend() {
        const _that = this;

        const segmentIdArr = this.compareChooseIds;
        this.targetAchievementService.getTrend(this.campaignId, segmentIdArr, this.targetIdCurrent).subscribe((response: any) => {
            if (response.code === 200 && response.data && response.data.data && response.data.data.length > 0) {
                const trendList = response.data.data;
                const legend_data = [];
                const x_data = [];
                const series_list = [];
                for (let i = 0; i < trendList.length; i++) {
                    const obj = trendList[i];

                    const legendName = obj.segmentName || obj.targetName;
                    if (!_that.trendPerMap[legendName]) {
                        _that.trendPerMap[legendName] = {};
                    }

                    legend_data.push(legendName);

                    const tmp_series = {
                        name: legendName,
                        type: 'line',
                        stack: obj.targetName,
                        data: []
                    };
                    for (let j = 0; j < obj.items.length; j++) {
                        const item = obj.items[j];
                        // _that.trendPerMap[legendName][item.date] = item.rate || 0;
                        _that.trendPerMap[legendName][item.date] = item.increaseRate || 0;
                        if (i === 0) {
                            x_data.push(item.date);
                        }
                        // tmp_series.data.push(item.value);
                        tmp_series.data.push(item.increaseValue);
                    }
                    series_list.push(tmp_series);
                }

                let json = _that.planFixedPoint(series_list[0].data.length);
                series_list.push(json);

                _that.chartOption.legend.data = legend_data;
                _that.chartOption.xAxis.data = x_data;
                _that.chartOption.series = series_list;

                _that.chartComponent.option = _that.chartOption;
            }
        });
    }

    /**
     * 趋势概览固定点
     * @param dataLength 获取长度，用于固定点前补数
     */
    planFixedPoint(dataLength: number) {
        const that = this;
        let value, selectedTarget;

        that.indiList && that.indiList.forEach(element => {
            if (element.isSelected) {
                selectedTarget = element;
                if (that.compareChooseIds) {
                    value = element.totalActualValue
                } else {
                    value = element.targetValue;
                }
                return;
            }
        });

        let json = {
            name: '计划目标',
            smooth: true,
            type: 'line',
            symbol: 'diamond',
            hoverAnimation: false,
            symbolSize: 10,
            color: '#DB425A',
            label: {
                normal: {
                    show: true,
                    position: 'bottom',
                    formatter: function (params: any) {
                        let number = params.value;
                        let tempNumber = number;
                        if (number && /^[0-9]*$/.test(number)) {
                            number += '';
                            let length = Math.floor(number.length / 3);
                            tempNumber = number.split('');
                            for (let i = 0; i < length; i++) {
                                tempNumber.splice(-(((i + 1) * 3) + i), 0, ',');
                            }
                            if (tempNumber[0] == ',') {
                                tempNumber.shift();
                            }
                            tempNumber = tempNumber.join('');
                        }
                        return `${params.seriesName}\n${tempNumber}`;
                    }
                },
                emphasis: {
                    show: true,
                    position: 'bottom',
                }
            },
            markLine: {
                symbol: ['', ''],
                animation: true,
                data: [{yAxis: value}],
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        formatter: function (params: any) {
                            return '';
                        }
                    },
                    emphasis: {
                        show: true,
                        position: 'bottom',
                        formatter: function (params: any) {
                            return '';
                        }
                    }
                },
            }
        }
        let tempData = [];
        for (let i = 0; i < dataLength - 1; i++) {
            tempData.push('');
        }
        if (that.compareChooseIds) {
            json.name = '实际值'
            tempData.push(selectedTarget.totalActualValue);
        } else {
            tempData.push(selectedTarget.targetValue)
        }
        json['data'] = tempData;
        return json;
    }

    private getDetail() {
        const _that = this;
        const segmentIdArr = this.compareChooseIds;
        this.targetAchievementService.getDetail(this.campaignId, segmentIdArr).subscribe((response: any) => {
            if (response.code === 200 && response.data && response.data.data && response.data.data.length > 0) {
                const tmpList = response.data.data;
                if (tmpList && tmpList.length > 0) {
                    // 将空列补空对象
                    for (let i = 0; i < tmpList.length; i++) {
                        const obj = tmpList[i];
                        const segments = obj.segments;
                        for (let j = 0; j < segments.length; j++) {
                            const obj1 = segments[j];
                            if (!obj1.items) {
                                obj1.items = [];
                            }
                            if (obj1.items.length === 0) {
                                for (let k = 0; k < obj.groupOverview.length; k++) {
                                    obj1.items.push({});
                                }
                            }
                            for (let k = 0; k < obj1.items.length; k++) {
                                const obj2 = obj1.items[k];
                                if (obj2.actualValueRate && obj2.actualValueRate === '--') {
                                    obj2.actualValueRate = '0';
                                }
                            }
                        }
                    }
                }
                _that.detailList = tmpList;
            }

        });
    }

    private getOverview() {
        const _that = this;

        const segmentIdArr = this.compareChooseIds;
        this.targetAchievementService.getOverview(this.campaignId, segmentIdArr).subscribe((response: any) => {
            if (response.code === 200 && response.data && response.data.data && response.data.data.length > 0) {
                _that.haveData = true;

                let percentField = 'totalActualRate';
                if (_that.compareChooseIds) {
                    percentField = 'segmentsActualRate';
                }
                const tmpList = [];
                for (let i = 0; i < response.data.data.length; i++) {
                    const obj = response.data.data[i];
                    tmpList.push({
                        targetId: obj.targetId,
                        targetName: obj.targetName,
                        targetValue: obj.targetValue,
                        totalActualValue: obj.totalActualValue,
                        segmentsActualValue: obj.segmentsActualValue,
                        percent: obj[percentField],
                        isSelected: i === 0
                    });

                }
                _that.indiList = tmpList;

                _that.targetIdCurrent = tmpList[0].targetId;
                _that.getTrend();
            } else if (response.code === 504) {
                _that.errorTip = response.message;
            } else {
                _that.message.create('error', response.message);
            }

        });
    }

    clickPanel(item: any, i) {
        if (!item.isSelected) {
            for (let j = 0; j < this.indiList.length; j++) {
                const obj = this.indiList[j];
                obj.isSelected = false;
            }
            item.isSelected = true;
            this.targetIdCurrent = item.targetId;
            this.getTrend();
        }
    }

    // 点击对比确认按钮
    compareCheck() {
        this.compareState = false;
        this.compareChooseShow = this.compareChooseList;
        if (this.compareChooseIds) {
            this.compareShowState = true;
        } else {
            this.compareShowState = false;
        }
        this.getOverview();
        this.getDetail();
    }

    // 点击对比条目，每次点击重新计算已选中的ids
    clickCompareItem(item: any) {
        if (item.selected) {
            item.selected = false;
        } else {
            item.selected = true;
        }

        this.compareChooseIds = '';
        this.compareChooseList = [];
        for (let i = 0; i < this.compareList.length; i++) {
            const obj = this.compareList[i];
            for (let j = 0; j < obj.segmentInfoVos.length; j++) {
                const obj1 = obj.segmentInfoVos[j];
                if (obj1.selected) {
                    this.compareChooseIds += obj1.segmentId + ',';
                    this.compareChooseList.push(obj1.segmentName || '未定义名称');
                }
            }
        }

        this.compareChooseIds = this.compareChooseIds.substr(0, this.compareChooseIds.length - 1);
    }

    resetCompare() {
        for (let i = 0; i < this.compareList.length; i++) {
            const obj = this.compareList[i];
            for (let j = 0; j < obj.segmentInfoVos.length; j++) {
                const obj1 = obj.segmentInfoVos[j];
                obj1.selected = false;
            }
        }
        this.compareChooseIds = '';
        this.compareChooseList = [];
    }

    clickReport(segment: any) {
        const channelType = segment.channelType;

        this.reportObj = {
            campaignId: this.campaignId,
            segmentId: segment.segmentId,
            name: segment.segmentName,
            right: true
        };

        let contentTmp = null;
        if (channelType === 1) {
            contentTmp = this.report_push;
        } else if (channelType === 2) {
            contentTmp = this.report_sms;
        } else if (channelType === 3) {
            contentTmp = this.report_email;
        }

        this.modalService.create(
            {
                nzTitle: '投放报告',
                nzContent: contentTmp,
                nzCancelText: null,
                nzOkText: null,
                nzWidth: '80%',
                nzMask: true,
                nzMaskClosable: false,
                nzFooter: null,
                nzBodyStyle: {
                    background: '#eef0f3',
                    padding: '0px 0px 16px 0px'
                }
            }
        );

    }

    gotoDetail() {
        this.goInto({
            name: '',
            url: '/marketing-activities/activities',
            params: {
                campaignId: this.campaignId
            }
        });
    }

    cacheCompareStatus() {
        if (!this.compareState) {
            this.compareChooseIdsOld = this.compareChooseIds;
            this.compareListOld = JSON.parse(JSON.stringify(this.compareList));
        }

        this.compareState = !this.compareState;
    }

    restoreCompareStatus() {
        this.compareChooseIds = this.compareChooseIdsOld;
        this.compareList = this.compareListOld;

        this.compareState = false;
    }

    downloadTrend() {
        this.targetAchievementService.downloadTrend(this.campaignId, this.campaignName, this.compareChooseIds, this.targetIdCurrent).subscribe(() => {
        });
    }

    downloadDetail() {
        this.targetAchievementService.downloadDetail(this.campaignId, this.campaignName, this.compareChooseIds).subscribe(() => {
        });
    }

    goPage(hash: string) {
        this.commonService.goPage(hash);
    }
}
