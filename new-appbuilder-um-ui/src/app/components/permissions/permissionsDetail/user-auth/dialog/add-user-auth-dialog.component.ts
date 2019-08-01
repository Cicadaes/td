import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { permissionsService } from '../../../permissions/permissions.service';
@Component({
  selector: 'add-user-auth-dialog',
  templateUrl: './add-user-auth-dialog.component.html',
  styleUrls: ['./add-user-auth-dialog.component.css']
})
export class AddUserAuthDialogComponent implements OnInit, OnChanges {
  @Input() isSuper: boolean = true;
  @Input() userId: number = 0;
  @Input() roleId: number = 0;
  @Input() tenantId: number = 0;

  isReloadData: boolean = false;
  queryParams: any = {};

  _searchValue = "";

  @Input() isShow: boolean = false;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  public toSubmit: EventEmitter<any> = new EventEmitter()



  isNeedSubmit: boolean = false;
  isVisible = false;
  isConfirmLoading = false;

  showModal = () => {
    this.isConfirmLoading = false;
    this.isVisible = this.isShow;
    this.isReloadData = this.isShow;
    this.isNeedSubmit = !this.isShow;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let key in changes) {
      if (key == "isShow" && changes.isShow.currentValue != null) {
        this.isShow = changes.isShow.currentValue || false;
        this.showModal();
      }
    }
  }

  onSearchUnauthUser(data: any = null) {
    this.queryParams = {};
    this.queryParams.name = data && data.trim();
    this.queryParams.vroleId = this.roleId;
    this.queryParams.tenantId = this.tenantId;
  }

  handleOk = (e: any) => {
    this.isNeedSubmit = true;
    this.toSubmit.emit()
  }

  onSubmitUserAuth(authSet: any[]) {
    this.service.batchAuthorizeUser(authSet).then((data: any) => {
      if (data.success == true) {
        this.onSubmit.emit(true);
      }
      this.onClose.emit(this.isVisible);
    });
  }


  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  constructor(private service: permissionsService) {

  }

  ngOnInit() {
    this.onSearchUnauthUser();
  }
}
