import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';
import { NzNotificationService } from 'ng-cosmos-ui';
import { ApiAccountService } from '../api-account.service';
import { TenantDetailService } from '../../tenant/view/tenant-detail.service';

@Component({
    selector: 'app-add-api-account',
    templateUrl: './add-api-account.component.html',
    styleUrls: ['./add-api-account.component.css']
})
export class AddApiAccountComponent implements OnInit, OnChanges {
    @Input() isVisible: any;  // 是否显示弹框
    @Input() editFlag: any;   // 处于新建，编辑，还是查看状态
    @Input() editData: any;   // 传递过来的当前数据
    @Input() tenantId: any;   // 传递过来的租户ID
    @Output() hideDialog = new EventEmitter<any>();
    @Output() saveDate = new EventEmitter<any>();
    status = '1';
    tokenType = '1';
    selectedTenantId: any;          // 选择的所属租户
    tenantList: any = [];           // 所属租户列表tenantList
    productOptions: any = [];       // 使用产品列表
    selectedOption: any = [];       // 所选择的适应产品
    validateForm: FormGroup;
    checkName: any = CheckRegExp(this.regService.getName());
    checkToken: any = CheckRegExp(this.regService.getUurlStrict());
    tenantDetails: any = {};
    companyName: any;              // 租户名称
    isLoading = false;             // 懒加载租户loading
    searchTenant: any;
    page = 1;
    rows = 20;
    str: any = '只能输入数字、英文字母、“:/?&#-_{}.”，长度最少2个字符，最多256个字符';
    _tenantTotal: any;
    constructor(
        private fb: FormBuilder,
        private service: ApiAccountService,
        private tenantsService: TenantDetailService,
        private regService: RegexpSService,
        private nzNotificationService: NzNotificationService
    ) { }

