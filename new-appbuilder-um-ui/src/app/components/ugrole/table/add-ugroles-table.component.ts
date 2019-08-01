import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddUgRolesTableService } from './add-ugroles-table.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'add-ugroles-table',
    templateUrl: './add-ugroles-table.component.html',
    styleUrls: ['./add-ugroles-table.component.css']
})

export class AddUgRolesTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() userId: number;
    @Input() isInUser = false;
    @Input() tenantId: number;
    isShowRoleModal = false;
    currentRole: any;

    /**使用复选框**/
    @Input() refresh = false;
    @Input() reload = false;
    @Output() onCheckAddRole = new EventEmitter<any[]>();
    _allChecked = false;
    _indeterminate = false;
    _checkList: any = [];

    // 页面类型，在那个组件下
    // 0 --- 用户组
    // 1 --- 用户
    @Input() viewType = 0;
    // private viewType: number = 0

    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    _sortValue: any = null;
    userGroupId: any;
    userGroup: any;
    user: any;

    constructor(
        private scrollSer: ScrollToTopService,
        private service: AddUgRolesTableService,
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

    showRoleModal(role: any) {
        this.currentRole = role;
        this.isShowRoleModal = true;
    }

    hideRoleModal(params: any) {
        this.isShowRoleModal = false;
    }

    refreshData(reset = false) {
        this.scrollSer.scrollToTop();
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        // this.queryParams.tenantId = 0;
        this._loading = false;
        this.userGroupId = this.route.snapshot.params['id'];
        if (!this.userId) {
            this.userId = this.route.snapshot.params['id'];
        }
        const params = this.queryParams;
        if (this.isInUser) { // 是dialog就查不属于某用户的
            params['id'] = this.userId;
        } else {
            params['inId'] = this.userId;
        }
        if (!this.userGroupId) {
            params['page'] = this._current;
            params['rows'] = this._pageSize;
        } else {
            params['page'] = this._current;
            params['rows'] = this._pageSize;
            params['virtualRoleId'] = this.userGroupId;
        }
        params['tenantId'] = this.tenantId;
        params['virtualRoleType'] = 'ROLE';

        if (!this.viewType) {
            this.getRoleNotC(params);
        } else {
            this.service.getUserGroups(params).then((data: any) => {
                this._loading = false;
                this._total = data.total;
                this._dataSet = data.list;
            });
        }

    }

    deleteRoleFromUserGroup(role: any) {
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
        }
        this.service.getUserGroupPageDetail(this.userGroupId).then((data: any) => {
            if (data.success) {
                this.userGroup = data.data;
                const _this_ = this;
                this.confirmServ.confirm({
                    nzMaskClosable: false,
                    nzTitle: '确定要移除用户' + role.name + '吗？',
                    nzContent: '',
                    nzOnOk() {
                        _this_.service.deleteRoleFromUserGroup(_this_.userGroup, role).then((response: any) => {
                            if (response.success) {
                                const params = {
                                    virtualRoleId: _this_.userGroupId
                                };
                                _this_.service.getAddUgRoles(params).then((dating: any) => {
                                    _this_._loading = false;
                                    _this_._total = dating.total;
                                    _this_._dataSet = dating.list;
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

    deleteRoleFromUser(role: any) {
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
        }
        this.service.getUgUserById(this.userGroupId).then((data: any) => {
            if (data.success) {
                this.user = data.data;
                const _this_ = this;
                this.confirmServ.confirm({
                    nzMaskClosable: false,
                    nzTitle: '确定要移除用户' + role.name + '吗？',
                    nzContent: '',
                    nzOnOk() {
                        _this_.service.deleteRolesFromUser(_this_.user, role.id).then((response: any) => {
                            if (!response.success) {
                                alert(response.result);
                            }
                        });
                    }
                });
            }
        });
    }


    /**使用复选框**/
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
        this.onCheckAddRole.emit(this._checkList);
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

    ngOnChanges(changes: SimpleChanges) {
        this.queryParams = changes.queryParams.currentValue || {};
        this.reset();

        /**使用复选框**/
        if (this.refresh) {
            this._checkAll(false);
            this._allChecked = false;
        }
    }

    ngOnInit() {
        // 升级前
        // this.router.events.filter(event => event instanceof NavigationEnd).subscribe((data: any) => {
        //   if (data.url.indexOf('viewUserGroupDetail') !== -1) {
        //     this.viewType = 0;
        //   } else if (data.url.indexOf('viewTenantUserPage') !== -1) {
        //     this.viewType = 1;
        //   }
        // });
        this.router.events.subscribe(Event => {
            if (Event instanceof NavigationEnd) {
                // 待改
                console.log(Event);
                // if (Event.url.indexOf('viewUserGroupDetail') !== -1) {
                //   this.viewType = 0;
                // } else if (Event.url.indexOf('viewTenantUserPage') !== -1) {
                //   this.viewType = 1;
                // }
            }
        });


        this.userGroupId = this.route.snapshot.params['id'];
        this.reset();
    }

    /**
     * 获取未被选的角色的信息
     * @return {[type]} [description]
     */
    private getRoleNotC(params: any) {
        params['type'] = 'ROLE';
        delete params.virtualRoleId;
        delete params.virtualRoleType;
        params.virtualroleId = params.id;
        delete params.id;

        this.service.getRoleGroupList(params).then((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
        });

        this._allChecked = false;
        this._indeterminate = false;
    }


}
