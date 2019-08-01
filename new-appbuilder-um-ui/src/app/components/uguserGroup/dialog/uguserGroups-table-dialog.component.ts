import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddUgUserGroupDialogService } from './uguserGroups-table-dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'uguserGroups-table-dialog',
  templateUrl: './uguserGroups-table-dialog.component.html',
})
export class AddUgUserGroupDialogComponent {
  @Input() userGroup: boolean;
  @Input() isShow: boolean = false;
  @Input() tenantId: number;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  user: boolean;
  userId: number;

  isRefreshUgUserGroupTable: boolean;
  isVisible = false;
  isSubmit = false;
  isConfirmLoading = false;
  isReloadUgUserGroupTable: boolean = false;
  checkUserGroups: any[];
  showModal = () => {
    this.isConfirmLoading = false;
    this.isVisible = true;
    this.isSubmit = false;
    this.isReloadUgUserGroupTable = false;
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

  onCheckUgUserGroups(data: any) {
    this.checkUserGroups = data;
  }

  handleOk = (e: any) => {
    this.isRefreshUgUserGroupTable = true;
    if (!this.userId) {
      this.userId = this.route.snapshot.params['id'];
    }
    if (this.checkUserGroups && this.checkUserGroups.length) {
      this.checkUserGroups.forEach((userGroup: any, index: any) => {
        this.isConfirmLoading = true;
        const vroleUser = {
          vroleId: userGroup.id,
          userId: this.userId,
          createUserId: 1,
          updateUserId: 1,
          tenantId: this.tenantId
        };
        this.service.addUserToUserGroups(vroleUser).then((data: any) => {
          this.isVisible = false;
          this.isSubmit = true;
          this.isConfirmLoading = false;
          this.isReloadUgUserGroupTable = true;
          this.onClose.emit(this.isVisible);
          this.onSubmit.emit(this.isSubmit);
        });
      });
    } else {
      this.isVisible = false;
      this.isReloadUgUserGroupTable = true;
      this.isSubmit = true;
      this.onClose.emit(this.isVisible);
      this.onSubmit.emit(this.isSubmit);
    }
  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  constructor(private service: AddUgUserGroupDialogService, private router: Router, private route: ActivatedRoute) {

  }

}
