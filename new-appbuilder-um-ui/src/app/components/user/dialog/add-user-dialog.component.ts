import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddUserDialogService } from './add-user-dialog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
})
export class AddUserDialogComponent {
  @Input() user: boolean;
  @Input() isShow = false;
  @Input() isSuper = true;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  isNeedSubmitAddUserFormData: boolean;
  isVisible = false;
  isSubmit = false;
  isConfirmLoading = false;
  isReloadUserTable = false;
  tenantId = 0;


  private toSubmit: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    if (this.activeRoute.snapshot.params['tenantId'] != null) {
      this.tenantId = this.activeRoute.snapshot.params['tenantId'];
    } else if (window['appConfig'] && window['appConfig'].tenant) {
      this.tenantId = window['appConfig'].tenant.id;
    } else {
      this.tenantId = 0;
    }
  }

  showModal = () => {
    this.isConfirmLoading = false;
    this.isVisible = true;
    this.isSubmit = false;
    this.isReloadUserTable = false;
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

  submitAddUserForm(data: any) {
    this.isNeedSubmitAddUserFormData = false;
    if (data.status === 'VALID') {
      this.isConfirmLoading = true;
      this.service.getUgUserList(data.value).then((vrslt: any) => {
        if (vrslt.total && vrslt.total > 0) {
          this.isConfirmLoading = false;
        } else {
          this.service.addUser(data.value).then((data1: any) => {
            this.isVisible = false;
            this.isSubmit = true;
            this.isConfirmLoading = false;
            this.isReloadUserTable = true;
            this.onClose.emit(this.isVisible);
            this.onSubmit.emit(this.isSubmit);
          });
        }
      });

    }
  }

  handleOk = (e: any) => {
    this.toSubmit.emit();
    this.isNeedSubmitAddUserFormData = true;
  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  constructor(private service: AddUserDialogService, private activeRoute: ActivatedRoute) {

  }

}
