import {Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core';
import {ReportService} from '../../report.service';
import {NzNotificationService} from 'ng-cosmos-ui';
import {CommonService} from '../../../../common/services/common.service';

@Component({
    selector: 'app-report-push',
    templateUrl: './report-push.component.html',
    styleUrls: ['./report-push.component.less']
})
export class ReportPushComponent implements OnInit, OnChanges {
    @Input() reportObj: any = {};
    productId: any = 1;
    pushTitleRight: any = [];
    pushOverview: any = [];         // 投放概览数据
    tabs: any = [];                 // 趋势分析tab
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
    campaignList: any = [];         // 计划目标列表
    contributeList: any = [];       // 贡献率数据列表
    keys: any = [];
    chartTableName = '发送数';

    downloadJson: any = {
        type: 'segment',
        segmentType: 'push'
    };
    statRange = 8;
    cycleSelect: string;
    trendData: any = {};
    _width: any;
    keyLength: any;

    constructor(private reportService: ReportService,
                private notification: NzNotificationService,
                private commonService: CommonService) {
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnInit() {

        if (this.commonService.productId) {
            this.productId = Number(this.commonService.productId);
        }

        this.tabs = [
            {
                name: '日',
                type: 'day'
            },
            {
                name: '小时',
                type: 'hover'
            }
        ];

        this.chartTab = [
            {
                name: '发送数',
                type: 'sent',
                key: '_td_app_send_count'
            },
            {
                name: '到达数',
                type: 'arrivaled',
                key: '_td_app_recv_count'
            },
            {
                name: '展示数',
                type: 'impressions',
                key: '_td_app_display_count'
            },
            {
                name: '点击数',
                type: 'click',
                key: '_td_app_click_count'
            }
        ];

        // this.getTimeAxis();
        this.getOverview(this.reportObj.segmentId, '');
        if (this.reportObj && this.reportObj.right) {
            this.getCampaign(this.reportObj.campaignId);
            this.getContribute(this.reportObj.segmentId, this.reportObj.campaignId);
        }
        this.getTrend(this.reportObj.segmentId);
        this.initEchart();
    }

    /**
     * 图表格
     */
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
     * 获取投放概览数据
     */
    getOverview(segmentId: any, date: any) {
        this.reportService.getOverview(segmentId, date).subscribe((response) => {
            if (response.code === 200) {
                this.pushOverview = this.initPushOverviewData(response.data);
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    /**
     * 获取投放时间轴
     */
    getTimeAxis() {
        this.reportService.getTimeAxis(this.reportObj.segmentId).subscribe((response) => {
            if (response.code === 200) {
                this.cycleTimeList = response.data;
                const that = this;

//                const lasterTime = that.cycleTimeList[that.cycleTimeList.length - 1];
                if (that.cycleTimeList.length > 7) {
                    that.showTimeList = that.cycleTimeList.slice(-7);
                    that.leftButton = true;
                    that.cycleSelect = that.showTimeList[that.showTimeList.length - 1];
                } else {
                    that.showTimeList = that.cycleTimeList;
                    that.cycleSelect = that.showTimeList[that.cycleTimeList.length - 1];
                }

                const data = this.dateFormat(that.cycleSelect);
                this.getOverview(this.reportObj.segmentId, data);

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
                        });
                    }
                }
                this.contributeList = list;
                console.log('this.contributeList', this.contributeList);
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
                console.log('campaignList =>', this.campaignList);
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    /**
     * 获取趋势分析
     */
    getTrend(segmentId: any) {
        this.reportService.getTrend(segmentId).subscribe((response) => {
            if (response.code === 200) {
                this.trendData = response;
                this.keys = Object.keys(response.data);
                this._total = this.keys.length;
                this._width = (100 / (this._total + 1)) + '%';
                if (this.keys.length > 0) {
                    this.changeTrendCahrtData('_td_app_send_count', this.trendData);
                    this.changeTrendTableData('_td_app_send_count', this.trendData);
                }
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 切换趋势分析
    checkOne(index: any, item: any) {
        this.chartTabIndex = index;
        this.chartTableName = item.name;
        if (Object.keys(this.trendData).length > 0) {
            this.changeTrendCahrtData(item.key, this.trendData);
            this.changeTrendTableData(item.key, this.trendData);
        }
    }

    /**
     * 其实分析数据组装
     */
    changeTrendTableData(zbkey: any, response: any) {
        const length = Object.keys(response.data).length;
        this.tableOption = [];
        const obj = {};

        if (length > 0) {
            for (let i = 0; i < this.chartOptionLine.xAxis.data.length; i++) {
                this.tableOption.push({
                    time: this.chartOptionLine.xAxis.data[i],

                });
            }

            for (const key in response.data) {
                if (response.data.hasOwnProperty(key)) {
                    const data = response.data[key];
                    for (const i in data) {
                        if (data.hasOwnProperty(i)) {
                            for (let a = 0; a < this.tableOption.length; a++) {
                                if (this.dateFormat(i) === this.tableOption[a].time) {
                                    this.tableOption[a][key] = this.table(data[i], zbkey);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    table(data: any, zbkey: any) {
        for (const i in data) {
            if (data.hasOwnProperty(i)) {
                if (i === zbkey) {
                    return data[i].toLocaleString();
                }
            }
        }
    }

    /**
     * 其实分析数据组装
     */
    changeTrendCahrtData(zbkey: any, response: any) {
        let data = {};
        const length = Object.keys(response.data).length;
        let i = 0;
        if (length > 0) {
            this.chartOptionLine.series = [];
            this.chartOptionLine.legend.data = [];
            this.chartOptionLine.xAxis.data = [];
            for (const key in response.data) {
                if (response.data.hasOwnProperty(key)) {
                    data = response.data[key];
                    let specialKey = key;
                    if (key === 'X' || key === 'x') {
                        specialKey = this.chartTableName;
                    } else {
                        if (this._total > 1) {
                            specialKey = `${this.chartTableName} - ${key}组`;
                        } else {
                            specialKey = this.chartTableName;
                        }
                    }
                    this.chartOptionLine.series[i] = {
                        name: specialKey,
                        type: 'line',
                        stack: '总量' + i,
                        smooth: true,
                        data: []
                    };

                    this.chartOptionLine.legend.data.push(specialKey);

                    for (const j in data) {
                        if (data.hasOwnProperty(j)) {
                            this.chartOptionLine.series[i]['data'].push(data[j][zbkey]);
                        }
                    }
                    i++;
                }
            }

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    this.chartOptionLine.xAxis.data.push(this.dateFormat(key));
                }
            }
        }
        this.chartOptionLine = Object.assign({}, this.chartOptionLine);
    }

    /**
     * 格式化时间
     */
    dateFormat(time: any): any {
        let year, month, day, hour;
        if (time) {
            time = time.toString();
            year = time.substring(0, 4);
            month = time.substring(4, 6);
            day = time.substring(6, 8);
            hour = time.substring(8, 10);
            if (time.split('').length > 8) {
                return `${year}-${month}-${day} ${hour}:00`;
            } else {
                return `${year}-${month}-${day}`;
            }

        }
    }

    // 组装投放概览数据
    initPushOverviewData(data: any) {
        const that = this;
        const list = [];
        const data2 = [];
        const length = Object.keys(data).length;
        if (length > 1) {
            that.isOne = false;
        } else {
            that.isOne = true;
        }

        for (const i in data) {
            if (data.hasOwnProperty(i)) {
                if (length === 0) {
                    break;
                }
                if (i === 'overview_indexes_total') {
                    data[i]['groupName'] = '总计';
                } else {
                    data[i]['groupName'] = i;
                }
                const json = {
                    groupName: data[i]['groupName'],
                    percent: data[i]['segment_crowd_ratio'] ? data[i]['segment_crowd_ratio'] + '%' : 0 + '%',
                    sum_td_app_send_count: data[i].sum_td_app_send_count.toLocaleString(),
                    // _td_app_send_count_rate: ((data[i]._td_app_recv_count / data[i]._td_app_send_count) * 100 || 0).toFixed(2) + '%',
                    sum_td_app_recv_count: data[i].sum_td_app_recv_count.toLocaleString(),
                    sum_td_app_recv_count_rate: ((data[i].sum_td_app_recv_count / data[i].sum_td_app_send_count)
                    * 100 || 0).toFixed(2) + '%',
                    sum_td_app_display_count: data[i].sum_td_app_display_count.toLocaleString(),
                    sum_td_app_display_count_rate: ((data[i].sum_td_app_display_count / data[i].sum_td_app_recv_count)
                    * 100 || 0).toFixed(2) + '%',
                    sum_td_app_click_count: data[i].sum_td_app_click_count.toLocaleString(),
                    sum_td_app_click_count_rate: ((data[i].sum_td_app_click_count / data[i].sum_td_app_recv_count)
                    * 100 || 0).toFixed(2) + '%',
                };
                if (data[i].sum_td_app_send_count === 0) {
                    json.sum_td_app_recv_count_rate = '0';
                }
                if (data[i].sum_td_app_recv_count === 0) {
                    json.sum_td_app_click_count_rate = '0';
                    json.sum_td_app_display_count_rate = '0';

                }

                list.push(json);
            }
        }

        return list;
    }

    // 导出  跳转到数据下载页面
    goPage(hash: string) {
        this.commonService.goPage(hash);
    }

    // 导出
    download(type: any) {
        if (type === 'pushOverview') {
            this.reportService.downLoadOver(this.productId, this.reportObj.segmentId).subscribe((response: any) => {
                if (response && response.code !== 200) {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        } else {
            this.reportService.downLoadTrend(this.productId, this.reportObj.segmentId).subscribe((response: any) => {
                if (response.code !== 200) {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        }
    }

    // 切换线图还是表格
    checkChart(type: any) {
        this.chartType = type;
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

    /**
     * 获取某一天 / 最近一天 的投放概览
     */
    getPushPromotionData(time: string) {
        const that = this;
        that.downloadJson = {
            type: 'segment',
            segmentType: 'push',
            segmentId: that.reportObj.segmentId,
            time: time,
            statRange: that.statRange
        };
        that.cycleSelect = time;
        this.getOverview(this.reportObj.segmentId, this.dateFormat(that.cycleSelect));
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

    /**
     * 获取累计的投放概览
     */
    getAllPushPromotionData() {
        this.downloadJson = {
            type: 'segment',
            segmentType: 'sms',
            segmentId: this.reportObj.segmentId,
            all: 1,
            statRange: this.statRange
        };
        this.cycleSelect = 'all';
        this.getOverview(this.reportObj.segmentId, '');
    }
}
