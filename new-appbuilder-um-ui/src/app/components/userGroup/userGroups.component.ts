import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserGroupsService } from './userGroups.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-groups',
  templateUrl: './userGroups.component.html',
  styleUrls: ['./userGroups.component.css']
})
export class UserGroupsComponent implements OnInit, OnDestroy {
  userGroupFieldArray: any[];
  userGroupTableFieldParams: any = {};
  userTableAjaxUrl: string;
  isShowAddUserGroupModal = false;
  isReloadUserGroupTable = false;
  tenantId: number;
  search: any;            // input 搜索

  constructor(private service: UserGroupsService, private confirmServ: NzModalService, private route: ActivatedRoute) {
    this.userTableAjaxUrl = service.getUserGroupsUrl;
  }

  showConfirm() {
    this.confirmServ.confirm({
      nzTitle: '您是否确认要删除这项内容',
      nzContent: '<strong>一些解释</strong>',
      nzOnOk: () => {
        console.log('确定');
      },
      nzOnCancel: () => {
      }
    });
  }

  showInfo() {
    this.confirmServ.info({
      nzTitle: '这是一条通知信息',
      nzContent: '信息内容'
    });
  }

  showAddUserGroupModal() {
    // this.isReloadUserGroupTable = false;
    this.isShowAddUserGroupModal = true;
  }

  hideAddUserGroupModal(params: any) {
    this.isShowAddUserGroupModal = false;
  }

  onSubmitUserGroupFormData(params: boolean) {
    this.isReloadUserGroupTable = params || false;
    this.userGroupTableFieldParams = {};
    this.userGroupTableFieldParams.tenantId = this.tenantId;
  }

  onSearch(event: any, type: any) {
    const that = this;
    if (type === 'click') {
        if (event) {
            event = event.replace(/(^\s*)|(\s*$)/g, '');
        }
        that.userGroupTableFieldParams = { name: event, tenantId: that.tenantId };

    } else {
        if (event.keyCode === 13) {
            if (that.search) {
                that.search = that.search.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.userGroupTableFieldParams = { name: that.search, tenantId: that.tenantId };
        }
    }
    // this.orgrolesTableFieldParams = params;
  }

  onSearchUserGroupList(params: any) {
    params.createTimeRange = params.createTime;
    params.updateTimeRange = params.updateTime;
    delete params.createTime;
    delete params.updateTime;
    this.userGroupTableFieldParams = params;
    this.userGroupTableFieldParams.tenantId = this.tenantId;
  }

  initUserGroupFieldArray(): void {
    this.userGroupFieldArray = [{
      id: 1,
      fieldName: 'name',
      fieldLabel: '名称',
      fieldType: 'input'
    }, {
      id: 2,
      fieldName: 'createUserName',
      fieldLabel: '创建人',
      fieldType: 'input'
    }, {
      id: 3,
      fieldName: 'createTime',
      fieldLabel: '创建日期',
      fieldType: 'date-range'
    }, {
      id: 4,
      fieldName: 'updateUserName',
      fieldLabel: '更新人',
      fieldType: 'input'
    }, {
      id: 5,
      fieldName: 'updateTime',
      fieldLabel: '更新时间',
      fieldType: 'date-range'
    }];
  }

  ngOnInit() {
    if (this.route.snapshot.params['tenantId'] != null) {
        this.tenantId = this.route.snapshot.params['tenantId'];
    } else if (window['appConfig'] && window['appConfig'].tenant) {
        this.tenantId = window['appConfig'].tenant.id;
    } else {
        this.tenantId = 0;
    }
    this.userGroupTableFieldParams.tenantId = this.tenantId;
    this.initUserGroupFieldArray();
  }

  ngOnDestroy() {

  }

}
