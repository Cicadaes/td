import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { QrcodeService } from '../qrcode.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-qrcode',
  templateUrl: './create-qrcode.component.html',
  styleUrls: ['./create-qrcode.component.less']
})
export class CreateQrcodeComponent implements OnInit {
  createForm: FormGroup;
  secretInputType: string;
  qrcodeType: number;
  qrcodeParams: any[];
  channel: string;
  appIdErr: boolean;
  appIdErrMessage: string;
  isParamsNameErr: any; // 判断是否输入错误
  isParamsNameRepeatErr: any; //判断是否输入重复
  isParamsNameNotUtmSource: any;
  isParamsNumberErr: any;
  paramsNameErrMessage: string;
  paramsNameErrMessage1: string;
  paramsNameErrMessage2: string;
  paramsNumberErrMessage: string;
  isPathLengthErr: boolean;
  isUtmSourceErr: boolean;
  isUtmSourceNull: boolean;
  isUrlParamsLengthErr: boolean;
  urlParamsLengthErrMessage: string;
  isNoUtmSource: boolean;
  paramList: any;

  @Input() productId: number;
  @Input() appId: string;
  @Input() secret: string;

  @Output() closeModel = new EventEmitter<boolean>();
  @Output() showNext = new EventEmitter<any>();

  constructor(public fb: FormBuilder, public service: QrcodeService, public message: NzMessageService) {
    const that = this;
    that.qrcodeType = 1;
    that.secretInputType = 'password';
    that.channel = '0';
    that.createForm = fb.group({
      qrcodeName: ['', [Validators.required, that.checkQrocdeName, that.inputCheck1], that.checkQrcodeName],
      appId: ['', [Validators.required]],
      appSecret: ['', [Validators.required]],
      // appId: new FormControl({ value: '', disabled: true }, Validators.required),
      // appSecret: new FormControl({ value: '', disabled: true }, Validators.required),
      qrcodePath: ['', [Validators.required, that.inputCheckPath]],
      channel: '',
      utmSource: ['', [Validators.maxLength(42), that.inputCheck2]]
    });
    that.qrcodeParams = [{ paramName: '', paramValue: '' }];
    that.appIdErrMessage = '';
    that.paramsNameErrMessage = '';
    that.paramsNameErrMessage1 = '';
    that.paramsNameErrMessage2 = '';
    that.isParamsNameErr = [];
    that.isParamsNameRepeatErr = [];
    that.isParamsNameNotUtmSource = [];
    that.isParamsNumberErr = [];
    that.isUrlParamsLengthErr = false;
    that.isPathLengthErr = false;
    that.isUtmSourceErr = false;
    that.urlParamsLengthErrMessage = '';
    that.isNoUtmSource = false;
    that.isUtmSourceNull = false;
    that.paramList = [];
  }

  ngOnInit() {
    this.getParam();
  }

  getParam() {
    const param = {
      productid: this.productId,
      page: 1,
      rows: 20,
      status: 0
    };
    this.service.getParamList(param).subscribe((response: any) => {
      if (response) {
        if (response.list) {
          this.paramList = response.list;
          this.paramList.forEach((element: any) => {
            element['showName'] = element.displayname ? element.displayname : element.name;
          });
        }
        if (response && response.success === false) {
          this.paramList = [];
          this.message.create('warning', response.msg);
        }
      }
    });
  }

  checkQrocdeName = (control: FormControl): { [key: string]: any } => {
    const that = this;
    let flag = false;
    const controlV = control.value;
    const length = that.getLength(controlV);
    if (length > 42) {
      flag = true;
    }
    return flag ? { length: { value: control.value } } : null;
  };

  inputCheckPath = (control: FormControl): { [key: string]: any } => {
    //        const that = this;
    let flag = false;
    const controlV = control.value;
    const tmp = new RegExp('^[-A-Za-z0-9/_]+$');
    if (tmp.test(controlV)) {
      flag = false;
    } else if (!tmp.test(controlV)) {
      flag = true;
    }
    if (controlV === null || controlV === '' || controlV === undefined) {
      flag = false;
    }
    return flag ? { auto: { value: control.value } } : null;
  };

