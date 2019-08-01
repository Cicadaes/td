import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddUgUserDialogService } from './add-uguser-dialog.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'add-uguser-dialog',
    templateUrl: './add-uguser-dialog.component.html',
})
export class AddUgUserDialogComponent implements OnChanges {
    @Input() user: boolean;
    @Input() isShow = false;
    @Input() tenantId: number;
    @Input() deptId: number;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

    isNeedSubmitAddUgUserFormData: boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadUgUserTable = false;
    userGroupId: any;

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

    private toSubmit: EventEmitter<any> = new EventEmitter<any>();

    submitAddUgUserForm(data: any) {
        this.isNeedSubmitAddUgUserFormData = false;
        if (data.status === 'VALID') {
            this.isConfirmLoading = true;
            if (!this.userGroupId) {
                this.userGroupId = this.route.snapshot.params['id'];
            }
            data.value.tenantId = this.tenantId;
            this.service.getUgUserList(data.value).then((vrslt: any) => {
                if (vrslt.total && vrslt.total > 0) {
                    this.isConfirmLoading = false;
                    this.confirmServ.info({
                        nzTitle: '提示',
                        nzContent: '该账户已经注册，请联系管理员找回密码'
                    });
                } else {
                    data.value['virtualRoleId'] = this.userGroupId;
                    data.value.tenantId = this.tenantId;
                    this.service.addUgUser(data.value).then((response: any) => {
                        this.isVisible = false;
                        this.isSubmit = true;
                        this.isConfirmLoading = false;
                        this.isReloadUgUserTable = true;
                        this.onClose.emit(this.isVisible);
                        this.onSubmit.emit(this.isSubmit);
                    });
                }
            });
        }
    }

    handleOk = (e: any) => {
        this.toSubmit.emit();
        this.isNeedSubmitAddUgUserFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(
        private service: AddUgUserDialogService,
        private router: Router,
        private route: ActivatedRoute,
        private confirmServ: NzModalService) {

    }

}
