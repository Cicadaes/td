import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ShowOrganizationPageService } from './show-organization-page.service';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-cosmos-ui';
import { ApplistService } from '../../../@themes/transform-service';

@Component({
  selector: 'show-organization-page',
  templateUrl: './show-organization-page.component.html',
  styleUrls: ['./show-organization-page.component.css'],
  providers: [FormBuilder]
})

export class ShowOrganizationPageComponent implements OnInit, OnChanges {
  @Output() onClose = new EventEmitter<any>();
  @Input() _dataSet: any = [];
  @Input() organization: any;
  appList: any;
  tenantAppList: any[] = [];
  status = true;
  name = '';
  desc = '';
  licence: any = {};
  @Input() isedit = false;
  isShowLicenceAppModal = false;
  currentData: any;
  uguserFieldArray: any[];
  oruserTableFieldParams: any;
  refreshOguserTableStatus = false;
  checkedUser: any[] = [];
  tenantId: any;
  tabIndex = 0;

  isShowAddUerModal = false;
  isReloadUserTable = false;
  currentUser: any;
  isShowAddUerList = false;

  //  角色列表功能需求变量
  isReloadRoleTable = false;
  refreshUgRoleTableStatus = false;
  isShowAddRoleModal = false;
  checkedRole: any[] = [];
  isUserRelation = false;
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


  constructor(private appListSer: ApplistService, private fb: FormBuilder, private service: ShowOrganizationPageService, private router: Router, private confirmServ: NzModalService) {

  }

  handleOk = (e: any) => {

  }


  ngOnInit() {
    /*this.organization={
        name:'市场部',
        desc:'市场部部门描述部门描述部门描述部门描述部门描述部门描述部门描述部门描述部门描述部门描述部门描述部门描述部门描述',
        id:16,
        tenantId:2
    };*/
    console.log(this.organization);
    this.initUserFieldArray();
    this.queryOrganizationAppList();
    // this.queryTenantAppList();
    this.tenantId = this.organization.tenantId;
    // alert(this.organization.tenantId)
  }



  hideAddAppModal() {
    this.isShowLicenceAppModal = false;
  }

  editAttribute(data: any) {
    this.isShowLicenceAppModal = true;
    this.isedit = true;
    this.currentData = data;
  }

  deleteAttribute(data: any) {
    const key = data.key;
    const name = data.name;
    for (let i = this._dataSet.length - 1; i >= 0; i--) {
      const p = this._dataSet[i];
      if (p.key === key && p.name === name) {
        this._dataSet.splice(i, 1);
      }
    }
  }
  refreshData() {
    const params = {};

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
      id: 6,
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

  showAddUserModal(user: any) {
    this.currentUser = user;
    this.isReloadUserTable = false;
    this.isShowAddUerModal = true;
  }
  showAddUserList(user: any) {
    this.currentUser = user;
    this.isReloadUserTable = false;
    this.isShowAddUerList = true;
  }
  hideAddUserModal(params: any) {
    this.isShowAddUerModal = false;
  }

  hideAddUserListModal(params: any) {
    this.isShowAddUerList = false;
  }
  onSearchOrUserList(params: any) {
    this.oruserTableFieldParams = params;
    this.refreshOguserTableStatus = true;
  }


  onSubmitUserListData(params: boolean) {
    this.isReloadUserTable = params || false;
    if (this.isReloadUserTable) {
      //  this.refreshData();
    }
  }

  // 角色列表功能需求变量

  showAddRoleModal() {
    this.isReloadRoleTable = false;
    this.isShowAddRoleModal = true;
  }
  hideAddRoleListModal(params: any) {
    this.isShowAddRoleModal = false;
  }

  onSubmitRoleListData(params: boolean) {
    this.isReloadRoleTable = params || false;

  }
  onCheckUgRoles(roles: any[]) {
    this.checkedRole = roles;
  }

  onCheckUgUsers(data: any[]) {
    this.checkedUser = data;
  }
  deleteUsersFromUserGroup(users: any) {
    this.isReloadUserTable = false;
    this.refreshOguserTableStatus = false;
    if (this.checkedUser && this.checkedUser.length > 0) {
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
          _this_.service.deleteUsersFromUserGroup(_this_.organization, uids).subscribe((data: any) => {
            if (data.status === 200) {
              _this_.isReloadUserTable = true;
              _this_.isShowAddUerModal = false;
              _this_.refreshOguserTableStatus = true;
            } else {
              alert(data.result);
            }
          });
        },
        nzOnCancel() {
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

  deleteRolesFromUserGroup(users: any) {
    this.isReloadRoleTable = false;
    this.refreshUgRoleTableStatus = false;
    if (this.checkedRole && this.checkedRole.length > 0) {

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
          _this_.service.deleteRolesFromUserGroup(_this_.organization, uids).then((data: any) => {
            if (data.success) {
              _this_.isReloadRoleTable = true;
              _this_.isShowAddUerModal = false;
              _this_.refreshUgRoleTableStatus = true;
              _this_.isUserRelation = false;
            } else {
              alert(data.result);
            }
          });
        },
        nzOnCancel() {
        }
      });
    } else {
      this.confirmServ.info({
        nzTitle: '请选择角色',
        nzContent: '',
        //  title: '提示',
        //  content: '请选择角色',
      });
    }
  }


  // 初始化数据根据许可证id查询app功能集
  queryOrganizationAppList() {
    const param: any = {};
    param.id = this.organization.id;
    const _addList = this.appList;
    this.appList = null;
    this.service.queryOrganizationAppList(param).then((data: any) => {
      if (data.success) {
        this.appList = data.data;
      }
    }).catch((err: any) => {
      console.log(err);
      this.appList = _addList;
    });
  }

  resetCarouselAppList(data: any) {
    //  if(data){
    //      this.queryOrganizationAppList();
    //  }
  }


  onSubmitAppData(data: any) {
    this.appList = data;
    // 修改关联的应用
    this.updateOrganizationApp();

  }
  /*updateLicenceApp(){
      this.licence.id=this.organization.id;
      this.licence.appList=this.appList;
      this.service.updateLicenceAppList(this.licence).then((data: any) => {
          // this.onClose.emit(false);
      }).catch((err:any)=>{
          console.log(err);
      });
  }*/
  updateOrganizationApp() {
    const pa: any = { vroleId: this.organization.id, appList: this.appList };
    pa.appList = this.appListSer.deleteIcon(this.appList) || [];
    this.service.authorizeFunctionList(pa).then((data: any) => {
      if (data.success === true) {
        this.queryOrganizationAppList();
        // alert('授权成功！');
        // this.initFuncAuthList();
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }

  changeIndexFun(e: any) {
    this.tabIndex = e;
  }
  ngOnChanges(changes: SimpleChanges) {
    // this.queryParams = changes.queryParams.currentValue || {};
    if (changes.organization) {
      this.tabIndex = 0;
    }
    this.queryOrganizationAppList();
  }

  queryTenantAppList() {
    const param: any = {};
    param.tenantId = this.organization.tenantId;
    this.service.queryTenantAppList(param).then((data: any) => {
      console.dir(data);
      if (data.success === '200') {
        this.tenantAppList = data.result;
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }


}
