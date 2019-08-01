import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { deptAuthTreeService } from './dept-auth-tree.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { NzFormatEmitEvent, NzModalService, NzTreeNode } from 'ng-cosmos-ui';
import { deptAuthPageComponent } from '../page/dept-auth-page.component';
import { ScrollToTopService } from '../../../../../@themes/scroll-service';

@Component({
  selector: 'dept-auth-tree',
  templateUrl: './dept-auth-tree.component.html',
  styleUrls: ['./dept-auth-tree.component.css'],
  providers: [deptAuthTreeService]
})

export class deptAuthTreeComponent implements OnInit {
  @Input() queryParams: any;
  @Input() reload: boolean = false;
  @Input() appCode: any;
  @Input() roleHierarchyId: any;
  @Input() tenantId: any;
  @ViewChild('detailChild')
  detailChild: deptAuthPageComponent;

  isReloadUserTable: boolean = false;
  emptyFlag: boolean = true;
  currentUser: any;
  _dataSet: any = [];
  editAddFresh: number;
  deleteFl: boolean = false;
  listData: any = [];  //  储存数据列表
  editOrAdd: boolean = true;  //  当true时表示新增，false表示修改
  nodeData: any = {};  //  点击节点的node数据
  addNode: any = {};  //  新增节点时的父级node数据
  chosenName: string = '';  //  记录添加完成后的新加的节点名称，默认选中
  @Output() noNode = new EventEmitter<any>();
  @Input() addOriData: any;  //  新增时要用到的数据

  inputValue: string;
  nodes: any = [];
  reloadList(params: number) {  //  获取子集传过来的事件值(子集新增，编辑提交成功时调用父级刷新方法) 
    this.editAddFresh = params;
    this.refreshData(true);
  }
  //  nodeKey: number = 0;
  constructor(private service: deptAuthTreeService, private activatedRoute: ActivatedRoute, private scrollSer: ScrollToTopService, private confirmServ: NzModalService) {

  }
  // 拖拽
  mouseAction(name: string, e: any): void {
    if (name === 'drop') {
      let params: any = {};
      if (e.dragNode.parentNode != null) { // 二级节点及以下节点的节点的拖拽时,一级节点拖拽为二级节点及以下节点    
        // params.id = e.dragNode.parentNode.key;
        // params.code = e.dragNode.parentNode.origin.code;
        // params.roleHierarchyId = this.addOriData.id;
        // params.roleHierarchyItems = [];
        // for (let i = 0; i < e.dragNode.parentNode.children.length; i++) {
        //   //   console.log('二级及以下每个节点',e.dragNode.parentNode.children[i]);
        //   let tempCode = e.dragNode.parentNode.children[i].origin.code;
        //   params.roleHierarchyItems.push({ "id": e.dragNode.parentNode.children[i].key, "serialNumber": i, "code": tempCode });
        // }

        params.id = e.node.origin.key;
        params.code = e.node.origin.code;
        params.roleHierarchyId = this.addOriData.id;
        params.roleHierarchyItems = [];
        for (let i = 0; i < e.node.children.length; i++) {
          //   console.log('二级及以下每个节点',e.dragNode.parentNode.children[i]);
          let tempCode = e.node.children[i].origin.code;
          params.roleHierarchyItems.push({ "id": e.node.children[i].key, "serialNumber": i, "code": tempCode });
        }
      } else { // 一级节点间拖拽或者拖拽成一级节点时  (角色层级只能有一个顶级)
        //  alert('拖成一级了');
        this.showTree();
        return;

        // params.id = '';
        // params.code = '';
        // params.roleHierarchyId = this.addOriData.id;
        // params.roleHierarchyItems = [];
        // this.nodes.forEach((item: any) => {
        //   let tempIndex = this.nodes.indexOf(item);
        //   //  console.log('每一个节点',item);
        //   params.roleHierarchyItems.push({ "id": item.key, "serialNumber": tempIndex, "code": item.origin.code });
        // });
      }
      this.service.moveNode(params).then((data: any) => {
        if (data['code'] != 200) {
          this.showDialog(data.msg);
        } else {
          this.showTree();
        }
      });
    }

  }

