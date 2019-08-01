import { Component, Input, Output, EventEmitter,OnChanges , SimpleChanges} from '@angular/core';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import { AddUserGroupPageService } from './add-userGroup-page.service';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';

@Component({
    selector: 'add-userGroup-page',
    templateUrl: './add-userGroup-page.component.html',
})
export class AddUserGroupPageComponent {
    @Input() userGroup : boolean;
    @Input() isShow:boolean = false;
    @Input() tenantId:string;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

    isNeedSubmitAddUserGroupFormData:boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadUserGroupTable:boolean = false;

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        this.isSubmit = false;
        this.isReloadUserGroupTable = false;
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

    submitAddUserGroupForm(data:any){
        this.isNeedSubmitAddUserGroupFormData = false;
        if(data.status == 'VALID'){
            this.isConfirmLoading = true;
            this.service.addUserGroup(data.value).then((data: any) => {
                if(data.success==200){
                    this.onClose.emit(false);
                }else{
                    alert(data.result)
                }
            })
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitAddUserGroupFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: AddUserGroupPageService,private router: Router) {

    }

}