import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DeptAuthTableService } from './dept-auth-table.service';
import { ScrollToTopService } from '../../../../@themes/scroll-service';

@Component({
  selector: 'dept-auth-table',
  templateUrl: './dept-auth-table.component.html',
  styleUrls: ['./dept-auth-table.component.css']
})

export class DeptAuthTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  isShowAddDeptAuthModal: boolean = false;
  curDeptAuth: any;
  _allChecked: boolean;

  isTreeList = true;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  expandDataCache: any;

  _loading = true;
  _sortValue: any = null;

  _checkAll = (isCheckAll: any) => {
    this._dataSet.forEach((ug: any) => ug.checked = isCheckAll);
    this._allChecked = isCheckAll;
  }

  constructor(private scrollSer: ScrollToTopService, private service: DeptAuthTableService) {

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
    this.scrollSer.scrollToTop();
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this._dataSet = [
      {
        key: 1,
        name: '研发部',
        age: 60,
        desc: 'New York No. 1 Lake Park',
        children: [{
          key: 11,
          name: '开发部',
          age: 42,
          desc: 'New York No. 2 Lake Park',
        }, {
          key: 12,
          name: '测试部',
          age: 30,
          desc: 'New York No. 3 Lake Park',
          children: [{
            key: 121,
            name: 'UM测试部',
            age: 16,
            desc: 'New York No. 3 Lake Park',
          }],
        }, {
          key: 13,
          name: '产品部',
          age: 72,
          desc: 'London No. 1 Lake Park',
          children: [{
            key: 131,
            name: '产品一部',
            age: 42,
            desc: 'London No. 2 Lake Park',
            children: [{
              key: 1311,
              name: 'UM产品设计部',
              age: 25,
              desc: 'London No. 3 Lake Park',
            }, {
              key: 1312,
              name: '其它产品设计部',
              age: 18,
              desc: 'London No. 4 Lake Park',
            }],
          }],
        }],
      },
      {
        key: 2,
        name: '销售部',
        age: 32,
        desc: 'Sidney No. 1 Lake Park',
      }
    ];
    this.expandDataCache = {};

    /*convertTreeToList(root: any){
        const stack = [], childArray = [], hashMap = {};
        stack.push({root, level: 0, expand: false });

        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({node.children[ i ], level: node.level + 1, expand: false, parent: node });
                }
            }
        }
        return childArray;
    }*/


    /*this._dataSet = [{
        expand:false,
        checked:false,
        id:1,
        roleId:1,
        tenantId:0,
        name:'马六',
        email:'liu.ma@tendcloud.com',
        mobile:'13700002568',
        status:1,
        createUserName:"李四",
        createTime:'2017-12-01',
        updateUserName:"王五",
        updateTime:'2018-02-01'
    },{
        expand:false,
        checked:false,
        id:2,
        roleId:2,
        tenantId:0,
        name:'张三',
        email:'san.zhang@tendcloud.com',
        mobile:'17325680001',
        status:1,
        createUserName:"李四",
        createTime:'2017-06-01',
        updateUserName:"王五",
        updateTime:'2018-02-11'
    }];*/
    this._loading = false;

    const params = this.queryParams || {};
    params.page = this._current;
    params.rows = this._pageSize;
    /*let params = {
        page:this._current,
        rows:this._pageSize,
        //sortField:'name',
        //sortOrder:this._sortValue,
        //fileds:this.queryParams
    };*/
    /*        this.service.queryDept( params).subscribe((data: any) => {
                this._loading = false;
                this._total =  data.total;
                this._dataSet = data.list;
            });*/

    /*this.service.getTableDatas(this._current, this._pageSize, 'name', this._sortValue,this.queryParams).subscribe((data: any) => {
        this._loading = false;
        this._total = 200;
        this._dataSet = data.results;
    })*/
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
