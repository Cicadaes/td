import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';
import { ApiService } from '../api.service';
import * as _ from 'lodash';
import { NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-add-version',
    templateUrl: './add-version.component.html',
    styleUrls: ['./add-version.component.css']
})
export class AddVersionComponent implements OnInit, OnChanges {
    @Input() isVisible: any;       // 是否显示弹框
    @Input() editFlag: any;        // 处于新建，编辑，还是查看状态
    @Input() editData: any;        // 传递过来的当前数据
    @Input() catalogObj: any;      // 当前选中产品
    @Output() hideVersionDialog = new EventEmitter<any>();
    @Output() saveVersionDate = new EventEmitter<any>();
    validateForm: FormGroup;
    productOptions: any = [];
    selectedOption: any;
    checkVersion: any = CheckRegExp(this.regService.getVersion());
    checkedApi = false;             // 选中从当前版本复制api
    versionOptions: any = [];
    selectedVersion: any;
    status: any = '1';
    copyError = false;

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private regService: RegexpSService,
        private notification: NzNotificationService
    ) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        this.selectedOption = this.catalogObj.catalogId;
        this.checkedApi = false;
        this.copyError = false;
        this.status = '1';
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

        if (this.editFlag === 'edit') {
            this.resetValidateForm(this.editData);
        }

        if ((this.editFlag === 'copy' && this.editData && this.isVisible)
            || (this.editFlag === 'add' && this.selectedOption && this.isVisible)) {
            this.getProductVersion(this.selectedOption);
        }
    }

    // 初始化表单
    initialValidateForm(): any {
        this.status = '1';
        return this.fb.group({
            catalogId: [this.selectedOption, [Validators.required]],
            version: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/), this.checkVersion]],
            status: ['1', [Validators.required]],
            uri: [null, [Validators.pattern(/([0-9a-zA-Z\.\=\_\/])$/), Validators.maxLength(256)]],
            description: [null, [Validators.maxLength(256)]],
        });
    }

    // 重置化表单
    resetValidateForm(data: any) {
        this.status = data['status'] ? data.status.toString() : '0';
        this.validateForm.reset({
            catalogId: data['catalogId'] ? data.catalogId : null,
            version: data['version'] ? data.version : null,
            status: data['status'] ? data.status.toString() : '0',
            uri: data['uri'] ? data.uri : null,
            description: data['description'] ? data.description : null,
        });
    }

    getFormControl(name: string) {
        return this.validateForm.controls[name];
    }

    //  取消
    handleCancel = (e: any) => {
        this.isVisible = false;
        this.hideVersionDialog.emit(this.isVisible);
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
        if (this.validateForm.invalid && this.editFlag !== 'copy') {
            return;
        }
        if (this.editFlag === 'copy' && !this.selectedVersion) {
            this.copyError = true;
            return;
        } else {
            this.copyError = false;
        }
        const that = this;
        if (this.editFlag === 'edit') {
            const data = {};
            _.assign(data, this.editData);
            data['status'] = Number(that.validateForm.get('status').value);
            data['uri'] = that.validateForm.get('uri').value;
            data['description'] = that.validateForm.get('description').value;

            if (that.validateForm.get('uri').value) {
                data['uri'] = that.validateForm.get('uri').value.replace(/(^\s*)|(\s*$)/g, '');
            }

            if (that.validateForm.get('description').value) {
                data['description'] = that.validateForm.get('description').value.replace(/(^\s*)|(\s*$)/g, '');
            }
            this.apiService.updateVersion(data).then((response: any) => {
                if (response.code === 200) {
                    this.saveVersionDate.emit();
                    this.isVisible = false;
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        } else if (this.editFlag === 'add') {
            const obj = {
                catalogId: that.validateForm.get('catalogId').value,
                version: that.validateForm.get('version').value.replace(/(^\s*)|(\s*$)/g, ''),
                status: Number(that.validateForm.get('status').value),
            };

            if (that.validateForm.get('uri').value) {
                obj['uri'] = that.validateForm.get('uri').value.replace(/(^\s*)|(\s*$)/g, '');
            }

            if (that.validateForm.get('description').value) {
                obj['description'] = that.validateForm.get('description').value.replace(/(^\s*)|(\s*$)/g, '');
            }

            let versionId = 0;

            if (this.checkedApi) {
                versionId = this.selectedVersion;
            }

            this.apiService.insertVersion(obj, this.checkedApi, versionId).then((response: any) => {
                if (response.code === 200) {
                    this.saveVersionDate.emit();
                    this.isVisible = false;
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        } else {
            this.apiService.copyVersion(this.checkedApi, this.selectedVersion, this.editData.id).then((response: any) => {
                if (response.code === 200) {
                    this.saveVersionDate.emit();
                    this.isVisible = false;
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        }
    }

    select(value: any) {
        if (this.checkedApi && this.editFlag === 'add') {
            this.getProductVersion(value);
        }
    }

    // 复制的选择已有版本
    change(value: any) {
        if (value) {
            this.copyError = false;
        }
    }

    // 获取当前产品的版本信息
    getProductVersion(catalogId: any) {
        this.apiService.getProductVersion(catalogId, 1).then((response: any) => {
            if (response.code === 200) {
                this.versionOptions = [];
                if (response.data.length) {
                    if (this.editFlag === 'copy') {
                        this.versionOptions = response.data.filter((one: any) => {
                            return one.id !== this.editData.id;
                        });
                    } else {
                        this.versionOptions = response.data;
                    }

                    if (this.versionOptions.length) {
                        this.selectedVersion = this.versionOptions[0].id;
                    } else {
                        this.selectedVersion = null;
                    }
                }
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }
}
