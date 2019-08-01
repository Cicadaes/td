import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddAppDialogService } from './add-app-dialog.service';

@Component({
    selector: 'add-app-dialog',
    templateUrl: './add-app-dialog.component.html',
})
export class AddAppDialogComponent {
    @Input() app: boolean;
    @Input() isShow =  false;
    @Output() onClose = new EventEmitter<any>();

    isNeedSubmitAddAppFormData: boolean;
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

    submitAddAppForm(data: any) {
        this.isNeedSubmitAddAppFormData = false;
        if (data.status === 'VALID') {
            this.isConfirmLoading = true;
            this.service.addApp(data.value).subscribe((data1: any) => {
                this.isVisible = false;
                this.isConfirmLoading = false;
                this.onClose.emit(this.isVisible);
            });
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitAddAppFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: AddAppDialogService) {

    }

}
