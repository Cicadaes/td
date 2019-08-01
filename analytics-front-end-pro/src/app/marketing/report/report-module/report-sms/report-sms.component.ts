import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';
import {ReportService} from '../../report.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '../../../../common/services/common.service';

@Component({
    selector: 'app-report-sms',
    templateUrl: './report-sms.component.html',
    styleUrls: ['./report-sms.component.less']
})
export class ReportSmsComponent implements OnInit, OnChanges {
    // @Input() cycleTime: any;
    // @Input() right: any;
    // @Input() segmentId: any;
    // @Input() campaignId: any;
    @Input() reportObj: any = {};

    smsContentList: any = [];       // 投放概览数据
    tabs: any = [];                 // 趋势分析tab
    timeType = 'by_day';            // 天和小时切换
    chartTab: any[];                // 图还是表格
    chartTabIndex = 0;              // 趋势分析tab切换index
    loading = false;                // 图标加载loading
    _total = 0;                     // 图标数据总条数
    chartType = 'line';             // 图还是表格type
    chartOptionLine: any;           // 线图数据
    tableOption: any = [];          // 表格数据
    data: any;                      // 原始数据

    isOne = true;                   // 判断是否有A/B test true只有一条消息 不是A/B test
    cycleTimeList: any = [];        // 循环时间数组
    showTimeList: any = [];         // 显示的循环时间
    leftButton = false;             // 循环左边按钮是否可点击
    rightButton = false;            // 循环右边按钮是否可点击

    downloadJson: any = {
        type: 'segment',
        segmentType: 'sms'
    };
    statRange = 8;
    cycleSelect: string;            // 选择循环时间轴上的某个时间
    campaignList: any[];            // 计划目标列表
    contributeList: any[];          // 贡献率列表
    TreadData: any;                 // 趋势分析数据
    chartTabName = '发送成功数';      // 趋势Tab
    chartTabKey: any;               // 趋势Tab
    contributeListLength = 0;

