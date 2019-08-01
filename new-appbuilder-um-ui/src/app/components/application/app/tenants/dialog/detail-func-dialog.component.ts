import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DetailFuncDialogService } from './detail-func-dialog.service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'detail-func-dialog',
    templateUrl: './detail-func-dialog.component.html',
    styleUrls: ['./detail-func-dialog.component.css']
})
export class DetailFuncDialogComponent {
    @Input() user: boolean;
    @Input() isShow = false;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

    isNeedSubmitAddUserFormData: boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadUserTable = false;
    isSetTreeDatas = true;
    @Input() resourceTreeDatas: any[] = [];

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
        this.isNeedSubmitAddUserFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }
    getBackTreeDatas(datas: any[]) {

    }

    constructor(private service: DetailFuncDialogService, private confirmServ: NzModalService) {

    }

}
