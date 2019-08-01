import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddUserPageService } from './add-user-page.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'add-user-page',
    templateUrl: './add-user-page.component.html',
})
export class AddUserPageComponent {
    @Input() user: boolean;
    @Input() isShow: boolean = false;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();
    tenantId: number = 0;
    isNeedSubmitAddUserFormData: boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadUserTable: boolean = false;

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        this.isSubmit = false;
        this.isReloadUserTable = false;
    }

    ngOnInit() {
        if (this.activeRoute.snapshot.params['tenantId'] != null) {
            this.tenantId = this.activeRoute.snapshot.params['tenantId'];
        } else if (window['appConfig'] && window['appConfig'].tenant) {
            this.tenantId = window['appConfig'].tenant.id;
        } else {
            this.tenantId = 0;
        }
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
        if (data.status == 'VALID') {
            this.isConfirmLoading = true;
            this.service.addUser(data.value).then((data: any) => {
                this.isVisible = false;
                this.isSubmit = true;
                this.isConfirmLoading = false;
                this.isReloadUserTable = true;
                this.onClose.emit(this.isVisible);
                this.onSubmit.emit(this.isSubmit);
            })
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitAddUserFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: AddUserPageService, private activeRoute: ActivatedRoute) {

    }

}