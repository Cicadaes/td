import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DetailUserGroupPageService } from './detail-userGroup-page.service';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-cosmos-ui';
import 'rxjs/add/operator/switchMap';

import { ApplistService } from '../../../@themes/transform-service';

@Component({
  selector: 'app-detail-user-group-page',
  templateUrl: './detail-userGroup-page.component.html',
  styleUrls: ['./detail-userGroup-page.component.css'],
  providers: [DetailUserGroupPageService]
})

export class DetailUserGroupPageComponent implements OnInit {
  userGroup: any;
  uguserFieldArray: any[];
  uguserTableFieldParams: any;
  isShowEditAppModal  = false;
  checkedUser: any[] = [];
  ids: any[] = [];
  id: any;
  user: any;
  tenantId: number;
  //  新增用户 使用变量
  isShowAddUerModal = false;
  isReloadUserTable = false;
  refreshUguserTableStatus = false;
  currentUser: any;
  // 用户组批量添加用户变量
  isShowAddUerList = false;
  // 角色列表功能需求变量
  isReloadRoleTable  = false;
  refreshUgRoleTableStatus = false;
  isShowAddRoleModal = false;
  checkedRole: any[] = [];
  isUserRelation = false;
  appList: any;
  licence: any;
  appAttributeParams: any = {};
  queryParams: any = {};
  _dataSet: any = [];
  isInitPage = true;
  tabs = [
    {
      name: '用户',
      tabCode: '1'
    },
    {
      name: '被授予的角色',
      tabCode: '2'
    },
    {
      name: '授权',
      tabCode: '3'
    }
  ];

  private toSubmit: EventEmitter<any> = new EventEmitter<any>();
  private _refresh: EventEmitter<any> = new EventEmitter<any>();
  private viewType = 0;


  constructor(
      private appListSer: ApplistService,
      private service: DetailUserGroupPageService,
       private route: ActivatedRoute,
       private confirmServ: NzModalService) {

  }

  onSearchUgUserList(params: any) {
    this.uguserTableFieldParams = params;
    this.refreshUguserTableStatus = true;
  }

