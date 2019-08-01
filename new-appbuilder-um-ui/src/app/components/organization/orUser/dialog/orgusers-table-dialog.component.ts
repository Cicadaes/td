import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { OrgUsersTableDialogService } from './orgusers-table-dialog.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
    selector: 'orgusers-table-dialog',
    templateUrl: './orgusers-table-dialog.component.html',
})
export class OrgUsersTableDialogComponent implements OnChanges {
    @Input() user: boolean;
    @Input() isShow = false;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();
    @Input() organization: any;

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
    addUgUser(params: any) {
        this.service.addUgUser(params).subscribe((data: any) => {
            this.isVisible = false;
            this.isSubmit = true;
            this.isConfirmLoading = false;
            this.isReloadUgUserTable = true;
            this.onClose.emit(this.isVisible);
            this.onSubmit.emit(this.isSubmit);
        });
    }
    submitUgUsersTableForm(data: any) {
        this.isNeedSubmitUgUsersTableFormData = false;
        if (data.status === 'VALID') {
            this.isConfirmLoading = true;
            if (!this.userGroupId) {
                this.userGroupId = this.route.snapshot.params['id'];
            }
            data.value['virtualRoleId'] = this.userGroupId;
            this.addUgUser(data.value);

        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitUgUsersTableFormData = true;
        this.checkedUser.forEach((user: any, index: any) => {
            this.isConfirmLoading = true;
            if (this.organization) {
                user.virtualRoleId = this.organization.id;
                user.deptId = this.organization.id;
            }
            this.addUgUser(user);
        });

    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: OrgUsersTableDialogService, private router: Router, private route: ActivatedRoute) {

    }

}
