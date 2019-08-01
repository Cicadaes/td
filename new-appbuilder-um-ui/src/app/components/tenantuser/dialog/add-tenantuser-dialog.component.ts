import { Component, Input, Output, EventEmitter,OnChanges , SimpleChanges} from '@angular/core';
import { AddTenantUserDialogService } from './add-tenantuser-dialog.service';

@Component({
    selector: 'add-tenantuser-dialog',
    templateUrl: './add-tenantuser-dialog.component.html',
})
export class AddTenantUserDialogComponent {
    @Input() needSubmit : boolean;
    @Input() user : boolean;
    @Input() isShow:boolean = false;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

    isNeedSubmitAddUserFormData:boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadUserTable:boolean = false;
    isPage = false;

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        this.isSubmit = false;
        this.isReloadUserTable = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.isShow && changes.isShow.currentValue){
            this.isShow = changes.isShow.currentValue;
        }else{
            this.isShow = false;
        }
        if(this.isShow){
            this.showModal();
        }
    }

    submitAddUserForm(data:any){
        this.isNeedSubmitAddUserFormData = false;
        if(data.status == 'VALID'){
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

    ngOnInit() {
        this.isPage = false;
    }

    constructor(private service: AddTenantUserDialogService) {

    }

}