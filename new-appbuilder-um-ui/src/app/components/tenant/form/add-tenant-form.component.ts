import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddTenantFormService } from "./add-tenant-form.service";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


// 校验相关
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { CheckRegExpppassword } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';

@Component({
  selector: 'add-tenant-form',
  templateUrl: './add-tenant-form.component.html',
  styleUrls: ['./add-tenant-form.component.css'],
  providers: [FormBuilder]
})

export class AddTenantFormComponent implements OnInit {
  @Input() needSubmit: boolean;
  @Input() tenant: any;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onRepeatEmail = new EventEmitter<boolean>();
  status: boolean = false;
  gender: any;
  isInitFormValue: boolean = false;
  genderSelect: any;
  aautoPassword: boolean = false;
  password_: string;
  hasContactInfo: boolean = false;
  isRepeatEmail: boolean = false;
  iscompanyName: boolean = false;
  existEmail: boolean;
  validateForm: FormGroup;
  emailErrorMsg: any;
  companyNameErrorMsg: any;
  // 邮箱和密码校验
  private validatorEmail: any = CheckRegExp(this.regService.getEmail())
  private validatorPwd: any = CheckRegExpppassword(this.regService.getenterpassword())


  private tenantStatus: boolean = true

  oldData: any = {}
  // 所有的租户名称和代码
  public applistInfo: Array<any> = []

  componentChange(value: any, fieldName: string) {
    if (this.checkHasFieldName(fieldName)) {
      if (fieldName == 'status') {
        if (value == 1) {
          value = false;
        } else {
          value = true;
        }
        this.status = value;
      }
      this.validateForm.controls[fieldName].setValue(value);
    }

    if (this.tenant) {
      this.checkAuto()
    } else {
      this.clearPasswordInput()
    }
  }

  checkHasFieldName(fieldName: string) {
    let has = false;
    for (let o in this.validateForm.controls) {
      if (fieldName && fieldName == o) {
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

    setTimeout(() => {
      this.onSubmit.emit(this.validateForm);
    }, 100);

  }
  constructor(private regService: RegexpSService, private fb: FormBuilder, private service: AddTenantFormService, private route: ActivatedRoute) {

  }

  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(() => {
      this.validateForm.controls['acheckPassword'].updateValueAndValidity();
    });
  }

  clearPasswordInput() {
    if (this.getFormControl('aautoPassword') && this.getFormControl('aautoPassword').value) {
      this.validateForm.controls['apassword'].setValue('12345j');
      this.validateForm.controls['acheckPassword'].setValue('12345j');
    } else {
      if (this.validateForm.controls['apassword'].value && this.validateForm.controls['apassword'].value !== '12345j') {
        this.password_ = this.validateForm.controls['apassword'].value;
      }
      this.validateForm.controls['apassword'].setValue(this.password_);
      this.validateForm.controls['acheckPassword'].setValue(this.password_);
    }
    // if (this.aautoPassword) {
    //   this.validateForm.controls['apassword'].setValue('12345j');
    //   this.validateForm.controls['acheckPassword'].setValue('12345j');
    // } else {
    //   if (this.validateForm.controls['apassword'].value && this.validateForm.controls['apassword'].value !== '12345j') {
    //     this.password_ = this.validateForm.controls['apassword'].value;
    //   }
    //   this.validateForm.controls['apassword'].setValue(this.password_);
    //   this.validateForm.controls['acheckPassword'].setValue(this.password_);
    // }
  }

  cuaInput() {
    if (this.hasContactInfo) {
      this.validateForm.controls['contactName'].setValue(this.validateForm.controls['aname'].value);
      this.validateForm.controls['contactEmail'].setValue(this.validateForm.controls['aemail'].value);
      this.validateForm.controls['contactPhone'].setValue(this.validateForm.controls['amobile'].value);
    } else {
      this.validateForm.controls['contactName'].setValue('');
      this.validateForm.controls['contactEmail'].setValue('');
      this.validateForm.controls['contactPhone'].setValue('');
    }
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['apassword'].value) {
      return { confirm: true, error: true };
    }
  };

