import {Component, Injector, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BehaviorAnalysisService} from './behavior-analysis.service';
import {TABLE_PAGE_SIZE_OPTIONS} from '../../common/config/page.size.config';
import {BaseComponent} from '../../common/base-component';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {debounceTime} from 'rxjs/operators/debounceTime';

@Component({
    selector: 'app-behavior-analysis',
    templateUrl: './behavior-analysis.component.html',
    styleUrls: ['./behavior-analysis.component.less'],
    providers: [BehaviorAnalysisService]
})
export class BehaviorAnalysisComponent extends BaseComponent implements OnInit {
    chartOption: any;                // 图表数据
    lineChartOption: any;            // 折线图表数据
    barChartOption: any;             // 柱状图表数据

    eventTypeList: any = [];   // 事件类型列表
    selecteEventType: string;   // 选中的事件类型
    eventTypePaging: any = {};  // 事件类型分页信息
    eventList: any = []; // 事件列表
    selectedEvent: string; // 选中的事件
    eventPaging: any = {
        page: 1,
        rows: 20,
        keyword: ''
    };  // 事件分页信息
    metricList: any = []; // 指标列表
    selectedMetric: number; // 选中的指标
    dimensionList: any = []; // 维度列表
    selectedDimension: string; // 选中的维度
    leftList: any = [];   // 等号左边的下拉框列表
    leftAllList: any = [];  // 等号左边的下拉框 所有数据
    filterMap: any = {};   // 等号左边的下拉框map数据 key为esfieldname value为displayType
    leftSelectfirst: string;
    rightList: any = [];  // 等号右边的下拉框列表
    rightPaging: any = {}; // 等号右边的下拉框列表的分页信息
    equalList: any = [];  // 等号判断下拉框列表
    moreSearchList: any = [];  // 更多搜索条件
    isLoadingRightList: boolean;

    eventMap: any = {};
    metricMap: any = {};

    tableTitleList: any = [];

    dateRange: any = [];   // 时间
    dateRangeOld: any;

    detailData: any = [];            // 数据明细表格
    detailDataTableLoading = false;   // 数据明细表格Loading  TODO？？？
    moreSearchFlag = false;          // 显示更多筛选
    isVisible = false;               // 保存用户分群弹框flag
    // 分页数据
    _current = 1;                   // 当前页
    _pageSize = 10;                 // 每页条数
    _total = 1;                     // 数据总量

    pageSizeOptions: any;

    isFirst: boolean;
    isMoreEventTypeList: boolean;
    isMoreEventList: boolean;

    clausesList: any[];
    _isQueringData: boolean;
    _seriesData: boolean;

    _containerStyle = {
        height: '',
        overflow: 'auto'
    };

