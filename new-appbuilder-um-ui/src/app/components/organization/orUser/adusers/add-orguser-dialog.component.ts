import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddOrgUserDialogService } from './add-orguser-dialog.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'add-orguser-dialog',
  templateUrl: './add-orguser-dialog.component.html',
})
export class AddOrgUserDialogComponent {
  @Input() user: boolean;
  @Input() isShow: boolean = false;
  @Output() onClose = new EventEmitter<any>();
  @Output() tenantId: number = 0;
  @Output() onSubmit = new EventEmitter<any>();
  @Input() organization: any;

  isNeedSubmitAddUgUserFormData: boolean;
  isVisible = false;
  isSubmit = false;
  isConfirmLoading = false;
  isReloadUgUserTable: boolean = false;
  userGroupId: any;

  private toSubmit: EventEmitter<any> = new EventEmitter<any>()

  showModal = () => {
    this.isConfirmLoading = false;
    this.isVisible = true;
    this.isSubmit = false;
    this.isReloadUgUserTable = false;
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

  submitAddUgUserForm(data: any) {
    this.isNeedSubmitAddUgUserFormData = false;
    if (data.status == 'VALID') {
      this.isConfirmLoading = true;
      if (this.organization) {
        //data.value["virtualRoleId"]=this.organization.id;
        data.value["tenantId"] = this.organization.tenantId;
        data.value["deptId"] = this.organization.id;
      }

      if (data.value && data.value.email) {
        data.value.email = data.value.email.replace(/(^\s*)|(\s*$)/g, "");
      }


      this.service.addUgUser(data.value).subscribe((data: any) => {
        this.isVisible = false;
        this.isSubmit = true;
        this.isConfirmLoading = false;
        this.isReloadUgUserTable = true;
        this.onClose.emit(this.isVisible);
        this.onSubmit.emit(this.isSubmit);
      })
    }
  }

  handleOk = (e: any) => {
    this.toSubmit.emit()
    this.isNeedSubmitAddUgUserFormData = true;
  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  constructor(private service: AddOrgUserDialogService, private router: Router, private route: ActivatedRoute) {

  }

}
