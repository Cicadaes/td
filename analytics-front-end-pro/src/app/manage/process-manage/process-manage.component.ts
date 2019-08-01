import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {ProcessManageService} from './process-manage.service';
import {TABLE_PAGE_SIZE_OPTIONS} from '../../common/config/page.size.config';
import {BaseComponent} from '../../common/base-component';

@Component({
    selector: 'app-process-manage',
    templateUrl: './process-manage.component.html',
    styleUrls: ['./process-manage.component.less']
})
export class ProcessManageComponent extends BaseComponent implements OnInit, OnChanges {

    tabList: any = [];                              // tab切换
    processData: any;                               // 流程列表table Data
    processTableLoading = true;                     // 流程列表table的loading
    pageSizeOptions: any[];                         // 流程列表table 分页options
    processMoreSearch: any = [];                    // 更多搜索条件
    // 分页数据
    _pageIndex = 1;                                 // 当前页
    _pageSize = 10;                                 // 每页条数
    _total = 1;                                     // 数据总量
    indexType: any = 1;                             // tab切换当前状态
    parmas: any;                                    // 查询列表参数
    isVisible = false;

    // 操作历史
    operationHistoryData: any;                      // 流程列表table Data
    operationHistoryTableLoading = true;            // 流程列表table的loading
    operationHistoryMoreSearch: any = [];           // 更多搜索条件
    rejectData: any = {
        reason: null
    };                                // 拒绝时的当前数据

    itemObj: any;                                   // 操作弹框的提示数据
    _item: any;                                     // 操作弹框的当前数据
    flag = false;                                   // 操作弹框

    constructor(private injector: Injector,
                private processManageService: ProcessManageService) {
        super(injector);
        this.initRouterList('流程列表');
    }

    ngOnInit() {
        this.pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;

        this.tabList = [
            {
                title: '流程列表',
                type: 1,
            },
            {
                title: '操作历史',
                type: 2,
            }
        ];

        const that = this;
        this.processMoreSearch = [
            {
                // fieldName: 'campaignId',
                // fieldLabel: '营销活动',
                // fieldType: 'select',
                // apiData: true,
                // apiUrl: '/marketing-api/campaign/campaigns',
                // apiParam: {
                //     page: 1,
                //     pageSize: 10,
                //     productId: that.productId
                // },
                // app: 'marketing',
                // apiType: 'get',
                // search: true,
                // initValue: '',
                // defaultLabel: '请选择',
                // originData: true,
                // selectOptions: []
                fieldName: 'campaignName',
                fieldLabel: '营销活动',
                fieldType: 'input'
            }, {
                fieldName: 'statusList',
                fieldLabel: '状态',
                fieldType: 'select',
                apiData: false,
                initValue: '',
                selectOptions: [{
                    value: '',
                    label: '全部'
                }, {
                    value: '4',
                    label: '已上线'
                }, {
                    value: '5',
                    label: '运行中'
                }, {
                    value: '2',
                    label: '待审核'
                }]
            }, {
                fieldName: 'creator',
                fieldLabel: '发布者',
                fieldType: 'input'
            }, {
                fieldName: 'name',
                fieldLabel: '流程名称',
                fieldType: 'input'
            }
        ];

        this.operationHistoryMoreSearch = [
            {
                // fieldName: 'campaignId',
                // fieldLabel: '营销活动',
                // fieldType: 'select',
                // apiData: true,
                // apiUrl: '/marketing-api/campaign/campaigns',
                // apiParam: {
                //     page: 1,
                //     pageSize: 10,
                //     productId: that.productId
                // },
                // originData: true,
                // app: 'marketing',
                // apiType: 'get',
                // search: true,
                // initValue: '',
                // defaultLabel: '请选择',
                // selectOptions: []
                fieldName: 'campaignName',
                fieldLabel: '营销活动',
                fieldType: 'input'
            }, {
                fieldName: 'creator',
                fieldLabel: '发布者',
                fieldType: 'input'
            }, {
                fieldName: 'name',
                fieldLabel: '流程名称',
                fieldType: 'input'
            }, {
                fieldName: 'operationTimeRange',
                fieldLabel: '操作时间',
                fieldType: 'date-range'
            }, {
                fieldName: 'updater',
                fieldLabel: '操作者',
                fieldType: 'input'
            }, {
                fieldName: 'statusList',
                fieldLabel: '操作行为',
                fieldType: 'select',
                apiData: false,
                initValue: '',
                selectOptions: [{
                    value: '',
                    label: '全部'
                }, {
                    value: '3',
                    label: '上线拒绝'
                },
                    // {
                    //     value: '3',
                    //     label: '上线拒绝'
                    // },
                    {
                        value: '6',
                        label: '下线'
                    }]
            }
        ];

        this.parmas = {
            page: 1,
            pageSize: 10,
            statusList: '2,4,5',
            productId: that.productId
        };
        this.getProcessList(this.parmas);
    }

