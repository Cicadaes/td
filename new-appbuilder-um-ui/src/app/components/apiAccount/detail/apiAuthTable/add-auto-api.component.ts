import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { ApiAccountService } from '../../api-account.service';
import { ScrollToTopService } from '../../../../@themes/scroll-service';
import * as _ from 'lodash';
import { NzNotificationService, NzModalService } from 'ng-cosmos-ui';


@Component({
    selector: 'app-add-auto-api',
    templateUrl: './add-auto-api.component.html',
    styleUrls: ['./add-auto-api.component.css']

})
export class AddAutoApiComponent implements OnInit, OnChanges {
    @Input() isVisible: any;
    @Input() tenantId: any;
    @Input() accountId: any;
    @Input() set productList(value: any) {
        this._productList = _.cloneDeep(value);
        const arr = _.cloneDeep(this.moreSearchArray);
        arr[0].selectOptions = this._productList;
        this.moreSearchArray = arr;
    }
    @Output() hideDialog = new EventEmitter<any>();
    @Output() save = new EventEmitter<any>();
    queryParams: any;
    pageIndex = 1;
    pageSize = 10;
    total = 0;
    dataSet: any = [];
    loading = false;
    _productList: any;
    moreSearchArray = [
        {
            id: 1,
            fieldName: 'catalogId',
            fieldLabel: 'API所属产品',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: this._productList
        },
        {
            id: 2,
            fieldName: 'metaName',
            fieldLabel: 'API名称',
            fieldType: 'input'
        },
        {
            id: 3,
            fieldName: 'path',
            fieldLabel: 'API路径',
            fieldType: 'input'
        }
    ];

    /*checkbox使用变量*/
    _allChecked = false;
    _indeterminate = false;
    _checkList: any = [];                               // 选中的项

    constructor(
        private service: ApiAccountService,
        private scrollSer: ScrollToTopService,
        private nzNotificationService: NzNotificationService,
        private modalService: NzModalService
    ) {
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isVisible) {
            this.isVisible = changes.isVisible.currentValue;
        }

        if (this.isVisible) {
            this.initMoreSearchArray();
            const arr = _.cloneDeep(this.moreSearchArray);
            this.moreSearchArray = arr;
            this.queryParams = {};
            this.refreshData(true);
        }
    }

    initMoreSearchArray() {
        this.moreSearchArray = [
            {
                id: 1,
                fieldName: 'catalogId',
                fieldLabel: 'API所属产品',
                fieldType: 'select',
                apiData: false,
                initValue: '',
                selectOptions: this._productList
            },
            {
                id: 2,
                fieldName: 'metaName',
                fieldLabel: 'API名称',
                fieldType: 'input'
            },
            {
                id: 3,
                fieldName: 'path',
                fieldLabel: 'API路径',
                fieldType: 'input'
            }
        ];
    }


    // 请求数据
    refreshData(reset = false) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const params = this.queryParams || {};
        params.page = this.pageIndex;
        params.pageSize = this.pageSize;
        params.accountId = this.accountId;
        if (this.tenantId) {
            params.tenantId = this.tenantId;
        }
        this.service.getUnApiLIst(params).then((data: any) => {
            if (data.code === 200) {
                this.loading = false;
                this.dataSet = [];
                this.total = data.data.total;
                this.dataSet = data.data.data;
                if (this.total) {
                    this._refreshStatus();
                }
                this.scrollSer.scrollToTop();
            }
        }).catch((err: any) => {
        });
    }

    // 全选逻辑
    _checkAll(value: boolean) {
        if (value) {
            this.dataSet.forEach((data: any, index: any) => {
                data.checked = true;
            });
        } else {
            this.dataSet.forEach((data: any, index: any) => {
                data.checked = false;
            });
        }
        this._refreshStatus();
    }

    // 单选逻辑
    _refreshStatus() {
        const allChecked = this.dataSet.every((value: any) => value.checked === true);
        const allUnChecked = this.dataSet.every((value: any) => !value.checked);
        this._allChecked = allChecked;
        this._indeterminate = (!allChecked) && (!allUnChecked);
        this.callbackSelect();
    }

    // 改变选中状态
    callbackSelect() {
        this._checkList = [];
        this.dataSet.forEach((user: any, index: any) => {
            if (user.checked) {
                this._checkList.push(user);
            }
        });
    }


    //  取消
    handleCancel = (e: any) => {
        this.isVisible = false;
        this.hideDialog.emit(this.isVisible);
    }

    // 搜索
    onMoreSearch(params: any) {
        this.queryParams = {};
        for (const key in params) {
            if (params[key] !== null && params[key] !== '') {
                this.queryParams[key] = params[key];
            }
        }
        this.refreshData(true);
    }

    // 确定
    confirm($event: any) {
        if (this._checkList.length < 1) {
            this.modalService.warning({
                nzTitle: `请选择要授权的API`,
                nzOkText: '知道了'
            });
            return;
        }
        this.service.insertAllApi(this._checkList, this.accountId).then((response: any) => {
            if (response.code === 200) {
                this.save.emit(this._checkList);
            } else {
                this.nzNotificationService.warning('错误提示', response.message);
            }
        });
    }

    onSearchMore(parmas: any) {
        this.queryParams = {};
        for (const key in parmas) {
            if (parmas[key] !== null && parmas[key] !== '') {
                this.queryParams[key] = parmas[key];
            }
        }
        this.refreshData(true);
    }
}
