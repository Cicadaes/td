import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {UserInsightService} from '../user-insight.service';
import {TABLE_PAGE_SIZE_OPTIONS} from '../../../common/config/page.size.config';
import {BaseComponent} from '../../../common/base-component';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { debounceTime } from 'rxjs/operators/debounceTime';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.less'],
})
export class UserListComponent extends BaseComponent implements OnInit, OnChanges {
    boolFiltersLength: any;                             // 选择的高级筛选条件个数
    userListData: any = [];                             // 数据明细表格
    userListDataTableLoading = true;                    // 数据明细表格Loading
    parmas: any;                                        // 查询数据明细数据参数
    // 分页数据
    _current = 1;                                       // 当前页
    _pageSize = 10;                                     // 每页条数
    _total = 0;                                         // 数据总量
    // 搜索数据
    serachParam: string;                                // 搜索值
    searchFlag = false;                                 // 是否显示高级搜索
    boolFilters: any;                                   // 查询表格高级收搜参数
    tableHead: any = [];                                // 表头数据
    tableData: any = [];                                // 表格数据

    pageSizeOptions: any[] = TABLE_PAGE_SIZE_OPTIONS;   // Table页数选择器可选值
    styleObj: any = {
        x: '1300px'
    };

    tableNoData: string;

    _containerStyle = {
        height: '',
        overflow: 'auto',
        minHeight: '300px'
    };

    constructor(private userInsightService: UserInsightService,
                private injector: Injector) {

        super(injector);

        this.initRouterList('用户列表');
        this.listenerWindownResize();

    }

    ngOnInit() {

        this.boolFilters = [
            {
                operator: 'and',
                term: true,
                fieldName: null,
                eqType: null,
                value: null,
                value2: null
            }
        ];

        if (this.userInsightService.userInsight['userList'].length > 0 && this.userInsightService.userInsight['userList'][0].value) {
            this.searchFlag = true;
            this.boolFilters = this.userInsightService.userInsight['userList'];
        }

        this.parmas = {
            productId: Number(this.productId),
            page: 1,
            rows: 10
        };

        this.initParam();

        this.route.paramMap.subscribe((params: any) => {
            const id = params.get('id');
            this.productId = Number(id);
            this.parmas.productId = this.productId;
        });

        // 查询表头
        this.getThead();
        // 查询表格数据
        this.getTableData(this.parmas);
    }

