import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DeptAuthService } from './dept-auth.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dept-auth',
  templateUrl: './dept-auth.component.html',
  styleUrls: ['./dept-auth.component.css']
})
export class DeptAuthComponent implements OnInit, OnDestroy {
  @Input() tenantId = 0;
  @Input() userId = 0;
  @Input() roleId  = 0;

  deptQuery: any = {};
  organizationTreeData: any = {
    hasChecked: true, // 需要复选框
    needMenu: false, // 需要菜单
    data: null
  };
  deptAuthTableAjaxUrl: string;
  checkedFunIds: any[] = [];
  checkedDatas: any[] = [];

  constructor(private service: DeptAuthService, private activatedRoute: ActivatedRoute, private confirmServ: NzModalService) {
    this.deptAuthTableAjaxUrl = service.getDeptAuthUrl;
  }
  // 递归获取到的数据进行处理（改变数据，使select=false,去除默认选中状态)
  changeData(param: any) {
    if (param.select) {
      param.select = false;
      if (param.children.length > 0) {
        param.children.forEach((item: any) => {
          this.changeData(item);
        });
      } else {
        return;
      }
    }
  }
  queryOrganizationTreeData() {
    const params = {
      tenantId: this.tenantId,
      id: this.roleId
    };
    this.service.getDeptAuth(params).subscribe((data: any) => {
      if (data != null || data.data != null) {
        console.log(data.data);
        data.data.forEach((item: any) => {
          this.changeData(item);
          // item.select = false;
        });
        this.organizationTreeData.data = data.data;
      }
    });
  }

  onChangeOrganizationTreeData(data: any) {
    const _data = data.data;
    this.checkedDatas = _data;
    // this.pushIds(_data);
  }

  pushIds(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        this.checkedFunIds.push(data[i].id);
      }
      if (data[i].children.length > 0) {
        this.pushIds(data[i].children);
      }
    }
  }

  submitAuthorizedOrg = (e: any) => {
    this.checkedFunIds = [];
    this.pushIds(this.checkedDatas);
    const params = {
      roleId: this.roleId,
      virtualroleIdList: this.checkedFunIds
    };
    if (this.organizationTreeData.data && this.organizationTreeData.data.length) {
      this.service.saveOrganization(params).subscribe((data: any) => {
        if (data.success) {
          this.confirmServ.info({
            nzTitle: '更新成功！',
            nzContent: ''
          });
          this.queryOrganizationTreeData();
        }
      });
    } else {
      this.confirmServ.info({
        nzTitle: '组织机构为空，请创建组织机构',
        nzContent: ''
      });
    }
  }


  ngOnInit() {
    this.tenantId = this.activatedRoute.snapshot.params['tenantId'];
    this.userId = this.activatedRoute.snapshot.params['userId'];
    this.roleId = this.activatedRoute.snapshot.params['roleId'];

    this.queryOrganizationTreeData();
  }

  ngOnDestroy() {

  }

}
