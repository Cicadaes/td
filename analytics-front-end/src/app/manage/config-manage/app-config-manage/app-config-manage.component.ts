import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigManageService } from '../config-manage.service';
import { BaseComponent } from 'src/app/common/base-component';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-app-config-manage',
  templateUrl: './app-config-manage.component.html',
  styleUrls: ['./app-config-manage.component.less']
})
export class AppConfigManageComponent extends BaseComponent implements OnInit {
  validateForm: FormGroup;
  data = {};
  iscollectdata: boolean;
  _scheme: any;
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
        this._scheme = 'talkingdata.' + this.data['appkey'].toLowerCase();
        this.resetValidateForm(this.data);
      }
    });
  }

  // 初始化表单
  initialValidateForm(): any {
    this.iscollectdata = true;
    return this.fb.group({
      productname: [null, [Validators.required]],
      appkey: { value: null, disabled: true },
      scheme: { value: null, disabled: true },
      iscompensate: ['1', [Validators.required]],
      desc: [null]
    });
  }

  /** 充值表单
   * @param
   * data: 请求接口返回的表单数据
   * type: 时候将表单每项置为空 resetValidateForm：初始化表单数据时调用； 取消是重置表单调用
   */
  resetValidateForm(data: any) {
    this.iscollectdata = data['iscollectdata'] === 2 ? false : true;
    this.validateForm.reset({
      productname: data['productname'] ? data.productname : null,
      appkey: data['appkey'] ? data.appkey : null,
      scheme: this._scheme ? this._scheme : null,
      iscompensate: data['iscompensate'] && (data['iscompensate'] === 1 || data['iscompensate'] === '1') ? '1' : '2',
      desc: data['desc'] ? data.desc : null
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
    obj['iscollectdata'] = this.iscollectdata ? 1 : 2;
    obj['productname'] = that.validateForm.get('productname').value.trim();
    obj['appkey'] = that.validateForm.get('appkey').value;
    obj['iscompensate'] = that.validateForm.get('iscompensate').value;
    obj['desc'] = that.validateForm.get('desc').value;
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
