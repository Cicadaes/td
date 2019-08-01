import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { UgRolesTableDialogService } from './ugroles-table-dialog.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'ugroles-table-dialog',
  templateUrl: './ugroles-table-dialog.component.html',
  styleUrls: ['./ugroles-table-dialog.component.css']
})
export class UgRolesTableDialogComponent implements OnChanges, OnInit {
  @Input() user: boolean;
  @Input() isShow = false;
  @Input() tenantId: number;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  rolesFieldArray: any[];
  isNeedSubmitUgRolesTableFormData: boolean;
  isVisible = false;
  isSubmit = false;
  isConfirmLoading = false;
  isReloadRoleTable = false;
  userGroupId: any;
  checkedRole: any[] = [];
  queryParams: any = {};
  search: any;

  // 页面类型，在那个组件下
  // 0 --- 用户组
  // 1 --- 用户
  @Input() viewType = 0;
  // private viewType: number = 0

  showModal = () => {
    this.isConfirmLoading = false;
    this.isVisible = true;
    this.isSubmit = false;
    this.isReloadRoleTable = false;
  }


  initFieldArray() {
    this.rolesFieldArray = [{
      id: 1,
      fieldName: 'name',
      fieldLabel: '名称',
      fieldType: 'input'
    }];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isShow && changes.isShow.currentValue) {
      this.isShow = changes.isShow.currentValue;
    } else {
      this.isShow = false;
    }
    if (this.isShow) {
      this.showModal();
    }
  }

  onCheckAddUgRoles(users: any[]) {
    this.checkedRole = users;
  }

  submitUgRolesTableForm(data: any) {
    this.isNeedSubmitUgRolesTableFormData = false;
    if (data.status === 'VALID') {
      this.isConfirmLoading = true;
      if (!this.userGroupId) {
        this.userGroupId = this.route.snapshot.params['id'];
      }
      data.value['virtualRoleId'] = this.userGroupId;
      /*  data.value["tenantId"]=this.tenantId;*/
      this.service.addUgRole(data.value).then(() => {
        this.isVisible = false;
        this.isSubmit = true;
        this.isConfirmLoading = false;
        this.isReloadRoleTable = true;
        this.onClose.emit(this.isVisible);
        this.onSubmit.emit(this.isSubmit);
      });
    }
  }

  handleOk = (e: any) => {
    this.isNeedSubmitUgRolesTableFormData = true;
    if (!this.userGroupId) {
      this.userGroupId = this.route.snapshot.params['id'];
    }


    if (!this.viewType) {
      const userArr: any = [];
      this.checkedRole.forEach((item: any) => {
        userArr.push(item.id);
      });

      this.addRole({
        virtualroleId: this.userGroupId,
        roleIdList: userArr,
      });
    } else {
      if (this.checkedRole && this.checkedRole.length) {
        this.checkedRole.forEach((role: any, index: any) => {
          this.isConfirmLoading = true;
          const roleRelation = {
            userId: this.userGroupId,
            vroleId: role.id,
            createUserId: 1,
            updateUserId: 1,
            tenantId: this.tenantId
          };
          this.service.addUgRole(roleRelation).then((data: any) => {
            this.isVisible = false;
            this.isSubmit = true;
            this.isConfirmLoading = false;
            this.isReloadRoleTable = true;
            this.onClose.emit(this.isVisible);
            this.onSubmit.emit(this.isSubmit);
          });
        });
      } else {
        this.handleCancel();
      }
    }

  }

  handleCancel = (e: any = null) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  onSearchList(params: any) {
    this.queryParams = params;
  }

  onSearch(params: any, type: any) {
    const that = this;
    if (type === 'click') {
        if (params) {
            params = params.replace(/(^\s*)|(\s*$)/g, '');
        }
        that.queryParams = { 'name': params };

    } else {
        if (params.keyCode === 13) {
            if (that.search) {
                that.search = that.search.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.queryParams = { 'name': that.search };
        }
    }
  }


  ngOnInit() {
    this.initFieldArray();
    // 升级前
    // this.router.events.filter(event => event instanceof NavigationEnd).subscribe((data: any) => {
    //   if (data.url.indexOf('viewUserGroupDetail') !== -1) {
    //     this.viewType = 0;
    //   } else if (data.url.indexOf('viewTenantUserPage') !== -1) {
    //     this.viewType = 1;
    //   }
    // });
    this.router.events.subscribe(Event => {
      if (Event instanceof NavigationEnd) {
        // 待改
        console.log(Event);
        // if (Event.url.indexOf('viewUserGroupDetail') !== -1) {
        //   this.viewType = 0;
        // } else if (Event.url.indexOf('viewTenantUserPage') !== -1) {
        //   this.viewType = 1;
        // }
      }
    });
  }

  constructor(private service: UgRolesTableDialogService, private router: Router, private route: ActivatedRoute) {

  }

  private addRole(param: any) {
    this.service.saveVirtualroleRoleRel(param).subscribe((data: any) => {
      this.isVisible = false;
      this.isSubmit = true;
      this.isConfirmLoading = false;
      this.isReloadRoleTable = true;
      this.onClose.emit(this.isVisible);
      this.onSubmit.emit(this.isSubmit);
    });
  }

}