  // 包含数字、字母和中文
  inputCheck1 = (control: FormControl): { [key: string]: any } => {
    //        const that = this;
    let flag = false;
    const controlV = control.value;
    const tmp = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+$');
    if (tmp.test(controlV)) {
      flag = false;
    } else if (!tmp.test(controlV)) {
      flag = true;
    }
    if (controlV === null || controlV === '' || controlV === undefined) {
      flag = false;
    }
    return flag ? { auto: { value: control.value } } : null;
  };

  // 包含数字和字母
  inputCheck2 = (control: FormControl): { [key: string]: any } => {
    //        const that = this;
    let flag = false;
    const controlValue = control.value;
    const tmp = new RegExp('^[A-Za-z0-9_-]+$');
    if (tmp.test(controlValue)) {
      flag = false;
    } else if (!tmp.test(controlValue)) {
      flag = true;
    }
    if (controlValue === null || controlValue === '' || controlValue === undefined) {
      flag = false;
    }
    return flag ? { auto: { value: control.value } } : null;
  };

  checkQrcodeName = (control: FormControl) =>
    Observable.create((observer: Observer<ValidationErrors>) => {
      const that = this;
      that.service.checkQrcodeName(control.value, that.productId).subscribe((data: any) => {
        if (data.code === 200 && data.data.count === 0) {
          observer.next(null);
        } else {
          observer.next({ error: true, duplicated: true });
        }
        observer.complete();
      });
    });

  /**
   * 点击显示或隐藏APPSecret显示
   */
  changeSecretType() {
    const that = this;
    if (that.secretInputType === 'password') {
      that.secretInputType = 'text';
    } else if (that.secretInputType === 'text') {
      that.secretInputType = 'password';
    }
  }

  /**
   * 选择二维码样式
   */
  selectQrcode(value: number) {
    const that = this;
    that.qrcodeType = value;
  }

  changeSelectChannel(e: any) {
    const that = this;
    if (e == '1') {
      for (let i = 0; i < that.qrcodeParams.length; i++) {
        if (that.qrcodeParams[i].paramName == 'utm_source') {
          that.isParamsNameNotUtmSource[i] = true;
          that.paramsNameErrMessage1 = '使用渠道后，参数名不能为utm_source';
        }
      }
    } else {
      for (let i = 0; i < that.qrcodeParams.length; i++) {
        that.isParamsNameNotUtmSource[i] = false;
        that.paramsNameErrMessage1 = '';
      }
      if (!that.isRepeat(that.qrcodeParams)) {
        for (let i = 0; i < that.isParamsNameRepeatErr.length; i++) {
          that.isParamsNameRepeatErr[i] = false;
        }
      } else {
        for (let i = 0; i < that.qrcodeParams.length; i++) {
          for (let j = 0; j < that.qrcodeParams.length; j++) {
            if (i != j && that.qrcodeParams[i].paramName == that.qrcodeParams[j].paramName) {
              j > i ? (that.isParamsNameRepeatErr[j] = true) : (that.isParamsNameRepeatErr[i] = true);
              that.paramsNameErrMessage2 = '参数名不能重复';
            }
          }
        }
      }
    }
  }

  /**
   * 添加参数
   */
  addParams() {
    const that = this;
    const length = that.qrcodeParams.length;
    let flag = true;
    for (let i = 0; i < length; i++) {
      if (
        that.isParamsNameNotUtmSource[i] ||
        that.isParamsNameRepeatErr[i] ||
        that.isParamsNameErr[i] ||
        that.isParamsNumberErr[i]
      ) {
        flag = false;
      }
      if (!that.qrcodeParams[i].paramName) {
        flag = false;
        that.isParamsNameErr[i] = true;
        that.paramsNameErrMessage = '请输入参数名';
      }
      if (!that.qrcodeParams[i].paramValue) {
        flag = false;
        that.isParamsNumberErr[i] = true;
        that.paramsNumberErrMessage = '请输入参数值';
      }
    }
    if (flag) {
      that.qrcodeParams.push({ paramName: '', paramValue: '' });
    }
  }

  /**
   * 删除一条参数
   * @param index
   */
  removeParams(index: number) {
    const that = this;
    that.qrcodeParams.splice(index, 1);
    that.checkUrlParamsLength('param');
  }

