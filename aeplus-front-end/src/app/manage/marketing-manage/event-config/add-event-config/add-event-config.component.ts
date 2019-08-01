import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MarketingManageService } from '../../marketing-manage.service';
import { CommonService } from '../../../../common/services/common.service';
import { NzNotificationService } from 'ng-cosmos-ui';
import { Globals} from "../../../../utils/globals"

@Component({
    selector: 'app-add-event-config',
    templateUrl: './add-event-config.component.html',
    styleUrls: ['./add-event-config.component.less']
})
export class AddEventConfigComponent implements OnInit, OnChanges {
    productId: any = 467;
    valueData: any = [];
    valueTableLoading = false;
    @Input() isVisible;
    @Input() editFlag: any;
    @Input() editData: any;
    @Output() hideDialog = new EventEmitter<any>();
    @Output() saveDate = new EventEmitter<any>();
    validateForm: FormGroup;
    flag = true;
    valueList: any = [];                                // 可选事件
    eventValueList: any = [];                           // 事件选择列表
    _name: any = null;
    forbidFlag: any;                                // 禁止规则
    funnelFlag: any;                                // 漏斗
    timerFlag: any;                                 // 计时器
    triggerFlag: any;                               // 触发器
    scope: any = [0, 0, 0, 0];                          // 添加至列表 scope[0]：规则/条件 scope[1]：触发器-指标 scope[2]：计划目标
    constructor(
        private fb: FormBuilder,
        private notification: NzNotificationService,
        private commonService: CommonService,
        private marketingManageService: MarketingManageService,
        private globals: Globals
    ) {
    }

    ngOnInit() {

        if (this.commonService.productId) {
            this.productId = Number(this.commonService.productId);
        }
        // this.validateForm = this.initialValidateForm();
        // this.getEventValueList();

        // if (this.editFlag) {
        //     this.resetValidateForm(this.editData);
        // }
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

        if (this.editFlag) {
            if (this.editData) {
                if (this.editData.forbidFlag === 1 || this.editData.forbidFlag === true) {
                    this.forbidFlag  = true;
                } else {
                    this.forbidFlag  = false;
                }
                if (this.editData.funnelFlag === 1 || this.editData.funnelFlag === true) {
                    this.funnelFlag = true;
                } else {
                    this.funnelFlag = false;
                }
                if (this.editData.triggerFlag === 1 || this.editData.triggerFlag === true) {
                    this.triggerFlag = true;
                } else {
                    this.triggerFlag = false;
                }
                if (this.editData.timerFlag === 1 || this.editData.timerFlag === true) {
                    this.timerFlag = true;
                } else {
                    this.timerFlag = false;
                }
            }
            this.resetValidateForm(this.editData);
        } else if (!this.editFlag && this.isVisible) {
            this.forbidFlag = false;
            this.funnelFlag = false;
            this.triggerFlag = false;
            this.timerFlag = false;
            this.scope = [false, false, false, false];
            this.getEventValueList();
        }
    }

    // 初始化表单
    initialValidateForm(): any {
        return this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(32), this.checkName]],            // 事件名称
            code: [null, [Validators.required]],                                                      // 事件选择
            description: [null, Validators.maxLength(480)]                                            // 描述
        });
    }

    // 重置化表单
    resetValidateForm(data: any) {
        this.validateForm.reset({
            name: data['name'] ? data.name : null,                         // 事件名称
            code: data['name'] ? data.code : null,                         // 事件选择
            description: data['description'] ? data.description : null     // 描述
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

    checkName = (control: FormControl): {[key: string]: any} => {
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
        return nameError ? {'nameError': {value: control.value}} : null;
    }

    // 保存
    save() {
        this.submitForm();
        if (this.validateForm.invalid) {
            return;
        }
        const that = this;
        let a, b, c, d;

        if (that.forbidFlag === true || that.forbidFlag === 1) {
            a = '1';
        } else {
            a = '0';
        }
        if (that.funnelFlag === true || that.funnelFlag === 1) {
            b = '1';
        } else {
            b = '0';
        }
        if (that.triggerFlag === true || that.triggerFlag === 1) {
            c = '1';
        } else {
            c = '0';
        }
        if (that.timerFlag === true || that.timerFlag === 1) {
            d = '1';
        } else {
            d = '0';
        }
        const obj = {
            productId: that.productId,
            name: that.validateForm.get('name').value,
            code: that.validateForm.get('code').value.code,
            // scope: that.scope.join(',')
            forbidFlag: a,
            funnelFlag: b,
            triggerFlag: c,
            timerFlag: d,
        };
        this.globals.resetBodyStyle();
        if (that.validateForm.get('description').value && that.validateForm.get('description').value != null
            && that.validateForm.get('description').value !== '') {
            obj['description'] = that.validateForm.get('description').value;
        }

        if (this.editFlag) {
            const data = Object.assign({}, this.editData);
            data['name'] = that.validateForm.get('name').value;
            data['code'] = this.editData['code'];
            data['description'] = that.validateForm.get('description').value;
            data['forbidFlag'] = a;
            data['funnelFlag'] = b;
            data['triggerFlag'] = c;
            data['timerFlag'] = d;

            // this.editData['name'] = that.validateForm.get('name').value;
            // this.editData['code'] = that.validateForm.get('code').value.name;
            // this.editData['description'] = that.validateForm.get('description').value;
            // this.editData['forbidFlag'] = a;
            // this.editData['funnelFlag'] = b;
            // this.editData['triggerFlag'] = c;
            // this.editData['timerFlag'] = d;
            // this.editData['scope'] = that.scope.join(',');
            this.marketingManageService.updateEvent(data).subscribe((response) => {
                if (response.code === 200) {
                    this.editData['forbidFlag'] = a;
                    this.editData['funnelFlag'] = b;
                    this.editData['triggerFlag'] = c;
                    this.editData['timerFlag'] = d;
                    this.isVisible = false;
                    this.saveDate.emit();
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        } else {
            this.marketingManageService.insertEvent(obj).subscribe((response) => {
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
    getEventValueList() {
        const that = this;
        this.marketingManageService.getEventValueList({
            productId: that.productId
        }).subscribe((response) => {
            if (response.code === 200) {
                this.eventValueList = response.data;
                if (this.editFlag) {
                    for (let i = 0; i < this.eventValueList.length; i++) {
                        if (this.eventValueList[i].name === this.editData.code) {
                            this._name = this.eventValueList[i];
                        }
                    }
                }
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

}