    constructor(private reportService: ReportService,
                private notification: NzNotificationService,
                private commonService: CommonService) {
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnInit() {

        this.tabs = [
            {
                name: '日',
                type: 'by_day'
            },
            {
                name: '小时',
                type: 'by_hour'
            }
        ];

        this.chartTab = [
            {
                name: '发送成功数',
                value: 0,
                key: 'sum_td_sms_send_success_count'
            },
            {
                name: '点击链接数',
                value: 0,
                key: 'sum_td_sms_click_count'
            }
        ];

        this.cycleTimeList = ['20170502', '20170503', '20170504', '20170505', '20170506', '20170507', '20170508',
            '20170509', '20170510', '20170511', '20170512', '20170513', '20170514', '20170515', '20170516', '20170517', '20170518',
            '20170519', '20170520', '20170521', '20170522', '20170523', '20170524', '20170525', '20170526', '20170527', '20170528',
            '20170529', '20170530', '20170531'];

        if (this.cycleTimeList.length > 7) {
            this.showTimeList = this.cycleTimeList.slice(-7);
            this.leftButton = true;
            this.cycleSelect = this.showTimeList[this.showTimeList.length - 1];
        } else {
            this.showTimeList = this.cycleTimeList;
            this.cycleSelect = this.showTimeList[this.cycleTimeList.length - 1];
        }

        this.getSmsOverview();
        if (this.reportObj && this.reportObj.right) {
            this.getCampaign(this.reportObj.campaignId);
            this.getContribute(this.reportObj.segmentId, this.reportObj.campaignId);
        }
        this.getSmsTrend(this.reportObj.segmentId, this.timeType);
        this.initEchart();
    }

    initEchart() {
        this.chartOptionLine = {
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
                color: '#495060'
            },
            tooltip: {
                trigger: 'axis'
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
                }
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
            }
        };
    }

    /**
     * 投放概览数据
     */
    getSmsOverview() {
        this.reportService.getSmsOverview(this.reportObj.segmentId).subscribe((response) => {
            if (response.code === 200) {
                const data = response.data[this.reportObj.segmentId];
                let successRate, failRate, unknowRate, phoneError, blackList, limitError, notAvailabel, other;
                let successCount = 0, failCount = 0, unknowCount = 0;
                if (response.data && response.data[this.reportObj.segmentId] && data['sum_td_sms_send_count']) {
                    // 成功率
                    successRate = ((data['sum_td_sms_send_success_count'] / data['sum_td_sms_send_count']) * 100).toFixed(0) + '%';
                    // 失败率
                    failRate = ((data['sum_td_sms_send_fail_count'] / data['sum_td_sms_send_count']) * 100).toFixed(0) + '%';
                    // 未知率
                    unknowRate = ((data['sum_td_sms_send_unknow'] / data['sum_td_sms_send_count']) * 100).toFixed(0) + '%';
                    // 手机错误数
                    phoneError = ((data['sum_td_sms_send_wrong_number'] / data['sum_td_sms_send_count']) * 100).toFixed(1) + '%';
                    // 黑名单
                    blackList = ((data['sum_td_sms_send_blacklist'] / data['sum_td_sms_send_count']) * 100).toFixed(1) + '%';
                    // 超限失败
                    limitError = ((data['sum_td_sms_send_exceed_limit'] / data['sum_td_sms_send_count']) * 100).toFixed(1) + '%';
                    // 无法连接
                    notAvailabel = ((data['sum_td_sms_send_not_available'] / data['sum_td_sms_send_count']) * 100).toFixed(1) + '%';
                    // 其他
                    other = ((data['sum_td_sms_send_other'] / data['sum_td_sms_send_count']) * 100).toFixed(1) + '%';

                    successCount = data['sum_td_sms_send_success_count'];
                    failCount = data['sum_td_sms_send_fail_count'];
                    unknowCount = data['sum_td_sms_send_unknow'];

                } else {
                    // 成功率
                    successRate = 0 + '%';
                    // 失败率
                    failRate = 0 + '%';
                    // 未知率
                    unknowRate = 0 + '%';
                    // 手机错误数
                    phoneError = 0 + '%';
                    // 黑名单
                    blackList = 0 + '%';
                    // 超限失败
                    limitError = 0 + '%';
                    // 无法连接
                    notAvailabel = 0 + '%';
                    // 其他
                    other = 0 + '%';
                }

                this.smsContentList = [
                    {
                        name: '成功',
                        status: '1',
                        value: successCount.toLocaleString(),
                        percentage: successRate
                    },
                    {
                        name: '失败',
                        status: '-1',
                        value: failCount.toLocaleString(),
                        percentage: failRate,
                        error: [
                            {
                                name: '手机号错误',
                                value: phoneError
                            },
                            {
                                name: '黑名单',
                                value: blackList
                            },
                            {
                                name: '超限失败',
                                value: limitError
                            },
                            {
                                name: '无法连接',
                                value: notAvailabel
                            },
                            {
                                name: '其他',
                                value: other
                            }
                        ]
                    },
                    {
                        name: '未知',
                        status: '2',
                        value: unknowCount.toLocaleString(),
                        percentage: unknowRate
                    }
                ];
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    /**
     * 获取贡献率
     */
    getContribute(segmentId: any, campaignId: any) {
        this.reportService.getContribute(segmentId, campaignId).subscribe((response) => {
            if (response.code === 200) {
                const data = response.data;
                const list = [];
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        list.push({
                            name: key,
                            value: data[key],
                            [this.replaceSum(key)]: data[key],
                            [this.replaceSum(key) + '1']: this.replaceSum(key),
                        });
                    }
                }
                this.contributeList = list;
                this.contributeListLength = this.contributeList.length;
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    replaceSum(key: any) {
        if (key) {
            return key.replace(/sum/, '');
        }
    }

    /**
     * 获取计划目标列表
     */
    getCampaign(campaignId: any) {
        this.reportService.getCampaign(campaignId).subscribe((response) => {
            if (response.code === 200) {
                this.campaignList = response.data;
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    /**
     * 获取趋势分析
     */
    getSmsTrend(segmentId: any, statDimension: any) {
        this.reportService.getSmsTrend(segmentId, statDimension).subscribe((response) => {
            if (response.code === 200) {
                this.TreadData = response;
                this.changeTrendCahrtData(this.TreadData, '');
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    /**
     * 格式化时间
     */
    dateFormat(time: any, type: any): any {
        let year, month, day, hour;
        if (time) {
            time = time.toString();
            year = time.substring(0, 4);
            month = time.substring(4, 6);
            day = time.substring(6, 8);
            if (type === 'by_hour') {
                hour = time.substring(8, 10);
                return `${year}-${month}-${day} ${hour}:00`;
            } else {
                return `${year}-${month}-${day}`;
            }
        }
    }

    // 组装趋势分析返回数据
    changeTrendCahrtData(response: any, itemkey: any) {
        let oneDate = {};
        this.chartOptionLine.legend.data = [];
        this.chartOptionLine.xAxis.data = [];
        this.tableOption = [];
        this.chartOptionLine.series = [
            {
                name: this.chartTabName,
                type: 'line',
                smooth: true,
                data: []
            }
        ];
        this.chartOptionLine.legend.data.push(this.chartTabName);
        const arr = Object.keys(response.data);
        this._total = arr.length;
        if (this._total > 0) {
            let clickTotal = 0, sendTotal = 0;
            for (const key in response.data) {
                if (response.data.hasOwnProperty(key)) {
                    oneDate = response.data[key];
                    for (const i in response.data[key]) {
                        if (response.data[key].hasOwnProperty(i)) {
                            if (this.chartTabKey) {
                                if (this.chartTabKey === key) {
                                    this.chartOptionLine.series[0].data.push(response.data[key][i]);
                                    this.tableOption.push({
                                        date: this.dateFormat(i, this.timeType),
                                        value: response.data[key][i]
                                    });
                                }
                                if (key === 'sum_td_sms_send_success_count') {
                                    sendTotal += response.data[key][i];
                                }
                                if (key === 'sum_td_sms_click_count') {
                                    clickTotal += response.data[key][i];
                                }
                            } else {
                                if (key === 'sum_td_sms_send_success_count') {
                                    sendTotal += response.data[key][i];
                                    this.chartOptionLine.series[0].data.push(response.data[key][i]);
                                    this.tableOption.push({
                                        date: this.dateFormat(i, this.timeType),
                                        value: response.data[key][i]
                                    });
                                }
                                if (key === 'sum_td_sms_click_count') {
                                    clickTotal += response.data[key][i];
                                }
                            }
                        }
                    }
                }
            }

            for (const i in oneDate) {
                if (oneDate.hasOwnProperty(i)) {
                    this.chartOptionLine.xAxis.data.push(this.dateFormat(i, this.timeType));
                }
            }

            this.chartOptionLine = Object.assign({}, this.chartOptionLine);

            this.chartTab = [
                {
                    name: '发送成功数',
                    value: sendTotal.toLocaleString(),
                    key: 'sum_td_sms_send_success_count'
                },
                {
                    name: '点击链接数',
                    value: clickTotal.toLocaleString(),
                    key: 'sum_td_sms_click_count'
                }
            ];
        }
    }

    // 切换时间颗粒度，日OR小时
    checkOneTime(item: any) {
        this.timeType = item.type;
        this.getSmsTrend(this.reportObj.segmentId, item.type);
    }

    // 切换趋势分析
    checkOne(index: any, item: any) {
        this.chartTabIndex = index;
        this.chartTabName = item.name;
        this.chartTabKey = item.key;
        this.changeTrendCahrtData(this.TreadData, item.key);
    }

    // 切换线图还是表格
    checkChart(type: any) {
        this.chartType = type;
    }

    // 导出  跳转到数据下载页面
    goPage(hash: string) {
        this.commonService.goPage(hash);
    }

    // 导出 导出失败日志和导出表格数据
    download(type: any) {
        if (type === 'error') {
            this.reportService.downLoadSmsOver(this.reportObj.segmentId).subscribe((response: any) => {
                if (response && response.code !== 200) {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        } else {
            this.reportService.downLoadSmsTrend(this.reportObj.segmentId, this.timeType).subscribe((response: any) => {
                if (response.code !== 200) {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        }
    }

    // 循环时间轴向前/向后查看
    getCycleTimeList(type: string) {
        const that = this;
        if (type === 'left') {
            if (!that.leftButton) {
                return;
            }
            const index = that.cycleTimeList.indexOf(that.showTimeList[0]);
            if (index < 7) {
                that.showTimeList = that.cycleTimeList.slice(0, 7);
            } else {
                that.showTimeList = that.cycleTimeList.slice(index - 7, index);
            }
        } else if (type === 'right') {
            if (!that.rightButton) {
                return;
            }
            const index = that.cycleTimeList.indexOf(that.showTimeList[that.showTimeList.length - 1]);
            const length = that.cycleTimeList.length;
            if (length - index < 8) {   // length为数组实际长度 index从0开始计算 所以要大于8
                that.showTimeList = that.cycleTimeList.slice(-7);
            } else {
                that.showTimeList = that.cycleTimeList.slice(index + 1, index + 8);
            }
        }
        if (that.showTimeList[0] === that.cycleTimeList[0]) {
            that.leftButton = false;
        } else {
            that.leftButton = true;
        }
        if (that.showTimeList[that.showTimeList.length - 1] === that.cycleTimeList[that.cycleTimeList.length - 1]) {
            that.rightButton = false;
        } else {
            that.rightButton = true;
        }
    }

    // 选择时间轴上的某个时间
    getPushPromotionData(time: string) {
        // 请求接口的参数
        this.downloadJson = {
            type: 'segment',
            segmentType: 'sms',
            segmentId: this.reportObj.segmentId,
            time: time,
            statRange: this.statRange
        };
        this.cycleSelect = time;
    }

    // 选择累计OR最近
    getPromotionData(type: string) {
        let time: any;
        if (type === 'all') {
            if (this.cycleTimeList.length > 7) {
                this.showTimeList = this.cycleTimeList.slice(0, 7);
                this.rightButton = true;
                this.leftButton = false;
            } else {
                this.showTimeList = this.cycleTimeList;
            }
            this.getAllPushPromotionData();
        } else if (type === 'end') {
            time = this.cycleTimeList[this.cycleTimeList.length - 1];
            if (this.cycleTimeList.length > 7) {
                this.showTimeList = this.cycleTimeList.slice(-7);
                this.leftButton = true;
                this.rightButton = false;
            } else {
                this.showTimeList = this.cycleTimeList;
            }
            this.getPushPromotionData(time);
        }
    }

    // 获取循环数据累计数据
    getAllPushPromotionData() {
        this.downloadJson = {
            type: 'segment',
            segmentType: 'sms',
            segmentId: this.reportObj.segmentId,
            all: 1,
            statRange: this.statRange
        };
        this.cycleSelect = 'all';
    }
}
