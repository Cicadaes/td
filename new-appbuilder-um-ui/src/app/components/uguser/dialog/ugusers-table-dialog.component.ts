import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UgUsersTableDialogService } from './ugusers-table-dialog.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
    selector: 'ugusers-table-dialog',
    templateUrl: './ugusers-table-dialog.component.html',
})
export class UgUsersTableDialogComponent implements OnChanges {
    @Input() user: boolean;
    @Input() isShow = false;
    @Input() tenantId: number;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

    isNeedSubmitUgUsersTableFormData: boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadUgUserTable = false;
    userGroupId: any;
    checkedUser: any[] = [];


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

    onCheckUgUsers(users: any[]) {
        this.checkedUser = users;
    }

    submitUgUsersTableForm(data: any) {
        this.isNeedSubmitUgUsersTableFormData = false;
        if (data.status === 'VALID') {
            this.isConfirmLoading = true;
            if (!this.userGroupId) {
                this.userGroupId = this.route.snapshot.params['id'];
            }
            data.value['virtualRoleId'] = this.userGroupId;
            this.service.addUgUser(data.value).then((response: any) => {
                this.isVisible = false;
                this.isSubmit = true;
                this.isConfirmLoading = false;
                this.isReloadUgUserTable = true;
                this.onClose.emit(this.isVisible);
                this.onSubmit.emit(this.isSubmit);
            });
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitUgUsersTableFormData = true;
        this.checkedUser.forEach((user: any, index: any) => {
            this.isConfirmLoading = true;
            if (!this.userGroupId) {
                this.userGroupId = this.route.snapshot.params['id'];
            }
            user.virtualRoleId = this.userGroupId;
            this.service.addUgUser(user).then((data: any) => {
                this.isVisible = false;
                this.isSubmit = true;
                this.isConfirmLoading = false;
                this.isReloadUgUserTable = true;
                this.onClose.emit(this.isVisible);
                this.onSubmit.emit(this.isSubmit);
            });
        });

    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(
        private service: UgUsersTableDialogService,
        private router: Router,
        private route: ActivatedRoute) {

    }
}
