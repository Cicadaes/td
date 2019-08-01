import * as extend from 'extend';
import {Component, Input, Output, EventEmitter, OnInit, Injector} from '@angular/core';
import {CommonService} from '../../../common/services/common.service';
import {BaseComponent} from '../../../common/base-component';

let $scope;

@Component({
    selector: 'app-behavior-trajectory',
    templateUrl: './behavior-trajectory.component.html',
    styleUrls: ['./behavior-trajectory.component.less']
})

export class BehaviorTrajectoryComponent extends BaseComponent implements OnInit {
    nodata = false;

    showChartData = true;
    _dateRangeOld: any;
    public vm = {

        header: {
            title: '行为轨迹'
        },

        condition: {
            dateRange: []
        },

        chart: {
            title: '行为统计',
            subtitle: 'TOP10',
            data: [],
            option: [],
            loading: false,
            trajectoryList: [],
            trajectoryListTop: '',
            trajectoryListBottom: '',
            trajectoryListMore: '显示更多',
            trajectoryListLoading: false,
            trajectoryDetail: [],
            trajectoryDetailTitle: '行为详情',
            trajectoryDetailColon: '：',
            trajectoryDetailSource: null,
            trajectoryDetailLoading: false,
            trajectoryMore: false
        }

    };

    public chartOption = {

        color: ['#2D8CF0', '#2DE2C5', '#FCC45F', '#FF8454', '#DB425A', '#34508C', '#5BB6FD', '#56D08B', '#B3E768', '#71808F'],

        // legend : {
        // right                   : '10%',
        // y                       : 'center',
        // orient                  : 'vertical',
        // itemWidth               : 10,
        // itemHeight              : 10,
        // itemGap                 : 16,
        // selectedMode            : false,
        // textStype               : {color : '#676c7a', fontSize : 12},
        // data                    : []
        // },

        tooltip: {
            formatter: this.handlerChartTooltip,
            textStyle: {color: '#ffffff', fontSize: 12}
        },

        series: [
            {
                label: {
                    position: 'center',
                    formatter: '',
                    rich: {
                        text: {color: '#1c2438', fontSize: 32, lineHeight: 50},
                        subtext: {color: '#5a616f', fontSize: 12, lineHeight: 12}
                    }
                },
                type: 'pie',
                center: ['50%', '50%'], // 42.5
                radius: ['42%', '42%'],
                itemStyle: {normal: {labelLine: {show: false}}},
                cursor: 'default',
                data: []
            },
            {
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['36%', '48%'],
                itemStyle: {normal: {labelLine: {show: false}, label: {show: false}}},
                cursor: 'default',
                data: []
            },
        ]

    };

    @Input()
    private set dateRange($value: any) {

        const vm = $scope.vm;

        if ($value && $value.length) {

            const date1 = $value[1];
            const date2 = $value[0];

            vm.condition.dateRange = extend(true, [], $value);
            this._dateRangeOld = vm.condition.dateRange;
            vm.chart.trajectoryListTop = this.commonService.getDateStr(date1);
            vm.chart.trajectoryListBottom = this.commonService.getDateStr(date2);

        }

    }

    @Input()
    private set trajectoryList($value: any) {

        const vm = $scope.vm;

        if ($value && $value.length) {

            // 如果是行为轨迹初始值
            // 那么把 TOP 赋值
            //
            if (vm.chart.trajectoryList && !vm.chart.trajectoryList.length) {
                vm.chart.trajectoryListTop = $value[0].date;
            }
            this.nodata = false;
        } else {
            this.nodata = true;
        }

        vm.chart.trajectoryList = extend(true, [], $value);
        vm.chart.trajectoryListLoading = false;

    }

    @Input()
    private set trajectoryDetail($value: any) {

        const vm = $scope.vm;

        if ($value && $value.length) {

            vm.chart.trajectoryDetail = extend(true, [], $value);
            vm.chart.trajectoryDetailLoading = false;

        }

    }

    @Input()
    private set trajectoryMore($value: any) {

        const vm = $scope.vm;

        vm.chart.trajectoryMore = $value;

    }

    @Input()
    private set chartData($value: any) {

        const vm = $scope.vm;
        if ($value && $value.length) {
            vm.chart.data = $value;
            vm.chart.loading = false;
            $scope.handlerChartOption();
        }
    }

    @Output() private $DateChange = new EventEmitter();

    @Output() private $TrajectoryDetail = new EventEmitter();

    @Output() private $TrajectoryMore = new EventEmitter();

