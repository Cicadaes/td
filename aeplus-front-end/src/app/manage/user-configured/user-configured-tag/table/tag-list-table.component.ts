import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Injector, TemplateRef} from '@angular/core';
import {Globals} from '../../../../utils/globals';
import {BaseComponent} from '../../../../common/base-component';
import {UserConfiguredTagService} from '../user-configured-tag.service';

@Component({
    selector: 'app-tag-list-table',
    templateUrl: './tag-list-table.component.html',
    styleUrls: ['./tag-list-table.component.less'],
    providers: [UserConfiguredTagService]
})
export class TagListTableComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() tagCate: any;
    @Input() tenantAdmin: any;
    @Output() onLoadTagCate = new EventEmitter<any>();
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    dataSet = [];
    loading = true;
    sortValue = null;
    sortKey = null;

    _moreSearchFieldArray: any[] = [];
    _queryParam: any = {};
    _tagCate: any = {};
    _keyword: string;
    _showMoreSearch: boolean;

    allChecked = false;
    indeterminate = false;
    displayData = [];
    _batchSelectedData: any[];
    _hasChecked: boolean;

    moveTagSelect: any;
    _checkDeleteTagType: any;
    _checkDeleteTagData: any = {};
    _showMoreTagList: boolean;
    _isVisible: boolean;
    _tenantAdmin: boolean;

    constructor(private service: UserConfiguredTagService,
                public globals: Globals,
                private injector: Injector) {
        super(injector);
    }

    currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
        this.displayData = $event;
        this.refreshStatus();
    }

    handleCancel(): void {
        this._isVisible = false;
        this.globals.resetBodyStyle();
    }

    showHideMoreTagList() {
        this._showMoreTagList = !this._showMoreTagList;
    }

    checkHasChecked() {
        this._hasChecked = false;
        if (this.displayData && this.displayData.length > 0) {
            for (let i = 0; i < this.displayData.length; i++) {
                if (this.displayData[i].checked) {
                    this._hasChecked = true;
                    break;
                }
            }
        }
    }

    refreshStatus(): void {
        const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
        const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
        if (this.displayData && this.displayData.length > 0) {
            this.allChecked = allChecked;
        } else {
            this.allChecked = false;
        }
        this.indeterminate = (!allChecked) && (!allUnChecked);
        setTimeout(() => {
            this.checkHasChecked();
        }, 10);
    }

    checkAll(value: boolean): void {
        this.displayData.forEach(data => {
            if (!data.disabled) {
                data.checked = value;
            }
        });
        this.refreshStatus();
    }

    swithFilter() {
        this._showMoreSearch = !this._showMoreSearch;
        this._keyword = '';
        this._queryParam = {};
        this.searchData(true);
    }

    sort(sort: { key: string, value: string }): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    checkCreateTags() {
        const data = {
            productId: this.productId
        };
        this.service.checkCreateTags(data).subscribe((response: any) => {
            if (response && response.code === 200) {
                this.goToPage('创建标签', '/manage/user-configured/tag/tag-create/add', {
                    customTagCategoryId: this._tagCate.id
                });
            } else {
                this.modalService.warning({
                    nzTitle: '提示',
                    nzContent: response.message
                });
            }
        });
    }

    create() {
        this.checkCreateTags();
    }

    goToPage(pageName: string, pageUrl: string, params: any) {
        this.commonService.goInto({
            name: pageName,
            url: pageUrl,
            params: params || {}
        });
    }

    _getCheckedTags() {
        const datas = [];
        if (this.displayData && this.displayData.length > 0) {
            for (let i = 0; i < this.displayData.length; i++) {
                if (this.displayData[i].checked) {
                    datas.push(this.displayData[i]);
                }
            }
        }
        return datas;
    }

    removeTags() {
        this._batchSelectedData = this._getCheckedTags();
        this.checkDeleteTags(this._batchSelectedData, 'batchDelete');
    }

    checkDeleteTags(datas: any[], type: string) {
        this._checkDeleteTagType = type;
        this.service.checkDeleteTags(datas).subscribe((response: any) => {
            if (response && response.code === 200) {
                this.modalService.confirm({
                    nzTitle: '提示',
                    nzContent: `确认要删除所有被选中的标签吗？`,
                    nzOnOk: () => {
                        if (type === 'batchDelete') {
                            this.deleteBatch(datas);
                        }
                    },
                    nzOnCancel: () => {
                        this.handleCancel();
                    }
                });
            } else {
                this._checkTagCallback(response.data);
            }
        });
    }

    _checkTagCallback(data: any) {
        this._showMoreTagList = false;
        this._isVisible = true;
        this._checkDeleteTagData = data || {};
    }

    deleteBatch(datas: any[]) {
        this.handleCancel();
        this.service.deleteBatchTags(datas).subscribe((response: any) => {
            this.handleCancel();
            if (response && response.code === 200) {
                this.modalService.success({
                    nzTitle: '提示',
                    nzContent: '批量删除选中的标签成功'
                });
                this.onLoadTagCate.emit(true);
                this.searchData(true);
            } else {
                this.modalService.warning({
                    nzTitle: '提示',
                    nzContent: '批量删除选中的标签失败'
                });
            }
        });
    }

    delete(data: any) {
        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: '确定要删除标签"' + data.name + '"？',
            nzOnOk: () => {
                this._checkDeleteTagType = 'delete';
                this.deleteFunc(data);
            },
            nzOnCancel: () => {
                this.handleCancel();
            }
        });
    }

    deleteFunc(data: any) {
        this.handleCancel();
        this.service.deleteTag(data).subscribe((response: any) => {
            this.handleCancel();
            if (response && response.code === 200) {
                this.modalService.success({
                    nzTitle: '提示',
                    nzContent: '标签"' + data.name + '"删除成功',
                    nzOnOk: () => {
                        this.handleCancel();
                    }
                });
                this.onLoadTagCate.emit(true);
                this.searchData(true);
            } else {
                this._checkTagCallback(response.data);
            }
        });
    }

    checkEditTag(datas: any[], type: string) {
        this._checkDeleteTagType = type;
        this.service.checkEditTag(datas).subscribe((response: any) => {
            if (response && response.code === 200) {
                this.goToPage('', '/manage/user-configured/tag/tag-create/edit', {id: datas[0].id});
            } else {
                this._checkTagCallback(response.data);
            }
        });
    }

    editTag(data: any) {
        const datas = [];
        datas.push(data);
        this._batchSelectedData = datas;
        this.checkEditTag(datas, 'edit');
    }

    viewTag(data: any) {
        this.goToPage('', '/manage/user-configured/tag/tag-create/view', {id: data.id});
    }

    calcuteTag(data: any) {
        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: '确定要重新计算标签"' + data.name + '"？',
            nzOnOk: () => {
                this.calcuteTagApi(data);
            },
            nzOnCancel: () => {
                this.handleCancel();
            }
        });
    }

    calcuteTagApi(data: any) {
        this.service.calcuteTag(data).subscribe((response: any) => {
            if (response && response.code === 200) {
                this.modalService.success({
                    nzTitle: '提示',
                    nzContent: '标签"' + data.name + '"重新计算成功'
                });
                this.searchData(false);
            } else {
                this.modalService.warning({
                    nzTitle: '提示',
                    nzContent: '标签"' + data.name + '"重新计算失败'
                });
            }
            this.handleCancel();
        });
    }

    onSubmit(value: boolean) {
        this.searchData(true);
    }

    searchData(reset: boolean = false): void {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const param = this._queryParam || {};
        param.productId = this.globals.getProductIdByStorage();
        param.page = this.pageIndex;
        param.rows = this.pageSize;
        param.customTagCategoryId = this._tagCate.id;
        if (!param.name) {
            param.name = this._keyword;
        }
        this.service.query(param).subscribe((response: any) => {
            this.loading = false;
            if (response && response.code === 200) {
                this.total = response.data.total;
                this.dataSet = response.data.rows;
            }
        });
    }

    _onSearch(value: any) {
        this._queryParam = {};
        this._keyword = value || '';
        this.searchData(true);
    }

    onSearchMoreSearch(params: any) {
        if (params.updateDataTimeRange) {
            params.updateDataTimeRange.end = this.globals.getDateZeroTime(params.updateDataTimeRange.end) + (24 * 3600 * 1000) - 1;
        }
        if (params.updateTagRuleTimeRange) {
            params.updateTagRuleTimeRange.end = this.globals.getDateZeroTime(params.updateTagRuleTimeRange.end) + (24 * 3600 * 1000) - 1;
        }
        this._queryParam = params;
        this.searchData(true);
    }

    initMoreSearchFieldArray(): void {
        this._moreSearchFieldArray = [{
            fieldName: 'name',
            fieldLabel: '标签名称',
            fieldType: 'input',
            span: '7'
        }, {
            fieldName: 'calcStatus',
            fieldLabel: '计算状态',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            search: true,
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '0',
                label: '未计算'
            }, {
                value: '1',
                label: '计算中'
            }, {
                value: '2',
                label: '计算完成'
            }, {
                value: '-1',
                label: '计算失败'
            }]
        }, {
            fieldName: 'updateTagRuleTimeRange',
            fieldLabel: '规则更新时间',
            fieldType: 'date-range',
            span: '9'
        }, {
            fieldName: 'status',
            fieldLabel: '状态',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            search: true,
            span: '7',
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '2',
                label: '已生效'
            }, {
                value: '1',
                label: '未生效'
            }]
        }, {
            fieldName: 'updator',
            fieldLabel: '更新人',
            fieldType: 'input'
        }, {
            fieldName: 'updateDataTimeRange',
            fieldLabel: '数据更新时间',
            fieldType: 'date-range',
            span: '9'
        }];
    }

    moveBatchTag(datas: any[], tagCate: any) {
        this.service.moveBatchTags(datas, tagCate).subscribe((response: any) => {
            if (response && response.code === 200) {
                this.modalService.success({
                    nzTitle: '提示',
                    nzContent: '移动选中的标签到分类"' + tagCate.name + '"下成功'
                });
                this.onLoadTagCate.emit(true);
                this.searchData(true);
            } else {
                this.modalService.warning({
                    nzTitle: '提示',
                    nzContent: '移动选中的标签到分类"' + tagCate.name + '"下失败'
                });
            }
        });
    }

    onSelectMoveTag(tagCate: any) {
        this._batchSelectedData = this._getCheckedTags();
        this.moveBatchTag(this._batchSelectedData, tagCate);
    }

    _initMoveTagSelect() {
        this.moveTagSelect = {
            apiUrl: this.service.queryTagCategoryUrl,
            apiParam: {
                productId: this.productId,
                name: '',
                page: 1,
                rows: 100
            },
            keywordFiled: 'name',
            selectSource: 'userConfiguredTag',
            opacity: true,
            style: {
                width: '100%',
                'min-width': '100%'
            }
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tagCate && changes.tagCate.currentValue) {
            this._tagCate = changes.tagCate.currentValue;
            if (this._tagCate) {
                this._showMoreSearch = false;
                this._keyword = '';
                this._queryParam = {};
                this.searchData(true);
            }
        }
        if (changes.tenantAdmin && changes.tenantAdmin.currentValue) {
            this._tenantAdmin = changes.tenantAdmin.currentValue;
        }
    }

    ngOnInit(): void {
        this._initMoveTagSelect();
        this.initMoreSearchFieldArray();
//        this.searchData(true);
    }

}
