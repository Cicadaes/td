import { Component, OnInit, OnDestroy, Input, SimpleChanges, OnChanges } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { NzModalService } from 'ng-cosmos-ui';
@Component({
  selector: 'user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isSuper = true;
  @Input() roleId = 0;
  @Input() userId = 0;
  @Input() tenantId = 0;

  isReloadData = false;
  userQuery: any = {};

  batchRemoveUsers = false;

  userAuthFieldArray: any[] = [];
  userAuthTableAjaxUrl: string;
  isShowAddUserAuthModal = false;
  isShowAddUerModal = false;

  private canShow = false;

  constructor(private service: UserAuthService, private confirmServ: NzModalService) {
    this.userAuthTableAjaxUrl = service.getUserAuthUrl;
  }

  showAddUserModal() {
    this.isShowAddUerModal = true;
    this.isReloadData = false;
  }

  hideAddUserModal(params: any) {
    this.isShowAddUerModal = false;
  }

  showAddUserAuthModal() {
    this.isShowAddUserAuthModal = true;
    this.isReloadData = false;
  }

  hideAddUserAuthModal(params: any) {
    this.isShowAddUserAuthModal = false;
  }

  onSubmitUserAuthData(submitted: boolean) {
    this.isReloadData = submitted;
  }

  batchRemove(event: any) {
    if (this.canShow) {
      this.confirmServ.confirm({
        nzTitle: '您确认要批量移除选定用户吗？',
        nzContent: '<strong></strong>',
        nzOnOk: () => {
          this.batchRemoveUsers = true;
        }
      });
    } else {
      this.confirmServ.info({
        nzTitle: '请先选择用户',
        nzContent: '<strong></strong>'
      });
    }

  }

  onSearchUserAuthList(params: any) {
    params.vroleId = this.roleId;
    params.tenantId = this.tenantId;
    this.userQuery = params;

    this.isReloadData = true;
  }

  initUserAuthFieldArray(): void {
    if (this.isSuper) {
      this.userAuthFieldArray = [{
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
      }, /*{
                id:4,
                fieldName:'qq',
                fieldLabel:'QQ',
                fieldType:'input'
            },{
                id:5,
                fieldName:'wechat',
                fieldLabel:'微信',
                fieldType:'input'
            },*/
      {
        id: 4,
        fieldName: 'updateUserName',
        fieldLabel: '更新人',
        fieldType: 'input'
      }, {
        id: 5,
        fieldName: 'updateTimeRange',
        fieldLabel: '更新时间',
        fieldType: 'date-range'
      }
      ];
    } else {
      this.userAuthFieldArray = [{
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
      },
      // ,{
      //     id:4,
      //     fieldName:'qq',
      //     fieldLabel:'QQ',
      //     fieldType:'input'
      // },{
      //     id:5,
      //     fieldName:'wechat',
      //     fieldLabel:'微信',
      //     fieldType:'input'
      // },
      {
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
      },
        // {
        //     id:5,
        //     fieldName:'updateUserName',
        //     fieldLabel:'操作人',
        //     fieldType:'input'
        // },{
        //     id:6,
        //     fieldName:'updateTimeRange',
        //     fieldLabel:'操作时间',
        //     fieldType:'date-range'
        // }
      ];
    }

  }

  ngOnInit() {
    this.userQuery.vroleId = this.roleId;
    this.userQuery.tenantId = this.tenantId;

    this.initUserAuthFieldArray();
  }

  ngOnChanges(changes: SimpleChanges) {
    /*for (let key in changes) {
        if (key == "user" && changes.user.currentValue != null ) {
            this.user = changes.user.currentValue;
            this.userQuery.tenantId = this.user.tenantId;
        } else if (key == "role" && changes.role.currentValue != null ) {
            this.role = changes.role.currentValue;
            this.userQuery.vroleId = this.role.id;
        }
    }*/
  }
  ngOnDestroy() {
    this.isReloadData = false;
  }

  /**
   * 检查是否有数据，确定是否显示弹窗
   * @return {[type]} [description]
   */
  private checkData(data: any) {
    this.canShow = data;
  }


}