    constructor(protected commonService: CommonService,
                private injector: Injector) {
        super(injector);
        $scope = this;
    }

    handlerChartOption() {

        const vm = $scope.vm, chartOption = $scope.chartOption;
        const b = vm.chart.data;
        // for (a = [], i = 0; b = vm.chart.data[i]; i++) {
        //
        // a.push(b);
        //
        // }
        //
        // chartOption.legend.data                 = a;

        let result = vm.chart.data;
        if (vm.chart.data && vm.chart.data.length > 0) {
            result = vm.chart.data.slice(0, 1);
        }

        chartOption.series[0].data = result;
        if (b && b.length > 0) {
            let name = b[0].name || '';
            if (name && name.length > 10) {
                name = name.substring(0, 10) + '...';
            }
            chartOption.series[0].label.formatter = b.length > 0 ? '{text|' + b[0].value + '%}\n{subtext|' + name + '}' : '';
            chartOption.series[1].data = b;
        }

        b && b.length === 0 ? this.showChartData = false : this.showChartData = true;

        vm.chart.option = extend(true, {}, chartOption);
    }

    handlerChartTooltip($data: any) {

        return `
                <style>

                    .a5b1c668-fc10-45ea-b8ef-7ab30a6eddd9 .name {
                        display: block;
                    }

                    .a5b1c668-fc10-45ea-b8ef-7ab30a6eddd9 .name, .a5b1c668-fc10-45ea-b8ef-7ab30a6eddd9 .value, .a5b1c668-fc10-45ea-b8ef-7ab30a6eddd9 .valueByCount {
                        padding: 8px;
                        font-size: 12px;
                        line-height: 12px;
                        color: #ffffff;
                    }

                    .a5b1c668-fc10-45ea-b8ef-7ab30a6eddd9 .value, .a5b1c668-fc10-45ea-b8ef-7ab30a6eddd9 .valueByCount {
                        display: inline-block;
                    }

                    .a5b1c668-fc10-45ea-b8ef-7ab30a6eddd9 .value:before {
                        content: "";
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        margin-right: 6px;
                        border-radius: 6px;
                        background-color: ${$data.color};
                    }

                </style>

                <div class="a5b1c668-fc10-45ea-b8ef-7ab30a6eddd9">
                    <span class="name">${$data.data.name}</span>
                    <span class="value">${$data.data.value}%</span>
                    <span class="valueByCount">行为数 ${$data.data.valueByCount}</span>
                </div>
            `;

    }

    handlerTrajectoryList_scroll($event: any) {

        const vm = $scope.vm;

        // 1. 行高 36 像素
        const i = Math.round($event.srcElement.scrollTop / 36);

        // 2. 因为数组下标以 0 开始，所以不用 +1
        if (vm.chart.trajectoryList && vm.chart.trajectoryList.length > 0) {
            vm.chart.trajectoryListTop = vm.chart.trajectoryList[i].date;
        }
    }

    // 用户档案-行为轨迹-显示更多
    handlerTrajectoryList_more() {

        const vm = $scope.vm;

        $scope.$TrajectoryMore.emit(), vm.chart.trajectoryListLoading = true;

    }

    handlerTrajectoryDetail_show($item: any) {

        const vm = $scope.vm;

        $scope.$TrajectoryDetail.emit($item), vm.chart.trajectoryDetailSource = $item, vm.chart.trajectoryDetailLoading = true;

    }

    handlerTrajectoryDetail_close() {

        const vm = $scope.vm;

        if (vm.chart.trajectoryDetail) {
            vm.chart.trajectoryDetail = [], vm.chart.trajectoryDetailSource = null, vm.chart.trajectoryDetailLoading = false;
        }

    }

    handlerDateChange($date: any) {
        const vm = $scope.vm;
        const days = this.globals.getDateDays(vm.condition.dateRange[0], vm.condition.dateRange[1]);
        let dateChangeData = {
            loading: true,
            dateRange: $date
        };
        if (days > 365) {
            setTimeout(() => {
                dateChangeData = {
                    loading: false,
                    dateRange: this._dateRangeOld
                };
                $scope.$DateChange.emit(dateChangeData);
            }, 100);
            this.message.create('warning', '时间范围不能超过一年');
            return false;
        }
        $scope.handlerTrajectoryDetail_close();
        $scope.$DateChange.emit(dateChangeData);
        vm.chart.trajectoryListLoading = true;
        vm.chart.loading = true;

    }

    handlerDateDisabled($date: any) {

        return (new Date()).getTime() <= $date.getTime();

    }

}
