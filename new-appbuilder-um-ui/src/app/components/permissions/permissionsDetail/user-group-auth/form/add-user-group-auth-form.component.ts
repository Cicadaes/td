import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'add-user-group-auth-form',
    templateUrl: './add-user-group-auth-form.component.html',
    styleUrls: ['./add-user-group-auth-form.component.css'],
    providers: [FormBuilder]
})

export class AddUserGroupAuthFormComponent implements OnInit {
    @Input() needSubmit: boolean;
    @Input() role: any;
    @Output() onSubmit = new EventEmitter<any>();
    status: boolean = false;
    gender: any;
    isInitFormValue: boolean = false;
    genderSelect: any;

    validateForm: FormGroup;

    componentChange(value: any, fieldName: string) {
        if (this.checkHasFieldName(fieldName)) {
            if (fieldName === 'status') {
                if (value === 1) {
                    value = true;
                } else {
                    value = false;
                }
                this.status = value;
            }
            this.validateForm.controls[fieldName].setValue(value);
        }
    }

    checkHasFieldName(fieldName: string) {
        let has = false;
        for (let o in this.validateForm.controls) {
            if (fieldName && fieldName === o) {
                has = true;
                break;
            }
        }
        return has;
    }

    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
        }

        setTimeout(() => {
            this.onSubmit.emit(this.validateForm);
        }, 100);

    }
    constructor(private fb: FormBuilder) {

    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(() => {
            this.validateForm.controls['checkPassword'].updateValueAndValidity();
        });
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls['password'].value) {
            return { confirm: true, error: true };
        }
    }

    getCaptcha(e: MouseEvent) {
        e.preventDefault();
    }

    initValidateForm() {
        if (this.validateForm) {
            return false;
        }
        this.validateForm = this.fb.group({
            id: [null],
            email: [null, [Validators.email]],
            password: [null, [Validators.required]],
            checkPassword: [null, [Validators.required, this.confirmationValidator]],
            name: [null, [Validators.required]],
            mobile: [null],
            // phone             : [ null, [ Validators.required ] ],
            // wechat           : [ null, [ Validators.required ] ],
            // qq                : [ null, [ Validators.required ] ],
            // gender             : [ null ],
            status: [true]
            // desc              : [ null, [Validators.required]]
        });
    }


    ngOnInit() {
        this.genderSelect = {
            id: 3,
            fieldName: 'gender',
            fieldLabel: '性别',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '1',
                label: '正常'
            }, {
                value: '0',
                label: '禁用'
            }]
        };
    }

    getFormControl(name: string) {
        return this.validateForm.controls[name];
    }

    initUserGroupAuthFormData() {
        if (this.isInitFormValue) {
            return false;
        }
        this.isInitFormValue = true;
        if (this.role) {
            const pass = this.role.password;
            for (let o in this.role) {
                this.componentChange(this.role[o], o);
            }
            this.validateForm.controls['checkPassword'].setValue(pass);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.needSubmit = changes.needSubmit.currentValue || false;
        if (this.needSubmit) {
            this._submitForm();
        } else {
            this.initValidateForm();
            this.initUserGroupAuthFormData();
        }
    }

}
