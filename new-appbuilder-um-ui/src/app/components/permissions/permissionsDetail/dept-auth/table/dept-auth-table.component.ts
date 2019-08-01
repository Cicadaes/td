import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DeptAuthTableService } from './dept-auth-table.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../../@themes/scroll-service';

@Component({
  selector: 'dept-auth-table',
  templateUrl: './dept-auth-table.component.html',
  styleUrls: ['./dept-auth-table.component.css']
})

export class DeptAuthTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Output() changeLevelId = new EventEmitter<any>();
  @Output() backFalse = new EventEmitter<any>();
  isShowAddDeptAuthModal: boolean = false;
  curDeptAuth: any;
  _allChecked: boolean;

  isTreeList = true;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  expandDataCache: any;
  _indeterminate: boolean;
  _checkList: any;
  _loading = true;
  _sortValue: any = null;
  @Input() tenantId: any;
  @Input() targetId: any;

  constructor(private scrollSer: ScrollToTopService, private service: DeptAuthTableService, private confirmServ: NzModalService) {

  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }

  showAddDeptAuthModal(deptAuth: any) {
    this.curDeptAuth = deptAuth;
    this.isShowAddDeptAuthModal = true;
  }

  hideAddDeptAuthModal(params: any) {
    this.isShowAddDeptAuthModal = false;
  }

  refreshData(reset = false) {
    this.scrollSer.scrollToTop()
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this.expandDataCache = {};
    this._loading = false;
    this.service.queryDept(this.targetId, this.tenantId, this._current, this._pageSize).then((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.data;
    });
  }
  showSetModal(role: any) {
    console.log('设置', role);
    this.changeLevelId.emit(role); // 传给上级当前点击设置项的id
  }
  deleteActionModal(role: any, roleIndex: number) {
    this.confirmServ.confirm({
      nzTitle: '您确定要删除角色层级定义吗？',
      nzContent: '<strong style="color:red;">将删除层级内的角色关系及权限定义</strong><strong style="color:#9d9d9f;">,你确定还要继续吗？</strong>',
      nzOnOk: () => {
        role.status = 0;
        this._loading = true;
        this.service.deleteRoleLevel(role.id).then((data: any) => {
          if (data['code'] === 200) {
            this.confirmServ.warning({
              nzTitle: '删除成功',
              nzOnCancel: () => {
              }
            });
            this.refreshData(true);
          } else {
            this.confirmServ.warning({
              nzTitle: '删除失败',
              nzOnCancel: () => {
              }
            });
          }
          this._loading = false;
        });
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.queryParams = changes.queryParams.currentValue || {};
    this.reset();

  }

  collapse(array: any, data: any, event: any) {
    if (event === false) {
      if (data.children) {
        data.children.forEach((d: any) => {
          const target = array.find((a: any) => a.key === d.key);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  visitNode(node: any, hashMap: any, array: any) {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  convertTreeToList(root: any) {
    const stack = [], nodeArray: any[] = [], hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, nodeArray);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
        }
      }
    }
    return nodeArray;
  }


  ngOnInit() {
    this._dataSet.forEach((item: any) => {
      this.expandDataCache[item.key] = this.convertTreeToList(item);
    });
  }
}
