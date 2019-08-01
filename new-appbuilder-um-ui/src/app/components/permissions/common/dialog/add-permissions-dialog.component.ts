import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { permissionsService } from '../../permissions/permissions.service';

@Component({
  selector: 'add-role-dialog',
  templateUrl: './add-role-dialog.component.html',
})
export class AddpermissionsDialogComponent {
  @Input() role: any;
  @Input() nameList: any;
  @Input() isShow: boolean = false;
  @Input() tenantId: number;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  // 告知form提交
  private toSubmit: EventEmitter<any> = new EventEmitter<any>()

  isNeedSubmitAddRoleFormData: boolean;
  isVisible = false;
  isSubmit = false;
  isConfirmLoading = false;
  isReloadUserTable: boolean = false;

  constructor(private service: permissionsService) { }

  showModal = () => {
    this.isConfirmLoading = false;
    this.isVisible = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.isVisible = this.isShow;
    /*if(changes.isShow && changes.isShow.currentValue){
        this.isShow = changes.isShow.currentValue;
    }else{
        this.isShow = false;
    }
    if(this.isShow){
        this.showModal();
    }*/
  }
  ngOnInit() {
  }

  submitAddRoleForm(roledata: any) {
    this.isNeedSubmitAddRoleFormData = false;
    if (roledata.status == 'VALID') {
      this.isConfirmLoading = true;
      if (this.role) {
        roledata.value.id = this.role.id;
      }
      roledata.value.tenantId = this.tenantId;
      this.service.addRole(roledata.value).then((data: any) => {
        if (data.success == true) {
          this.isVisible = false;
          this.isSubmit = true;
          this.isConfirmLoading = false;
          this.isReloadUserTable = true;
          this.onClose.emit(this.isVisible);
          this.onSubmit.emit(this.isSubmit);
        } 
      }).catch((err: any) => {
        console.log(err);
      });
    }
  }

  handleOk = (event: any) => {
    this.toSubmit.emit()
    this.isNeedSubmitAddRoleFormData = true;
  }

  handleCancel = (event: any) => {
    this.isVisible = false;
    this.onClose.emit(null);
  }
}
