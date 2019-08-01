import { Component, Input, Output, EventEmitter, SimpleChanges, Injector, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MarketingManageService } from '../../marketing-manage.service';
import { BaseComponent } from '../../../../common/base-component';

@Component({
    selector: 'app-add-crowd-dimensionality',
    templateUrl: './add-crowd-dimensionality.component.html',
    styleUrls: ['./add-crowd-dimensionality.component.less']
})
export class AddCrowdDimensionalityComponent extends BaseComponent implements OnInit, OnChanges {
    valueData: any = [];
    valueTableLoading = false;
    @Input() isVisible;
    @Input() editFlag: any;
    @Input() editData: any;
    @Output() hideDialog = new EventEmitter<any>();
    @Output() saveDate = new EventEmitter<any>();
    validateForm: FormGroup;
    flag = true;
    valueList: any = [];                                // 可选维度
    dimensionList: any = [];                            // 可选择的全部维度值
    _name: any = null;
    leftValue: any = [];

    constructor(private fb: FormBuilder,
        private injector: Injector,
        private marketingManageService: MarketingManageService) {
        super(injector);
    }

    ngOnInit() {
        // this.validateForm = this.initialValidateForm();
        // this.getDimensionList();

        // if (this.editFlag) {
        //     this.resetValidateForm(this.editData);
        //     this.getDimensionList();
        // }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.valueData = [];
        this.leftValue = [];
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
            // this.getDimensionList();
            const obj = {
                productId: this.productId,
                dicKey: this.editData.code
            };
            this.getValueList(obj);
        } else if (!this.editFlag && this.isVisible) {
            this.getDimensionList();
        }
    }

    // 初始化表单
    initialValidateForm(): any {
        return this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(32), this.checkName]],                    // 维度名称
            code: [null, [Validators.required]],                                                              // 编码
            description: [null, Validators.maxLength(255)],                                                   // 描述
            value: [null, [Validators.required]],                                                             // 维度名称
        });
    }

    // 重置化表单
    resetValidateForm(data: any) {
        this.validateForm.reset({
            name: data['name'] ? data.name : null,   // 维度名称
            code: data['code'] ? data.code : null,   // 显示顺序
            description: data['description'] ? data.description : null,    // 描述
            value: data['name'] ? data.name : null,   // 维度名称
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

    // checkCode = (control: FormControl): {[key: string]: any} => {
    //     let codeError = false;
    //     const controlV = control.value;
    //     const reg = new RegExp('^[A-Za-z/_]+$');
    //     if (reg.test(controlV)) {
    //         codeError = false;
    //     } else if (!reg.test(controlV)) {
    //         codeError = true;
    //     }
    //     if (controlV == null || controlV === '' || controlV === undefined) {
    //         codeError = false;
    //     }
    //     return codeError ? {'codeError': {value: control.value}} : null;
    // }

    // 保存
    save() {
        this.submitForm();
        if (this.validateForm.invalid) {
            return;
        }

        if (this.leftValue.length < 1) {
            this.notification.create('warning', '错误提示', '请选择维度值');
            return;
        }
        const that = this;
        const obj = {
            productId: that.productId,
            name: that.validateForm.get('name').value,
            code: that.validateForm.get('code').value,
            optionConfigList: this.leftValue
        };
        this.globals.resetBodyStyle();
        if (that.validateForm.get('description').value && that.validateForm.get('description').value != null
            && that.validateForm.get('description').value !== '') {
            obj['description'] = that.validateForm.get('description').value;
        }
        if (this.editFlag) {
            const parmas = Object.assign({}, this.editData);
            parmas['name'] = that.validateForm.get('name').value;
            parmas['code'] = this.editData['code'];
            parmas['description'] = that.validateForm.get('description').value;
            parmas['optionConfigList'] = this.leftValue;

            // this.editData['name'] = that.validateForm.get('name').value;
            // this.editData['code'] = that.validateForm.get('code').value;
            // this.editData['description'] = that.validateForm.get('description').value;

            this.marketingManageService.updateDimension(parmas).subscribe((response) => {
                if (response.code === 200) {
                    this.saveDate.emit();
                    this.isVisible = false;
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });

        } else {
            this.marketingManageService.insertDimension(obj).subscribe((response) => {
                if (response.code === 200) {
                    this.isVisible = false;
                    this.saveDate.emit();
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        }
    }

    // 获取可选择的维度
    getDimensionList() {
        const that = this;
        this.marketingManageService.getDimensionList({
            productId: that.productId
        }).subscribe((response) => {
            if (response.code === 200) {
                this.dimensionList = response.data;
                // if (this.editFlag) {
                //     for (let i = 0; i < this.dimensionList.length; i++) {
                //         if (this.dimensionList[i].code === this.editData.code) {
                //             this._name = this.dimensionList[i];
                //         }
                //     }
                // }
                // console.log(this.dimensionList);
                // console.log(this._name);
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 选择维度
    selectName(item: any) {
        if (item && item.code) {
            const that = this;
            that.validateForm.controls.code.setValue(item.code);
            const obj = {
                productId: that.productId,
                dicKey: item.code
            };
            this.getValueList(obj);
        }
    }

    // 获取当前维度下的维度值
    getValueList(parmas: any) {
        this.marketingManageService.getValueList(parmas).subscribe((response) => {
            this.valueTableLoading = false;
            if (response.code === 200) {
                this.valueData = response.data;
                for (let i = 0; i < this.valueData.length; i++) {
                    this.valueData[i]['direction'] = 'left';
                    if (this.editData && this.editData.optionConfigList && this.editData.optionConfigList.length) {
                        for (let j = 0; j < this.editData.optionConfigList.length; j++) {
                            if (this.editData.optionConfigList[j].value ===  this.valueData[i].dicItemValue) {
                                this.valueData[i]['direction'] = 'right';
                                this.leftValue.push({
                                    value: this.editData.optionConfigList[j].value,
                                    key: this.valueData[i].id
                                });
                            }
                        }
                    }
                }
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    filterOption(inputValue: string, item: any): boolean {
        return item.dicItemValue.indexOf(inputValue) > -1;
    }

    search(ret: {}): void {
        // console.log('nzSearchChange', ret);
    }

    select(ret: {}): void {
        // console.log('nzSelectChange', ret);
    }

    change(ret: {}): void {
        if (ret && ret['list']) {
            ret['list'].map(item => {
                if (ret && ret['from'] === 'left') {
                    const obj = {
                        value: item.dicItemValue,
                        key: item.id,
                    };
                    this.leftValue.push(obj);
                } else {
                    this.leftValue = this.leftValue.filter(one => {
                        return Number(one.key) !== item.id;
                    });
                }
            });
        }
    }
}
