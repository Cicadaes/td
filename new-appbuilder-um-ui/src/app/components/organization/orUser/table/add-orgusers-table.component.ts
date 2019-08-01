import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddOrgUsersTableService } from './add-orgusers-table.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ScrollToTopService } from '../../../../@themes/scroll-service';
import { NzModalService } from 'ng-cosmos-ui';
@Component({
    selector: 'add-orgusers-table',
    templateUrl: './add-orgusers-table.component.html',
    styleUrls: ['./add-orgusers-table.component.css'],
})

export class AddOrgUsersTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() reload = false;
    @Input() refresh = false;
    @Output() onCheck = new EventEmitter<any[]>();
    isShowAddUerModal = false;
    isReloadUserTable = false;
    @Input() organization: any;

    userGroupId: any;
    userGroup: any;
    currentUser: any;
    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _checkList: any = [];
    _loading = true;
    _sortValue: any = null;

    /*checkbox使用变量*/
    _allChecked = false;
    _indeterminate = false;
    _value: any;

    constructor(
        private scrollSer: ScrollToTopService,
        private service: AddOrgUsersTableService,
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

    showAddUserModal(user: any) {
        this.router.navigate(['/ugusers/addUgUserPage'], user);
    }

    showUserDetail(user: any) {
        this.router.navigate(['/userGroups/viewUserGroupDetail']);
    }

    deleteUserFromUserGroup(user: any) {
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
        }
        this.service.getUserGroupPageDetail(this.userGroupId).subscribe((data: any) => {
            if (data.success) {
                this.userGroup = data.data;
                const _this_ = this;
                this.confirmServ.confirm({
                    nzMaskClosable: false,
                    nzTitle: '确定要移除用户' + user.name + '吗？',
                    nzContent: '',
                    nzOnOk() {
                        _this_.service.deleteUserFromUserGroup(_this_.userGroup, user).subscribe((response: any) => {
                            if (response.success) {
                                const params = {};
                                params['status'] = 1;
                                params['virtualRoleId'] = _this_.userGroup.id;
                                params['id'] = user.id;
                                _this_.service.getUgUsers(params).subscribe((data1: any) => {
                                    _this_._loading = false;
                                    _this_._total = data1.total;
                                    _this_._dataSet = data1.list;
                                });
                            } else {
                                alert(response.result);
                            }
                        });
                    }
                });
            }
        });
    }

    deleteUsersFromUserGroup(userGroup: any, users: any) {
        const _this_ = this;
        let userNames = '';
        users.data.forEach((user: any, index: any) => {
            userNames += user.name + ',';
        });
        userNames = userNames.substring(0, userNames.length - 1);
        let uids = '';
        users.data.forEach((user: any, index: any) => {
            uids += user.id + ',';
        });
        uids = uids.substring(0, uids.length - 1);
        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: '确认',
            nzContent: '確定要从' + userGroup.name + '用户组中移除' + userNames + '吗？',
            nzOnOk() {
                _this_.service.deleteUsersFromUserGroup(userGroup, uids).subscribe((data: any) => {
                    if (data.success) {
                        const params = {};
                        params['status'] = 1;
                        _this_.service.getUgUsers(params).subscribe((response: any) => {
                            _this_._loading = false;
                            _this_._total = response.total;
                            _this_._dataSet = response.list;
                        });
                    } else {
                        alert(data.result);
                    }
                });
            }
        });
    }

    onSubmitUserFormData(params) {
        this.isReloadUserTable = params || false;
        if (this.isReloadUserTable) {
            this.refreshData();
        }
    }

    showRoles(user: any) {
        this.currentUser = user;
        this.isShowAddUerModal = false;
        this.service.queryRoleByUser(user).subscribe((data: any) => {
            let roleNames = '';
            if (data.success && data.data) {
                data.data.forEach((c: any, index: any) => {
                    roleNames += c.name;
                });
            }
            this.confirmServ.info({
                nzTitle: user.name + '被授权的角色',
                nzContent: roleNames
            });
        });

    }

    onSearch(searchStr: any, type: any) {
        const that = this;
        let tenantId: any;
        let virtualRoleId: any;
        if (that.organization) {
            tenantId = that.organization.tenantId;
            virtualRoleId = that.organization.id;
        }
        const params = {
            page: that._current,
            rows: that._pageSize,
            unVirtualRoleId: this.userGroupId,
            tenantId: tenantId,
            virtualRoleId: virtualRoleId
        };
        if (type === 'click') {
            if (searchStr) {
                searchStr = searchStr.replace(/(^\s*)|(\s*$)/g, '');
            }
            params['nameOrEmail'] = searchStr;
            that.service.getUgUsers(params).subscribe((data: any) => {
                that._loading = false;
                that._total = data.total;
                that._dataSet = data.list;
            });
        } else {
            if (searchStr.keyCode === 13) {
                if (that._value) {
                    that._value = that._value.replace(/(^\s*)|(\s*$)/g, '');
                }
                params['nameOrEmail'] = that._value;
                that.service.getUgUsers(params).subscribe((data: any) => {
                    that._loading = false;
                    that._total = data.total;
                    that._dataSet = data.list;
                });
            }
        }
    }

    hideAddUserModal(params: any) {
        this.isShowAddUerModal = false;
    }

    refreshData(reset = false) {
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        const params = this.queryParams || {};
        params.page = this._current;
        params.rows = this._pageSize;
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
        }
        if (this.organization) {
            params.tenantId = this.organization.tenantId;
            params.virtualRoleId = this.organization.id;
            this.service.getUgUsers(params).subscribe((data: any) => {
                this._loading = false;
                this._total = data.total;
                this._dataSet = data.list;
                this.scrollSer.scrollToTop();
            });
        }
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
        this.onCheck.emit(this._checkList);
    }

    _checkAll(value) {
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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.queryParams) {
            this.queryParams = changes.queryParams.currentValue || {};
        } else {
            this.queryParams = {};
        }
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

        if (this.refresh) {
            this._checkAll(false);
            this._allChecked = false;
        }

    }

    ngOnInit() {
        this.userGroupId = this.route.snapshot.params['id'];
    }
}
