import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ResponseCodeService } from '../response-code.service';
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';
import { NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-add-code',
    templateUrl: './add-code.component.html',
    styleUrls: ['./add-code.component.css']
})
export class AddCodeComponent implements OnInit, OnChanges {
    @Input() isVisible: any;  // 是否显示弹框
    @Input() editFlag: any;   // 处于新建，编辑，还是查看状态
    @Input() editData: any;   // 传递过来的当前数据
    @Input() productList: any;
    @Output() hideDialog = new EventEmitter<any>();
    @Output() saveDate = new EventEmitter<any>();
    validateForm: FormGroup;
    productOptions: any = [];
    selectedOption: any = [];
    checkCode: any = CheckRegExp(this.regService.getCode());
    checkReason: any = CheckRegExp(this.regService.getName());

    constructor(
        private fb: FormBuilder,
        private responseCodeService: ResponseCodeService,
        private regService: RegexpSService,
        private nzNotificationService: NzNotificationService
    ) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        this.selectedOption = [];
        this.validateForm = this.initialValidateForm();
        this.initProductList();

        if (changes.isVisible) {
            this.isVisible = changes.isVisible.currentValue;
        }

        if (changes.editFlag) {
            this.editFlag = changes.editFlag.currentValue;
        }

        if (changes.editData) {
            this.editData = changes.editData.currentValue;
        }

        if (this.editFlag !== 'add') {
            this.resetValidateForm(this.editData);
        }
    }

    initProductList() {
        this.productOptions = [];
        if (this.productList && this.productList.length) {
            for (let i = 0; i < this.productList.length; i++) {
                this.productOptions.push(this.productList[i]);
            }
            this.productOptions.shift();
        }
    }

    // 初始化表单
    initialValidateForm(): any {
        return this.fb.group({
            code: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/), this.checkCode]],
            catalogSet: [null, [Validators.required]],
            reason: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/), this.checkReason]],
            solution: [null, [Validators.maxLength(256)]],
        });
    }

    // 重置化表单
    resetValidateForm(data: any) {
        const that = this;
        that.selectedOption = [];
        const productSelect = data['catalogNames'] ? data.catalogNames.split(',') : null;
        if (that.productList && that.productList.length && productSelect && productSelect.length) {
            data['catalogSet'] = [];
            const obj = {};
            for (let i = 0; i < that.productList.length; i++) {
                for (let j = 0; j < productSelect.length; j++) {
                    if (that.productList[i].label === productSelect[j]) {
                        if (!obj[that.productList[i].label]) { // 如果能查找到，证明数组元素重复了
                            obj[that.productList[i].label] = 1;
                            data['catalogSet'].push(that.productList[i].value);
                        }
                    }
                }
            }
            that.selectedOption = data['catalogSet'];
        }

        this.validateForm.reset({
            code: data['code'] ? data.code : null,
            catalogSet: data['catalogSet'] ? data.catalogSet : null,
            reason: data['reason'] ? data.reason : null,
            solution: data['solution'] ? data.solution : null,
        });
    }

    getFormControl(name: string) {
        return this.validateForm.controls[name];
    }

    //  取消
    handleCancel = (e: any) => {
        this.isVisible = false;
        this.hideDialog.emit(this.isVisible);
    }

    // 表单验证
    submitForm() {
        for (const i in this.validateForm.controls) {
            if (this.validateForm.controls.hasOwnProperty(i)) {
                this.validateForm.controls[i].markAsDirty();
                this.validateForm.controls[i].updateValueAndValidity();
            }
        }
    }


    // 保存
    save() {
        this.submitForm();
        if (this.validateForm.invalid) {
            return;
        }
        const that = this;
        const obj = {
            code: that.validateForm.get('code').value.replace(/(^\s*)|(\s*$)/g, ''),
            reason: that.validateForm.get('reason').value.replace(/(^\s*)|(\s*$)/g, ''),
            catalogSet: that.selectedOption
        };


        if (that.validateForm.get('solution').value) {
            obj['solution'] = that.validateForm.get('solution').value.replace(/(^\s*)|(\s*$)/g, '');
        }
        if (this.editFlag === 'edit') {
            const data = {};
            data['catalogSet'] = this.selectedOption;
            data['reason'] = that.validateForm.get('reason').value.replace(/(^\s*)|(\s*$)/g, '');
            data['code'] = that.validateForm.get('code').value.replace(/(^\s*)|(\s*$)/g, '');
            data['oldCode'] = this.editData['code'];
            data['solution'] = that.validateForm.get('solution').value;

            if (that.validateForm.get('solution').value) {
                data['solution'] = that.validateForm.get('solution').value.replace(/(^\s*)|(\s*$)/g, '');
            }
            this.responseCodeService.updateResponseCode(data).then((response: any) => {
                if (response.code === 200) {
                    this.saveDate.emit();
                    this.isVisible = false;
                } else {
                    this.nzNotificationService.create('warning', '错误提示', response.message);
                }
            });
        } else if (this.editFlag === 'add') {
            this.responseCodeService.addResponseCode(obj).then((response: any) => {
                if (response.code === 200) {
                    this.saveDate.emit();
                    this.isVisible = false;
                } else {
                    this.nzNotificationService.create('warning', '错误提示', response.message);
                }
            });
        } else {
            this.isVisible = false;
            this.hideDialog.emit(this.isVisible);
        }
    }

    select(arr: any) {
        if (arr && arr.length) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === '0' || arr[i] === 0) {
                    this.selectedOption = [];
                    this.selectedOption.push(arr[i]);
                }
            }
        }
    }
}
