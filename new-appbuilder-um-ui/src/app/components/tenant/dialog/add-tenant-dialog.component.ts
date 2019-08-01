import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddTenantDialogService } from './add-tenant-dialog.service';

@Component({
    selector: 'app-add-tenant-dialog',
    templateUrl: './add-tenant-dialog.component.html',
})
export class AddTenantDialogComponent implements OnChanges {
    @Input() tenant: boolean;
    @Input() isShow = false;
    @Output() close = new EventEmitter<any>();
    @Output() submit = new EventEmitter<any>();
    isRepeatEmail = false;
    isNeedSubmitAddTenantFormData: boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadTenantTable = false;

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        this.isSubmit = false;
        this.isReloadTenantTable = false;
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

    submitAddTenantForm(data: any) {
        this.isNeedSubmitAddTenantFormData = false;
        if (data.status === 'VALID' && !this.isRepeatEmail) {
            this.isConfirmLoading = true;
            this.service.addTenant(data.value).then((response: any) => {
                this.isVisible = false;
                this.isSubmit = true;
                this.isConfirmLoading = false;
                this.isReloadTenantTable = true;
                this.close.emit(this.isVisible);
                this.submit.emit(this.isSubmit);
            });
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitAddTenantFormData = true;
    }

    repeatEmail(data: boolean) {
        this.isRepeatEmail = data;
    }
    handleCancel = (e: any) => {
        this.isVisible = false;
        this.close.emit(this.isVisible);
    }

    constructor(private service: AddTenantDialogService) {

    }
}
