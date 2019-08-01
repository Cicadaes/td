import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DetailTenantUserPageService } from './detail-tenantuser-page.service';
import { ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ApplistService } from '../../../@themes/transform-service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'detail-app-page',
    templateUrl: './detail-tenantuser-page.component.html',
    styleUrls: ['./detail-tenantuser-page.component.css'],
    providers: [DetailTenantUserPageService]
})

export class DetailTenantUserPageComponent implements OnInit {
    functionFieldArray: any[];
    functionTableFieldParams: any;
    isShowAddUerModal: boolean;
    userGroup: any;
    isShowEditAppModal = false;
    id: number;
    user: any;
    // 功能模块功能实现需求变量
    appList: any;
    licence: any;
    appAttributeParams: any = {};
    queryParams: any = {};
    _dataSet: any = [];
    tenantId: number;

    private viewType = 1;

    private toSubmit: EventEmitter<any> = new EventEmitter<any>()
    tabs: any = [];

    /**用户组弹出框列表**/
    isReloadUgUserGroupTable = false;
    refreshUgUserGroupStatus = false;
    isShowAddUgUserGroupModal = false;
    checkedUserGroups: any[];
    // 角色列表
    isReloadRoleTable = false;
    refreshUgRoleTableStatus = false;
    isShowAddRoleModal = false;
    checkedRole: any[] = [];
    isUserRelation = true;

