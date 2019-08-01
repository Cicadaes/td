import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddUserFormService } from './add-user-form.service';

// 校验相关
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { CheckRegExpppassword } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';


@Component({
  selector: 'add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
  providers: [FormBuilder]
})

export class AddUserFormComponent implements OnInit {
  @Input() needSubmit: boolean;
  @Input() user: any;
  @Input() isSuper: boolean = true;
  @Input() tenantId: number = 0;
  @Output() onSubmit = new EventEmitter<any>();
  status: boolean = false;
  gender: any;
  isInitFormValue: boolean = false;
  genderSelect: any;
  autoPassword: boolean = false;
  autoPassword2: boolean = false;
  password_: string;
  existEmail: boolean;

  validateForm: FormGroup;

  organizationSelect: any;
  emailErrorMsg: any;

  @Input() set toSubmit(toSubmit: EventEmitter<any>) {
    toSubmit && toSubmit.subscribe(() => {
      this._submitForm();
    })
  }

  // 邮箱的表单校验
  private validatorEmail: any = CheckRegExp(this.regService.getEmail());
  private validatorPwd: any = CheckRegExpppassword(this.regService.getenterpassword());

  componentChange(value: any, fieldName: string) {
    if (this.checkHasFieldName(fieldName)) {
      if (fieldName == 'status') {
        if (value == 1) {
          value = true;
        } else {
          value = false;
        }
        this.status = value;
      }
      this.validateForm.controls[fieldName].setValue(value);
    }
    if (this.user) {
      this.checkAuto();
    } else {
      this.clearPasswordInput();
    }
  }