    calContainerStyle(): void {
        setTimeout(() => {
            const maxHeight = window.innerHeight - 72;
            this._containerStyle = {
                height: maxHeight.toString() + 'px',
                overflow: 'auto',
                minHeight: '300px'
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

    initParam() {
        if (this.userInsightService.userInsight['userList'] && this.userInsightService.userInsight['userList'].length < 1) {
            if (this.userInsightService.userInsightParmas) {
                const obj = JSON.parse(JSON.stringify(this.userInsightService.userInsightParmas));
                if (obj && obj.hasOwnProperty('definition')) {
                    this.parmas['definition'] = obj.definition;
                } else {
                    if (this.boolFilters.length > 0 && this.boolFilters[0].value) {
                        this.parmas = this.parmas;
                    } else {
                        this.parmas['definition'] = null;
                    }
                }
            } else {
                this.parmas['definition'] = null;
            }
        } else {
            if (this.userInsightService.userListParmas) {
                const obj = JSON.parse(JSON.stringify(this.userInsightService.userListParmas));
                if (obj && obj.hasOwnProperty('definition')) {
                    this.parmas['definition'] = obj.definition;
                }
            } else {
                this.parmas['definition'] = null;
            }
        }
    }

    // 模糊搜索
    // serach(value: string) {
    //     console.log(value);
    // }

    // 查询表头数据
    getThead() {
        this.userInsightService.getThead().subscribe((response: any) => {
            this.tableHead = response.data;
            this.styleObj = {
                x: 200 * response.data.length + 'px'
            };
            if (response.data.length < 1) {
                this.tableNoData = '暂未对用户列表进行配置，请在管理-用户配置-用户洞察配置中进行配置，如果没权限，请联系管理员。';
            }
        });
    }

    // 查询表格数据
    getTableData(parmas: any) {
        this.userInsightService.getTableData(parmas).subscribe((response: any) => {
            this.userListDataTableLoading = false;
            this.tableData = response.data.rows;
            this._total = response.data.total;
        }, (err: any) => {
            this.userListDataTableLoading = false;
        });
    }

    time(value: any) {
        const str = this.commonService.getDateStr(value);
        return str;
    }

    // 高级搜索查询
    queryDeatil() {
        const that = this;
        this.userListDataTableLoading = true;
        let failure = false;
        // 检测所有属性检测项
        for (let k = 0; k < this.boolFilters.length; k++) {
            const boolFilter = this.boolFilters[k];
            if (!boolFilter.fieldName) {
                boolFilter.fieldNameCheckFailure = true;
                failure = true;
            }
            if (
                boolFilter.displayType === 'Tag' &&
                boolFilter.value &&
                boolFilter.value.length === 0
            ) {
                boolFilter.valueCheckFailure = true;
                failure = true;
            } else if (
                boolFilter.displayType === 'Date' &&
                !boolFilter.value
            ) {
                if (boolFilter.eqType === 'between') {
                    if (!boolFilter.value || (boolFilter.value && boolFilter.value.length === 0)) {
                        boolFilter.valueCheckFailure = true;
                        failure = true;
                    }
                } else {
                    boolFilter.valueCheckFailure = true;
                    failure = true;
                }
            } else if (
                ( boolFilter.displayType === 'integer' ||
                    boolFilter.displayType === 'Integer' ||
                    boolFilter.displayType === 'Double' ||
                    boolFilter.displayType === 'Long')
            ) {
                if (
                    boolFilter.eqType === 'between' &&
                    (boolFilter.value2 === undefined || boolFilter.value2 === '' || boolFilter.value2 === null)
                ) {
                    boolFilter.value2CheckFailure = true;
                    failure = true;
                } else if (boolFilter.value === undefined || boolFilter.value === '' || boolFilter.value === null){
                    boolFilter.valueCheckFailure = true;
                    failure = true;
                }
            }
        }

        if (failure) {
            this.userListDataTableLoading = false;
            this.message.create('error', '请为空白项输入值');
            return;
        } else {
            // 有值
            this.userInsightService.userInsight['userList'] = [];
            this.initParam();
            // 判断definition是否有值，没有初始化
            if (this.parmas['definition'] == null) {
                this.parmas['definition'] = {};
                this.parmas.definition['condition'] = {};
                this.parmas.definition['filters'] = [];
                this.parmas.definition.filters = [
                    {
                        condition: 'condition01',
                        not: false,
                        operator: ''
                    }
                ];

                this.parmas.definition.condition['condition01'] = {
                    indice: {
                        type: 'attribute'
                    },
                    queryList: []
                };
            }

            // 转换查询对象
            const queryObj = [];
            this.boolFilters.map((item: any, index: any) => {
                const obj = {};
                if (item.eqType !== 'between') {
                    if (item.displayType !== 'Date') {
                        if (item.value || item.value === 0) {
                            obj['must'] = {
                                attributeCode: item.fieldName,
                                term: {
                                    [item.eqType]: item.value
                                }
                            };
                            if (this.boolFilters.length > 0 && index !== 0) {
                                obj['operator'] = item.operator;
                            }
                        }
                    } else {
                        if (item.value instanceof Array) {
                            item.value = item.value[0];
                        }
                        obj['must'] = {
                            attributeCode: item.fieldName,
                            attributeType: item.displayType,
                            term: {
                                [item.eqType]: that.time(item.value)
                            }
                        };
                        if (this.boolFilters.length > 0 && index !== 0) {
                            obj['operator'] = item.operator;
                        }
                    }
                } else {
                    if (item.displayType !== 'Date') {
                        if ((item.value || item.value === 0) && (item.value2 || item.value2 === 0)) {
                            const arr = [];
                            if (item.value > item.value2) {
                                arr.push(item.value2);
                                arr.push(item.value);
                            } else {
                                arr.push(item.value);
                                arr.push(item.value2);
                            }

                            obj['must'] = {
                                attributeCode: item.fieldName,
                                range: {
                                    lte: arr[1],
                                    gte: arr[0]
                                }
                            };
                            if (this.boolFilters.length > 0 && index !== 0) {
                                obj['operator'] = item.operator;
                            }
                        }
                    } else {
                        const arr = [];
                        if (item.value[0] > item.value[1]) {
                            arr.push(item.value[1]);
                            arr.push(item.value[0]);
                        } else {
                            arr.push(item.value[0]);
                            arr.push(item.value[1]);
                        }
                        obj['must'] = {
                            attributeCode: item.fieldName,
                            attributeType: item.displayType,
                            range: {
                                gte: that.time(arr[0]),
                                lte: that.time(arr[1]),
                            }
                        };
                        if (this.boolFilters.length > 0 && index !== 0) {
                            obj['operator'] = item.operator;
                        }

                    }
                }
                if (Object.keys(obj).length) {
                    queryObj.push(obj);
                }
            });

            // 装入当前条件对象
            const ont = {};
            ont['operator'] = 'and';
            ont['boolFilters'] = queryObj;

            this.parmas.definition.condition.condition01.queryList.push(ont);
            this.parmas.page = 1;
            this._current = 1;
            this.getTableData(this.parmas);
        }
    }

    // 高级搜索组件的返回值
    attributeChange(value: any) {
        this.boolFiltersLength = value.length;
        if (value.length < 1) {
            this.userListDataTableLoading = true;
            this.userInsightService.userInsight['userList'] = [];
            this.initParam();
            this.parmas.page = 1;
            this._current = 1;
            this.getTableData(this.parmas);
            this.searchFlag = false;
        }
    }

    // 改变每页数量
    PageSizeChange(e: any) {
        this.userListDataTableLoading = true;
        this.parmas.rows = this._pageSize;
        this.PageIndexChange(1);
    }

    // 改变页码
    PageIndexChange(e: number) {
        this.userListData = [];
        if (this._current === e) {
            this.parmas.page = e;
            this.userListDataTableLoading = true;
            this.getTableData(this.parmas);
        } else {
            this._current = e;
        }
    }

    // 用户列表详情也
    detail(item: any, event: Event) {
        event.stopPropagation();
        this.userInsightService.userInsight['userList'] = this.boolFilters;

        let data = item;
        let params = {
            // crowdId: data.id,
            // accountId: data.accountid,
            // distinctId: data.distinctid,
            // accountType: data.accounttype,
            // accountOffset: data.accountoffset,
            // offset: data.offset,
        };
        if (data.id) {
            params['crowdId'] = data.id;
        }
        if (data.accountid) {
            params['accountId'] = data.accountid;
        }
        if (data.distinctid) {
            params['distinctId'] = data.distinctid;
        }
        if (data.accounttype) {
            params['accountType'] = data.accounttype;
        }
        if (data.accountoffset) {
            params['accountOffset'] = data.accountoffset;
        }
        if (data.offset) {
            params['offset'] = data.offset;
        }

        if (this.parmas['definition']) {
            this.userInsightService.userListParmas = this.parmas;
        }
        this.commonService.goInto({
            name: '用户档案',
            url: `/user/user-profile`,
            params: params
        });

    }

    // 是否显示高级搜索
    SearchMore() {
        this.searchFlag = !this.searchFlag;
        if (this.boolFilters.length < 1 || this.searchFlag === false) {
            this.boolFilters = [
                {
                    operator: 'and',
                    term: true,
                    fieldName: null,
                    eqType: null,
                    value: null,
                    value2: null
                }
            ];
        }


        if (this.searchFlag === false) {
            this.userListDataTableLoading = true;
            this.userInsightService.userInsight['userList'] = [];
            this.initParam();
            this.parmas.page = 1;
            this._current = 1;
            this.getTableData(this.parmas);
        }
    }
}
