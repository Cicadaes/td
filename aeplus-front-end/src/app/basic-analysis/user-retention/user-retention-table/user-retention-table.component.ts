import {Component, Input, SimpleChanges, Injector, OnInit, OnChanges} from '@angular/core';
import {NzModalRef} from 'ng-cosmos-ui';
import {UserRetentionService} from '../user-retention.service';
import {BaseComponent} from '../../../common/base-component';

@Component({
    selector: 'app-user-retention-table',
    templateUrl: './user-retention-table.component.html',
    styleUrls: ['./user-retention-table.component.less']
})
export class UserRetentionTableComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() filter: any;
    confirmModal: NzModalRef;
    pageIndex = 1;
    pageSize = 100;
    total = 1;
    dataSet = [];
    loading = true;
    sortValue = null;
    sortKey = null;

    _isShowUserAttributeAddDialog: boolean;
    _currentUserAttribute: any;

    searchGenderList: string[] = [];
    _moreSearchFieldArray: any[] = [];
    _queryParam: any = {};
    _granularity = 'day';
    _granularityLabel = '日';
    _filter: any;
    _tdStyle: any;
    urlParams: any;

    sort(sort: { key: string, value: string }): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    constructor(private service: UserRetentionService,
                private injector: Injector) {
        super(injector);
        this.urlParams = {};
    }

    goPage(hash: string) {
        this.commonService.goPage(hash);
    }

    downloadData() {
        const param = this._queryParam || {};
        const dateRange = this.globals.dateFormat(this._filter.dateRange[0], '') + '至' +
            this.globals.dateFormat(this._filter.dateRange[1], '');
        param.title = '基础分析-留存分析-留存率-数据导出-' + dateRange;
        this.service.download(param).subscribe((response: any) => {
        });
    }

    changeGranularity(value: any) {
        if (value === 'day') {
            this._granularityLabel = '日';
        } else if (value === 'week') {
            this._granularityLabel = '周';
        } else if (value === 'month') {
            this._granularityLabel = '月';
        }
        this._buildQueryParam();
        this.searchData(true);
    }

    searchData(reset: boolean = false): void {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const param = this._queryParam || {};
        this.service.query(param).subscribe((response: any) => {
            this.loading = false;
            if (response && response.data) {
                this.total = response.total;
                this.dataSet = response.data;
                this._buildTdStyle(response);
            }
        });
    }

    _getNumArea(response) {
        let area = {
            one: 100,
            two: 0,
            three: 0,
            four: 0,
            five: 0
        };
        if (response && response.maxNum && response.minNum) {
            const average = (parseFloat(response.maxNum) - parseFloat(response.minNum)) / 5;
            area = {
                one: average * 5,
                two: average * 4,
                three: average * 3,
                four: average * 2,
                five: average * 1
            };
        }
        return area;
    }

    _buildTdStyle(response) {
        this._tdStyle = {};
        const area = this._getNumArea(response);
        if (this.dataSet && this.dataSet.length > 0) {
            for (let i = 0; i < this.dataSet.length; i++) {
                const data = this.dataSet[i];
                const trKey = data['starttime_day'];
                this._tdStyle[trKey] = {};
                for (const key in data) {
                    const val = data[key];
                    let background;
                    let color;
                    if (key !== 'starttime_day' && key !== 'keep') {
                        if (val && val > area.two) {
                            background = '#3B9DF7';
                            color = '#fff';
                        } else if (val && val > area.three) {
                            background = '#5FB0FF';
                            color = '#fff';
                        } else if (val && val > area.four) {
                            background = '#81C1FE';
                            color = '#fff';
                        } else if (val && val > area.five) {
                            background = '#C2E1FF';
                            color = '#17233D';
                        } else if (val && val >= 0) {
                            background = '#DBEEFF';
                            color = '#17233D';
                        } else {
                            background = 'none';
                            color = '#17233D';
                        }
                        this._tdStyle[trKey][key] = {
                            background: background,
                            color: color
                        };
                    }
                }
            }
        }
    }

    _buildQueryParam() {
        const eventId = this._filter.event;
        this._queryParam = {
            'total': false,
            'sumMetric': false,
            'limit': {
                'page': 1,
                'pageSize': 999
            },
            'orderBy': [],
            'interval': {
                'granularity': this._granularity,
                'dateFormate': null,
                'field': 'starttime_day'
            },
            'metrics': [{
                'aggregator': 'sum',
                'alias': 'keep',
                'field': 'keep'
            }],
            'filters': [{
                'type': 'or',
                'condition': [
                    {
                        'field': '_cube_table_code',
                        'operator': '=',
                        'value': 'KEEP'
                    }
                ]
            }, {
                'condition': [{
                    'operator': '>=',
                    'value': this._filter.dateRange[0],
                    'field': 'starttime_day'
                }, {
                    'operator': '<=',
                    'value': this._filter.dateRange[1],
                    'field': 'starttime_day'
                }],
                'type': 'and'
            },
                {
                    'condition': [{
                        'operator': '=',
                        'value': this._filter.user,
                        'field': '_td_user_type'
                    }],
                    'type': 'and'
                },
                {
                    'condition': [{
                        'operator': '=',
                        'value': eventId,
                        'field': 'eventid'
                    }],
                    'type': 'and'
                }, {
                    'condition': [{
                        'operator': '=',
                        'value': this.productId,
                        'field': 'productid'
                    }],
                    'type': 'and'
                }],
            'groupBy': [{
                'field': 'starttime_day'
            }],
            'dimensions': [{
                'aggregator': null,
                'alias': '日期',
                'field': 'starttime_day'
            }]
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.filter) {
            this._filter = changes.filter.currentValue;
            if (this._filter) {
                /*                this._granularity = 'day';
                                this._granularityLabel = '日';*/
                this._buildQueryParam();
                this.searchData(true);
            }
        }
    }

    ngOnInit(): void {
    }
}
