import { Component, OnInit, Input, Output, EventEmitter, NgModule, SimpleChanges, ViewChild } from '@angular/core';
import { funcAuthChecktreeService } from './func-auth-checktree.service';
import { ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { NzFormatEmitEvent, NzTreeNode, NzModalService } from 'ng-cosmos-ui';
import { funcAuthPageComponent } from '../page/func-auth-page.component';
import { ScrollToTopService } from '../../../../../@themes/scroll-service';


@Component({
  selector: 'func-auth-checktree',
  templateUrl: './func-auth-checktree.component.html',
  styleUrls: ['./func-auth-checktree.component.css'],
  providers: [funcAuthChecktreeService]
})

export class funcAuthChecktreeComponent implements OnInit {
  @ViewChild('detailChild')
  detailChild: funcAuthPageComponent;
  id: number;
  _current = 1;
  _pageSize = 9999;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;
  nodes: any = [];
  listData: any = [];
  search: string = '';
  nodeInfo: any = {};
  searchList: any = [];
  storeNodes: any = [];
  findCli: boolean = false;
  @Input() targetId: any;
  @Input() tenantId: any;

  //  nodeKey: number = 0;
  constructor(private service: funcAuthChecktreeService, private activatedRoute: ActivatedRoute, private scrollSer: ScrollToTopService, private confirmServ: NzModalService) {

  }

  // 点击树节点,显示详情
  showDetail(e: NzFormatEmitEvent): void {
    this.nodeInfo = e.node.origin;
    if (this.findCli) {  //  点击的是已经搜索到的内容
      this.nodes = [];
      this.nodes = this.storeNodes;
      this.nodes.forEach((node: any) => {
        node.isSelected = false;
        if (node.title == e.node.origin.title) {
          node.isSelected = true;
        }
      });
      this.findCli = false;
    }
  }

  ngOnInit() {
    this.showTree()
  }

  ngOnChanges(changes: SimpleChanges) {

  }
  showDialog(msg: any) {
    this.confirmServ.warning({
      nzTitle: msg,
      nzOnCancel: () => {
      }
    });
  }
  //  查询节点
  searchNode(data: any) {
    this.findCli = false;
    data = data.trim();
    if (data == '') {
      // this.confirmServ.warning({
      //   nzTitle: '请输入要搜索的内容',
      //   nzOnCancel: () => {
      //   }
      // });
      this.nodes = this.storeNodes;
      return;
    }
    this.searchList = [];
    this._dataSet.forEach((item: any) => {
      this.searchList.push(item);
    });
    this.nodes = [];
    let findFlag = false;
    let tempArr: any = [];
    this.searchList.forEach((item: any) => {
      if (data != '' && item.name.indexOf(data) != -1) {  //  找到
        findFlag = true;
        tempArr.push(item);
      }
    });
    if (!findFlag) {  //  没找到
      this.searchList = [{ "name": '没有找到数据', "id": '0', "disabled": true }];
    } else {  //  找到了 
      this.searchList = tempArr;
      this.findCli = true;
    }
    this.searchList.forEach((item: any) => {
      this.setTreeData(item);
      this.nodes.push(new NzTreeNode(item));
    });
  }

  // 设置处理列表的节点数据
  setTreeData(node: any) {
    node.title = node.name;
    node.key = node.id;
    node.isLeaf = true;
  }
  // 展示列表
  showTree() {
    let tenantId: any = this.tenantId, targetId: any = this.targetId;
    this.service.queryFunctions(1, 9999, targetId, tenantId).then((data: any) => {
      if (this._dataSet && this._dataSet.length > 0) {
        this._dataSet.splice(0, this._dataSet.length);
      }
      this._dataSet = data.data;
      if (this._dataSet && this._dataSet.length > 0) {
        this._dataSet.forEach((item: any) => {
          this.setTreeData(item);
          this.nodes.push(new NzTreeNode(item));
          this.storeNodes.push(new NzTreeNode(item));
        });
        this.nodes[0].isSelected = true;
        this.nodeInfo = this.nodes[0].origin;
      }
    });

  }

}