    /* 流程列表查询 */
    getProcessList(value: any) {
        this.processManageService.getProcessList(value).subscribe((response: any) => {
            this.processTableLoading = false;
            if (response.code === 200) {
                this.processData = response.data.data;
                this._total = response.data.total;
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 查询历史操作列表
    getOperationHistoryList(parmas: any) {
        this.processManageService.getProcessList(parmas).subscribe((response: any) => {
            this.operationHistoryTableLoading = false;
            if (response.code === 200) {
                this.operationHistoryData = response.data.data;
                this._total = response.data.total;
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 改变页码
    PageIndexChange(e: number) {
        this.processData = [];
        if (this._pageIndex === e) {
            this.parmas.page = e;
            if (this.indexType === 1) {
                this.processTableLoading = true;
                this.getProcessList(this.parmas);
            } else {
                this.operationHistoryTableLoading = true;
                this.getOperationHistoryList(this.parmas);
            }
        } else {
            this._pageIndex = e;
        }
    }

    // 改变每页数量
    PageSizeChange(e: any) {
        this.processTableLoading = true;
        this.parmas.pageSize = this._pageSize;
        this.PageIndexChange(1);
    }

    // 切换tab
    navigiter(item: any) {
        this.indexType = item.type;
        this._pageIndex = 1;
        this._pageSize = 10;
        this._total = 1;
        this.parmas = {};
        this.parmas['page'] = this._pageIndex;
        this.parmas['pageSize'] = this._pageSize;
        this.parmas['productId'] = this.productId;
        // this.processMoreSearch[0].apiParam.page = 1;
        // this.operationHistoryMoreSearch[0].apiParam.page = 1;
        if (this.indexType === 1) {
            this.parmas['statusList'] = '2,4,5';
            this.processTableLoading = true;
            this.getProcessList(this.parmas);
        } else {
            this.parmas['statusList'] = '3,6';
            this.operationHistoryTableLoading = true;
            this.getOperationHistoryList(this.parmas);
        }
    }

    // 条件搜索
    onSearchMoreSearch(params: any) {
        const obj = this.updateParmas(params);
        this._pageIndex = 1;
        obj['page'] = 1;
        obj['pageSize'] = this.parmas['pageSize'];
        obj['productId'] = this.parmas['productId'];
        if (!obj['statusList']) {
            (this.indexType === 1) ? obj['statusList'] = '2,4,5' : obj['statusList'] = '3,6';
        }
        this.parmas = obj;
        if (this.indexType === 1) { // 流程操作列表
            // 组装参数
            this.processTableLoading = true;
            this.getProcessList(this.parmas);
        } else {
            // 组装参数
            this.operationHistoryTableLoading = true;
            this.getOperationHistoryList(this.parmas);
        }
    }

    // 格式化时间
    time(value: any) {
        const pattern = new Date(value);
        const str = this.commonService.getDateStr(pattern);
        return str;
    }

    // 改变查询参数
    updateParmas(params: any) {
        const that = this;
        const obj = {};
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                if (params[key] && params[key] != null && params[key] !== '') {
                    if (key !== 'operationTimeRange') {
                        obj[key] = params[key];
                    } else {
                        if (params[key]['start'] && params[key]['start'] !== undefined) {
                            obj['updateTime1'] = that.time(params[key]['start']);
                            obj['updateTim2'] = that.time(params[key]['end']);
                        }
                    }
                }
            }
        }
        return obj;
    }

    // 批准
    approve(item: any) {
        this.flag = true;
        this._item = item;
        this.itemObj = {
            type: 'information',
            message: `请确认是否同意营销流程"${this._item['name']}上线"?`
        };
    }

    // 下线
    downLine(item: any) {
        this.flag = true;
        this._item = item;
        this.itemObj = {
            type: 'information',
            message: `请确认是否将营销流程"${this._item['name']}下线"?`
        };
    }

    // 拒绝
    reject(item: any) {
        this.rejectData = item;
        this.isVisible = true;
    }

    // 隐藏拒绝理由弹框
    hideDialog(type: any) {
        this.isVisible = false;
    }

    // 保存拒绝理由
    saveDate() {
        this.isVisible = false;
        this.processTableLoading = true;
        this.getProcessList(this.parmas);
    }

    // 取消操作提示框
    hideItemDialog(type: any) {
        this.flag = false;
    }

    // 确认操作提示框
    confirmHideDialog(value: any) {
        // 判断是上线通过，还是上线拒绝
        if (this._item.status === 2) { // 通过上线
            this.processManageService.approve(this._item.id).subscribe((response: any) => {
                if (response.code === 200) {
                    this.getProcessList(this.parmas);
                    this.flag = false;
                } else {
                    this.flag = false;
                    this.notification.create('warning', '错误提示', response.message);
                }
            }, (err: any) => {
                this.flag = false;
            });
        } else if (this._item.status === 5 || this._item.status === 4) {
            this.processManageService.downLine(this._item.id).subscribe((response: any) => {
                if (response.code === 200) {
                    this.flag = false;
                    this.getProcessList(this.parmas);
                } else {
                    this.flag = false;
                    this.notification.create('warning', '错误提示', response.message);
                }
            }, (err: any) => {
                this.flag = false;
            });
        }
    }
}
