import { Component, OnInit, OnDestroy, Input, EventEmitter } from '@angular/core';
import { manageRoleService } from './manage-role.service';


@Component({
  selector: 'manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.css']
})
export class manageRoleComponent implements OnInit, OnDestroy {
  @Input() tenantId: number;
  @Input() userId: number;
  @Input() roleId: number;

  private _batchRemove: EventEmitter<any> = new EventEmitter()

  userGroup: any = {};

  isShowAddUserGroupAuthModal: boolean = false;
  isConfirmLoading: boolean;
  doBatchRevoke: boolean;
  batchRemoveUsers: boolean;

  private refresh: EventEmitter<any> = new EventEmitter<any>()


  constructor(private service: manageRoleService) {
    //this.userGroupAuthTableAjaxUrl = service.getUserGroupAuthUrl;
  }
 
  setUserGroupParams() {
    this.userGroup.tenantId = this.tenantId;
    this.userGroup.id = this.roleId;
  }

  ngOnInit() {
    this.setUserGroupParams();
  }

  ngOnDestroy() {

  }

}
