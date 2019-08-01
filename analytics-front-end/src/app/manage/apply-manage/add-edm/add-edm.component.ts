import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApplyManageService } from '../apply-manage.service';
import { Globals } from '../../../utils/globals';
import { NzNotificationService } from 'ng-zorro-antd';
import { CommonService } from '../../../common/services/common.service';

@Component({
  selector: 'app-add-edm',
  templateUrl: './add-edm.component.html',
  styleUrls: ['./add-edm.component.less']
})
export class AddEdmComponent implements OnInit, OnChanges {
  productId: any = 467;
  @Input() isVisible;
  @Input() editFlag: any;
  @Input() editData: any;
  @Output() hideDialog = new EventEmitter<any>();
  @Output() saveDate = new EventEmitter<any>();
  validateForm: FormGroup;
  data: any = {
    edmSenderList: [{ email: '', note: '' }]
  };
  emailMessage: string;
  emailErr: any = [];
  noteMessage: string;
  noteErr: any = [];

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private commonService: CommonService,
    private applyManageService: ApplyManageService,
    private globals: Globals
  ) {}

  ngOnInit() {
    if (this.commonService.productId) {
      this.productId = Number(this.commonService.productId);
    }

    this.validateForm = this.initialValidateForm();

    if (this.editFlag) {
      this.resetValidateForm(this.editData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.validateForm = this.initialValidateForm();
    this.data = {
      edmSenderList: [{ email: '', note: '' }]
    };

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
      if (this.editData) {
        this.data.edmSenderList = this.editData.param.edmSenderList;
        this.data = Object.assign({}, this.data);
      }
    }
  }

  // 初始化表单
  initialValidateForm(): any {
    return this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(32), this.checkName]], // 渠道名称
      code: [null, [Validators.required, Validators.maxLength(255), this.checkCode]] // code
    });
  }

  // 重置化表单
  resetValidateForm(data: any) {
    this.validateForm.reset({
      name: data['name'] ? data.name : null, // 渠道名称
      code: data['code'] ? data.code : null // code
    });
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  //  取消
  handleCancel = e => {
    this.isVisible = false;
    this.globals.resetBodyStyle();
    this.hideDialog.emit(this.isVisible);
  };

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
    return nameError ? { nameError: { value: control.value } } : null;
  };

  checkCode = (control: FormControl): { [key: string]: any } => {
    let codeError = false;
    const controlV = control.value;
    const reg = new RegExp('^[A-Za-z/_]+$');
    if (reg.test(controlV)) {
      codeError = false;
    } else if (!reg.test(controlV)) {
      codeError = true;
    }
    if (controlV == null || controlV === '' || controlV === undefined) {
      codeError = false;
    }
    return codeError ? { codeError: { value: control.value } } : null;
  };

  // 保存
  save() {
    this.submitForm();
    const a = this.checkaddresser('');
    if (this.validateForm.invalid || !a) {
      return;
    }
    const that = this;
    // console.log(1111);
    const obj = {
      channelType: 3,
      name: that.validateForm.get('name').value,
      code: that.validateForm.get('code').value,
      param: {
        edmSenderList: that.data.edmSenderList
      }
    };
    this.globals.resetBodyStyle();
    if (this.editFlag) {
      const data = Object.assign({}, this.editData);
      data['name'] = that.validateForm.get('name').value;
      data['code'] = that.validateForm.get('code').value;
      data.param.edmSenderList = that.data.edmSenderList;

      this.applyManageService.updateChannelConfig(data).subscribe(response => {
        if (response.code === 200) {
          this.saveDate.emit();
          this.isVisible = false;
        } else {
          this.notification.create('warning', '错误提示', response.message);
        }
      });
    } else {
      this.applyManageService.insertChannelConfig(obj).subscribe(response => {
        if (response.code === 200) {
          this.isVisible = false;
          this.saveDate.emit();
        } else {
          this.notification.create('warning', '错误提示', response.message);
        }
      });
    }
  }

  /**
   * 添加发件人
   */
  add() {
    this.checkaddresser('add');
  }

  /**
   * 删除发件人
   */
  remove(index: number) {
    this.data.edmSenderList.splice(index, 1);
  }

  // 校验发件人地址
  checkEmail(data: any, index: number) {
    const that = this;
    if (!data.email) {
      that.emailErr[index] = true;
      that.emailMessage = '请输入发件人地址';
      return;
    }
    if (!this.testValue('email', data.email)) {
      that.emailErr[index] = true;
      that.emailMessage = '请输正确的邮箱地址';
      return;
    }
    that.emailErr[index] = false;
  }

  // 校验发件人名称
  checkNote(data: any, index: number) {
    const that = this;
    if (!data.note) {
      that.noteErr[index] = true;
      that.noteMessage = '请输入发件人名称';
      return;
    }
    if (!this.testValue('zw', data.note)) {
      that.noteErr[index] = true;
      that.noteMessage = '请输入中文、英文或数字';
      return;
    }
    that.noteErr[index] = false;
  }

  // 校验发件人
  checkaddresser(type: any) {
    const that = this;
    const length = that.data.edmSenderList.length;
    let flag = true;
    for (let i = 0; i < length; i++) {
      if (!that.data.edmSenderList[i].email) {
        flag = false;
        that.emailErr[i] = true;
        that.emailMessage = '请输入发件人地址';
      }

      if (!this.testValue('email', that.data.edmSenderList[i].email)) {
        flag = false;
        that.emailErr[i] = true;
        that.emailMessage = '请输入正确的邮箱地址';
      }

      if (!that.data.edmSenderList[i].note) {
        flag = false;
        that.noteErr[i] = true;
        that.noteMessage = '请输入发件人名称';
      }

      if (!this.testValue('zw', that.data.edmSenderList[i].note)) {
        flag = false;
        that.noteErr[i] = true;
        that.noteMessage = '请输入中文、英文或数字';
      }
    }
    if (flag && type === 'add') {
      that.data.edmSenderList.push({ email: '', note: '' });
    }
    if (flag) {
      return true;
    } else {
      return false;
    }
  }

  // 正则校验
  testValue(type: any, value: any) {
    let rex;
    if (type === 'email') {
      rex = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    } else {
      rex = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
    }

    if (!rex.test(value)) {
      return false;
    } else {
      return true;
    }
  }
}
