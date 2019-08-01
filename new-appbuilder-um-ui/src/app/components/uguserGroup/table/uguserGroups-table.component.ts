import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UgUserGroupsTableService } from './uguserGroups-table.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'uguserGroups-table',
    templateUrl: './uguserGroups-table.component.html',
    styleUrls: ['./uguserGroups-table.component.css'],
})

export class UgUserGroupsTableComponent implements OnInit, OnChanges {
    @Input() reload = false;
    @Input() isInUser = false;
    @Input() tenantId: number;
    @Output() onCheckUserGroup = new EventEmitter<any[]>();
    isReloadUserGroupTable = false;
    currentUserGroup: any;
    userId: number;
    _value: string;
    userGroupFieldArray: any;
    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    _sortValue: any = null;
    name: string;
    /**使用复选框**/
    @Input() refresh = false;
    _allChecked = false;
    _indeterminate = false;
    _checkList: any = [];
    search: string;
    constructor(
        private scrollSer: ScrollToTopService,
        private service: UgUserGroupsTableService,
        private confirmServ: NzModalService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    sort(value: any) {
        this._sortValue = value;
        this.refreshData();
    }

    reset() {
        this.refreshData(true);
    }

    showAddUserGroupModal(userGroup: any) {
        this.currentUserGroup = userGroup;
        this.isReloadUserGroupTable = false;
    }

    viewDetailUserGroup(userGroup: any) {
        this.router.navigate(['/userGroups/viewUserGroupDetail', userGroup.id]);
    }

    onSubmitUserGroupFormData(params: boolean) {
        this.isReloadUserGroupTable = params || false;
        if (this.isReloadUserGroupTable) {
            this.refreshData();
        }
    }

    deleteUserGroup(data: any) {
        const _this_ = this;
        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: '您确定要移除用户组\'' + data.name + '\'吗？',
            nzContent: '',
            nzOnOk() {
                _this_.service.deleteUserGroupsFromUser(_this_.userId, data.id).then((response: any) => {
                    if (response.success) {
                        _this_.refreshData(true);
                        // var params = {};
                        // params['status'] = 1;
                        // _this_.service.getUserGroups( params).then((data: any) => {
                        //     _this_._loading = false;
                        //     _this_._total =  data.total;
                        //     _this_._dataSet = data.list;
                        // });
                    } else {
                        alert(response.result);
                    }
                });
            }
        });
    }

    refreshData(reset = false) {
        this.scrollSer.scrollToTop();
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        if (!this.userId) {
            this.userId = this.route.snapshot.params['id'];
        }
        const params = {};
        params['page'] = this._current;
        params['rows'] = this._pageSize;
        if (this.isInUser) { // 是dialog就查不属于某用户的
            params['id'] = this.userId;
        } else {
            params['inId'] = this.userId;
        }
        if (this.name) {
            params['name'] = this.name;
        }
        params['virtualRoleType'] = 'USERGROUP';
        params['tenantId'] = this.tenantId;
        this.service.getUserGroups(params).then((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
        });
    }

    _refreshStatus() {
        const allChecked = this._dataSet.every((value: any) => value.checked === true);
        const allUnChecked = this._dataSet.every((value: any) => !value.checked);
        this._allChecked = allChecked;
        this._indeterminate = (!allChecked) && (!allUnChecked);
        this.refresh = false;
        this.callbackSelect();
    }
    callbackSelect() {
        this._checkList = [];
        this._dataSet.forEach((user: any, index: any) => {
            if (user.checked) {
                this._checkList.push(user);
            }
        });
        this.onCheckUserGroup.emit(this._checkList);
    }
    _checkAll(value: boolean) {
        if (value) {
            this._dataSet.forEach((data: any, index: any) => {
                data.checked = true;
            });
        } else {
            this._dataSet.forEach((data: any, index: any) => {
                data.checked = false;
            });
        }
        this._refreshStatus();
    }


    onSearch() {
        if (!this.userId) {
            this.userId = this.route.snapshot.params['id'];
        }
        const params = {};
        params['page'] = this._current;
        params['rows'] = this._pageSize;
        params['status'] = 1;
        params['name'] = this._value;
        if (this.isInUser) { // 是dialog就查不属于某用户的
            params['id'] = this.userId;
        } else {
            params['inId'] = this.userId;
        }
        this.service.getUserGroups(params).then((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
        });
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes.reload) {
            this.reload = changes.reload.currentValue || false;
        } else {
            this.reload = false;
        }

        if (this.reload) {
            this.refreshData();
        } else {
            this.reset();
        }

        /**使用复选框**/
        if (this.refresh) {
            this._checkAll(false);
            this._allChecked = false;
        }
    }

    onSearchUserGroupList(params: any) {
        this.name = params.name;
        this.refreshData();
    }

    onSearch2(event: any, type: any) {
        const that = this;
        if (type === 'click') {
            if (event) {
                event = event.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.name = event;
            that.refreshData();
        } else {
            if (event.keyCode === 13) {
                if (that.search) {
                    that.search = that.search.replace(/(^\s*)|(\s*$)/g, '');
                }
                that.name = that.search;
                that.refreshData();
            }
        }
    }

    initUserGroupFieldArray(): void {
        this.userGroupFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '名称',
            fieldType: 'input'
        }];
    }

    ngOnInit() {
        // this.userId=this.route.snapshot.params['id'];
        this.initUserGroupFieldArray();
        this.route.params.subscribe((data) => {
            this.userId = data.id;
        });
    }
}
