import { Component, Injector, EventEmitter, Output, Input, OnInit, OnChanges } from '@angular/core';
import { BaseComponent } from '../../../common/base-component';
import { ProductCenterService } from '../../product-center.service';

@Component({
  selector: 'app-product-share-dialog',
  templateUrl: './product-share-dialog.component.html',
  styleUrls: ['./product-share-dialog.component.less']
})
export class ProductShareDialogComponent extends BaseComponent implements OnInit, OnChanges {
  shareType = 'role'; // 分享类型

  allRoleChecked = false; // 选中所有的角色
  allUserChecked = false; // 选中所有的用户
  indeterminate = false;

  selectedRoleIndex = 0; // 选中的角色下标
  allDatasList: any = [];
  allRolesList: any = []; // 全部的用户信息（含角色）
  allUsersList: any = [];

  allShareChecked = false; // 选中所有分享的角色和用户

  shareRoleList: any = []; // 分享的角色列表
  shareUserList: any = []; // 分享的用户列表
  shareList: any = []; // 分享的列表

  searchUserName: string; // 关键字搜索
  searchRoleName: string;

  @Input() id: number; // id
  @Output() closeModel = new EventEmitter<boolean>();

  constructor(private service: ProductCenterService, private injector: Injector) {
    super(injector);
  }

  onSelectShareType(index: any) {
    if (index === 1) {
      this.shareType = 'user';
    } else {
      this.shareType = 'role';
    }
  }

  ngOnInit() {
    this.getAllRoles(false);
    this.getAllUsers(false);
    this.queryShareList();
  }

  queryShareList() {
    const params = {
      productid: this.id
    };
    this.service.queryProductShareList(params).subscribe(data => {
      if (data && data['data']) {
        const arrs: any = data['data'];
        this._initShareList(arrs);
      }
    });
  }

  _initShareList(arrs: any[]) {
    if (arrs && arrs.length > 0) {
      for (let i = 0; i < arrs.length; i++) {
        const arr = arrs[i];
        if (arr.shareType === 'role') {
          this.shareRoleList.push({
            checked: false,
            code: arr['userorroleid'],
            userorroleid: arr['userorroleid'],
            name: arr['name']
          });
        } else if (arr.shareType === 'user') {
          this.shareUserList.push({
            checked: false,
            umid: arr['userorroleid'],
            userorroleid: arr['userorroleid'],
            name: arr['name'],
            roleName: arr['roleName'],
            status: arr['status']
          });
        }
      }
      this.shareRoleList = this.arrUniqueByAttr(this.shareRoleList, 'code');
      this.shareUserList = this.arrUniqueByAttr(this.shareUserList, 'umid');
      this.shareList = this.shareRoleList.concat(this.shareUserList);
    }
  }

  async onSearch(event: any) {
    if (this.shareType === 'role') {
      await this.getAllRoles(true);
      this.allRoleChecked = false;
      this.updateAllRoleChecked(false);
    } else if (this.shareType === 'user') {
      await this.getAllUsers(true);
      this.allUserChecked = false;
      this.updateAllUserChecked(false);
    }
  }

  /**
   * 获取所以角色信息
   */
  getAllRoles(isChange: boolean) {
    const param = {};
    if (this.shareType === 'role' && this.searchRoleName) {
      param['search'] = this.searchRoleName;
      param['searchType'] = this.shareType;
    }
    return new Promise((resolve, reject) => {
      this.service.getAllRoles(param).subscribe(data => {
        this.allRolesList = data || [];
        resolve();
      });
    });
  }

  /**
   * 获取所以用户信息
   */
  getAllUsers(isChange: boolean) {
    const param = {};
    if (this.shareType === 'user' && this.searchUserName) {
      param['search'] = this.searchUserName;
      param['searchType'] = this.shareType;
    }
    return new Promise((resolve, reject) => {
      this.service.getAllUser(param).subscribe(data => {
        this.allUsersList = data || [];
        resolve();
      });
    });
  }

