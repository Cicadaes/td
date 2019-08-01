import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddUgUserFormService } from './add-uguser-form.service';
import { ActivatedRoute } from '@angular/router';
// 校验相关
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { CheckRegExpppassword } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';

@Component({
    selector: 'add-uguser-form',
    templateUrl: './add-uguser-form.component.html',
    styleUrls: ['./add-uguser-form.component.css'],
    providers: [FormBuilder]
})

export class AddUgUserFormComponent implements OnInit, OnChanges {
    @Input() needSubmit: boolean;
    @Input() user: any;
    @Input() tenantId: number;
    @Output() onSubmit = new EventEmitter<any>();
    status = false;
    gender: any;
    isInitFormValue = false;
    genderSelect: any;
    autoPassword = 'a';
    password_: string;
    existEmail: boolean;
    validateForm: FormGroup;
    emailErrorMsg: any;
    organizationSelect: any;
    userId: number;
    depts: any[] = [];
    deptIds: any[];
    deptId: number;

    private validatorEmail: any = CheckRegExp(this.regService.getEmail());
    private validatorPwd: any = CheckRegExpppassword(this.regService.getenterpassword());

    @Input() noOrg = false;

    @Input() set toSubmit(toSubmit: EventEmitter<any>) {
        toSubmit && toSubmit.subscribe(() => {
            this._submitForm()
        })
    }

    componentChange(value: any, fieldName: string) {
        if (this.checkHasFieldName(fieldName)) {
            if (fieldName == 'status') {
                if (value == 1) {
                    value = true;
                } else {
                    value = false;
                }
                this.status = value;
            }
            this.validateForm.controls[fieldName].setValue(value);
        }

        this.clearPasswordInput();
    }

    checkHasFieldName(fieldName: string) {
        let has = false;
        for (const o in this.validateForm.controls) {
            if (fieldName && fieldName == o) {
                has = true;
                break;
            }
        }
        return has;
    }

    _submitForm() {
        for (const i in this.validateForm.controls) {
            if (this.validateForm.controls.hasOwnProperty(i)) {
                this.validateForm.controls[i].markAsDirty();
            }
        }
        if (this.validateForm.status === 'VALID') {
            if (this.validateForm.controls['autoPassword'] && this.validateForm.controls['autoPassword'].value === 'b') {
                this.validateForm.controls['autoPassword'].setValue(false);
            } else {
                this.validateForm.controls['autoPassword'].setValue(true);
            }
            this.validateForm.controls['gender'].setValue(Number( this.validateForm.controls['gender'].value));
            this.onSubmit.emit(this.validateForm);
        }
    }
    constructor(
        private fb: FormBuilder,
        private service: AddUgUserFormService,
        private route: ActivatedRoute,
        private regService: RegexpSService) {

    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(() => {
            this.validateForm.controls['checkPassword'].updateValueAndValidity();
        });
    }