  initUserFieldArray(): void {
    this.uguserFieldArray = [{
      id: 1,
      fieldName: 'name',
      fieldLabel: '姓名',
      fieldType: 'input'
    }, {
      id: 2,
      fieldName: 'email',
      fieldLabel: '账号',
      fieldType: 'input'
    }, {
      id: 3,
      fieldName: 'mobile',
      fieldLabel: '手机',
      fieldType: 'input'
    }, {
      id: 4,
      fieldName: 'status',
      fieldLabel: '状态',
      fieldType: 'select',
      apiData: false,
      initValue: '',
      selectOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '正常'
      }, {
        value: '0',
        label: '禁用'
      }]
    }];
  }

  showEditUserGroupModal() {
    this.isShowEditAppModal = true;
  }

  onCheckUgUsers(users: any[]) {
    this.checkedUser = users;
  }

  deleteUsersFromUserGroup(users: any) {
    //  this.isReloadUserTable = false;
    this.refreshUguserTableStatus = false;
    if (this.checkedUser && this.checkedUser.length > 0) {
      this.service.getUserGroupPageDetail(this.id).then((data: any) => {
        if (data.success) {
          this.userGroup = data.data;
          const _this_ = this;
          let userNames = '';
          this.checkedUser.forEach((user: any, index: any) => {
            userNames += user.name + ',';
          });
          userNames = userNames.substring(0, userNames.length - 1);
          let uids = '';
          this.checkedUser.forEach((user: any, index: any) => {
            uids += user.id + ',';
          });
          uids = uids.substring(0, uids.length - 1);
          this.confirmServ.confirm({
            nzTitle: '您确认要批量移除选定用户吗？',
            nzContent: '',
            nzOnOk: () => {
              _this_.service.deleteUsersFromUserGroup(_this_.userGroup, uids).then((data1: any) => {
                if (data1.success) {
                  _this_.isReloadUserTable = true;
                  _this_.isShowAddUerModal = false;
                  _this_.refreshUguserTableStatus = true;
                } else {
                  alert(data.result);
                }
              });
            },
            nzOnCancel: () => {
            }
          });
        }
      });
    } else {
      this.confirmServ.info({
        nzTitle: '请选择用户',
        nzContent: '',
        //  title: '提示',
        //  content: '请选择用户',
      });
    }
  }

  hideEditUserGroupModal() {
    this.isShowEditAppModal = false;
    this.reflashUserGroupDetail();
  }

  reflashUserGroupDetail() {
    this.service.getUserGroupPageDetail(this.id).then((data: any) => {
      if (data.success) {
        this.userGroup = data.data;
      }
    });
  }


  //  新增用户 使用变量
  hideAddUserModal(params: any) {
    this.isShowAddUerModal = false;
  }
  showAddUserModal(user: any) {
    this.currentUser = user;
    this.isReloadUserTable = false;
    this.isShowAddUerModal = true;
  }
  onSubmitUserFormData(params: boolean) {
    this.isReloadUserTable = params || false;
    if (this.isReloadUserTable) {
      //  this.refreshData();
    }
  }

  // 用户组批量添加用户变量
  onSubmitUserListData(params: boolean) {
    this.isReloadUserTable = params || false;
    if (this.isReloadUserTable) {
      // this.refreshData();
    }
  }
  hideAddUserListModal(params: any) {
    this.isShowAddUerList = false;
  }
  showAddUserList(user: any) {
    this.currentUser = user;
    this.isReloadUserTable = false;
    this.isShowAddUerList = true;
  }

  // 角色列表功能需求变量
  showAddRoleModal(user: any) {
    this.isReloadRoleTable = false;
    this.isShowAddRoleModal = true;
  }

  onSubmitRoleListData(params: boolean) {
    this.refreshUgRoleTableStatus = true;
    this.isReloadRoleTable = params || false;
  }

  hideAddRoleListModal(params: any) {
    this.isShowAddRoleModal = false;
    this.toSubmit.emit();
  }

  deleteRolesFromUserGroup(users: any) {
    this.isReloadRoleTable = false;
    this.refreshUgRoleTableStatus = false;
    if (this.checkedRole && this.checkedRole.length > 0) {
      this.service.getUserGroupPageDetail(this.id).then((data: any) => {
        if (data.success) {
          this.userGroup = data.data;
          const _this_ = this;
          let userNames = '';
          this.checkedRole.forEach((user: any, index: any) => {
            userNames += user.name + ',';
          });
          userNames = userNames.substring(0, userNames.length - 1);
          let uids = '';
          this.checkedRole.forEach((user: any, index: any) => {
            uids += user.id + ',';
          });
          uids = uids.substring(0, uids.length - 1);
          this.confirmServ.confirm({
            nzTitle: '您确认要批量移除选定角色吗？',
            nzContent: '',
            nzOnOk: () => {
              _this_.service.deleteRolesFromUserGroup(_this_.userGroup, uids).then((data1: any) => {
                if (data1.success) {
                  _this_.toSubmit.emit();
                  _this_.isReloadRoleTable = true;
                  _this_.isShowAddUerModal = false;
                  _this_.refreshUgRoleTableStatus = true;
                  _this_.isUserRelation = false;
                } else {
                  alert(data1.result);
                }
              });
            },
            nzOnCancel: () => {
            }
          });
        }
      });
    } else {
      this.confirmServ.info({
        nzTitle: '请选择角色',
        nzContent: '',
        //  title: '提示',
        //  content: '请选择用户',
      });
    }
  }


  addRoleFromUserGroup(roles: any[]) {
    this.checkedRole = roles;
  }

  onCheckUgRoles(roles: any[]) {
    this.checkedRole = roles;
  }



  // 功能模块功能实现需求变量

  onSubmitAppData(data: any) {
    this.appList = data;
    // 修改关联的应用
    this.updateUserGroupApp();
  }
  updateUserGroupApp() {
    if (!this.id) {
      this.id = this.route.snapshot.params['id'];
    }
    const params = {
      vroleId: this.id,
      appList: this.appList
    };
    params.appList = this.appListSer.deleteIcon(this.appList) || [];

    this.service.updateUserGroupAppList(params).then((data: any) => {
      //  this._refresh.emit()
      this.queryAppListByUserGroup();
    }).catch((err: any) => {
      console.log(err);
    });
  }
  queryAppListByUserGroup() {
    if (!this.id) {
      this.id = this.route.snapshot.params['id'];
    }
    const params = { vroleId: this.id };
    const _appList = this.appList;
    this.appList = null;
    this.service.queryAppListByUserGroup(params).then((data: any) => {
      if (data.success) {
        this.appList = data.data;
        /*if(this.appList.length > 0) {
            this.isInitPage = false;
        }*/
      }
    }).catch((err: any) => {
      console.log(err);
      this.appList = _appList;
    });
  }





  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.tenantId = this.route.snapshot.params['tenantId'];
    this.reflashUserGroupDetail();
    this.initUserFieldArray();

    // 功能模块功能实现需求变量、
    this.appAttributeParams.id = this.id;
    this.queryParams.id = this.id;
    this.queryAppListByUserGroup();
  }





}