  /**
   * 全选角色
   * @param value
   */
  updateAllRoleChecked(value: boolean) {
    this.allRolesList.forEach(data => {
      data['checked'] = value;
    });
  }

  /**
   * 全选用户
   * @param value
   */
  updateAllUserChecked(value: boolean) {
    this.allUsersList.forEach(data => {
      data['checked'] = value;
    });
  }

  /**
   * 全选分享的角色和用户
   * @param value
   */
  updateAllShareChecked(value: boolean) {
    this.shareList.forEach(element => {
      element['checked'] = value;
    });
  }

  /**
   * 选中角色下的用户
   * @param value
   * @param index
   */
  updateAllUsersChecked(value: boolean, index: number) {}

  /**
   * 选中角色
   * @param role
   * @param index
   */
  chooseRole(role: any, index: number) {
    this.selectedRoleIndex = index;
  }

  /**
   * 添加选中的分享
   */
  addShare() {
    if (this.shareType === 'role') {
      this.allRolesList.forEach(data => {
        if (data['checked']) {
          this.shareRoleList.push({
            checked: false,
            code: data['code'],
            userorroleid: data['code'],
            name: data['name']
          });
        }
      });
    } else if (this.shareType === 'user') {
      this.allUsersList.forEach(data => {
        if (data['checked']) {
          this.shareUserList.push({
            checked: false,
            umid: data['umid'],
            userorroleid: data['umid'],
            name: data['name'],
            roleName: data['roleName'],
            status: data['status']
          });
        }
      });
    }

    this.shareRoleList = this.arrUniqueByAttr(this.shareRoleList, 'code');
    this.shareUserList = this.arrUniqueByAttr(this.shareUserList, 'umid');
    //        this.shareList = this.arrUniqueByAttr(this.shareList, 'userorroleid');
    this.shareList = this.shareRoleList.concat(this.shareUserList);
  }

  /**
   * 数组对象去重（根据属性）
   * @param arr
   * @param name
   */
  arrUniqueByAttr(arr, name) {
    const hash = {};
    return arr.reduce((item, next) => {
      if (!hash[next[name]]) {
        hash[next[name]] = true && item.push(next);
      }
      return item;
    }, []);
  }

  /**
   * 删除分享
   */
  delShare() {
    this.allShareChecked = false;
    this.shareList = this._getCheckedList(this.shareList, '');
    this.shareRoleList = this._getCheckedList(this.shareList, 'code');
    this.shareUserList = this._getCheckedList(this.shareList, 'umid');
  }

  _getCheckedList(arr: any[], field: any) {
    const list: any[] = [];
    arr.forEach(element => {
      if (field) {
        if (element[field] && !element['checked']) {
          list.push(element);
        }
      } else {
        if (!element['checked']) {
          list.push(element);
        }
      }
    });
    return list;
  }

  /**
   * 清除所有选中的分享
   */
  removeAllShare() {
    this.allShareChecked = false;
    this.shareRoleList = [];
    this.shareUserList = [];
    this.shareList = [];
  }

  /**
   * 关闭弹框
   */
  cancel() {
    this.globals.resetBodyStyle();
    this.closeModel.emit(true);
  }

  /**
   * 分享
   */
  submit() {
    const param = [];
    this.shareList.forEach(element => {
      let shareType = 'role';
      if (element && element.umid) {
        // 用户
        shareType = 'user';
      }
      param.push({
        name: element['name'],
        userorroleid: element['userorroleid'],
        shareType: shareType
      });
    });
    this.service.shareProduct(this.id, param).subscribe(data => {
      if (data) {
        if (data['success']) {
          this.closeModel.emit(true);
          this.message.create('success', data['msg'] || '授权设置成功。');
        } else {
          this.message.create('error', data['msg'] || '授权设置失败，请重试。');
        }
      } else {
        this.message.create('error', '网络异常，请稍后重试。');
      }
    });
  }
}
