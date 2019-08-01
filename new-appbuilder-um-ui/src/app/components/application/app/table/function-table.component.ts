import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-cosmos-ui';
import { FunctionTableService } from './function-table.service';
import { Router, ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import { ScrollToTopService } from '../../../../@themes/scroll-service';

@Component({
  selector: 'function-table',
  templateUrl: './function-table.component.html',
  styleUrls: ['./function-table.component.css']
})

export class FunctionTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() reload = false;
  @Input() appCode: any;
  isReloadUserTable = false;
  currentUser: any;
  id: number;
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;
  expandDataCache = {};

  constructor(private scrollSer: ScrollToTopService, private service: FunctionTableService, private confirmServ: NzModalService, private activatedRoute: ActivatedRoute) {

  }

  deleteActionModal(data: any, params: any) {
    const _this = this;
    const title = '您确定要删除功能“' + params.name + '”及其子功能吗？';
    // let pa: any = this.getParaData(data, params.id)
    this.confirmServ.confirm({
      nzTitle: title,
      nzContent: '',
      // title: '提示',
      // content: title,
      nzOnOk: () => {
        _this.service.deleteAction(params).subscribe((data1: any) => {
          if (!data1.success) {
            _this.showDialog(data1.msg);
          }
          _this.reset();
        });
      },
      nzOnCancel() { }
    });
    // this.confirmServ.confirm({
    // maskClosable: false,
    //   title: '提示',
    //   content: title,
    //   onOk() {
    //     _this.service.deleteAction(params).subscribe((data: any) => {
    //       if (!data.success) {
    //         _this.showDialog(data.msg);
    //       }
    //       _this.reset();
    //     });
    //   },
    //   onCancel() { }
    // });
  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }

  showAddUserModal(user: any) {
    this.currentUser = user;
    this.isReloadUserTable = false;
  }

  onSubmitUserFormData(params: boolean) {
    this.isReloadUserTable = params || false;
    if (this.isReloadUserTable) {
      this.refreshData();
    }
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    const params = this.queryParams || {};
    params.appId = this.activatedRoute.snapshot.params['id'];
    params.page = this._current;
    params.rows = this._pageSize;

    this.service.queryFunctions(params).subscribe((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.list;
      this.scrollSer.scrollToTop();

      this._dataSet.forEach((item: any) => {
        this.expandDataCache[item.id] = this.convertTreeToList(item);
      });
    });

  }

  collapse(array: any, data: any, $event: any) {
    if ($event === false) {
      if (data.children) {
        data.children.forEach((d: any) => {
          const target = array.find((a: any) => a.id === d.id);
          target.expand = true;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  showDialog(msg: any) {
    this.confirmServ.warning({
      nzTitle: msg,
      nzOnCancel: () => {
      }
    });
  }

  convertTreeToList(root: any) {
    const stack = [], array: any = [], hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: true, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: any, hashMap: any, array: any) {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.queryParams) {
      this.queryParams = changes.queryParams.currentValue || {};
    } else {
      this.queryParams = {};
    }
    if (changes.reload) {
      this.reload = changes.reload.currentValue || false;
    } else {
      this.reload = false;
    }

    if (this.reload) {
      this.refreshData();
    } else {
      this.reset();
    }
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
  }


  /**
   * 根据Id获取请求参数
   * @param  {any}       data [description]
   * @param  {number =    0}           id [description]
   * @return {[type]}         [description]
   */
  private getParaData(data: any, id: number = 0): any {
    if (data.id === id) {
      return data;
    } else if (data.children && data.children.length) {
      for (const item of data.children) {
        if (item.id === id) {
          return this.getParaData(item, id);
        }
      }
    }
  }
}