    constructor(private fb: FormBuilder,
                public behaviorAnalysisService: BehaviorAnalysisService,
                private injector: Injector) {

        super(injector);
        this.initRouterList('行为分析');

        this.pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;

        const that = this;
        that.isFirst = true;
        that.isMoreEventTypeList = true;
        that.isMoreEventList = true;
        const tempTime = new Date();
        const beforeTime = new Date(tempTime.getTime() - 6 * 24 * 3600 * 1000);
        // const beforeTime = new Date(tempTime.getFullYear() + '-' + (tempTime.getMonth() + 1) + '-' + (tempTime.getDate() - 6) + ' ' +
        //     tempTime.getHours() + ':' + tempTime.getMinutes() + ':' + tempTime.getSeconds());
        that.dateRange.push(beforeTime);
        that.dateRange.push(tempTime);
        that.dateRangeOld = that.dateRange;
        that.eventTypePaging = {
            page: 1,
            rows: 20
        };
        this.clausesList = [{
            value: 'and',
            label: '且'
        }, {
            value: 'or',
            label: '或'
        }];
        that.metricList = [
            {
                name: '人数',
                value: 1
            },
            {
                name: '次数',
                value: 2
            },
            {
                name: '人均次数',
                value: 3
            }
        ];
        that.metricMap = {
            1: '人数',
            2: '次数',
            3: '人均次数'
        };
        that.selectedMetric = that.metricList[0].value;
        that.equalList = [{
            name: '等于',
            value: '='
        }, {
            name: '不等于',
            value: '!='
        }];
        that.lineChartOption = {
            grid: {
                left: 80,
                right: 20,
                top: 38,
                bottom: 22,
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(23, 35, 61,0.85)',
                padding: 15,
                extraCssText: 'height: 90px;\n' +
                '    line-height: 30px;\n' +
                '    padding: 15px 25px;\n' +
                '    font-size: 12px;',
                textStyle: {
                    color: '#ffffff',
                    decoration: 'none',
                    fontFamily: '"HelveticaNeue", "PingFangSC", "微软雅黑"',
                    fontSize: 12,
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    lineHeight: 50
                },

                /*formatter: '{b}<br/><br/>' +
                 '<span style="line-height: 10px;\n' +
                 '    display: inline-block;\n' +
                 '    height: 6px;\n' +
                 '    width: 6px;\n' +
                 '    border-radius: 50%;\n' +
                 '    margin-right: 8px;\n' +
                 '    margin-bottom: 1px;\n' +
                 '    background: #3591f0;1">' +
                 '</span>' +
                 '{a}' +
                 '<span style="margin-left:20px;">{c}</span>',*/
                /*formatter: function (params, ticket, callback) {
                 console.dir([params, ticket, callback]);
                 return callback;
                 }*/
                formatter: function (params, ticket, callback) {
                    let res = 'Function formatter : <br/>' + params[0].name;
                    for (let i = 0, l = params.length; i < l; i++) {
                        res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
                    }
                    setTimeout(function () {
                        // 仅为了模拟异步回调
                        callback(ticket, res);
                    }, 1000);
                    return 'loading';
                }
            },
            legend: {
                right: 0,
                top: 0,
                itemWidth: 10,
                itemHeight: 10,
                textStype: {
                    fontSize: 12,
                    color: '#676c7a'
                },
                selectedMode: false,
                data: []
            },
            color: [
                '#3591f0'
            ],
            xAxis: [
                {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            width: 2,
                            color: '#dddee1'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            width: 1,
                            color: '#dddee1'
                        }
                    },
                    axisLabel: {
                        color: '#80848f'
                    },
                    splitLine: {
                        lineStyle: {
                            width: 1,
                            color: '#e9eaec'
                        }
                    },
                    boundaryGap: true,
                    data: []
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#80848f'
                    },
                    formatter: function ($v, $i) {
                        return ($v / 10) + 'K';
                    }
                }
            ],
            series: []
        };

        that.barChartOption = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(23, 35, 61,0.85)',
                padding: 15,
                extraCssText: 'height: 90px;\n' +
                '    line-height: 30px;\n' +
                '    padding: 15px 25px;\n' +
                '    font-size: 12px;',
                textStyle: {
                    color: '#ffffff',
                    decoration: 'none',
                    fontFamily: '"HelveticaNeue", "PingFangSC", "微软雅黑"',
                    fontSize: 12,
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    lineHeight: 50
                },
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                right: 0,
                top: 0,
                itemWidth: 10,
                itemHeight: 10,
                textStype: {
                    fontSize: 12,
                    color: '#676c7a'
                },
                selectedMode: false,
                data: []
            },
            grid: {
                left: 200,
                right: 20,
                top: 38,
                bottom: 22,
            },
            color: [
                '#3591f0'
            ],
            xAxis: [
                {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#80848f'
                    },
                    formatter: function ($v, $i) {
                        return ($v / 10) + 'K';
                    }
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: '#dddee1'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            width: 1,
                            color: '#dddee1'
                        }
                    },
                    axisLabel: {
                        color: '#80848f'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#e9eaec'
                        }
                    },
                    boundaryGap: true,
                    data: []
                }
            ],
            series: []
        };
    }

    ngOnInit() {
        this.listenerWindownResize();
        const that = this;
        // 获取按后面下拉框列表
        that.behaviorAnalysisService.getProvince().subscribe((data: any) => {
            if (data.success) {
                for (const key in data.list) {
                    if (data.list.hasOwnProperty(key)) {
                        const json = {
                            key: key,
                            value: data.list[key]
                        };
                        if (!that.selectedDimension) {
                            that.selectedDimension = 'all';
                        }
                        that.dimensionList.push(json);
                        that.leftAllList = that.leftAllList.concat(data.list[key]);
                    }
                }
            }
            that.getEventTypeList(1);
        });
    }

    // 获取用户后面下拉框列表
    getProfilemetasList() {
        const that = this;
        that.behaviorAnalysisService.getProfilemetasList(+that.selectedEvent).subscribe((data: any) => {
            if (data.success) {
                that.leftList = [];
                that.filterMap = {};
                for (const key in data.list) {
                    if (data.list.hasOwnProperty(key)) {
                        const json = {
                            key: key,
                            value: data.list[key]
                        };
                        if (json.value && json.value.length > 0) {
                            for (let i = 0; i < json.value.length; i++) {
                                json.value[i].groupKey = key;
                            }
                        }
                        that.leftList.push(json);
                        const tmpLength = data.list[key].length;
                        for (let i = 0; i < tmpLength; i++) {
                            that.filterMap[data.list[key][i].esfieldname] = data.list[key][i].displayType;
                        }
                    }
                }
                for (let i = 0; i < that.moreSearchList.length; i++) {
                    if (i === 0) {
                        that.moreSearchList[i] = {clauses: 'and', filter: that.leftList[0].value[0]};
                    } else {
                        that.moreSearchList[i] = {clauses: 'or', filter: that.leftList[0].value[0]};
                    }
                    that.getRightList(i, that.moreSearchList[i]);
                }
            }
        });
    }

    // 获取最后一个下拉框列表
    getRightList(index: number, item: any) {
        const that = this;
        let page = item.page;
        if (!page) {
            item.page = 1;
            page = 1;
        }
        const tempJson = {
            page: page,
            rows: that.rightPaging.rows || 20,
            sort: 'dic_item_alias',
            order: 'asc',
            searchName: item.searchName || '',
            dicKey: that.moreSearchList[index].filter['esfieldname']
        };
        if (that.isLoadingRightList) {
            return false;
        }
        that.moreSearchList[index]['rightList'] = that.moreSearchList[index]['rightList'] || [];
        that.isLoadingRightList = true;
        that.behaviorAnalysisService.getEventList(tempJson).subscribe((data: any) => {
            that.isLoadingRightList = false;
            if (data.success) {
                item.page++;
                for (let i = 0; i < data.list.length; i++) {
                    const option = that._getOptionById(data.list[i].id, that.moreSearchList[index]['rightList']);
                    if (!option) {
                        const json = {value: data.list[i].id, name: data.list[i].dicItemAlias};
                        that.moreSearchList[index]['rightList'].push(json);
                    }
                }
            }
        }, (err: any) => {
            that.isLoadingRightList = false;
        });
    }
    _getOptionById (id: any , list: any[]) {
        let option;
        if (id && list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (id === list[i].id) {
                    option = list[i];
                    break;
                }
            }
        }
        return option;
    }

    getEventTypeList(page?: number) {
        const that = this;
        if (!that.isMoreEventTypeList) {
            return;
        }
        const tmpEventJson = {
            page: page || that.eventTypePaging.page + 1 || 1,
            rows: that.eventTypePaging.rows || 30,
            dicKey: 'eventtype',
            order: 'asc'
        };
        that.behaviorAnalysisService.getEventList(tmpEventJson).subscribe((result: any) => {
            if (result.success) {
                if (that.isFirst) {
                    that.eventTypeList = result.list;
                    that.selecteEventType = result.list[0] && result.list[0].id;

                    // 获取触发下拉框列表
                    that.eventList = [];
                    that.eventPaging.page = 1;
                    if (that.selecteEventType) {
                        that.getEventList(1, false);
                    } else {
                        that.search();
                    }
                } else {
                    that.eventTypeList.push(result.list);
                }
                if (that.eventTypeList.length <= result.total) {
                    that.isMoreEventTypeList = false;
                }
            }
        });
    }

    eventTypeChange(data: any) {
        const that = this;
        this.moreSearchFlag = false;
        that.eventList = [];
        that.isMoreEventList = true;
        that.isFirst = true;
        that.eventPaging.page = 1;
        that.getEventList(1, false);
    }

    onSearchEvent(value: any) {
        this.eventPaging.page = 1;
        this.eventPaging.keyword = value || '';
        this.eventList = [];
        this.isMoreEventList = true;
        this.getEventList(1, true);
    }

    getEventList(page?: number, isSearch?: boolean) {
        const that = this;
        if (!that.isMoreEventList) {
            return;
        }
        if(isSearch){
            that.eventList = [];
        }
       
        const tmpJson = {
            page: page || that.eventPaging.page || 1,
            rows: that.eventPaging.rows || 10,
            dicKey: 'eventid',
            parentId: that.selecteEventType,
            searchName: that.eventPaging.keyword || ''
        };
        that.behaviorAnalysisService.getEventList(tmpJson).subscribe((data: any) => {
            that.eventPaging.page = tmpJson.page + 1;
            if (data.success) {
                if(data.list.length == 0){
                    that.isMoreEventList = false;
                }else {
                    for (let i = 0; i < data.list.length; i++) {
                        const json = {
                            value: data.list[i].id,
                            name: data.list[i].dicItemAlias,
                            smartEvent: data.list[i].smartEvent
                        };
                        that.eventMap[data.list[i].id] = data.list[i].dicItemAlias;
                        that.eventList.push(json);
                    }
                }

                if (!isSearch) {
                    that.selectedEvent = '';
                    if (that.eventList.length > 0) {
                        that.selectedEvent = that.eventList[0].value || '';
                    }
                    if (that.isFirst) {
                        that.search();
                        that.isFirst = false;
                    }
                    that.getProfilemetasList();
                }
            }
        });
    }

    changeEvent(e: any, index: number, item: any) {
        item.page = 1;
        const that = this;
        that.moreSearchList[index].filter = e;
        delete that.moreSearchList[index].values;
        delete that.moreSearchList[index].operator;
        delete that.moreSearchList[index].first;
        delete that.moreSearchList[index].second;
        // that.selectedEvent = e;
        that.moreSearchList[index].operator = 'eq';
        that.moreSearchList[index]['rightList'] = [];
        that.getRightList(index, item);
    }
    onSearchEventAttr(value: any, index: number, item: any) {
        item.searchName = value || '';
        item.page = 1;
        this.moreSearchList[index]['rightList'] = [];
        this.getRightList(index, item);
    }

    loadMore(index: number, item: any) {
        this.getRightList(index, item);
    }

    changeFilter(data: any) {
        data.operator = '=';
        data.values = null;
    }

    // 更多筛选
    moreSearch() {
        this.moreSearchFlag = !this.moreSearchFlag;
        if (this.moreSearchFlag) {
            this.moreSearchList = [{
                clauses: 'and',
                filter: this.leftList[0] ? this.leftList[0].value[0] : '',
                operator: 'eq',
                rightList: []
            }];
            this.getRightList(0, this.moreSearchList);
        } else {
            this.search();
        }
        this.calContainerStyle();
    }

    timeChange(e: any) {
        const that = this;
        const days = that.globals.getDateDays(that.dateRange[0], that.dateRange[1]);
        if (days > 365) {
            setTimeout(() => {
                that.dateRange = that.dateRangeOld;
            }, 100);
            that.notification.create(
                'warning',
                '时间范围不能超过一年',
                ''
            );
            return false;
        } else {
            that.dateRangeOld = that.dateRange;
        }
        this.search();
    }

    // 添加更多搜索条件
    add() {
        const that = this;
        that.moreSearchList.push({
            clauses: 'and',
            filter: that.leftList[0] ? that.leftList[0].value[0] : '',
            operator: 'eq',
            rightList: []
        });
        that.getRightList(that.moreSearchList.length - 1, that.moreSearchList[that.moreSearchList.length - 1]);
        this.calContainerStyle();
    }

    removeItem(index: number) {
        const that = this;
        that.moreSearchList.splice(index, 1);
        if (that.moreSearchList.length === 0) {
            that.moreSearchFlag = !that.moreSearchFlag;
            that.search();
        }
        this.calContainerStyle();
    }

    formatterInputNumber(value: any, item: any) {
        if (value && item && item.filter) {
            if (item.filter.displayType === 'Integer' && value.toString().indexOf('.') !== -1) {
                setTimeout(() => {
                    item.values = parseInt(value.toString(), 10);
                }, 10);
            }
        }
        console.dir([value, item]);
    }

    checkEventFilter(filter: any) {
        let eventFilter = false;
        if (filter && filter['groupKey'] && filter['groupKey'] === '事件属性') {
            eventFilter = true;
        }
        return eventFilter;
    }

    rebuildQueryFilters(list: any[]) {
        const queryFilters = [];
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const filter = {
                    clauses: item.clauses,
                    filter: '',
                    operator: item.operator,
                    values: [],
                    eventFilter: false,
                    displayType: ''
                };
                if (item.filter) {
                    filter.eventFilter = this.checkEventFilter(item.filter);
                    filter.displayType = item.filter['displayType'];
                    filter.filter = item.filter['esfieldname'];

                    if (item.filter.displayType === 'Date') {
                        const temp = [];
                        if (item.operator === 'range') {
                            if (item.values && item.values.length > 1) {
                                temp[0] = this.globals.getDateZeroTime(item.values[0]);
                                temp[1] = this.globals.getDateZeroTime(item.values[1]);
                            }
                        } else {
                            if (item.value) {
                                temp.push(this.globals.getDateZeroTime(item.value));
                            }
                        }
                        filter.values = temp;
                    } else if (item.filter.displayType === 'Integer' || item.filter.displayType === 'Double') {
                        const temp = [];
                        if (item.operator === 'range') {
                            let first = null;
                            if (item.first || item.first === 0) {
                                first = item.first;
                            }
                            let second = null;
                            if (item.second || item.second === 0) {
                                second = item.second;
                            }
                            temp.push(first);
                            temp.push(second);
                        } else {
                            if (item.values || item.values === 0) {
                                temp.push(item.values);
                            }
                        }
                        filter.values = temp;
                    } else if (item.filter.displayType === 'Tag') {
                        filter.values = item.values || [];
                    } else if (item.filter.displayType === 'String') {
                        if (item.values) {
                            filter.values.push(item.values);
                        }
                    }
                }
                queryFilters.push(filter);
            }
        }
        return queryFilters;
    }

    search(e?: any, type?: any) {
        const that = this;
        const json = {
            productId: that.productId
        };
        if (type === 'event') {
            that.moreSearchFlag = false;
            that.selectedEvent = e;
            that.getProfilemetasList();
        } else if (type === 'metric') {
            that.selectedMetric = e;
        } else if (type === 'dimension') {
            that.selectedDimension = e;
        }
        json['eventTypeId'] = that.selecteEventType;
        json['startDate'] = that.formatTime(that.dateRange[0]);
        json['endDate'] = that.formatTime(that.dateRange[1]);
        json['eventId'] = that.selectedEvent;
        json['metricCode'] = that.selectedMetric;
        json['aggregationFiled'] = that.selectedDimension;
        if (that.moreSearchFlag) {
            json['queryFilters'] = that.rebuildQueryFilters(that.moreSearchList);
        }
        that._isQueringData = true;
        that.behaviorAnalysisService.search(json).subscribe((data: any) => {
            that._isQueringData = false;
            if (data.success) {
                if (!data.list || !data.list.chart || !data.list.table) {
                    return;
                }
                const seriesData = [];
                const xAxisData = [];
                const legendData = [];
                const length = data.list && data.list.chart && data.list.chart.length;
                const tmpData = data.list.chart;
                if (that.selectedDimension === 'all') {
                    for (let i = 0; i < length; i++) {
                        xAxisData.push(that.stringToDate(tmpData[i][0]));
                        seriesData.push(tmpData[i][1]);
                        legendData.push(that.metricMap[that.selectedMetric]);
                    }
                } else {
                    for (let i = length - 1; i >= 0; i--) {
                        xAxisData.push(tmpData[i][0]);
                        seriesData.push(tmpData[i][1]);
                        legendData.push(that.metricMap[that.selectedMetric]);
                    }
                }
                if(seriesData.length < 1){
                    that._seriesData = true;
                }else {
                    that._seriesData = false;
                }
                const tempSeries = [];
                const tempJson = {
                    name: that.metricMap[that.selectedMetric],
                    type: 'line',
                    showSymbol: false,
                    smooth: true,
                    silent: true,
                    data: seriesData
                };
                that.detailData = data.list && data.list.table;
                if (that.selectedDimension === 'all') {
                    tempSeries.push(tempJson);
                    that.tableTitleList[0] = '时间';
                    that.lineChartOption.legend.data = legendData;
                    that.lineChartOption.xAxis[0].data = xAxisData;
                    that.lineChartOption.series = tempSeries;
                    that.chartOption = JSON.parse(JSON.stringify(that.lineChartOption));
                    for (let i = 0; i < that.detailData.length; i++) {
                        that.detailData[i][0] = that.stringToDate(that.detailData[i][0]);
                    }
                } else {
                    tempJson.type = 'bar';
                    tempSeries.push(tempJson);
                    that.tableTitleList[0] = '时间';
                    that.barChartOption.legend.data = legendData;
                    that.barChartOption.yAxis[0].data = xAxisData;
                    that.barChartOption.series = tempSeries;
                    that.chartOption = JSON.parse(JSON.stringify(that.barChartOption));
                    for (let i = 0; i < that.leftAllList.length; i++) {
                        if (that.selectedDimension === that.leftAllList[i].esfieldname) {
                            that.tableTitleList[0] = that.leftAllList[i].displayname;
                            break;
                        }
                    }
                }
                that.tableTitleList[1] = that.metricMap[that.selectedMetric];
            }
        }, (err: any) => {
            that._isQueringData = false;
        });
    }

    downloadData() {
        const that = this;
        const json = {
            productId: that.productId
        };
        json['eventTypeId'] = that.selecteEventType;
        json['startDate'] = that.formatTime(that.dateRange[0]);
        json['endDate'] = that.formatTime(that.dateRange[1]);
        json['eventId'] = that.selectedEvent;
        json['metricCode'] = that.selectedMetric;
        json['aggregationFiled'] = that.selectedDimension;
        if (that.moreSearchFlag) {
            json['queryFilters'] = that.rebuildQueryFilters(that.moreSearchList);
        }
        const dateRangeStr = this.globals.dateFormat(that.dateRange[0], '') + '至' + this.globals.dateFormat(that.dateRange[1], '');
        const data = {
            productId: that.productId,
            type: 'behavior',
            title: `基础分析-行为分析-明细数据-数据导出-${dateRangeStr}`,
            param: json
        };
        that.behaviorAnalysisService.download(data).subscribe(() => {
        });
    }

    formatTime(time: any) {
        const date = new Date(time);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1) + '';
        let day = date.getDate() + '';
        if (+month < 10) {
            month = '0' + month;
        }
        if (+day < 10) {
            day = '0' + day;
        }
        return year + month + day;
    }

    stringToDate(s: string) {
        if (s.length !== 8) {
            return '';
        }
        return s.substring(0, 4) + '-' + s.substring(4, 6) + '-' + s.substring(6);
    }

    stringToDate2(s: string) {
        if (s.length !== 8) {
            return '';
        }
        return s.substring(4, 6) + '/' + s.substring(6);
    }

    // 日期处理
    disabledDate = (current: Date): boolean => {
        // Can not select days before today and today
        const now = new Date();
        return current > now;
    }

    goPage(hash: string) {
        this.commonService.goPage(hash);
    }

    calContainerStyle(): void {
        setTimeout(() => {
//            const filterHeader = document.getElementById('filter-header');
            const maxHeight = window.innerHeight - 70;
            this._containerStyle = {
                height: maxHeight.toString() + 'px',
                overflow: 'auto'
            };
        }, 200);
    }

    listenerWindownResize() {
        this.calContainerStyle();
        fromEvent(window, 'resize').pipe(
            debounceTime(100)
        ).subscribe((event) => {
            this.calContainerStyle();
        });
    }
}
