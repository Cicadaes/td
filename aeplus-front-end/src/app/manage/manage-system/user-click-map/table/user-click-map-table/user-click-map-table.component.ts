import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-cosmos-ui';
import {UserClickMapService} from '../../user-click-map.service';
import {Globals} from '../../../../../utils/globals';

@Component({
    selector: 'app-user-click-map-table',
    templateUrl: './user-click-map-table.component.html',
    styleUrls: ['./user-click-map-table.component.less'],
    providers: [UserClickMapService]
})
export class UserClickMapTableComponent implements OnInit, OnChanges {
    confirmModal: NzModalRef;
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    dataSet = [];
    loading = true;
    sortValue = null;
    sortKey = null;

    _isShowUserClickMapAddDialog: boolean;
    _currentUserClickMap: any;

    searchGenderList: string[] = [];
    _moreSearchFieldArray: any[] = [];
    _queryParam: any = {};
    removeFlag = false;             // 删除弹框
    itemObj: any;
    _item: any;

    sort(sort: {key: string, value: string}): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    constructor(private service: UserClickMapService,
                private modalService: NzModalService,
                public globals: Globals) {
    }

    delete(data: any) {
        this._item = data;
        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: `删除后热力图和链接点击图中将不再显示和统计该页面的数据，确定要删除？`,
            nzOnOk: () => {
                this.deleteFunc();
            }
        });
        /*    this.confirmModal = this.modal.confirm({
         nzTitle: '提示',
         nzContent: '删除后热力图和链接点击图中将不再显示和统计该页面的数据，您确定要删除吗？',
         nzOnOk: () => new Promise((resolve, reject) => {
         this.service.delete(data).then((response: any) => {
         if (response) {
         setTimeout(Math.random() > 0.5 ? resolve : reject, 10);
         this.searchData(true);
         }
         }).catch((err: any) => {

         });
         }).catch(() => console.log('Oops errors!'))
         });*/
    }

    deleteFunc() {
        this.service.delete(this._item).subscribe((response: any) => {
            if (response) {
                this.searchData(true);
            }
        });
    }

    // 确定删除 todo -del
    confirmHideDialog(type: any) {
        this.removeFlag = type;
        this.deleteFunc();
    }

    // 取消删除
    hideItemDialog(type: any) {
        this.removeFlag = type;
    }

    changeUserClickMapStatus(data: any, status: any) {
        data.status = status;
        this.service.update(data).subscribe((response: any) => {
            if (response) {
                this.searchData(false);
            }
        });
    }

    showUserClickMapAddDialog(data: any) {
        this._isShowUserClickMapAddDialog = true;
        this._currentUserClickMap = data;
    }

    hideUserClickMapAddDialog(value: boolean) {
        this._isShowUserClickMapAddDialog = false;
        this._currentUserClickMap = null;
    }

    onSubmitAddUserClickMap(value: boolean) {
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
            fieldName: 'sourceid',
            fieldLabel: '平台',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            search: true,
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '2',
                label: 'H5'
            }, {
                value: '1',
                label: 'Web'
            }]
        },
            {
                fieldName: 'displayname',
                fieldLabel: '点击图名称',
                fieldType: 'input'
            }, {
                fieldName: 'name',
                fieldLabel: '点击图URL',
                fieldType: 'input'
            }];
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    ngOnInit(): void {
        this.initMoreSearchFieldArray();
        this.searchData();
    }

}
