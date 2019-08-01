import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FuncAuthHomeService } from '../func-auth-home.service';
import { NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'edit-data-dialog',
    templateUrl: './edit-data-dialog.component.html',
    providers:[FormBuilder]
})
export class EditDataDialogComponent {
    @Output() onSubmit = new EventEmitter<any>();
    authBeans = [];
    isVisible = false;
    isConfirmLoading = false;
    editForm: FormGroup;
    data = {
        targetName: '',
        dataName: '',
        authBeans: []
    };
    constructor( 
        private fb: FormBuilder,
        private funcAuthHomeService: FuncAuthHomeService,
        private notification: NzNotificationService
        ) {
          this.editForm = this.fb.group({
        });
    }

    getFormControl(name: any) {
        return this.editForm.controls[name];
    }

    showModal(data){
        this.data = JSON.parse(JSON.stringify(data));
        this.isConfirmLoading = false;
        this.isVisible = true;
    }

    submitAddDataForm() {
        if (this.data) {
            this.isConfirmLoading = true;
            this.funcAuthHomeService.updateTargetDetailAuths(this.data).then(res => {
                this.isConfirmLoading = false;
                if (res.code === 200) {
                    this.onSubmit.emit(true);
                    this.data = {
                        targetName: '',
                        dataName: '',
                        authBeans: []
                    };
                    this.isVisible = false;
                               
                } else {
                    this.notification.error('error', res.message);
                }
            })
           
        }
    }

    handleOk = (e: any) => {
        this.submitAddDataForm();
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.data = {
            targetName: '',
            dataName: '',
            authBeans: []
        };
    }
    
}