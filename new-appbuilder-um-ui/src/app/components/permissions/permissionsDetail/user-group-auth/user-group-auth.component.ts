import { Component, OnInit, OnDestroy, Input, EventEmitter, ViewChild } from '@angular/core';
import { UserGroupAuthService } from './user-group-auth.service';
import { NzModalService } from 'ng-cosmos-ui';
import { UserGroupAuthTableComponent } from './table/user-group-auth-table.component';

@Component({
  selector: 'user-group-auth',
  templateUrl: './user-group-auth.component.html',
  styleUrls: ['./user-group-auth.component.css']
})
export class UserGroupAuthComponent implements OnInit, OnDestroy {
  @Input() tenantId: number;
  @Input() userId: number;
  @Input() roleId: number;
  @Input() targetId: number;
  @ViewChild('userTable')
  userTable: UserGroupAuthTableComponent;
  private _batchRemove: EventEmitter<any> = new EventEmitter();

  userGroup: any = {};

  isShowAddUserGroupAuthModal = false;
  isConfirmLoading: boolean;
  doBatchRevoke: boolean;
  batchRemoveUsers: boolean;
  private checkedItem = '';
  userGroupAuthFieldArray: any[] = [{
    id: 1,
    fieldName: 'name',
    fieldLabel: '名称',
    fieldType: 'input'
  }];

  private refresh: EventEmitter<any> = new EventEmitter<any>();


  constructor(private service: UserGroupAuthService, private confirmServ: NzModalService) {
    // this.userGroupAuthTableAjaxUrl = service.getUserGroupAuthUrl;
  }

  showConfirm() {
    this.confirmServ.confirm({
      nzTitle: '确认要移除所选用户组吗？',
      nzContent: '<strong></strong>',
      nzOnOk: () => {
        console.log('确定');
        //  this._batchRemove.emit(true)
        this.doBatchRevoke = true;
      },
      nzOnCancel() {
        //  this._batchRemove.emit(false)
        this.doBatchRevoke = false;
      }
    });
  }

  showInfo() {
    this.confirmServ.info({
      nzTitle: '这是一条通知信息',
      nzContent: '信息内容'
    });
  }

  showAddUserGroupAuthModal() {
    this.refresh.emit({ type: 0 });
    this.isShowAddUserGroupAuthModal = true;
  }
  //  修改管理员权限点击保存
  userEdit() {
    this.userTable.userEditSub();
  }

  hideAddUserGroupAuthModal(params: any) {
    this.isShowAddUserGroupAuthModal = false;
  }

  onSubmitUserFormData(params: boolean) {
    this.userGroup = {};
    this.userGroup.tenantId = this.tenantId;
    this.userGroup.id = this.targetId;
  }

  setUserGroupParams() {
    this.userGroup.tenantId = this.tenantId;
    this.userGroup.id = this.targetId;
  }

  onSearchUserGroupAuthList(params: any) {
    this.userGroup = params;
    this.setUserGroupParams();
  }

  onSearch(value: any) {
    this.userGroup = { 'name': value };
    this.setUserGroupParams();
  }

  ngOnInit() {
    this.setUserGroupParams();
  }

  ngOnDestroy() {

  }

  batchRevoke = (event: any) => {

    if (this.checkedItem) {
      this.confirmServ.confirm({
        nzTitle: '您确认要批量移除选定用户组吗？',
        nzContent: '<strong></strong>',
        nzOnOk: () => {
          this._batchRemove.emit(true);
        }
      });
    } else {
      this.confirmServ.info({
        nzTitle: '请勾选用户组',
        nzContent: '<strong></strong>',
      });
    }

  }

  /**
   * 获取选中的dataset的name
   * @return {[type]} [description]
   */
  private setCheckedItem(e: any) {
    const str = '';
    if (e && e.length) {
      const nameArr = e.filter((item: any) => {
        return item.checked;
      }).map((item: any) => {
        return item.name;
      });
      this.checkedItem = nameArr.join(',');
    } else {
      this.checkedItem = '';
    }
  }
}