    onCheckUgUsersGroup(users: any[]) {
        this.checkedUserGroups = users;
    }
    showAddUserGroupsModal(user: any) {
        this.isReloadUgUserGroupTable = false;
        this.isShowAddUgUserGroupModal = true;
    }
    onSubmitUgUserGroupFormData(params: boolean) {
        this.isReloadUgUserGroupTable = params || false;
        if (this.isReloadUgUserGroupTable) {
            // this.refreshData();
        }
    }
    hideAddUgUserGroupModal(params: any) {
        this.isShowAddUgUserGroupModal = false;
    }
    deleteUserGroupsFromUser() {
        this.isReloadRoleTable = false;
        this.refreshUgRoleTableStatus = false;
        if (this.checkedUserGroups && this.checkedUserGroups.length > 0) {
            if (!this.id) {
                this.id = this.route.snapshot.params['id'];
            }
            this.service.getUgUserById(this.id).then((data: any) => {
                if (data.success) {
                    this.user = data.data;
                    const _this_ = this;
                    let userGroupNames = '';
                    this.checkedUserGroups.forEach((user: any, index: any) => {
                        userGroupNames += user.name + ',';
                    });
                    userGroupNames = userGroupNames.substring(0, userGroupNames.length - 1);
                    let uids = '';
                    this.checkedUserGroups.forEach((user: any, index: any) => {
                        uids += user.id + ',';
                    });
                    uids = uids.substring(0, uids.length - 1);
                    this.confirmServ.confirm({
                        nzMaskClosable: false,
                        nzTitle: '您确认要批量移除选定用户组吗？',
                        nzContent: '',
                        nzOnOk() {
                            _this_.service.deleteUserGroupsFromUser(_this_.user, uids).then((response: any) => {
                                if (response.success) {
                                    _this_.isReloadUgUserGroupTable = true;
                                    _this_.refreshUgUserGroupStatus = true;
                                } else {
                                    alert(response.result);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            this.confirmServ.info({
                nzTitle: '请选择用户组',
                nzContent: '',
            });
        }
    }

    constructor(
        private appListSer: ApplistService,
        private service: DetailTenantUserPageService,
        private route: ActivatedRoute,
        private confirmServ: NzModalService) {
    }


    showAddRoleModal(user: any) {
        this.isReloadRoleTable = false;
        this.isShowAddRoleModal = true;
    }
    onSubmitRoleListData(params: boolean) {
        this.isReloadRoleTable = params || false;

    }
    hideAddRoleListModal(params: any) {
        this.toSubmit.emit();
        this.isShowAddRoleModal = false;
    }
    addRoleFromUserGroup(roles: any[]) {
        this.checkedRole = roles;
    }
    onCheckUgRoles(roles: any[]) {
        this.checkedRole = roles;
    }
    deleteRolesFromUser() {
        this.isReloadRoleTable = false;
        this.refreshUgRoleTableStatus = false;
        if (this.checkedRole && this.checkedRole.length > 0) {
            if (!this.id) {
                this.id = this.route.snapshot.params['id'];
            }
            this.service.getUgUserById(this.id).then((data: any) => {
                if (data.success) {
                    const _this_ = this;
                    let roleNames = '';
                    this.checkedRole.forEach((user: any, index: any) => {
                        roleNames += user.name + ',';
                    });
                    roleNames = roleNames.substring(0, roleNames.length - 1);
                    let uids = '';
                    this.checkedRole.forEach((user: any, index: any) => {
                        uids += user.id + ',';
                    });
                    uids = uids.substring(0, uids.length - 1);
                    this.confirmServ.confirm({
                        nzMaskClosable: false,
                        nzTitle: '您确认要批量移除选定角色吗？ ',
                        nzContent: '',
                        nzOnOk() {
                            _this_.service.deleteUserGroupsFromUser(_this_.user, uids).then((response: any) => {
                                if (response.success) {
                                    _this_.isReloadRoleTable = true;
                                    _this_.isShowAddUerModal = false;
                                    _this_.refreshUgRoleTableStatus = true;
                                    _this_.isUserRelation = true;

                                    _this_.toSubmit.emit();

                                } else {
                                    alert(response.result);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            this.confirmServ.info({
                nzTitle: '请选择角色',
                nzContent: '',
            });
        }
    }





    initFunctionFieldArray(): void {
        this.functionFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '功能名称',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'fucTypeDicId',
            fieldLabel: '功能类别',
            fieldType: 'select',
            apiData: true,
            apiUrl: '/console-api/appController/queryAppAttributeListByName',
            apiParam: {},
            initValue: '',
            selectOptions: []
        }];
    }

    showEditUserModal() {
        this.isShowEditAppModal = true;
    }

    hideEditUserModal() {
        this.isShowEditAppModal = false;
        this.reflashUserDetail();
    }

    reflashUserDetail() {
        this.service.getUgUserById(this.id).then((data: any) => {
            if (data.success) {
                this.user = data.data;
                if (this.user && this.user.status) {
                    this.tabs = [
                        {
                            name: '基本信息',
                            tabCode: '1'
                        },
                        {
                            name: '所属用户组',
                            tabCode: '2'
                        },
                        {
                            name: '被授予的角色',
                            tabCode: '3'
                        },
                        {
                            name: '授权',
                            tabCode: '4'
                        }
                    ];
                } else {
                    this.tabs = [
                        {
                            name: '基本信息',
                            tabCode: '1'
                        }
                    ];
                }
            }
        });
    }

    onSubmitAppData(data: any) {
        this.appList = data;
        // 修改关联的应用
        this.updateUserApp();
    }
    updateUserApp() {
        this.user.userId = this.id;
        this.user.appList = this.appList;
        this.user.appList = this.appListSer.deleteIcon(this.appList) || [];

        this.service.updateUserAppList(this.user).then((data: any) => {
            this.queryAppListByUser();

        }).catch((err: any) => {
            console.log(err);
        });
    }
    reflashAppDetail() {
        this.service.getAppPageDetail(this.id).then((data: any) => {
            if (data.success === '200' || data.success === 200) {
                this.licence = data.result;
            }
        }).catch((err: any) => {
            console.log(err);
        });
    }
    reflashLicenceAttribute() {
        this.service.getLicenceAttribute(this.id).then((data: any) => {
            if (data.success === '200' || data.success === 200) {
                this._dataSet = data.result;
            }
        }).catch((err: any) => {
            console.log(err);
        });
    }
    queryAppListByUser() {
        if (!this.id) {
            this.id = this.route.snapshot.params['id'];
        }
        const params = { userId: this.id };
        const _appList = this.appList;
        this.appList = null;
        this.service.queryAppListByUser(params).then((data: any) => {
            if (data.success) {
                this.appList = data.data;
            }
        }).catch((err: any) => {
            this.appList = _appList;
            console.log(err);
        });
    }

    // resetCarouselAppList(data:any){
    //     if(data){
    //         this.queryAppListByUser();
    //     }
    // }

    ngOnInit() {
        console.log('=======>flag');
        this.initFunctionFieldArray();
        if (this.route.snapshot.params['tenantId'] != null) {
            this.tenantId = this.route.snapshot.params['tenantId'];
        } else if (window['appConfig'] && window['appConfig'].tenant) {
            this.tenantId = window['appConfig'].tenant.id;
        } else {
            this.tenantId = 0;
        }
        this.id = this.route.snapshot.params['id'];
        this.reflashUserDetail();

        // 功能模块功能实现需求变量
        this.appAttributeParams.id = this.id;
        this.queryParams.id = this.id;
        this.queryAppListByUser();
    }



}
