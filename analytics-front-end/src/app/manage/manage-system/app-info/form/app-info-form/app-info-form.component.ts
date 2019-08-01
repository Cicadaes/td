import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { AppInfoService } from '../../app-info.service';

@Component({
  selector: 'app-app-info-form',
  templateUrl: './app-info-form.component.html',
  styleUrls: ['./app-info-form.component.less']
})
export class AppInfoFormComponent implements OnInit {
  @Input() isSubmit: boolean;
  @Input() data: any;
  @Input() systemError: any;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onBack = new EventEmitter<any>();
  confirmModal: NzModalRef;
  _isSubmit: boolean;
  validateForm: FormGroup;
  _data: any = {};
  _scheme: any;
  _systemError: any = {
    error: false,
    msg: ''
  };
  _iscollectdata: boolean;
  _isInited: boolean;
  isAutoMNP: boolean;
  _appConfig: any;
  _isTenantAdmin: boolean;
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    //    console.log(value);
  };

  _submitForm = () => {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    setTimeout(() => {
      this.onSubmit.emit(this.validateForm);
    }, 100);
  };

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  trim(str: string) {
    if (str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    } else {
      return '';
    }
  }

  getValueByField(fieldName: string) {
    return this.validateForm.controls[fieldName].value || '';
  }

  _trimInput(fieldName: string) {
    const value = this.trim(this.getValueByField(fieldName));
    this.componentChange(value, fieldName);
  }

  componentChange(value: any, fieldName: string) {
    if (this.checkHasFieldName(fieldName)) {
      this.validateForm.controls[fieldName].setValue(value);
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

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  };

  clearFormData() {
    if (this.validateForm && this.validateForm.controls) {
      for (const o in this.validateForm.controls) {
        this.validateForm.controls[o].setValue('');
      }
    }
  }

  initFormData() {
    //    this.clearFormData();
    if (this._data) {
      for (const o in this._data) {
        this.componentChange(this._data[o], o);
        if (o === 'iscompensate' && this._data[o]) {
          this._data.iscompensate = this._data[o].toString();
        }
        if (o === 'iscollectdata' && this._data[o]) {
          this._iscollectdata = this._data[o] === 1 ? true : false;
        }
      }
    }
  }

  successCopy(title: any) {
    this.message.create('success', title);
  }

  changeIsCollectData(value: any) {
    if (!this._iscollectdata) {
      this._iscollectdata = !this._iscollectdata;
      this.changeCollectDataApi(this._iscollectdata);
    } else {
      this.confirmModal = this.modal.confirm({
        nzTitle: '确认提示',
        nzContent: `确定要停止收取${this._data.productname}的数据吗？`,
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 10);
            this._iscollectdata = !this._iscollectdata;
            this.changeCollectDataApi(this._iscollectdata);
          }).catch(() => console.log('Oops errors!')),
        nzOnCancel: () =>
          new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 10);
            this._iscollectdata = true;
            this.componentChange(true, 'iscollectdata');
          }).catch(() => console.log('Oops errors!'))
      });
    }
  }

  changeCollectDataApi(value) {
    let iscollectdata = 1;
    if (!value) {
      iscollectdata = 2;
    }
    this._data.iscollectdata = iscollectdata;
    this.service.changeIsCollectData(this._data).subscribe((response: any) => {
      if (response) {
        // this.modal.success({
        //   nzTitle: '提示',
        //   nzContent: '停止收取“' + this._data.productname + '”的数据'
        // });
      }
    });
  }

  queryAppConfig() {
    this.service.getAppConfig().subscribe((response: any) => {
      this._appConfig = response || {};
      if (this._appConfig && this._appConfig.user) {
        this._isTenantAdmin = this._appConfig.user.tenantAdmin || false;
      }
    });
  }

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService,
    private service: AppInfoService
  ) {
    this.queryAppConfig();
    this.validateForm = this.fb.group({
      appkey: new FormControl({ value: '', disabled: true }),
      productname: new FormControl({ value: '', disabled: true }),
      miniprogramAppid: new FormControl({ value: '', disabled: true }),
      miniprogramSecret: new FormControl({ value: '', disabled: true }),
      desc: new FormControl({ value: '', disabled: true }),
      iscompensate: [''],
      iscollectdata: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isSubmit) {
      this._isSubmit = changes.isSubmit.currentValue;
    }
    if (this._isSubmit) {
      this._submitForm();
    }

    if (changes.data) {
      this._data = changes.data.currentValue;
      if (this._data.appkey) {
        this._scheme = 'talkingdata.' + this._data.appkey.toLowerCase();
      }
      this.initFormData();
    }

    if (changes.systemError) {
      this._systemError = changes.systemError.currentValue;
    }
  }

  ngOnInit() {
    const that = this;
    const list = window.localStorage.getItem('transfer') && JSON.parse(localStorage.getItem('transfer'));
    if (list) {
      const length = list.length;
      for (let i = 0; i < length; i++) {
        if (list[i]['code'] === 'miniprogram') {
          that.isAutoMNP = true;
        }
      }
    }
  }
}
