import { Component, OnInit, Input, Output, EventEmitter, NgModule, SimpleChanges, ViewChild } from '@angular/core';
import { applicationTreeService } from './applicationTree.service';
import { ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { NzFormatBeforeDropEvent, NzFormatEmitEvent, NzModalService, NzTreeNode } from 'ng-cosmos-ui';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';
// import { DetailAppPageService } from '../detailPage/detail-app-page.service';
import { ScrollToTopService } from '../../../../@themes/scroll-service';
import { AddActionPageComponent } from '../../action/page/add-action-page.component';


@Component({
  selector: 'applicationTree',
  templateUrl: './applicationTree.component.html',
  styleUrls: ['./applicationTree.component.css'],
  providers: [applicationTreeService]
})

export class applicationTreeComponent implements OnInit {
  @Input() queryParams: any;
  @Input() reload = false;
  @Input() appCode: any;
  @ViewChild('detailChild') detailChild: AddActionPageComponent;
  @ViewChild('treeCom') treeCom;

  isReloadUserTable =  false;
  emptyFlag =  true;
  currentUser: any;
  loading =  true;
  id: number;
  _current = 1;
  _pageSize = 9999;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;
  expandDataCache = {};
  showDetailFlag =  false;
  editAddFresh: number;
  deleteFl =  false;
  inputValue: string;
  searchValue: string;
  nodes  = [];
  reloadList(params: number) { // 获取子集传过来的事件值(子集新增，编辑提交成功时调用父级刷新方法)

    console.log('获取子集传过来的事件值', params);
    this.editAddFresh = params;
    this.refreshData(true);
  }
  // nodeKey: number = 0;
  constructor(private service: applicationTreeService, private activatedRoute: ActivatedRoute, private scrollSer: ScrollToTopService, private confirmServ: NzModalService) {

  }

  findNodeRecu(curNode:any, dragKey:any){
    let retNode;

    if(curNode.key == dragKey){
      retNode = curNode;
    }else if(curNode.children != null){
      for (let i = 0; i < curNode.children.length; i++) {
        const subNode = curNode.children[i];
        retNode = this.findNodeRecu(subNode, dragKey);
        if(retNode){
          break;
        }
      }
    }

      return retNode;
  }

  // 拖拽
  mouseAction(name: string, e: NzFormatEmitEvent): void {

    console.log(name);
    if (name === 'drop') {

      let dragKey = e.dragNode.key;
      let retNode;
      for (let i = 0; i < this.treeCom.ngModelNodes.length; i++) {
        const item = this.treeCom.ngModelNodes[i];
        retNode = this.findNodeRecu(item, dragKey);
        if(retNode){
          break;
        }
      }

      if(retNode){
        const params: any = {};
        params.id = retNode.parentNode.key;
        params.children = [];
        for (let i = 0; i < retNode.parentNode.children.length; i++) {
          params.children.push({ 'id': retNode.parentNode.children[i].key, 'serialNumber': i+1 });
        }
        console.log(params);
        this.service.moveNode(params).subscribe((data: any) => {
          if (!data.success) {
            this.showDialog(data.msg);
          } else {
            this.showTree2();
          }
        });
      }
    }

  }
  // 点击树节点,显示详情
  showDetail(e: NzFormatEmitEvent): void {
    this.detailChild.getFunctionById(e.node.origin.id, 'select', 0);

  }
  // 在拖拽放置之前做校验，仅允许拖拽到内部（延时1秒）
  beforeDrop(arg: NzFormatBeforeDropEvent): Observable<boolean> {
    // if insert node into another node, wait 1s
    if (arg.pos === 0) {
      return of(true).pipe(delay(1000));
    } else {
      return of(false);
    }
  }

  ngOnInit() {
    this.showTree();
    this.id = this.activatedRoute.snapshot.params['id'];

  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
  }
  reset() {
    this.refreshData(true);
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
      console.log('get the tree data:', data);
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.list;
      this.scrollSer.scrollToTop();
      this.nodes = [];
      if (data.total === 0) {
        this.emptyFlag = true;
        console.log('empty true');
      } else {
        this.emptyFlag = false;
        this.showTree();
      }

    });

  }

  showDialog(msg: any) {
    this.confirmServ.warning({
      nzTitle: msg,
      nzContent: ''
    });
  }
  // 新建注册功能
  public buildNode() {
    // this.detailChild.addNode(0);
    this.emptyFlag = false;
    this.detailChild.getFunctionById('0', 'addChild', 1);
  }
  // 修改
  edit(id: any) {
    console.log(id);
  }
  // 设置处理tree的节点数据
  setTreeData(node: any) {
    node.title = node.name;
    node.key = node.id;
    if (node.children.length < 0) {
      return;
    } else {
      for (let i = 0; i < node.children.length; i++) {
        this.setTreeData(node.children[i]);
      }
    }
  }

    // 展示树2
    showTree2() {
        const params = this.queryParams || {};
        params.appId = this.activatedRoute.snapshot.params['id'];
        params.page = this._current;
        params.rows = this._pageSize;

        let tmpNode = [];

        this.service.queryFunctions(params).subscribe((data: any) => {
            this.loading = false;
            this._total = data.total;
            this._dataSet = data.list;
            this._dataSet.forEach((item: any) => {
                this.setTreeData(item);
                tmpNode.push(new NzTreeNode(item));
            });
            if (tmpNode && tmpNode.length > 0) {
                if (this.editAddFresh) { // 如果是新增/或者修改成功
                    tmpNode.forEach((item: any) => {
                        this.openTreeData(item);
                    });
                } else {
                    // 如果不是新增的，默认选中第一个
                    tmpNode[0].isExpanded = true;
                    tmpNode[0].isSelected = true;
                }
                if (this.deleteFl) {
                    this.deleteFl = false;
                }

            } else {
                this.deleteFl = false;
            }

            this.nodes = tmpNode;
        });

    }

  // 展示树
  showTree() {
    const params = this.queryParams || {};
    params.appId = this.activatedRoute.snapshot.params['id'];
    params.page = this._current;
    params.rows = this._pageSize;

    this.nodes.splice(0, this.nodes.length);
    this.service.queryFunctions(params).subscribe((data: any) => {
      this.loading = false;
      this._total = data.total;
      this._dataSet = data.list;
      this._dataSet.forEach((item: any) => {
        this.setTreeData(item);
        this.nodes.push(new NzTreeNode(item));
      });
      if (this.nodes && this.nodes.length > 0) {
        if (this.editAddFresh) { // 如果是新增/或者修改成功
          this.nodes.forEach((item: any) => {
            this.openTreeData(item);
         });
          this.detailChild.getFunctionById(this.editAddFresh, 'select', 0);
        } else {
          this.detailChild.getFunctionById(this.nodes[0].key, 'select', 0);
          // 如果不是新增的，默认选中第一个
          this.nodes[0].isExpanded = true;
          this.nodes[0].isSelected = true;
        }
        if (this.deleteFl) {
          this.detailChild.getFunctionById(this.nodes[0].key, 'select', 0);
          this.deleteFl = false;
        }

      } else {
        this.deleteFl = false;
      }

    });

  }
    // 设置处理tree的节点展开数据
    openTreeData(node: any) {
      if (node.key === this.editAddFresh) {
        node.isExpanded = true;
        node.isSelected = true;

      } else {
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            this.openTreeData(node.children[i]);
          }
        } else {
          return;
        }
      }
    }
  // 展开节点
  toggleNode(e: any): void {
    setTimeout(() => {
      this.detailChild.editOrAdd = 'select';
      e.node.isExpanded = !e.node.isExpanded;
    });
  }

  // 调用子集页面方法刷新功能类别数据
  public freshType() {
    this.detailChild.resetAdditionalAppIdSelect();
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
  deleteActionModal(data: any, params: any) {
    let title;
    if (params.children.length > 0) {
      title = '您确定要删除功能“' + params.title + '”及其子功能吗？';
    } else {
      title = '您确定要删除功能“' + params.title + '”功能吗？';
    }
    const pa: any = {};
    pa.id = params.key;
    this.confirmServ.confirm({
      nzTitle: title,
      nzContent: '',
      nzOnOk: () => {
        this.service.deleteAction(pa).subscribe((data2: any) => {
          if (!data2.success) {
            this.showDialog(data2.msg);
          } else {
            this.showDialog('删除成功');
            this.deleteFl = true;
            console.log('change deleteFL');
            this.reset();
            //  this.detailChild.getFunctionById(this.nodes[0].key, 'select', 0);
          }

        });
      }
    });

  }
}
