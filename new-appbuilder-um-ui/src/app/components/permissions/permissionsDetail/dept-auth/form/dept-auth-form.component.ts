import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { deptAuthFormService } from "./dept-auth-form.service";

@Component({
    selector: 'dept-auth-form',
    templateUrl: './dept-auth-form.component.html',
    styleUrls: ['./dept-auth-form.component.css'],
    providers: [FormBuilder]
})

export class deptAuthFormComponent implements OnInit {
    @Input() needSubmit: boolean;
    @Input() userGroup: any;
    @Input() tenantId: string;
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onExists = new EventEmitter<any>();
    status: boolean = false;
    gender: any;
    isInitFormValue: boolean = false;
    genderSelect: any;
    autoPassword: boolean = false;
    password_: string;
    existUserGroupName: boolean = false;
    validateForm: FormGroup;

    organizationSelect: any;

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
    }

    checkHasFieldName(fieldName: string) {
        let has = false;
        for (let o in this.validateForm.controls) {
            if (fieldName && fieldName == o) {
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
    constructor(private fb: FormBuilder, private service: deptAuthFormService) {

    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(() => {
            this.validateForm.controls['checkPassword'].updateValueAndValidity();
        });
    }

    clearPasswordInput() {
        if (this.autoPassword) {
            this.validateForm.controls['password'].setValue('******');
            this.validateForm.controls['checkPassword'].setValue('******');
        } else {
            if (this.validateForm.controls['password'].value && this.validateForm.controls['password'].value !== '******') {
                this.password_ = this.validateForm.controls['password'].value;
            }
            this.validateForm.controls['password'].setValue(this.password_);
            this.validateForm.controls['checkPassword'].setValue(this.password_);
        }
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls['password'].value) {
            return { confirm: true, error: true };
        }
    };

    confirmationMobile = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else {
            if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.validateForm.controls['mobile'].value))) {
                return { required: true };
            }
        }
    };
    trim(str: any) { //正则表达式------去掉字符串前后所有空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
    confirmationNameExists = async (control: FormControl): Promise<any> => {
        let nameRepeat: boolean = false;
        let nameLayout: boolean = false;


        // if (!(/^([\u2E80-\u9FFF]|\w|[,，\.。\-])*$/.test(control.value))) {
        //     return { nameLayout: true };
        //     // resolve(nameLayout ? { 'nameLayout': { value: control.value } } : null)
        //     // this.onExists.emit(nameLayout);
        // }
        // let controlV = control.value
        // controlV && (controlV = controlV.trim())
        let pamams = {};
        if (this.userGroup) {
            pamams = {
                vid: this.userGroup.id,
                vname: this.trim(control.value),
                tenantId: this.tenantId
            };
        } else {
            pamams = {
                vname: this.trim(control.value),
                tenantId: this.tenantId,
            };
        }
        return new Promise((resolve: any, reject: any) => {
            this.service.queryUserGroupsByPage(pamams).then((data: any) => {
                if (data.data && data.data.length > 0) {
                    nameRepeat = true;
                } else {
                    nameRepeat = false;
                }
                resolve(nameRepeat ? { 'nameRepeat': { value: control.value } } : null)
                this.onExists.emit(nameRepeat);
            })
        });

    };
    confirmationEmail = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { email: true };
        } else {
            if (!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.validateForm.controls['email'].value))) {
                return { email: true };
            }
        }
    };
    /* 验证不为空，最小长度，最大长度，特殊字符*/
    checkCode = (control: FormControl): any => {

        const specialReg = RegExp(/^([\u4E00-\u9FA5]|[A-Za-z]|[0-9]|[ ]|[-_&])+$/);
        if (!control.value) {
            return { required: true };
        } else {
            if (!specialReg.test(control.value)) {
                return { special: true }
            } else {
                let tempName;
                if (control.value && control.value.length) {
                    tempName = this.trim(control.value);
                }
                if (tempName && tempName.length < 2) {
                    return { minlength: true }
                } else if (tempName && tempName.length > 100) {
                    return { maxlength: true }
                }
            }
        }

    }
    /**
    * 名称验证不能全为空格
    */
    folderName = (control: FormControl): any => {
        // const FOLDERname_REGEXP1 = new RegExp(/^([\u4E00-\u9FA5]|[A-Za-z]|[0-9]|[ ]|[-_&])+$/);
        // if (!FOLDERname_REGEXP1.test(control.value)) {
        //     if (control.value.length) {
        //         return { duplicated: true }
        //     }
        // }
        const FOLDERname_REGEXP2 = new RegExp(/^[ ]*$/);
        if (FOLDERname_REGEXP2.test(control.value)) {
            if (control.value.length) {
                return { allSpace: true }
            }
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
            name: [null, [this.checkCode], this.confirmationNameExists],
            desc: [null, [Validators.maxLength(256)]],
            tenantId: [null],
            parentId: [null],
            type: [null],
            code: [null]
            //desc              : [ null, [Validators.required]]
        });
    }


    ngOnInit() {
        this.organizationSelect = {
            apiData: false,
            apiUrl: '',
            apiParam: {},
            initValue: [{
                value: 'zhejiang',
                label: '浙江'
            }, {
                value: 'hangzhou',
                label: '杭州'
            }, {
                value: 'xihu',
                label: '西湖'
            }],
            selectOptions: [
                {
                    value: 'zhejiang',
                    label: '浙江',
                    children: [{
                        value: 'hangzhou',
                        label: '杭州',
                        children: [{
                            value: 'xihu',
                            label: '西湖',
                            isLeaf: true
                        }],
                    }, {
                        value: 'ningbo',
                        label: '宁波',
                        isLeaf: true
                    }],
                },
                {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [{
                        value: 'nanjing',
                        label: '南京',
                        children: [{
                            value: 'zhonghuamen',
                            label: '中华门',
                            isLeaf: true
                        }],
                    }],
                }
            ]

        };
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

    initUserGroupFormData() {
        if (this.isInitFormValue) {
            return false;
        }
        this.isInitFormValue = true;
        if (this.userGroup) {
            for (let o in this.userGroup) {
                this.componentChange(this.userGroup[o], o);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.needSubmit = changes.needSubmit.currentValue || false;
        if (this.needSubmit) {
            this._submitForm();
        } else {
            this.initValidateForm();
            this.initUserGroupFormData();
        }
    }

}