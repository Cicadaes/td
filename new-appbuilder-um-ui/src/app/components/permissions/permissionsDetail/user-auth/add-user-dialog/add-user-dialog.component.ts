import { Component, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { permissionsService } from '../../../permissions/permissions.service';

@Component({
    selector: 'add-user-dialog',
    templateUrl: './add-user-dialog.component.html',
})
export class AddUserDialogComponent {
    @Input() user : any;

    @Input() userId : number = 0;
    @Input() roleId : number = 0;
    @Input() tenantId : number = 0;

    @Input() isShow:boolean = false;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

    isNeedSubmitAddUserFormData:boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadUserTable:boolean = false;

    private toSubmit: EventEmitter<any> = new EventEmitter<any>()

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = this.isShow;
        this.isSubmit = false;
        this.isReloadUserTable = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            if (key == "isShow" && changes.isShow.currentValue != null) {
                this.isShow = changes.isShow.currentValue || false;
                this.showModal();
            }
        }
    }

    submitAddUserForm(data:any){
        this.isNeedSubmitAddUserFormData = false;
        if(data.status == 'VALID'){
            this.isConfirmLoading = true;
            let user = data.value;
            user.tenantId = this.tenantId;
            user.createUserId = this.userId;
            user.updateUserId = this.userId;
            this.service.addUser(user).then((data: any) => {
                if (data.success == true) {
                    let userAuth: any = {};
                    userAuth.userId = data.data;
                    userAuth.vroleId = this.roleId;
                    userAuth.createUserId = this.userId;
                    userAuth.updateUserId = this.userId;
                    this.service.authorizeUser(userAuth).then((data: any) => {
                        if (data.success == true) {
                            this.isReloadUserTable = true;
                            this.isSubmit = data.success;
                            this.onSubmit.emit(this.isReloadUserTable);
                        }
                        this.isConfirmLoading = false;
                        this.isVisible = false;
                        this.onClose.emit(this.isVisible);
                    });
                }
            })
        }
    }

    handleOk = (e: any) => {
        this.toSubmit.emit();
        this.isNeedSubmitAddUserFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: permissionsService) {

    }

}