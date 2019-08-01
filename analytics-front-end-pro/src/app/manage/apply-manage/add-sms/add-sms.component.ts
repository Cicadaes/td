import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApplyManageService } from '../apply-manage.service';
import { Globals} from "../../../utils/globals"
import { NzNotificationService } from 'ng-zorro-antd';
import { CommonService } from '../../../common/services/common.service';

@Component({
    selector: 'app-add-sms',
    templateUrl: './add-sms.component.html',
    styleUrls: ['./add-sms.component.less']
})
export class AddSmsComponent implements OnInit, OnChanges {
    productId: any = 467;
    @Input() isVisible;
    @Input() editFlag: any;
    @Input() editData: any;
    @Output() hideDialog = new EventEmitter<any>();
    @Output() saveDate = new EventEmitter<any>();
    validateForm: FormGroup;
    data: any = {
        signaList: [{ key: '', sign: '' }],
        subCodeList: [{ key: '' }]
    };
    signaCodeMessage: string;
    signaNameMessage: string;
    subCodeMessage: string;
    signaNameErr: any = [];
    signaCodeErr: any = [];
    subCodeListErr: any = [];

    constructor(
        private fb: FormBuilder,
        private notification: NzNotificationService,
        private commonService: CommonService,
        private applyManageService: ApplyManageService,
        private globals: Globals
    ) { }

