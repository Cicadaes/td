import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddUserGroupDialogService } from './add-userGroup-dialog.service';

@Component({
    selector: 'app-add-user-group-dialog',
    templateUrl: './add-userGroup-dialog.component.html',
})
export class AddUserGroupDialogComponent implements OnChanges {
    @Input() userGroup: boolean;
    @Input() isShow = false;
    @Input() tenantId: string;
    @Output() close = new EventEmitter<any>();
    @Output() submit = new EventEmitter<any>();

    isNeedSubmitAddUserGroupFormData: boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadUserGroupTable = false;
    existUserGroupName = false;

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        this.isSubmit = false;
        this.isReloadUserGroupTable = false;
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

    submitAddUserGroupForm(data: any) {
        this.isNeedSubmitAddUserGroupFormData = false;
        if (data.status === 'VALID') {
            this.isConfirmLoading = true;
            if (this.existUserGroupName) {
                this.isConfirmLoading = false;
            } else {
                data.value.tenantId = this.tenantId;
                this.service.addUserGroup(data.value).then((response: any) => {
                    this.isVisible = false;
                    this.isSubmit = true;
                    this.isConfirmLoading = false;
                    this.isReloadUserGroupTable = true;
                    this.close.emit(this.isVisible);
                    this.submit.emit(this.isSubmit);
                });
            }
        }
    }

    isExistsUserGroupName(data: any) {
        this.existUserGroupName = data;
    }

    handleOk = (e: any) => {
        this.isNeedSubmitAddUserGroupFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.close.emit(this.isVisible);
    }

    constructor(private service: AddUserGroupDialogService) {

    }

}