  checkHasFieldName(fieldName: string) {
    let has = false;
    for (let o in this.validateForm.controls) {
      if (fieldName && fieldName === o) {
        has = true;
        break;
      }
    }
    return has;
  }

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }

    if (this.validateForm.status === 'VALID') {
      this.onSubmit.emit(this.validateForm);
    }

  }
  constructor(private fb: FormBuilder, private service: AddUserFormService, private regService: RegexpSService) {

  }

  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(() => {
      this.validateForm.controls['checkPassword'].updateValueAndValidity();
    });
  }

  clearPasswordInput() {
    if (this.getFormControl('autoPassword') && this.getFormControl('autoPassword').value) {
      this.validateForm.controls['password'].setValue('12345j');
      this.validateForm.controls['checkPassword'].setValue('12345j');
    } else {
      if (this.validateForm.controls['password'].value && this.validateForm.controls['password'].value !== '12345j') {
        this.password_ = this.validateForm.controls['password'].value;
      }
      this.validateForm.controls['password'].setValue(this.password_);
      this.validateForm.controls['checkPassword'].setValue(this.password_);
    }
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
  }

  confirmationMobile = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else {
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.validateForm.controls['mobile'].value))) {
        return { required: true };
      }
    }
  }



  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }

  initValidateForm() {
    if (this.validateForm) {
      return false;
    }
    if (this.user) {
      this.validateForm = this.fb.group({
        id: [null],
        email: [null, [Validators.required, Validators.maxLength(256), this.validatorEmail]],
        autoPassword2: [true],
        autoPassword: [null],
        name: [null, [Validators.required, Validators.maxLength(256)]],
        editAutoPwd: [true],
        mobile: [null, [Validators.required, this.confirmationMobile]],
        status: [true],
        password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), this.validatorPwd]],
        checkPassword: [null, [Validators.required, this.confirmationValidator]],
      });
      this.checkAuto();
    } else {
      this.validateForm = this.fb.group({
        id: [null],
        email: [null, [Validators.required, Validators.maxLength(256), this.validatorEmail], this.checkRepeatEmail],
        password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), this.validatorPwd]],
        checkPassword: [null, [Validators.required, this.confirmationValidator]],
        autoPassword: [true],
        autoPassword2: [null],
        name: [null, [Validators.required, Validators.maxLength(256)]],
        mobile: [null, [Validators.required, this.confirmationMobile]],
        status: [true]
      });
      this.clearPasswordInput();
    }
  }


  ngOnInit() {
    this.initValidateForm();
    if (this.user) {
      this.initUserFormData();
    }

    this.getUserlist();

    if (!this.user) {
      this.status = true;
      this.autoPassword = true;
      this.clearPasswordInput();
    }
    this.organizationSelect = {
      apiData: false,
      apiUrl: '',
      apiParam: {},
      initValue: [{
        value: 'zhejiang',
        label: '浙江'
      }, {
        value: 'hangzhou',
        label: '杭州'
      }, {
        value: 'xihu',
        label: '西湖'
      }],
      selectOptions: [
        {
          value: 'zhejiang',
          label: '浙江',
          children: [{
            value: 'hangzhou',
            label: '杭州',
            children: [{
              value: 'xihu',
              label: '西湖',
              isLeaf: true
            }],
          }, {
            value: 'ningbo',
            label: '宁波',
            isLeaf: true
          }],
        },
        {
          value: 'jiangsu',
          label: '江苏',
          children: [{
            value: 'nanjing',
            label: '南京',
            children: [{
              value: 'zhonghuamen',
              label: '中华门',
              isLeaf: true
            }],
          }],
        }
      ]

    };
    this.genderSelect = {
      id: 3,
      fieldName: 'gender',
      fieldLabel: '性别',
      fieldType: 'select',
      apiData: false,
      initValue: '',
      selectOptions: [{
        value: '1',
        label: '正常'
      }, {
        value: '0',
        label: '禁用'
      }]
    };
  }

  getFormControl(name: string) {
    return this.validateForm && this.validateForm.controls && this.validateForm.controls[name];
  }

  initUserFormData() {
    if (this.isInitFormValue) {
      return false;
    }
    this.isInitFormValue = true;
    if (this.user) {
      for (let o in this.user) {
        this.componentChange(this.user[o], o);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.needSubmit = changes.needSubmit.currentValue || false;
    // if (this.needSubmit) {
    //   this._submitForm();
    // } else {
    //   this.initValidateForm();
    //   this.initUserFormData();
    // }
  }

  checkRepeatEmail = (control: FormControl): { [key: string]: any } => {
    let emailRepeat = false;
    const controlV = control.value;
    // controlV && (controlV = controlV.trim())

    return new Promise((resolve: any, reject: any) => {
      this.service.queryOneEmailById({ email: controlV }).then((data: any) => {
        if (data.success === false) {
          emailRepeat = true;
          this.emailErrorMsg = data.msg;
        } else {
          emailRepeat = false;
          this.emailErrorMsg = '';
        }
        resolve(emailRepeat ? { 'emailRepeat': { value: control.value } } : null)
      });
    });


  }

  // const CheckRegExp = (nameRe: RegExp): ValidatorFn => {
  //   return (control: AbstractControl): { [key: string]: any } => {
  //     let forbidden: boolean = true
  //     let str: string = control.value && control.value.trim()
  //     str ? (forbidden = nameRe.test(str)) : (forbidden = true)
  //
  //     return !forbidden ? { 'forbiddenName': { value: control.value } } : null
  //   }
  // }


  private userList: any
  /**
   * 获取所有app的信息
   * @return {[type]} [description]
   */
  private getUserlist() {
    this.service.getUsers({ page: 1, rows: 1000 }).then((data: any) => {
      this.userList = data.list.map((item: any) => {
        return {
          email: item.email,
        };
      });
    }).catch((err: any) => {
      console.log(err);
    });
  }

  checkAuto(e: any = '') {
    if (this.getFormControl('autoPassword2') && this.getFormControl('autoPassword2').value) {
      this.validateForm.controls['password'].setValue('12345j');
      this.validateForm.controls['checkPassword'].setValue('12345j');
    } else {
      if (this.validateForm.controls['password'].value && this.validateForm.controls['password'].value !== '12345j') {
        this.password_ = this.validateForm.controls['password'].value;
      }
      this.validateForm.controls['password'].setValue(this.password_);
      this.validateForm.controls['checkPassword'].setValue(this.password_);
    }
  }


}
