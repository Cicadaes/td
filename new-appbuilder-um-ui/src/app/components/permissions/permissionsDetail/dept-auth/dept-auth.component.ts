import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { DeptAuthService } from './dept-auth.service';
import { ActivatedRoute } from "@angular/router";
import { DeptAuthTableComponent } from './table/dept-auth-table.component';


@Component({
  selector: 'dept-auth',
  templateUrl: './dept-auth.component.html',
  styleUrls: ['./dept-auth.component.css']
})
export class DeptAuthComponent implements OnInit, OnDestroy {
  @Input() tenantId: number = 0;
  @Input() userId: number = 0;
  @Input() roleId: number = 0;
  @Input() targetId: number;
  @Input() roleHierarchyId: any;
  @ViewChild(DeptAuthTableComponent) child: DeptAuthTableComponent;
  seting: boolean = false;
  treeNodes: number = 0;
  isShow: boolean = false;
  adding: boolean = false;
  asName: string = '';
  addOriData: any = {};


  deptQuery: any = {};
  organizationTreeData: any = {
    hasChecked: true,//需要复选框
    needMenu: false,//需要菜单
    data: null
  }
  deptAuthTableAjaxUrl: string;
  checkedFunIds: any[] = [];
  checkedDatas: any[] = [];

  constructor(private service: DeptAuthService, private activatedRoute: ActivatedRoute) {
    this.deptAuthTableAjaxUrl = service.getDeptAuthUrl;
  }

  onChangeOrganizationTreeData(data: any) {
    let _data = data.data;
    this.checkedDatas = _data;
    //this.pushIds(_data);
  }

  pushIds(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        this.checkedFunIds.push(data[i].id)
      }
      if (data[i].children.length > 0) {
        this.pushIds(data[i].children);
      }
    }
  }
  funcQuery(id: any, id1: any) {
    this.service.queryFunctions(id, id1).then((data: any) => {
      if (data['code'] === 200 && data.data && data.data[0] && data.data[0]['id']) {
        this.treeNodes = data.data.length;
      }
    });
  }
  //点击设置，获取角色层级id，隐藏列表
  changeLevel(data: any) {
    this.seting = true;
    this.roleHierarchyId = data.id;
    this.addOriData = data;
    this.asName = data.name;

    this.funcQuery(this.roleHierarchyId, this.tenantId);

  }
  // 新增角色层级以后刷新列表，默认打开刚添加的角色层级设置
  refreshList(arr: any) {
    this.child.refreshData();
    this.seting = true;
    this.roleHierarchyId = arr[0];
    this.addOriData = { id: arr[0], name: arr[1], description: arr[2], targetId: this.targetId, tenantId: this.tenantId };
    this.asName = arr[1];
    this.funcQuery(this.roleHierarchyId, this.tenantId);
  }
  changeShow(data: any) {
    this.isShow = false;
  }

  addRoleLevel() {
    this.isShow = true;
  }
  // 无节点时展示图片
  showImg() {
    this.seting = true;
    this.treeNodes = 0;
    this.adding = false;
  }
  //添加顶层角色
  showAddModal() {
    this.adding = true;
  }
  backToList() {
    this.seting = false;
    this.adding = false;
  }

  ngOnInit() {
    this.tenantId = this.activatedRoute.snapshot.params['tenantId'];
    this.userId = this.activatedRoute.snapshot.params['userId'];
    this.targetId = this.activatedRoute.snapshot.params['targetId'];
  }

  ngOnDestroy() {

  }

}
