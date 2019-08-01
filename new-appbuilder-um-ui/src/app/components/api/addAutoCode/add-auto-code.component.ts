import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import * as _ from 'lodash';

@Component({
    selector: 'app-add-auto-code',
    templateUrl: './add-auto-code.component.html',
    styleUrls: ['./add-auto-code.component.css']

})
export class AddAutoCodeComponent implements OnInit, OnChanges {
    @Input() isVisible: any;
    @Input() catalogId: any;
    @Input() apiId: any;
    @Output() hideCodeDialog = new EventEmitter<any>();
    @Output() saveCode = new EventEmitter<any>();
    queryParams: any;
    pageIndex = 1;
    pageSize = 10;
    total = 0;
    dataSet: any = [];
    loading = true;
    autoCodeArray = [
        {
            id: 1,
            fieldName: 'code',
            fieldLabel: '返回码',
            fieldType: 'input'
        },
        {
            id: 2,
            fieldName: 'reason',
            fieldLabel: '返回码解释',
            fieldType: 'input'
        }
    ];

    /*checkbox使用变量*/
    _allChecked = false;
    _indeterminate = false;
    _checkList: any = [];                               // 选中的项

    constructor(
        private service: ApiService,
        private scrollSer: ScrollToTopService,
    ) {
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isVisible) {
            this.isVisible = changes.isVisible.currentValue;
        }

        if (this.isVisible) {
            this.refreshData(true);
        }
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
        params.catalogId = this.catalogId;
        params.metaId = this.apiId;
        if (this.catalogId) {
            this.service.getResponseCode(params).then((data: any) => {
                if (data.code === 200) {
                    this.loading = false;
                    this.dataSet = [];
                    this.total = data.data.total;
                    this.dataSet = data.data.data;
                    this._refreshStatus();
                    this.scrollSer.scrollToTop();
                }
            }).catch((err: any) => {
            });
        }
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
        this.hideCodeDialog.emit(this.isVisible);
    }

    // 搜索
    onSearchInterfaceList(params: any) {
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
        this.saveCode.emit(this._checkList);
    }
}
