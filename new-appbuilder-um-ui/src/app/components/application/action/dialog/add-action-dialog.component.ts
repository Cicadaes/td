import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddActionDialogService } from './add-action-dialog.service';

@Component({
    selector: 'add-action-dialog',
    templateUrl: './add-action-dialog.component.html',
})
export class AddActionDialogComponent {
    @Input() action: boolean;
    @Input() isShow: boolean = false;
    @Output() onClose = new EventEmitter<any>();

    isNeedSubmitAddActionFormData: boolean;
    isVisible = false;
    isConfirmLoading = false;

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
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

    submitAddActionForm(data: any) {
        this.isNeedSubmitAddActionFormData = false;
        if (data.status == 'VALID') {
            this.isConfirmLoading = true;
            this.service.addAction(data.value).subscribe((data: any) => {
                this.isVisible = false;
                this.isConfirmLoading = false;
                this.onClose.emit(this.isVisible);
            })
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitAddActionFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: AddActionDialogService) {

    }

}