  confirmationMobile = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else {
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.validateForm.controls['amobile'].value))) {
        return { required: true };
      }
    }
  };

  confirmationMobile2 = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else {
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.validateForm.controls['contactPhone'].value))) {
        return { required: true };
      }
    }
  };

  confirmationEmail = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { email: true };
    } else {
      if (!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.validateForm.controls['aemail'].value))) {
        return { email: true };
      }
    }
  };

  confirmationEmail2 = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { email: true };
    } else {
      if (!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.validateForm.controls['contactEmail'].value))) {
        return { email: true };
      }
    }
  };

  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }


  private dataStr = ['id', 'companyName', 'faxNo', 'phone', 'address', 'aemail', 'aautoPassword2', 'aname', 'amobile', 'contactName', 'contactPhone', 'contactEmail', 'hasContactInfo']

  initValidateForm() {
    if (this.validateForm) {
      return false;
    }
    //验证规则待定，原有验证规则保持原样暂时不改
    // faxNo: [null, [Validators.maxLength(50),Validators.pattern(/^(0\d{2,3}-[1-9]{1}\d{6,7})|(0\d{2,3}-[1-9]{1}\d{6,7}-\d{3,5})$/)]],
    // phone: [null, [Validators.maxLength(50),Validators.pattern(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$/)]],

    if (this.tenant) {
      this.validateForm = this.fb.group({
        id: [this.oldData.id],
        companyName: [this.oldData.companyName, [Validators.required, Validators.maxLength(256)], this.checkRepeatcompanyName],
        faxNo: [this.oldData.faxNo, [Validators.maxLength(50)]],
        phone: [this.oldData.phone, [Validators.maxLength(50)]],
        address: [this.oldData.address, [Validators.maxLength(256)]],
        editAutoPwd: [true],
        // aemail            : [ this.oldData.aemail, [ Validators.email, this.confirmationEmail ] ],
        aemail: [this.oldData.contactEmail, [Validators.required, this.validatorEmail, Validators.maxLength(256)], this.checkRepeatEmail],
        aautoPassword2: [true],
        aname: [this.oldData.contactName, [Validators.required, Validators.maxLength(256)]],
        amobile: [this.oldData.contactPhone, [Validators.required, this.confirmationMobile]],
        contactName: [this.oldData.contactName, [Validators.required]],
        contactPhone: [this.oldData.contactPhone, [Validators.required, this.confirmationMobile2]],
        // contactEmail            : [ this.oldData.contactEmail, [ Validators.email, this.confirmationEmail2 ] ],
        contactEmail: [this.oldData.contactEmail, [Validators.required, this.validatorEmail]],
        hasContactInfo: [this.oldData.hasContactInfo],
        status: [this.oldData.status],
        apassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), this.validatorPwd]],
        acheckPassword: [null, [Validators.required, this.confirmationValidator]]
      });
      this.checkAuto()
    } else {
      this.validateForm = this.fb.group({
        id: [null],
        companyName: [null, [Validators.required, Validators.maxLength(256)], this.checkRepeatcompanyName],
        faxNo: [null, [Validators.maxLength(50)]],
        phone: [null, [Validators.maxLength(50)]],
        address: [null, [Validators.maxLength(256)]],
        // aemail: [null, [Validators.required, this.validatorEmail, this.confirmationEmailRepeat]],
        aemail: [null, [Validators.required, this.validatorEmail, Validators.maxLength(256)], this.checkRepeatEmail],
        apassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), this.validatorPwd]],
        acheckPassword: [null, [Validators.required, this.confirmationValidator]],
        aautoPassword: [true],
        aname: [null, [Validators.required, Validators.maxLength(256)]],
        amobile: [null, [Validators.required, this.confirmationMobile]],
        contactName: [null, [Validators.required]],
        contactPhone: [null, [Validators.required, this.confirmationMobile2]],
        // contactEmail            : [ null, [ Validators.email, this.confirmationEmail2 ] ],
        contactEmail: [this.oldData.contactEmail, [Validators.required, this.validatorEmail]],
        hasContactInfo: [true],
        status: [true]
      });
      this.clearPasswordInput()
    }
  }

  checkRepeatEmail = async (control: FormControl): Promise<any> => {
    let aemailRepeat: boolean = false
    let controlV = control.value
    controlV && (controlV = controlV.trim())
    if(!this.tenant){
        return new Promise((resolve: any, reject: any) => {
            this.service.queryOneEmailById({ email: controlV }).then((data: any) => {
              if(data.success == false){
                  aemailRepeat = true;
                  this.emailErrorMsg = data.msg;
              }else {
                  aemailRepeat = false;
                  this.emailErrorMsg = "";
              }
              resolve(aemailRepeat ? { 'aemailRepeat': { value: control.value } } : null)
            })
          })
    }else {
        return (aemailRepeat ? { 'aemailRepeat': { value: control.value } } : null);
    }

  }


  checkRepeatcompanyName = async (control: FormControl): Promise<any> => {
    let companyNameRepeat: boolean = false
    let controlV = control.value
    controlV && (controlV = controlV.trim())
    if(!this.tenant){
        return new Promise((resolve: any, reject: any) => {
            this.service.queryOneNameById({ name: controlV }).then((data: any) => {
              if(data.success == false){
                companyNameRepeat = true;
                  this.companyNameErrorMsg = data.msg;
              }else {
                companyNameRepeat = false;
                  this.companyNameErrorMsg = "";
              }
              // if (data.total && data.total > 0) {
              //   emailRepeat = true;
              // }
              resolve(companyNameRepeat ? { 'companyNameRepeat': { value: control.value } } : null)
            })
          })
    }else {
        return new Promise((resolve: any, reject: any) => {
            this.service.queryOneNameById({ name: controlV,id:this.oldData.id}).then((data: any) => {
              if(data.success == false){
                companyNameRepeat = true;
                  this.companyNameErrorMsg = data.msg;
              }else {
                companyNameRepeat = false;
                  this.companyNameErrorMsg = "";
              }
              // if (data.total && data.total > 0) {
              //   emailRepeat = true;
              // }
              resolve(companyNameRepeat ? { 'companyNameRepeat': { value: control.value } } : null)
            })
          })
    }

  }



  ngOnInit() {
   // this.getTenantslist();
    if (!this.tenant) {
      this.status = true;
      this.aautoPassword = true;
      this.hasContactInfo = true;
      this.clearPasswordInput();
    } else {
      if (this.tenant.hasContactInfo == 1) {
        this.hasContactInfo = true;
      } else {
        this.hasContactInfo = false;
      }
      if (this.tenant.status == 1) {
        this.status = true;
      } else {
        this.status = false;
      }
    }
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

    this.route.params.subscribe((data: any) => {
      // 保存当前项目Id和PipelineId
      this.getTenant(data.id)
    })
  }

  getFormControl(name: string) {

    if (this.hasContactInfo) {
      this.validateForm.controls['contactName'].setValue(this.validateForm.controls['aname'].value);
      this.validateForm.controls['contactEmail'].setValue(this.validateForm.controls['aemail'].value);
      this.validateForm.controls['contactPhone'].setValue(this.validateForm.controls['amobile'].value);
    }
    //console.log(this.validateForm.controls['companyName'])

    return this.validateForm && this.validateForm.controls && this.validateForm.controls[name];
  }

  initTenantFormData() {
    if (this.isInitFormValue) {
      return false;
    }
    this.isInitFormValue = true;
    if (this.tenant) {
      for (let o in this.tenant) {
        this.componentChange(this.tenant[o], o);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.needSubmit = changes.needSubmit.currentValue || false;
    if (this.needSubmit) {
      this._submitForm();
    } else {
      this.initValidateForm();
      this.initTenantFormData();
    }
  }

  /**
   * 根据Id获取信息
   * @param  {any = ''}          tenantId [description]
   * @return {[type]}   [description]
   */
  getTenant(id: any = '') {
    if (id) {
      this.service.queryTenantById({ id }).then((data: any) => {
        this.oldData = data.data
        let adminUser = data.data.adminUser;
        for (let item of this.dataStr) {
          this.validateForm.controls[item].setValue && this.validateForm.controls[item].setValue(this.oldData[item])
        }
        if (this.oldData.status) {
          this.tenantStatus = true
        } else {
          this.tenantStatus = false
        }

        this.validateForm.controls['status'].setValue && this.validateForm.controls['status'].setValue(this.tenantStatus)
        this.validateForm.controls['aautoPassword2'].setValue && this.validateForm.controls['aautoPassword2'].setValue(true)

        this.validateForm.controls['aname'].setValue && this.validateForm.controls['aname'].setValue(adminUser['name'])
        this.validateForm.controls['amobile'].setValue && this.validateForm.controls['amobile'].setValue(adminUser['mobile'])
        this.validateForm.controls['aemail'].setValue && this.validateForm.controls['aemail'].setValue(adminUser['email'])
      });
    }
  }


  confirmationEmailRepeat = (control: FormControl): { [s: string]: boolean } => {
    if (control.value) {
      let pamams = {};
      pamams = {
        vemail: control.value
      };
      this.service.getUgUserList(pamams).then((data: any) => {
        if (data.total && data.total > 0) {
          if (this.tenant && (control.value.trim() == this.oldData.contactEmail.trim())) {
            this.isRepeatEmail = false
          } else {
            this.isRepeatEmail = true
          }
          return { isRepeatEmail: true };
        } else {
          this.isRepeatEmail = true;
          return { isRepeatEmail: true };
        }
      })
    } else {
      this.isRepeatEmail = false;
      return { isRepeatEmail: true };
    }

  };




  checkAuto(e: any = '') {
    if (this.getFormControl('aautoPassword2').value) {
      this.validateForm.controls['apassword'].setValue('12345j');
      this.validateForm.controls['acheckPassword'].setValue('12345j');
    } else {
      if (this.validateForm.controls['apassword'].value && this.validateForm.controls['apassword'].value !== '12345j') {
        this.password_ = this.validateForm.controls['apassword'].value;
      }
      this.validateForm.controls['apassword'].setValue(this.password_);
      this.validateForm.controls['acheckPassword'].setValue(this.password_);
    }
  }

  /**
   * 获取所有租户的信息
   * @return {[type]} [description]
   */
  private getTenantslist() {
    let params = {
      page: 1,
      rows: 100
    }
    this.service.getTenants(params).then((data: any) => {
      this.applistInfo = data.list.map((item: any) => {
        return {
          companyName: item.companyName,
          contactEmail: item.contactEmail,
          id: item.id
        }
      })
    }).catch((err: any) => {
      console.log(err);
    });
  }

}