    clearPasswordInput() {
        if (this.validateForm && this.validateForm.controls) {
            if (this.validateForm.controls['autoPassword'] && this.validateForm.controls['autoPassword'].value === 'a') {
                this.validateForm.controls['password'].setValue('12345j');
                this.validateForm.controls['checkPassword'].setValue('12345j');
            } else {
                if (this.validateForm.controls['password'].value && this.validateForm.controls['password'].value !== '12345j') {
                    this.password_ = this.validateForm.controls['password'].value;
                }
                this.validateForm.controls['password'].setValue(this.password_);
                this.validateForm.controls['checkPassword'].setValue(this.password_);
            }
        }
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls['password'].value) {
            return { confirm: true, error: true };
        }
    }

    confirmationMobile = async (control: FormControl): Promise<any> => {
        let phoneFlag = false;
        let controlV = control.value;
        controlV && (controlV = controlV.trim());
        if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.validateForm.controls['mobile'].value))) {
            phoneFlag = true;
        } else {
            phoneFlag = false;
        }
        return (phoneFlag ? { 'phoneFlag': { value: control.value } } : null);
    }


    getCaptcha(e: MouseEvent) {
        e.preventDefault();
    }

    initValidateForm() {
        if (this.validateForm) {
            return false;
        }
        this.gender = '0';
        this.validateForm = this.fb.group({
            id: [null],
            email: [null, [Validators.required, this.validatorEmail, Validators.maxLength(256)], [this.checkRepeatEmail]],
            password: [null, [Validators.required, Validators.maxLength(32), Validators.minLength(6), this.validatorPwd]],
            checkPassword: [null, [Validators.required, this.confirmationValidator]],
            autoPassword: ['a'],
            name: [null, [Validators.required, Validators.maxLength(256)]],
            mobile: [null, [Validators.required], this.confirmationMobile],
            phone: [null, [Validators.maxLength(50)]],
            wechat: [null, [Validators.maxLength(50)]],
            qq: [null, [Validators.maxLength(50)]],
            gender: ['0'],
            title: [null, [Validators.maxLength(256)]],
            deptId: [null],
            status: [true]
        });
    }

    checkRepeatEmail = async (control: FormControl): Promise<any> => {
        let emailRepeat = false;
        let controlV = control.value;
        controlV && (controlV = controlV.trim());

        return new Promise((resolve: any, reject: any) => {
            this.service.queryOneEmailById({ email: controlV, tenantId: this.tenantId }).then((data: any) => {
                if (data.success === false) {
                    emailRepeat = true;
                    this.emailErrorMsg = data.msg;
                } else {
                    emailRepeat = false;
                    this.emailErrorMsg = '';
                }
                resolve(emailRepeat ? { 'emailRepeat': { value: control.value } } : null)
            });
        });
    }


    ngOnInit() {
        this.initValidateForm();
        this.clearPasswordInput();
        if (this.user) {
            this.initUgUserFormData();
        }

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

    initUgUserFormData() {
        if (this.isInitFormValue) {
            return false;
        }
        this.isInitFormValue = true;
        if (this.user) {
            for (let o in this.user) {
                this.componentChange(this.user[o], o);
            }
        }
    }

    // 下拉树使用变量
    onSelectOrganizationSelect(data: any) {
        this.deptId = data[data.length - 1];
        this.deptIds = data;
        this.validateForm.controls['deptId'].setValue(this.deptId);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.needSubmit = changes.needSubmit.currentValue || false;
        // if (this.needSubmit) {
        //   this._submitForm();
        // } else {
        //   this.initValidateForm();
        //   this.initUgUserFormData();
        // }

        // 下拉树使用方法
        this.userId = this.route.snapshot.params['id'];
        if (this.user) {
            if (this.userId) {
                this.initDeptDetail();
            }
        }
        this.queryOrganizations();
    }


    // 下拉树使用方法
    queryOrganizations() {
        const params = { tenantId: this.tenantId };
        if (!this.user) {
            this.status = true;
            // this.autoPassword = true;
            this.clearPasswordInput();
            this.gender = '0';
            this.service.queryOrganizations(params).then((data: any) => {
                if (data.success === 200) {
                    this.organizationSelect = {
                        apiData: false,
                        apiUrl: '',
                        apiParam: {},
                        initValue: [],
                        selectOptions: data.result
                    };
                }
            });
        } else if (this.user) {
            this.gender = this.user.gender;
            this.service.queryOrganizations(params).then((data: any) => {
                if (data.success === 200) {
                    this.organizationSelect = {
                        apiData: false,
                        apiUrl: '',
                        apiParam: {},
                        initValue: this.depts,
                        selectOptions: data.result
                    };
                }
            });
        }
    }

    initDeptDetail() {

        const pamams = { userId: this.userId };
        this.service.queryOrganization(pamams).then((data: any) => {
            if (data.success) {
                if (data.data) {
                    this.depts = data.data;
                }
            }
        });

    }

}
