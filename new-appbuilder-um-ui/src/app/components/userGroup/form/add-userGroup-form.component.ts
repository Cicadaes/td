import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserGroupsTableService } from '../table/userGroups-table.service';
import { AddUserGroupFormService } from './add-userGroup-form.service';

@Component({
    selector: 'app-add-user-group-form',
    templateUrl: './add-userGroup-form.component.html',
    styleUrls: ['./add-userGroup-form.component.css'],
    providers: [FormBuilder]
})

export class AddUserGroupFormComponent implements OnInit, OnChanges {
    @Input() needSubmit: boolean;
    @Input() userGroup: any;
    @Input() tenantId: string;
    @Output() submit = new EventEmitter<any>();
    @Output() exists = new EventEmitter<any>();
    status = false;
    gender: any;
    isInitFormValue = false;
    genderSelect: any;
    autoPassword = false;
    password_: string;
    existUserGroupName = false;
    validateForm: FormGroup;

    organizationSelect: any;

    componentChange(value: any, fieldName: string) {
        if (this.checkHasFieldName(fieldName)) {
            if (fieldName === 'status') {
                if (value === 1 || value === '1') {
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
        for (const o in this.validateForm.controls) {
            if (fieldName && fieldName === o) {
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

        setTimeout(() => {
            this.submit.emit(this.validateForm);
        }, 100);

    }
    constructor(private fb: FormBuilder, private service: AddUserGroupFormService) {

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
    }

    confirmationMobile = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else {
            if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.validateForm.controls['mobile'].value))) {
                return { required: true };
            }
        }
    }
    trim(str: any) { // 正则表达式------去掉字符串前后所有空格
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }
    confirmationNameExists = async (control: FormControl): Promise<any> => {
        let nameRepeat = false;
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
                resolve(nameRepeat ? { 'nameRepeat': { value: control.value } } : null);
                this.exists.emit(nameRepeat);
            });
        });
    }

    confirmationEmail = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { email: true };
        } else {
            if (!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.validateForm.controls['email'].value))) {
                return { email: true };
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
            name: [null, [Validators.required, Validators.maxLength(256)], this.confirmationNameExists],
            desc: [null, [Validators.maxLength(256)]],
            tenantId: [null],
            parentId: [null],
            type: [null],
            code: [null]
            // desc              : [ null, [Validators.required]]
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
            for (const o in this.userGroup) {
                if (this.userGroup.hasOwnProperty(o)) {
                    this.componentChange(this.userGroup[o], o);
                }
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