  // 点击树节点,显示详情
  showDetail(e: NzFormatEmitEvent): void {
    const id: any = e.node.origin.id;
    this.detailChild.addChild = false;
    this.service.queryNodeInfo(id).then((data: any) => {
      this.nodeData = data.data;
      this.editOrAdd = false;
    });
  }

  //  新增角色层级
  addRoleLevel(data: any) {
    this.editOrAdd = true;
    this.addNode = data.origin;
    this.detailChild.addRoleLevel(data);
    this.detailChild.addChild = true;

  }
  //  新增节点完成后，改变editOrAdd的状态为false，重新加载树
  changeDoState(data: any) {
    this.chosenName = data;
    this.editOrAdd = false;
    this.reset();
  }
  ngOnInit() {
  }

  reset() {
    this.refreshData(true);
  }

  refreshData(reset = false) {
    this.showTree();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.roleHierarchyId) {
      this.refreshData();
    }
  }
  showDialog(msg: any) {
    this.confirmServ.warning({
      nzTitle: msg,
      nzOnCancel() {
      }
    });
  }

  // 设置处理tree的节点数据
  setTreeData(node: any) {
    node.title = node.name;
    node.key = node.id;
    node.children = node.roleHierarchyItems;
    if (node.children.length === 0) {
      return;
    } else {
      for (let i = 0; i < node.children.length; i++) {
        this.setTreeData(node.children[i]);
      }
    }
  }
  // 设置处理tree的节点展开数据
  openTreeData(node: any) {
    if (node.title == this.chosenName) {
      node.isExpanded = true;
      node.isSelected = true;
      this.nodeData = node.origin;
      this.listData = node.origin && node.origin.authBeans;

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
  // 展示树
  showTree() {
    this.service.queryFunctions(this.roleHierarchyId, this.tenantId).then((response: any) => {
      let data;
      if (response['code'] === 200) {
        data = response['data'];
      }
      this.listData = [];
      if (data && data.length > 0) {  //  当树结构有数据时
        this.emptyFlag = false;
        this.nodes = [];
        this._dataSet = data;
        this.listData = data[0].authBeans;

        if(!data[0].id){  // 这个时候 返回的数据并不是树的数据，只是权限列表的
          return ;
        }

        this._dataSet.forEach((item: any) => {
          this.setTreeData(item);
          this.nodes.push(new NzTreeNode(item));
        });

        //  如果是新添加完成的节点，添加完成后默认选中
        if (!this.chosenName) {
          //  如果不是新增的，默认选中第一个
          this.nodes[0].isExpanded = true;
          this.nodes[0].isSelected = true;
          this.nodeData = this.nodes[0].origin;

        } else {  //  是新增的，（数据已经处理过），恢复默认值
          this.nodes.forEach((item: any) => {
            this.openTreeData(item);
          });
          this.chosenName = '';
        }

        if (data[0]['id']) {
          this.editOrAdd = false;
        }
      } else {  //  树结构没有数据，渲染第一次新增
        this.emptyFlag = true;
        this.listData = data.authBeans;
      }
    });

  }
  // 展开节点
  toggleNode(e: any): void {
    setTimeout(() => {
      e.node.isExpanded = !e.node.isExpanded;
    });
  }

  deleteActionModal(data: any, params: any) {
    let title;
    let content;
    title = '您确定要删除此角色层级吗？';
    content = '<strong>将删除此角色层级及所有下属角色层级</strong><strong>,你还要继续吗？</strong>';
    let pa: any = params.key;
    console.log('params.key', params.key);
    this.confirmServ.confirm({
      nzTitle: title,
      nzContent: content,
      nzOnOk: () => {
        this.service.deleteAction(pa).then((data: any) => {
          if (data['code'] != 200) {
            this.showDialog(data.msg);
          } else {
            this.showDialog('删除成功');
            this.deleteFl = true;
            if (this.nodes.length == 1 && !params.parentNode) {  //  如果删除的是最后一个节点
              this.noNode.emit();
            } else {
              this.reset();
            }

          }

        })
      },
      nzOnCancel() { }
    });

  }
}
