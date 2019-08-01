import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-cosmos-ui';
import {UserAttributeService} from '../../user-attribute.service';
import {Globals} from '../../../../../utils/globals';

@Component({
    selector: 'app-user-attribute-table',
    templateUrl: './user-attribute-table.component.html',
    styleUrls: ['./user-attribute-table.component.less'],
    providers: [UserAttributeService]
})

export class UserAttributeTableComponent implements OnInit, OnChanges {
    confirmModal: NzModalRef;
    pageIndex = 1;
    pageSize = 10;
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

    sort(sort: { key: string, value: string }): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    constructor(private service: UserAttributeService, private modal: NzModalService, public globals: Globals) {
    }

    changeUserAttributeStatus(data: any, status: any) {
        data.status = status;
        this.service.update(data).subscribe((response: any) => {
            if (response) {
                this.searchData(false);
            }
        });
    }

    showUserAttributeAddDialog(data: any) {
        this._isShowUserAttributeAddDialog = true;
        this._currentUserAttribute = data;
    }

    hideUserAttributeAddDialog(value: boolean) {
        this._isShowUserAttributeAddDialog = false;
        this._currentUserAttribute = null;
    }

    onSubmitAddUserAttribute(value: boolean) {
        this.searchData(true);
    }

    searchData(reset: boolean = false): void {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const param = this._queryParam || {};
        param.productid = this.globals.getProductIdByStorage();
        param.page = this.pageIndex;
        param.rows = this.pageSize;
        this.service.query(param).subscribe((response: any) => {
            this.loading = false;
            if (response) {
                this.total = response.total;
                this.dataSet = response.list;
            }
        });
    }

    updateFilter(value: string[]): void {
        this.searchGenderList = value;
        this.searchData(true);
    }

    _onSearch(value: any) {
        this.searchData(true);
    }

    onSearchMoreSearch(params: any) {
        this._queryParam = params;
        this.searchData(true);
    }

    initMoreSearchFieldArray(): void {
        this._moreSearchFieldArray = [{
            fieldName: 'displayname',
            fieldLabel: '属性名称',
            fieldType: 'input'
        }, {
            fieldName: 'column',
            fieldLabel: '属性编码',
            fieldType: 'input'
        }, {
            fieldName: 'displayType',
            fieldLabel: '属性类型',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: 'Tag',
                label: '字典项'
            }, {
                value: 'String',
                label: '字符串'
            }, {
                value: 'Integer',
                label: '数字'
            }, {
                value: 'Double',
                label: '数值'
            }, {
                value: 'Date',
                label: '日期类型'
            }]
        }, {
            fieldName: 'groupid',
            fieldLabel: '所属分组',
            fieldType: 'select',
            apiData: true,
            apiUrl: this.service.queryGroupUrl,
            apiParam: {
                productid: this.globals.getProductIdByStorage()
            },
            search: true,
            initValue: '',
            selectOptions: []
        }, {
            fieldName: 'status',
            fieldLabel: '状态',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '0',
                label: '启用'
            }, {
                value: '1',
                label: '禁用'
            }]
        }];
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    ngOnInit(): void {
        this.initMoreSearchFieldArray();
        this.searchData();
    }

}
