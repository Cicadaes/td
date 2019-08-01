import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';
import { ApiService } from '../api.service';
import * as _ from 'lodash';
import { NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit, OnChanges {
    @Input() isVisible: any;         // 是否显示弹框
    @Input() editFlag: any;          // 处于新建，编辑，还是查看状态
    @Input() editData: any;          // 传递过来的当前数据
    @Output() hideProductDialog = new EventEmitter<any>();
    @Output() saveProductDate = new EventEmitter<any>();
    validateForm: FormGroup;
    productOptions: any = [];
    selectedOption: any = [];
    checkName: any = CheckRegExp(this.regService.getName());

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private regService: RegexpSService,
        private notification: NzNotificationService
    ) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        this.selectedOption = [];
        this.validateForm = this.initialValidateForm();

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
        }
    }

    // 初始化表单
    initialValidateForm(): any {
        return this.fb.group({
            name: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/), this.checkName]],
            description: [null, [Validators.maxLength(256)]],
        });
    }

    // 重置化表单
    resetValidateForm(data: any) {
        this.validateForm.reset({
            name: data['obj']['origin']['name'] ? data.obj.origin.name : null,
            description: data['obj']['origin']['description'] ? data['obj']['origin'].description : null,
        });
    }

    getFormControl(name: string) {
        return this.validateForm.controls[name];
    }

    //  取消
    handleCancel = (e: any) => {
        this.isVisible = false;
        this.hideProductDialog.emit(this.isVisible);
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
            parentId: that.editData.level ? that.editData.obj.origin.id : 0,
        };

        if (that.validateForm.get('description').value) {
            obj['description'] = that.validateForm.get('description').value.replace(/(^\s*)|(\s*$)/g, '');
        }

        if (this.editFlag) {
            const data = {
                createBy: that.editData.obj.origin.createBy,
                createTime: that.editData.obj.origin.createTime,
                creator: that.editData.obj.origin.creator,
                description: that.validateForm.get('description').value,
                id: that.editData.obj.origin.id,
                name: that.validateForm.get('name').value.replace(/(^\s*)|(\s*$)/g, ''),
                parentId: that.editData.level ? that.editData.obj.origin.parentId : 0,
                updateBy: that.editData.obj.origin.updateBy,
                updateTime: that.editData.obj.origin.updateTime,
                updater: that.editData.obj.origin.updater,
            };

            if (that.validateForm.get('description').value) {
                data['description'] = that.validateForm.get('description').value.replace(/(^\s*)|(\s*$)/g, '');
            }


            this.apiService.updateProduct(data).then((response: any) => {
                if (response.code === 200) {
                    this.saveProductDate.emit(this.isVisible);
                    this.isVisible = false;
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        } else {
            this.apiService.insertProduct(obj).then((response: any) => {
                if (response.code === 200) {
                    this.saveProductDate.emit(this.isVisible);
                    this.isVisible = false;
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        }
    }
}
