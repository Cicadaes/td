import {Component, Injector} from '@angular/core';
import {BaseComponent} from '../../../common/base-component';
import {CapacityPathService} from '../capacity-path.service';

@Component({
    selector: 'app-capacity-path-detail',
    templateUrl: './capacity-path-detail.component.html',
    styleUrls: ['./capacity-path-detail.component.less']
})
export class CapacityPathDetailComponent extends BaseComponent {
    queryParams: any = {
        order: 'user_count desc',
        pathLengthConditionOperator: '=',
        pathLengthCondition: '',
        pathLengthConditionStart: '',
        pathLengthConditionEnd: '',

        userCountCondition: '',
        userCountConditionStart: '',
        userCountConditionEnd: '',
        userCountConditionOperator: '=',

        conversionCondition: '',
        conversionConditionStart: '',
        conversionConditionEnd: '',
        conversionConditionOperator: '='
    };
    operatorOptions: any[] = [
        {key: '=', value: '等于'},
        {key: '<', value: '小于'},
        {key: '>', value: '大于'},
        {key: '<=', value: '小于等于'},
        {key: '>=', value: '大于等于'},
        {key: 'between', value: '区间'}
    ];
    orderOptions: any[] = [
        {key: 'user_count desc', value: '最高转化率'},
        {key: 'path_length asc', value: '最短路径'}
    ];
    _capacityPathId: any;
    _capacityPathDetails: any = {};
    _page: any = 1;
    _rows: any = 5;
    _totalPage: any;
    smartPathResults: any[] = [];
    isLoadingPathResult: boolean;

    constructor(private injector: Injector,
                private service: CapacityPathService) {
        super(injector);
        this.route.paramMap.subscribe((params: any) => {
            this._capacityPathId = params.get('id');
        });
        this.queryById();
    }

    queryById() {
        const params = {
            id: this._capacityPathId
        };
        this.service.queryById(params).subscribe((response: any) => {
            if (response) {
                this._capacityPathDetails = response.list || {};
            }
        });
    }

    _buildResults(rows: any[]) {
        if (rows && rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const resultDetails = row.resultDetail;
                if (resultDetails && resultDetails.length > 0) {
                    let time = 1;
                    let max = time * 5;
                    for (let j = 0; j < resultDetails.length; j++) {
                        const resultDetail = resultDetails[j];
                        resultDetail.style = {};
                        if (j === max - 1) {
                            resultDetail.style.position = 'left-last';
                        }
                        if (j === max) {
                            resultDetail.style.position = 'right-first';
                            time++;
                            max = time * 5;
                        }
                        if (time % 2 !== 0) {
                            resultDetail.style.float = 'left';
                        } else {
                            resultDetail.style.float = 'right';
                        }
                    }
                }
                this.smartPathResults.push(row);
            }
        }
    }

    buildParams(params, code) {
        const operator = params[code + 'Operator'];
        const start = params[code + 'Start'];
        const end = params[code + 'End'];
        let filterParams = {};
        filterParams = Object.assign(params, filterParams);
        if (operator === 'between') {
            if ((start || start === 0) && !end) {
                filterParams[code + 'Operator'] = '>=';
                filterParams[code] = start;
                filterParams[code + 'Start'] = '';
                filterParams[code + 'End'] = '';
            }
            if (!start && (end || end === 0)) {
                filterParams[code + 'Operator'] = '<=';
                filterParams[code] = end;
                filterParams[code + 'Start'] = '';
                filterParams[code + 'End'] = '';
            }
        }
        return filterParams;
    }

    buildFilterParams(params) {
        let filterParams = {};
        if (params) {
            const pathParams = this.buildParams(params, 'pathLengthCondition');
            filterParams = Object.assign({}, filterParams, pathParams);
            const userCountParams = this.buildParams(params, 'userCountCondition');
            filterParams = Object.assign({}, filterParams, userCountParams);
            const conversionParams = this.buildParams(params, 'conversionCondition');
            filterParams = Object.assign({}, filterParams, conversionParams);
        }
        return filterParams;
    }

    queryResult() {
        let queryParams = Object.assign({}, this.queryParams) || {};
        queryParams = this.buildFilterParams(queryParams);
        let params = {
            smartid: this._capacityPathId,
            page: this._page,
            rows: this._rows
        };
        params = Object.assign({}, params, queryParams);
        this.isLoadingPathResult = true;
        this.service.queryResult(params).subscribe((response: any) => {
            this.isLoadingPathResult = false;
            if (response) {
                this._totalPage = Math.ceil(response.total / this._rows);
                this._buildResults(response.rows);
            }
            this._page++;
        });
    }

    search() {
        this._page = 1;
        this.smartPathResults = [];
        this.queryResult();
    }

    loadingNextPage() {
        this.queryResult();
    }

    ngOnInit() {
        this.queryResult();
    }

    logChange() {
    }

}
