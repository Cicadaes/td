import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';
import { ApiService } from '../api.service';
import { NzNotificationService } from 'ng-cosmos-ui';
import * as _ from 'lodash';

@Component({
    selector: 'app-add-interface',
    templateUrl: './add-interface.component.html',
    styleUrls: ['./add-interface.component.css']
})
export class AddInterfaceComponent implements OnInit, OnChanges {
    @Input() isVisible: any;                                   // 是否显示弹框
    @Input() editFlag: any;                                    // 处于新建，编辑，还是查看状态
    @Input() editData: any;                                    // 传递过来的当前数据
    @Input() productList: any;                                 // 传递过来的当前数据
    @Output() hideInterfaceDialog = new EventEmitter<any>();
    @Output() saveInterfaceDate = new EventEmitter<any>();
    catalogId: any;                                            // 传递给树组件刷新他的选中状态
    @Output() pushCataloagId = new EventEmitter<any>();
    validateForm: FormGroup;
    productAllList: any = [];
    selectedOption: any;
    versionOptions: any;
    selectedVersion: any;
    checkName: any = CheckRegExp(this.regService.getName());
    _interfaceObj: any;
    catalogs: any;
    catalogName: any;
    interfaceData: any;
    @Input() set interfaceObj(value: any) {
        this._interfaceObj = value;
        if (this.editFlag !== 'copy') {
            if (this._interfaceObj && this._interfaceObj.obj && this._interfaceObj.obj.key && this._interfaceObj.obj.level) {
                this.selectedOption = this._interfaceObj.obj.key;
                this.catalogName = this._interfaceObj.obj.title;
            } else {
                this.selectedOption = null;
            }
        }
    }


    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private regService: RegexpSService,
        private notification: NzNotificationService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
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

        if (this.editFlag === 'edit' || this.editFlag === 'copy') {
            this.resetValidateForm(this.editData);
        }

        if (this.isVisible && this.editFlag !== 'edit') {
            this.getProductList();
        }
    }

    // 获取所有产品分类
    getProductList() {
        this.apiService.getProductList2().then((response: any) => {
            if (response.code === 200) {
                this.productAllList = response.data;
                if (this.selectedOption) {
                    this.catalogs = response.data.filter((one: any) => {
                        return one.id === this.selectedOption;
                    });
                    if (this.catalogs[0].parentId) {
                        this.getProductVersion(this.catalogs[0].parentId);
                    } else {
                        this.selectedVersion = null;
                    }
                } else {
                    this.selectedOption = null;
                    this.selectedVersion = null;
                }
            }
        });
    }

    // 获取当前产品的一级差产品的所有版本
    getProductVersion(catalogId: any) {
        this.apiService.getProductVersion(catalogId).then((response: any) => {
            if (response.code === 200) {
                this.versionOptions = response.data;
                this.selectedVersion = null;
            }
        });
    }

    // 初始化表单
    initialValidateForm(): any {
        return this.fb.group({
            name: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/), this.checkName]],
            catalogId: [this.selectedOption, [Validators.required]],
            versionId: [this.selectedVersion, [Validators.required]],
            description: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/),
            Validators.minLength(5), Validators.maxLength(256)]],
        });
    }

    // 重置化表单
    resetValidateForm(data: any) {
        this.selectedOption = data['catalogId'];
        this.editFlag === 'copy' ? this.selectedVersion = null : this.selectedVersion = data['versionId'];
        const that = this;

        this.validateForm.reset({
            name: data['name'] ? data.name : null,
            catalogId: data['catalogId'] ? data.catalogId : null,
            versionId: that.selectedVersion ? that.selectedVersion : null,
            description: data['description'] ? data.description : null,
        });
    }

    getFormControl(name: string) {
        return this.validateForm.controls[name];
    }

    //  取消
    handleCancel = (e: any) => {
        this.isVisible = false;
        this.hideInterfaceDialog.emit(this.isVisible);
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
        let versionId: number, versionName: string;
        this.submitForm();
        if (this.validateForm.invalid) {
            return;
        }
        const that = this;
        const obj = {
            name: that.validateForm.get('name').value.replace(/(^\s*)|(\s*$)/g, ''),
            catalogId: that.validateForm.get('catalogId').value,
            versionId: that.validateForm.get('versionId').value,
            description: that.validateForm.get('description').value.replace(/(^\s*)|(\s*$)/g, '')
        };

        const responseObj = {};
        responseObj['flag'] = this.editFlag;

        if (this.editFlag === 'add' || this.editFlag === 'copy') {
            versionId = that.validateForm.get('versionId').value;
            const arr = that.versionOptions.filter((one: any) => {
                return one.id === versionId;
            });
            versionName = arr[0].version;
        }
        if (this.editFlag === 'edit') {
            const queryobj = {
                name: that.validateForm.get('name').value.replace(/(^\s*)|(\s*$)/g, ''),
                id: that.editData.id,
                description: that.validateForm.get('description').value.replace(/(^\s*)|(\s*$)/g, ''),
                versionId: that.editData.versionId,
                versionName: that.editData.versionName,
                catalogId: that.editData.catalogId
            };
            that.apiService.updateInterface(queryobj).then((data: any) => {
                if (data.code === 200) {
                    responseObj['obj'] = _.assign({}, queryobj);
                    this.saveInterfaceDate.emit(responseObj);
                    this.isVisible = false;
                } else {
                    this.notification.create('warning', '错误提示', data.message);
                }
            }).catch((err: any) => {
            });
        } else if (this.editFlag === 'add') {
            obj['versionName'] = versionName;
            that.apiService.insertInterface(obj).then((data: any) => {
                if (data.code === 200) {
                    responseObj['obj'] = _.assign({}, data.data);
                    this.saveInterfaceDate.emit(responseObj);
                    this.isVisible = false;
                } else {
                    this.notification.create('warning', '错误提示', data.message);
                }
            }).catch((err: any) => {
            });
        } else if (this.editFlag === 'copy') {
            const obj2 = _.assign({}, this.editData);
            obj2.name = that.validateForm.get('name').value.replace(/(^\s*)|(\s*$)/g, '');
            obj2.catalogId = that.validateForm.get('catalogId').value;
            obj2.versionId = that.validateForm.get('versionId').value;
            obj2.description = that.validateForm.get('description').value.replace(/(^\s*)|(\s*$)/g, '');
            obj2['versionName'] = versionName;
            that.catalogId = obj2.catalogId;
            that.pushCataloagId.emit(this.catalogId);

            that.apiService.copyInterface(obj2).then((data: any) => {
                if (data.code === 200) {
                    responseObj['flag'] = 'update';
                    responseObj['obj'] = _.assign({}, data.data);
                    this.saveInterfaceDate.emit(responseObj);
                    this.isVisible = false;
                } else {
                    this.notification.create('warning', '错误提示', data.message);
                }
            }).catch((err: any) => {
            });
        }
    }

    // 选择产品分类
    select(value: any) {
        if (value && this.productAllList.length) {
            this.catalogs = this.productAllList.filter((one: any) => {
                return one.id === value;
            });
            this.getProductVersion(this.catalogs[0].parentId);
        }
    }
}