  createQrcode() {
    const that = this;
    if (
      (that.createForm.get('qrcodeName').dirty && that.createForm.get('qrcodeName').errors) ||
      that.createForm.get('qrcodeName').pending
    ) {
      return;
    }
    for (const i in that.createForm.controls) {
      if (that.createForm.controls.hasOwnProperty(i)) {
        that.createForm.controls[i].markAsDirty();
        // that.createForm.controls[i].updateValueAndValidity();
      }
    }
    if (that.createForm.invalid) {
      return;
    }
    const json = JSON.parse(JSON.stringify(that.createForm.value));
    json['qrcodeParams'] = JSON.parse(JSON.stringify(that.qrcodeParams));
    if (!that.isRepeat(that.qrcodeParams)) {
      that.isParamsNameRepeatErr.forEach(element => {
        element = false;
      });
    } else {
      return;
    }
    for (let i = 0; i < that.qrcodeParams.length; i++) {
      if (!that.qrcodeParams[i].paramName && !that.qrcodeParams[i].paramValue && i === 0) {
        json['qrcodeParams'].pop();
        break;
      }
      if (that.isParamsNameNotUtmSource[i]) {
        that.isParamsNameNotUtmSource[i] = true;
        that.paramsNameErrMessage1 = '使用渠道后，参数名不能为utm_source';
        return;
      }
      if (that.isParamsNameRepeatErr[i]) {
        that.isParamsNameRepeatErr[i] = true;
        that.paramsNameErrMessage2 = '参数名不能重复';
        return;
      }
      if (!that.qrcodeParams[i].paramName) {
        that.isParamsNameErr[i] = true;
        that.paramsNameErrMessage = '请输入参数名';
      }
      if (!that.qrcodeParams[i].paramValue) {
        that.isParamsNumberErr[i] = true;
        that.paramsNumberErrMessage = '请输入参数值';
      }
    }
    if (that.appIdErr || that.arrayCheck(that.isParamsNameErr) || that.arrayCheck(that.isParamsNumberErr)) {
      return;
    }
    if (that.channel === '1' && !that.createForm.value.utmSource) {
      that.isUtmSourceNull = true;
      return;
    }
    if (that.channel === '1' && that.isUtmSourceNull) {
      return;
    }
    json['productId'] = +that.productId;
    json['qrcodeType'] = that.qrcodeType;
    if (that.channel === '0') {
      delete json.utmSource;
    }
    delete json.channel;
    that.service.createQrocde(json).subscribe(
      (res: any) => {
        if (res.code === 200) {
          if (res.data) {
            that.showNext.emit(res.data);
          } else {
            that.closeModel.emit(true);
          }
        } else {
          if (res.code === 7003) {
            that.appIdErr = true;
            that.appIdErrMessage = res.message;
          } else {
            that.message.create('warning', res.message);
          }
        }
      },
      (error: any) => {}
    );
  }

  isRepeat(arr) {
    var hash = {};
    for (var i in arr) {
      if (hash[arr[i].paramName]) {
        return true;
      }
      hash[arr[i].paramName] = true;
    }
    return false;
  }

