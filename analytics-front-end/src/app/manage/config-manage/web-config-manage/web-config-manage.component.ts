import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/common/base-component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigManageService } from '../config-manage.service';
import cloneDeep from 'lodash/cloneDeep';
@Component({
  selector: 'app-web-config-manage',
  templateUrl: './web-config-manage.component.html',
  styleUrls: ['./web-config-manage.component.less']
})
export class WebConfigManageComponent extends BaseComponent implements OnInit {
  validateForm: FormGroup;
  data = {};
  constructor(private fb: FormBuilder, private service: ConfigManageService, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.validateForm = this.initialValidateForm();
    this.getAppConfig();
  }

  getAppConfig() {
    this.service.getConfig({ id: this.productId }).subscribe(response => {
      if (response.success) {
        this.data = response['list'];
        this.resetValidateForm(this.data);
      }
    });
  }

  // 初始化表单
  initialValidateForm(): any {
    return this.fb.group({
      productname: [null, [Validators.required]],
      appkey: { value: null, disabled: true },
      desc: [null],
      iscompensate: ['1', [Validators.required]]
    });
  }

  /** 充值表单
   * @param
   * data: 请求接口返回的表单数据
   * type: 时候将表单每项置为空 resetValidateForm：初始化表单数据时调用； 取消是重置表单调用
   */
  resetValidateForm(data: any) {
    this.validateForm.reset({
      productname: data['productname'] ? data.productname : null,
      appkey: data['appkey'] ? data.appkey : null,
      desc: data['desc'] ? data.desc : null,
      iscompensate: data['iscompensate'] && (data['iscompensate'] === 1 || data['iscompensate'] === '1') ? '1' : '2'
    });
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

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  successCopy(title: any) {
    this.message.create('success', title);
  }

  // 保存
  save() {
    const that = this;
    if (this.validateForm.invalid) {
      return;
    }
    let obj = Object.assign({}, this.data);
    obj['productname'] = that.validateForm.get('productname').value.trim();
    obj['appkey'] = that.validateForm.get('appkey').value;
    obj['desc'] = that.validateForm.get('desc').value;
    obj['iscompensate'] = that.validateForm.get('iscompensate').value;

    this.service.updateConfig(obj).subscribe(response => {
      if (response.success) {
        this.message.create('success', `保存成功`);
        this.data = cloneDeep(obj);
      } else {
        this.resetValidateForm(this.data);
      }
    });
  }

  // 取消
  cancel() {
    this.resetValidateForm(this.data);
  }
}