    ngOnInit() {
        if (this.commonService.productId) {
            this.productId = Number(this.commonService.productId);
        }

        this.validateForm = this.initialValidateForm();

        if (this.editFlag) {
            this.resetValidateForm(this.editData);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.validateForm = this.initialValidateForm();
        this.data = {
            signaList: [{ key: '', sign: '' }],
            subCodeList: [{ key: '' }]
        };

        if (changes.isVisible) {
            this.isVisible = changes.isVisible.currentValue;
        }

        if (changes.editFlag) {
            this.editFlag = changes.editFlag.currentValue;
        }

        if (changes.editData) {
            this.editData = changes.editData.currentValue;
        }

        if (this.editFlag) {
            this.resetValidateForm(this.editData);
            if (this.editData) {
                this.data.subCodeList = [];
                this.data.signaList = this.editData.param.signList;
                this.editData.param.subCodeList.map((one) => {
                    this.data.subCodeList.push({
                        key: one
                    });
                });
                this.data = Object.assign({}, this.data);
            }
        }
    }

    // 初始化表单
    initialValidateForm(): any {
        return this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(32), this.checkName]],                                   // 渠道名称
            code: [null, [Validators.required, Validators.maxLength(255), this.checkCode]]
        });
    }

    // 重置化表单
    resetValidateForm(data: any) {
        this.validateForm.reset({
            name: data['name'] ? data.name : null,                                 // 渠道名称
            code: data['code'] ? data.code : null,                                 // code
        });
    }

    getFormControl(name: string) {
        return this.validateForm.controls[name];
    }

    //  取消
    handleCancel = (e) => {
        this.isVisible = false;
        this.globals.resetBodyStyle();
        this.hideDialog.emit(this.isVisible);
    }

    // 表单验证
    submitForm() {
        for (const i in this.validateForm.controls) {
            if (this.validateForm.controls.hasOwnProperty(i)) {
                this.validateForm.controls[i].markAsDirty();
                // this.validateForm.controls[i].updateValueAndValidity();
            }
        }
    }

    checkName = (control: FormControl): { [key: string]: any } => {
        let nameError = false;
        const controlV = control.value;
        const reg = new RegExp('^[A-Za-z\u4e00-\u9fa5]+$');
        if (reg.test(controlV)) {
            nameError = false;
        } else if (!reg.test(controlV)) {
            nameError = true;
        }
        if (controlV == null || controlV === '' || controlV === undefined) {
            nameError = false;
        }
        return nameError ? { 'nameError': { value: control.value } } : null;
    }

    checkCode = (control: FormControl): { [key: string]: any } => {
        let codeError = false;
        const controlV = control.value;
        const reg = new RegExp('^[A-Za-z/_]+$');
        if (reg.test(controlV)) {
            codeError = false;
        } else if (!reg.test(controlV)) {
            codeError = true;
        }
        if (controlV == null || controlV === '' || controlV === undefined) {
            codeError = false;
        }
        return codeError ? { 'codeError': { value: control.value } } : null;
    }

    // 保存
    save() {
        this.submitForm();
        const a = this.checkSigna('');
        const b = this.checkAisle('');
        if (this.validateForm.invalid || !a || !b) {
            return;
        }
        const that = this;
        const arr = [];
        that.data.subCodeList.map((one) => {
            arr.push(one['key']);
        });
        const obj = {
            channelType: 2,
            name: that.validateForm.get('name').value,
            code: that.validateForm.get('code').value,
            param: {
                signList: that.data.signaList,
                subCodeList: arr
            }
        };
        this.globals.resetBodyStyle();
        if (this.editFlag) {
            const data = Object.assign({}, this.editData);
            data['name'] = that.validateForm.get('name').value;
            data['code'] = that.validateForm.get('code').value;
            data.param.signList = that.data.signaList;
            data.param.subCodeList = arr;

            this.applyManageService.updateChannelConfig(data).subscribe((response) => {
                if (response.code === 200) {
                    this.saveDate.emit();
                    this.isVisible = false;
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });

        } else {
            this.applyManageService.insertChannelConfig(obj).subscribe((response) => {
                if (response.code === 200) {
                    this.isVisible = false;
                    this.saveDate.emit();
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        }
    }

    /**
     * 添加签名
     */
    addSigna() {
        this.checkSigna('add');
    }

    /**
    * 删除签名
    */
    removeSigna(index: number) {
        this.data.signaList.splice(index, 1);
    }

    // 校验自定义签名的编码
    checkSignaCode(data: any, index: number) {
        const that = this;
        if (!data.key) {
            that.signaCodeErr[index] = true;
            that.signaCodeMessage = '请输入签名编码';
            return;
        }
        if (!this.testValue('yw', data.key)) {
            that.signaCodeErr[index] = true;
            that.signaCodeMessage = '请输入字母';
            return;
        }
        that.signaCodeErr[index] = false;
    }

    // 校验自定义签名的名称
    checkSignaName(data: any, index: number) {
        const that = this;
        if (!data.sign) {
            that.signaNameErr[index] = true;
            that.signaNameMessage = '请输入签名名称';
            return;
        }
        if (!this.testValue('zw', data.sign)) {
            that.signaNameErr[index] = true;
            that.signaNameMessage = '请输入中文';
            return;
        }
        that.signaNameErr[index] = false;
    }

    // 校验自定义通道
    checkSubCode(data: any, index: number) {
        const that = this;
        if (!data.key) {
            that.subCodeListErr[index] = true;
            that.subCodeMessage = '请输入渠道编码';
            return;
        }

        if (!this.testValue('num', data.key)) {
            that.subCodeListErr[index] = true;
            that.subCodeMessage = '请输入数字';
            return;
        }
        that.subCodeListErr[index] = false;
    }

    /**
     * 添加通道
     */
    addAisle() {
        this.checkAisle('add');
    }

    /**
    * 删除签名
    */
    removeAisle(index: number) {
        this.data.subCodeList.splice(index, 1);
    }

    // 正则校验
    testValue(type: any, value: any) {
        let rex;
        if (type === 'num') {
            rex = /^[0-9]*$/;
        } else if (type === 'yw') {
            rex = /^[a-zA-Z]+$/;
        } else {
            rex = /^[\u4e00-\u9fa5]+$/;
        }

        if (!rex.test(value)) {
            return false;
        } else {
            return true;
        }
    }

    // 校验自定义签名
    checkSigna(type: any) {
        const that = this;
        const length = that.data.signaList.length;
        let flag = true;
        for (let i = 0; i < length; i++) {
            if (!that.data.signaList[i].key) {
                flag = false;
                that.signaCodeErr[i] = true;
                that.signaCodeMessage = '请输入签名编码';
            }

            if (!this.testValue('yw', that.data.signaList[i].key)) {
                flag = false;
                that.signaCodeErr[i] = true;
                that.signaCodeMessage = '请输入字母';
            }

            if (!that.data.signaList[i].sign) {
                flag = false;
                that.signaNameErr[i] = true;
                that.signaNameMessage = '请输入签名名称';
            }

            if (!this.testValue('zw', that.data.signaList[i].sign)) {
                flag = false;
                that.signaNameErr[i] = true;
                that.signaNameMessage = '请输入中文';
            }
        }
        if (flag && type === 'add') {
            that.data.signaList.push({ key: '', sign: '' });
        }
        if (flag) { return true; } else { return false; }
    }

    // 校验自定义通道
    checkAisle(type: any) {
        const that = this;
        const length = that.data.subCodeList.length;
        let flag = true;
        for (let i = 0; i < length; i++) {
            if (!that.data.subCodeList[i].key) {
                flag = false;
                that.subCodeListErr[i] = true;
                that.subCodeMessage = '请输入通道编码';
            }

            if (!this.testValue('num', that.data.subCodeList[i].key)) {
                flag = false;
                that.subCodeListErr[i] = true;
                that.subCodeMessage = '请输入数字';
            }
        }
        if (flag && type === 'add') {
            that.data.subCodeList.push({ key: '' });
        }

        if (flag) { return true; } else { return false; }
    }
}
