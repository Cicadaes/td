import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UgRolesTableService } from './ugroles-table.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'ugroles-table',
    templateUrl: './ugroles-table.component.html',
    styleUrls: ['./ugroles-table.component.css']
})

export class UgRolesTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() userId: number;
    @Input() tenantId: number;
    @Input() isUserRelation = false;
    isShowRoleModal = false;
    currentRole: any;

    /**使用复选框**/
    @Input() refresh = false;
    @Input() reload = false;
    @Output() onCheckRole = new EventEmitter<any[]>();
    _allChecked = false;
    _indeterminate = false;
    _checkList: any = [];

    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    _sortValue: any = null;
    userGroupId: any;
    userGroup: any;
    // 页面类型，在那个组件下
    // 0 --- 用户组
    // 1 --- 用户
    // private viewType: number = 0
    @Input() viewType = 0;

    @Input() set toSubmit(toSubmit: EventEmitter<any>) {
        toSubmit && toSubmit.subscribe(() => {
          this.reset();
        })
    }
    constructor(
        private scrollSer: ScrollToTopService,
        private service: UgRolesTableService,
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
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        if (!this.userId) {
            this.userId = this.route.snapshot.params['id'];
        }
        const params = {};
        params['inId'] = this.userId;
        params['page'] = this._current;
        params['rows'] = this._pageSize;
        params['virtualRoleId'] = this.userGroupId;
        params['virtualRoleType'] = 'ROLE';
        params['tenantId'] = this.tenantId;

        if (!this.viewType) {
            this.getRoleData(params);
        } else {
            this.service.getUserGroups(params).then((data: any) => {
                this._loading = false;
                this._total = data.total;
                this._dataSet = data.list;
                this.scrollSer.scrollToTop();
                this._refreshStatus();
            });
        }



    }

    deleteRolesFormUserGroup(role: any) {
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
        }
        if (!this.isUserRelation) {
            this.deleteUserGpRole([role]);
        } else {
            this.deleteUserRole([role]);
        }
    }


    /**使用复选框**/
    _refreshStatus() {
        if (this._dataSet && this._dataSet.length) {
            const allChecked = this._dataSet.every((value: any) => value.checked === true);
            const allUnChecked = this._dataSet.every((value: any) => !value.checked);
            this._allChecked = allChecked;
            this._indeterminate = (!allChecked) && (!allUnChecked);
        } else {
            this._indeterminate = false;
        }

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
        this.onCheckRole.emit(this._checkList);
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
        /**使用复选框**/
        if (this.refresh) {
            this._checkAll(false);
            this._allChecked = false;
        }
    }

    ngOnInit() {
        this.userGroupId = this.route.snapshot.params['id'];
        this.reset();
        // 升级前
        // this.router.events.filter(event => event instanceof NavigationEnd).subscribe((data: any) => {
        //   if (data.url.indexOf('viewUserGroupDetail') !== -1) {
        //     this.viewType = 0;
        //   } else if (data.url.indexOf('viewTenantUserPage') !== -1) {
        //     this.viewType = 1;
        //   }
        // });
        this.router.events.subscribe((Event: any) => {
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
    }

    /**
     * 获取的角色列表信息
     * @return {[type]} [description]
     */
    private getRoleData(params: any) {
        params.type = 'ROLE';
        params['virtualroleId'] = this.userId;
        delete params.virtualRoleType;
        delete params.virtualRoleId;
        delete params.inId;
        this.service.getRoleUserGroup(params).then((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
            this._refreshStatus();
        });
    }

    /**
     * 获取选中的row
     * @return {[type]} [description]
     */
    private getCheckList(data: any) {
    }

    /**
     * 删除用户被授权的角色
     * @return {[type]} [description]
     */
    private deleteUserRole(data: any) {
        const params: any = this.getUserRoleInfo(data);
        const _this_ = this;
        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: '您确定要移除角色\"' + params.name + '\"吗？',
            nzContent: '',
            nzOnOk() {
                _this_.service.deleteRolesFromUserGroup({ userId: _this_.userGroupId, vroleIdSet: params.id, }).then((response: any) => {
                    if (response.success) {
                        // const params = {
                        //   virtualRoleId: _this_.userGroupId
                        // };
                        //  _this_._loading = false;
                        _this_.refreshData();
                        /*_this_.service.getUgRoles(params).then((data: any) => {
                          _this_._loading = false;
                          _this_._dataSet = data.list;
                        });*/
                    } else {
                        alert(response.result);
                    }
                });
            }
        });

    }


    /**
     * 获取删除用户角色的接口参数
     * @return {[type]} [description]
     */
    private getUserRoleInfo(data: any) {
        if (data && data.length) {
            const nameArr: any = [];
            const idArr: any = [];
            data.forEach((item: any) => {
                nameArr.push(item.name);
                idArr.push(item.id);
            });
            return {
                name: nameArr.join(','),
                id: idArr.join(',')
            };
        }
    }

    /**
     * 删除用户被授权的角色
     * @return {[type]} [description]
     */
    private deleteUserGpRole(data: any) {
        const params: any = this.getUserRoleInfo(data);
        const _this_ = this;
        this.confirmServ.confirm({
            nzTitle: '您确定要移除角色\"' + params.name + '\"吗？',
            nzContent: '',
            nzOnOk() {
                _this_.service.deleteUserGpRole({ vroleId: _this_.userGroupId, roleIdSet: params.id }).then((response: any) => {
                    if (response.success) {
                        _this_.refreshData();
                    } else {
                        alert(response.result);
                    }
                });
            }
        });

    }


    /**
     * 刷新表格数据
     * @return {[type]} [description]
     */
    private onRefresh() {

    }
}
