import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DomainNameService } from '../domain-name.service';
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';
import { NzNotificationService } from 'ng-cosmos-ui';


@Component({
    selector: 'app-add-domain-name',
    templateUrl: './add-domain-name.component.html',
    styleUrls: ['./add-domain-name.component.css']
})
export class AddDomainNameComponent implements OnInit, OnChanges {
    @Input() isVisible: any;  // 是否显示弹框
    @Input() editFlag: any;   // 处于新建，编辑，还是查看状态
    @Input() editData: any;   // 传递过来的当前数据
    @Input() productList: any;
    @Output() hideDialog = new EventEmitter<any>();
    @Output() saveDate = new EventEmitter<any>();
    validateForm: FormGroup;
    productOptions: any = [];
    selectedOption: any = [];
    checkName: any = CheckRegExp(this.regService.getName());
    checkUrl: any = CheckRegExp(this.regService.getDomainUrl());

    constructor(
        private fb: FormBuilder,
        private domainNameService: DomainNameService,
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
            name: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/), this.checkName]],
            domain: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/),
                this.checkUrl, Validators.maxLength(256), Validators.minLength(10)]],
            product: [null, [Validators.required]],
            description: [null, [Validators.maxLength(256)]],
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
            name: data['name'] ? data.name : null,
            domain: data['domain'] ? data.domain : null,
            product: data['product'] ? data.product : null,
            description: data['description'] ? data.description : null,
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
            name: that.validateForm.get('name').value.replace(/(^\s*)|(\s*$)/g, ''),
            domain: that.validateForm.get('domain').value.replace(/(^\s*)|(\s*$)/g, ''),
            catalogSet: that.selectedOption
        };

        if (that.validateForm.get('description').value) {
            obj['description'] = that.validateForm.get('description').value.replace(/(^\s*)|(\s*$)/g, '');
        }

        if (this.editFlag === 'edit') {
            const data = {};
            data['catalogSet'] = this.selectedOption;
            data['domain'] = that.validateForm.get('domain').value.replace(/(^\s*)|(\s*$)/g, '');
            data['name'] = that.validateForm.get('name').value.replace(/(^\s*)|(\s*$)/g, '');
            data['oldName'] = this.editData['name'];
            if (that.validateForm.get('description').value) {
                data['description'] = that.validateForm.get('description').value.replace(/(^\s*)|(\s*$)/g, '');
            }
            this.domainNameService.updateDomainName(data).then((response: any) => {
                if (response.code === 200) {
                    this.saveDate.emit();
                    this.isVisible = false;
                } else {
                    this.nzNotificationService.create('warning', '错误提示', response.message);
                }
            });
        } else if (this.editFlag === 'add') {
            this.domainNameService.addDomainName(obj).then((response: any) => {
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