  arrayCheck(list: any) {
    let flag = false;
    const length = list.length;
    for (let i = 0; i < length; i++) {
      if (list[i]) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  changeAppId() {
    const that = this;
    if (that.appIdErr) {
      that.appIdErr = false;
    }
  }

  checkParamName(data: any, index: number) {
    const that = this;
    if (!data.paramValue && !data.paramName) {
      that.isParamsNameErr[index] = false;
      that.isParamsNumberErr[index] = false;
      that.isParamsNameNotUtmSource[index] = false;
      that.isParamsNameRepeatErr[index] = false;
      return;
    }
    if (data.paramValue && !data.paramName) {
      that.isParamsNameErr[index] = true;
      that.paramsNameErrMessage = '请输入参数名';
      that.paramsNameErrMessage1 = '';
      that.paramsNameErrMessage2 = '';
      return;
    }
    if (data.paramName) {
      if (this.channel == '1' && data.paramName == 'utm_source') {
        that.isParamsNameNotUtmSource[index] = true;
        that.paramsNameErrMessage1 = '使用渠道后，参数名不能为utm_source';
        that.paramsNameErrMessage = '';
        that.paramsNameErrMessage2 = '';
        that.paramsNumberErrMessage = '';
        return;
      }
      for (let i = 0; i < that.qrcodeParams.length; i++) {
        if (i != index && data.paramName == that.qrcodeParams[i].paramName) {
          that.isParamsNameRepeatErr[index] = true;
          that.paramsNameErrMessage2 = '参数名不能重复';
          that.paramsNameErrMessage = '';
          that.paramsNameErrMessage1 = '';
          that.paramsNumberErrMessage = '';
          return;
        }
      }
      if (!that.isRepeat(that.qrcodeParams)) {
        for (let i = 0; i < that.isParamsNameRepeatErr.length; i++) {
          that.isParamsNameRepeatErr[i] = false;
        }
      }
    }
    const reg = /^[0-9a-zA-Z_-]+$/;
    if (!reg.test(data.paramName)) {
      that.isParamsNameErr[index] = true;
      that.paramsNameErrMessage = '仅支持字母、数字、下划线及中划线';
      return;
    }
    that.isParamsNameErr[index] = false;
    that.isParamsNameNotUtmSource[index] = false;
    that.isParamsNameRepeatErr[index] = false;
    that.checkUrlParamsLength('param');
  }

  checkParamValue(data: any, index: number) {
    const that = this;
    if (!data.paramValue && !data.paramName) {
      that.isParamsNameErr[index] = false;
      that.isParamsNumberErr[index] = false;
      return;
    }
    if (
      data.paramName &&
      !data.paramValue &&
      !that.isParamsNameNotUtmSource[index] &&
      !that.isParamsNameRepeatErr[index]
    ) {
      that.isParamsNumberErr[index] = true;
      that.paramsNumberErrMessage = '请输入参数值';
      return;
    }

    const reg = /^[A-Za-z0-9_-]+$/;
    if (data.paramValue && !reg.test(data.paramValue)) {
      that.isParamsNumberErr[index] = true;
      that.paramsNumberErrMessage = '仅支持字母、数字、下划线及中划线';
      return;
    }
    that.isParamsNumberErr[index] = false;
    that.checkUrlParamsLength('param');
  }

  checkUrlParamsLength(type: any) {
    const that = this;
    let tmpStr = '';
    tmpStr = tmpStr + that.createForm.value.qrcodePath;
    if (type === 'path') {
      if (tmpStr.length > 128) {
        that.isPathLengthErr = true;
        that.urlParamsLengthErrMessage = '长度限制在128个字符 ，可包含数字或英文';
      } else {
        that.isPathLengthErr = false;
        that.urlParamsLengthErrMessage = '';
      }
    }
    if (that.channel === '1') {
      if (!that.createForm.value.utmSource) {
        that.isUtmSourceNull = true;
      }
      tmpStr = `${tmpStr}utmSource=that.createForm.value.utmSource`;
    }
    if (type === 'utmSource') {
      if (tmpStr.length > 128) {
        that.isUtmSourceErr = true;
        that.urlParamsLengthErrMessage = '页面路径和参数长度限制在128个字符 ，可包含数字或英文';
      } else {
        that.isUtmSourceErr = false;
        that.urlParamsLengthErrMessage = '';
      }
      if (tmpStr.length) {
        that.isUtmSourceNull = false;
      }
    }
    if (that.qrcodeParams && that.qrcodeParams.length > 0) {
      for (let i = 0; i < that.qrcodeParams.length; i++) {
        if (!that.qrcodeParams[i].paramName && !that.qrcodeParams[i].paramValue) {
          continue;
        }
        tmpStr += `&${that.qrcodeParams[i].paramName}=${that.qrcodeParams[i].paramValue}`;
      }
    }
    if (tmpStr.length > 128) {
      that.isUrlParamsLengthErr = true;
      that.urlParamsLengthErrMessage = '页面路径和参数长度限制在128个字符 ，可包含数字或英文';
    } else {
      that.isUrlParamsLengthErr = false;
    }
  }

  getLength(str) {
    const l = str.length;
    let unicodeLen = 0;
    for (let i = 0; i < l; i++) {
      if (str.charCodeAt(i) > 127) {
        unicodeLen++;
      }
      unicodeLen++;
    }
    return unicodeLen;
  }

  /**
   * 关闭弹框
   */
  cancel() {
    const that = this;
    that.closeModel.emit(true);
  }
}
