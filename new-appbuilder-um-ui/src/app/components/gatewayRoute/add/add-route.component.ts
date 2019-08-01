import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';
import { NzNotificationService } from 'ng-cosmos-ui';
import { GatewayRouteervice } from '../gateway-route.service';

@Component({
    selector: 'app-add-route',
    templateUrl: './add-route.component.html',
    styleUrls: ['./add-route.component.css']
})
export class AddRouteComponent implements OnInit, OnChanges {
    @Input() isVisible: any;  // 是否显示弹框
    @Input() editFlag: any;   // 处于新建，编辑，还是查看状态
    @Input() editData: any;   // 传递过来的当前数据
    @Output() hideDialog = new EventEmitter<any>();
    @Output() saveDate = new EventEmitter<any>();
    status = '1';
    routingType = '1';
    selectedRoutingUrl: any;          // 当映射方式为service映射时  选择的映射路径
    serviceList: any = [];            // 当映射方式为service映射时  服务列表
    validateForm: FormGroup;
    checkName: any = CheckRegExp(this.regService.getName());
    checkUrl: any = CheckRegExp(new RegExp(/^[a-zA-Z\d\-\_\&\:\/\?\#\{\}\.\*]{2,256}$/));
    checkUrl2: any = CheckRegExp(new RegExp(/^[a-zA-Z\d\-\_\=\&\:\/\?\#\{\}\.\,]{2,256}$/));

    str = '只能输入数字、英文字母、:/?&#-_{}.*，长度最少2个、最多256个字符';
    str2 = '只能输入数字、英文字母、:/?&#-_=,{}.，长度最少2个、最多256个字符';


    constructor(
        private fb: FormBuilder,
        private gatewayRouteervice: GatewayRouteervice,
        private regService: RegexpSService,
        private nzNotificationService: NzNotificationService
    ) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        this.validateForm = this.initialValidateForm();
        this.status = '1';
        this.routingType = '1';
        if (changes.isVisible) {
            this.isVisible = changes.isVisible.currentValue;
        }

        if (this.isVisible) {
            this.getServiceList();
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

    getServiceList() {
        this.gatewayRouteervice.getService({}).then((response: any) => {
            if (response.code === 200) {
                this.serviceList = response.data.data;
            } else {
                this.nzNotificationService.create('warning', '错误提示', response.message);
            }
        });
    }


    // 初始化表单
    initialValidateForm(): any {
        return this.fb.group({
            name: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/), this.checkName]],
            originUrl: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/), this.checkUrl]],
            routingType: ['1', [Validators.required]],
            routingUrl: [null, [Validators.required, Validators.pattern(/^\S.*\S$|^\S$/), this.checkUrl2]],
            status: ['1', [Validators.required]],
            description: [null, [Validators.maxLength(256)]],
        });
    }

    // 重置化表单
    resetValidateForm(data: any) {
        this.status = data['status'] ? data.status.toString() : '0';
        this.routingType = data['routingType'] ? data.routingType.toString() : '1';
        if (this.routingType === '2') {
            this.selectedRoutingUrl = data.routingUrl;
        }

        this.validateForm.reset({
            name: data['name'] ? data.name : null,
            originUrl: data['originUrl'] ? data.originUrl : null,
            routingType: data['routingType'] ? data.routingType.toString() : '1',
            routingUrl: data['routingUrl'] ? data.routingUrl : null,
            status: data['status'] ? data.status.toString() : '1',
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
            name: that.validateForm.get('name').value.trim(),
            originUrl: that.validateForm.get('originUrl').value.trim(),
            routingUrl: that.validateForm.get('routingUrl').value.trim(),
            routingType: Number(that.routingType),
            status: Number(that.status),
            description: that.validateForm.get('description').value,
        };

        if (that.validateForm.get('description').value) {
            obj['description'] = that.validateForm.get('description').value.trim();
        }

        if (this.editFlag) {
            const data = {};
            data['id'] = that.editData.id;
            data['name'] = that.validateForm.get('name').value.replace(/(^\s*)|(\s*$)/g, '');
            data['originUrl'] = that.validateForm.get('originUrl').value.replace(/(^\s*)|(\s*$)/g, '');
            data['routingUrl'] = that.validateForm.get('routingUrl').value.trim();
            data['routingType'] =  Number(that.routingType);
            data['status'] =  Number(that.status);
            data['description'] =  that.validateForm.get('description').value;

            if (that.validateForm.get('description').value) {
                data['description'] = that.validateForm.get('description').value.replace(/(^\s*)|(\s*$)/g, '');
            }

            this.gatewayRouteervice.updateWayRoute(data).then((response: any) => {
                if (response.code === 200) {
                    this.saveDate.emit();
                    this.isVisible = false;
                } else {
                    this.nzNotificationService.create('warning', '错误提示', response.message);
                }
            });
        } else {
            this.gatewayRouteervice.addWayRoute(obj).then((response: any) => {
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
}
