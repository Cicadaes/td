import { Component, Injector, EventEmitter, Output, Input, OnInit, OnChanges } from '@angular/core';
import { CustomAnalysisService } from '../custom-analysis.service';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-share-report',
  templateUrl: './share-report.component.html',
  styleUrls: ['./share-report.component.less']
})
export class ShareReportComponent extends BaseComponent implements OnInit, OnChanges {
  shareType = 'private'; // 分享类型

  allRoleChecked = false; // 选中所有的角色
  indeterminate = false;

  selectedRoleIndex = 0; // 选中的角色下标
  allUser: any = []; // 全部的用户信息（含角色）
  userListForRole: any = []; // 角色里的用户

  allUserChecked = false; // 选中所有用户

  shareList: any = []; // 分享的列表

  searchName: string; // 关键字搜索

  @Input() reportId: number; // 报表id

  @Output() closeModel = new EventEmitter<boolean>();

  constructor(private customAnalysisService: CustomAnalysisService, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getAllUser();
    this.customAnalysisService.getShareListByReportId(this.reportId).subscribe(data => {
      const arr: any = data; // ArrayBuffer上没有length属性
      if (arr && arr.length > 0) {
        this.shareType = 'public';
        this.shareList = arr;
      }
    });
  }

  async onSearch(event: any) {
    await this.getAllUser();
    this.allRoleChecked = false;
    this.updateAllRoleChecked(false);
  }

  /**
   * 获取所以用户信息
   */
  getAllUser() {
    const param = {};
    if (this.searchName) {
      param['search'] = this.searchName;
    }
    return new Promise((resolve, reject) => {
      this.customAnalysisService.getAllUser(param).subscribe(data => {
        this.allUser = data;
        this.userListForRole = [];
        this.selectedRoleIndex = 0;
        for (let i = 0; i < this.allUser.length; i++) {
          this.allUser[i]['users'].forEach(element => {
            element['checked'] = this.allRoleChecked;
            for (let j = 0; j < this.shareList.length; j++) {
              const item = this.shareList[j];
              if (item['umid'] === element['umid']) {
                element['checked'] = true;
                break;
              }
            }
            if (i === 0) {
              this.userListForRole.push(element);
            }
          });
        }
        resolve();
      });
    });
  }

  /**
   * 全选角色
   * @param value
   */
  updateAllRoleChecked(value: boolean) {
    this.allUser.forEach(data => {
      data['checked'] = value;
      data['users'].forEach(element => {
        element['checked'] = value;
      });
    });
  }

  /**
   * 全选用户
   * @param value
   */
  updateAllUserChecked(value: boolean) {
    this.shareList.forEach(element => {
      element['checked'] = value;
    });
  }

  /**
   * 选中角色下的用户
   * @param value
   * @param index
   */
  updateAllUsersChecked(value: boolean, index: number) {
    this.allUser[index]['users'].forEach(element => {
      element['checked'] = value;
    });
  }

  /**
   * 选中角色
   * @param role
   * @param index
   */
  chooseRole(role: any, index: number) {
    this.userListForRole = [];
    role['users'].forEach(element => {
      // for (let i = 0; i < this.shareList.length; i++) {
      //     const item = this.shareList[i];
      //     if(item['umid'] === element['umid']){
      //         element['checked'] = true;
      //         break;
      //     }
      // }
      this.userListForRole.push(element);
    });
    this.selectedRoleIndex = index;
  }

  /**
   * 添加选中的分享
   */
  addShare() {
    this.allUser.forEach(data => {
      data['users'].forEach(element => {
        if (element['checked']) {
          this.shareList.push({
            checked: false,
            umid: element['umid'],
            name: element['name']
          });
        }
      });
    });
    this.shareList = this.arrUniqueByAttr(this.shareList, 'umid');
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
    const arr = this.shareList;
    this.shareList = [];
    arr.forEach(element => {
      if (!element['checked']) {
        this.shareList.push(element);
      }
    });
  }

  /**
   * 清除所有选中的分享
   */
  removeAllShare() {
    this.shareList = [];
  }

  /**
   * 关闭弹框
   */
  cancel() {
    this.closeModel.emit(true);
  }

  /**
   * 分享
   */
  submit() {
    if (this.shareType === 'public' && this.shareList.length === 0) {
      this.notification.create('warning', '提示', '请添加用户到已选用户列表中。');
      return;
    }
    const param = [];
    if (this.shareType === 'public') {
      this.shareList.forEach(element => {
        param.push({
          name: element['name'],
          umid: element['umid']
        });
      });
    }
    this.customAnalysisService.shareReportToUser(this.reportId, param).subscribe(data => {
      this.closeModel.emit(true);
    });
  }
}