    ngOnInit() {
        this.initProductList();
        this.initTenantList('search');
        this.getTenantDetails();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initialValidateForm();
        this.status = '1';
        this.tokenType = '1';
        this.selectedOption = [];

        if (changes.isVisible) {
            this.isVisible = changes.isVisible.currentValue;
        }

        if (this.isVisible) {
            // this.initProductList();
            // this.initTenantList();
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

    // 获取选择产品列表
    initProductList() {
        this.productOptions = [];
        this.service.getProduct().then((data: any) => {
            if (data.code === 200) {
                if (data.data.data.length) {
                    this.productOptions = data.data.data;
                }
            }
        }).catch((err: any) => {
        });
    }

    // 获取租户列表
    initTenantList(type: any) {
        const obj = {
            page: this.page,
            rows: this.rows,
            status: '1'
        };

        if (this.searchTenant) {
            obj['companyName'] = this.searchTenant;
        } else {
            if (obj.hasOwnProperty('companyName')) {
                delete obj['companyName'];
            }
        }
        this.service.getTenantList(obj).then((data: any) => {
            this.isLoading = false;
            if (type === 'search') {
                this.tenantList = [];
                this.tenantList = data.list;
                this._tenantTotal = data.total;
            } else {
                if (data.list.length) {
                    data.list.forEach((one: any) => {
                        this.tenantList.push(one);
                    });
                }
            }
        }).catch((err: any) => {
            this.nzNotificationService.create('warning', '错误提示', err.message);
        });
    }

    // 获取租户详情信息
    getTenantDetails() {
        if (this.tenantId) {
            this.tenantsService.getTenantDetailById(this.tenantId).then((data: any) => {
                if (data.success) {
                    this.tenantDetails = data.data;
                    this.companyName = this.tenantDetails.companyName;
                }
            });
        }
    }


    // 初始化表单
    initialValidateForm(): any {
        const id = this.tenantId ? this.tenantId : null;
        this.validateForm = this.fb.group({
            name: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/), this.checkName]],
            tenantId: [id, [Validators.required]],
            status: ['1', [Validators.required]],
            tokenUrl: [null],
            tokenType: ['1', [Validators.required]],
            description: [null, [Validators.maxLength(256)]],
            catalogIdList: [null, [Validators.required]],

        });
    }

    // 重置化表单
    resetValidateForm(data: any) {
        const that = this;
        this.status = data['status'] ? data.status.toString() : '0';
        this.tokenType = data['tokenType'] ? data.tokenType.toString() : '1';
        this.selectedTenantId = data['tenantId'] ? Number(data.tenantId) : 0;
        that.selectedOption = [];
        data['catalogIdList'] = [];
        const arr = that.editData.catalogList;
        for (let i = 0; i < arr.length; i++) {
            data['catalogIdList'].push(arr[i].id);
        }
        that.selectedOption = data['catalogIdList'];

        this.validateForm.reset({
            name: data['name'] ? data.name : null,
            tenantId: data['tenantId'] ? Number(data.tenantId) : null,
            status: data['status'] ? data.status.toString() : '1',
            tokenType: data['tokenType'] ? data.tokenType.toString() : '1',
            description: data['description'] ? data.description : null,
            catalogIdList: data['catalogIdList'] ? data.catalogIdList : null,
            tokenUrl: data['tokenUrl'] ? data.tokenUrl : null,
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
        if (this.tokenType === '2') {
            this.validateForm.get('tokenUrl').setValidators([Validators.required, Validators.pattern(/^\S.*\S$|^\S$/),
            this.checkToken, Validators.maxLength(256), Validators.minLength(10)]);
            this.validateForm.get('tokenUrl').markAsDirty();
        } else {
            this.validateForm.get('tokenUrl').clearValidators();
            this.validateForm.get('tokenUrl').markAsPristine();
        }

        this.submitForm();
        if (this.validateForm.invalid) {
            return;
        }
        const that = this;
        const obj = {
            name: that.validateForm.get('name').value.trim(),
            tenantId: that.validateForm.get('tenantId').value,
            status: Number(that.status),
            tokenType: Number(that.tokenType),
            description: that.validateForm.get('description').value,
            catalogIdList: that.selectedOption,
            companyName: that.companyName
        };

        if (that.validateForm.get('tokenUrl').value && that.tokenType === '2') {
            obj['tokenUrl'] = that.validateForm.get('tokenUrl').value.trim();
        }

        if (that.validateForm.get('description').value) {
            obj['description'] = that.validateForm.get('description').value.trim();
        }

        if (this.editFlag) {
            const data = {};
            data['id'] = that.editData.id;
            data['name'] = that.validateForm.get('name').value.trim();
            data['tenantId'] = that.validateForm.get('tenantId').value;
            data['status'] = Number(that.status);
            data['tokenType'] = Number(that.tokenType);
            data['description'] = that.validateForm.get('description').value;
            data['catalogIdList'] = that.selectedOption;
            data['companyName'] = that.editData.companyName;

            if (that.validateForm.get('tokenUrl').value && that.tokenType === '2') {
                data['tokenUrl'] = that.validateForm.get('tokenUrl').value.trim();
            }

            if (that.validateForm.get('description').value) {
                data['description'] = that.validateForm.get('description').value.trim();
            }

            this.service.updateAccounts(data).then((response: any) => {
                if (response.code === 200) {
                    this.saveDate.emit();
                    this.isVisible = false;
                } else {
                    this.nzNotificationService.create('warning', '错误提示', response.message);
                }
            });
        } else {
            this.service.addAccounts(obj).then((response: any) => {
                if (response.code === 200) {
                    this.saveDate.emit();
                    this.isVisible = false;
                } else {
                    this.nzNotificationService.create('warning', '错误提示', response.message);
                }
            });
        }
    }

    // 改变映射方式
    changeRoutingType(value: any) {
        this.validateForm.controls['routingUrl'].setValue(null);
    }

    // 选择某个租户
    changeTenant(id: any) {
        let arr;
        arr = this.tenantList.filter((one: any) => {
            return one.id === id;
        });
        if (arr.length) {
            this.companyName = arr[0].companyName;
        }
    }

    // 远端模糊搜索
    onSearch(value: string): void {
        this.isLoading = true;
        this.searchTenant = value;
        this.page = 1;
        this.initTenantList('search');
    }

    // 下拉加载数据
    loadMore(): void {
        if (this.tenantList.length > 0 && this.tenantList.length < this._tenantTotal) {
            this.isLoading = true;
            this.page++;
            this.initTenantList('load');
        } else {
            this.isLoading = false;
            return;
        }
    }

    changeToken(value: any) {
        if (this.tokenType === '2') {
            this.validateForm.get('tokenUrl').setValidators([Validators.required, Validators.pattern(/^\S.*\S$|^\S$/),
            this.checkToken, Validators.maxLength(256), Validators.minLength(10)]);
            this.validateForm.get('tokenUrl').markAsDirty();
            this.validateForm.get('tokenUrl').updateValueAndValidity();

        } else {
            this.validateForm.get('tokenUrl').clearValidators();
            this.validateForm.get('tokenUrl').markAsPristine();
        }
    }

}
