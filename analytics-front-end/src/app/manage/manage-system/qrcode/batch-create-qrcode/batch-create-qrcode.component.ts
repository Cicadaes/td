import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { QrcodeService } from '../qrcode.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'app-batch-create-qrcode',
  templateUrl: './batch-create-qrcode.component.html',
  styleUrls: ['./batch-create-qrcode.component.less']
})
export class BatchCreateQrcodeComponent implements OnInit {
  createForm: FormGroup;
  secretInputType: string;
  qrcodeType: number;
  qrcodeParams: any[];
  channel: string;
  appIdErr: boolean;
  appIdErrMessage: string;
  isParamsNameErr: any; // 判断是否输入错误
  isParamsNumberErr: any;
  paramsNameErrMessage: string;
  paramsNumberErrMessage: string;
  isPathLengthErr: boolean;
  isUtmSourceErr: boolean;
  isUtmSourceNull: boolean;
  isUrlParamsLengthErr: boolean;
  urlParamsLengthErrMessage: string;
  isNoUtmSource: boolean;
  fileList: UploadFile[] = [];
  isLoading: boolean;

  @Input() productId: number;
  @Input() appId: string;
  @Input() secret: string;

  @Output() closeModel = new EventEmitter<boolean>();
  @Output() showNext = new EventEmitter<any>();

  constructor(
    public fb: FormBuilder,
    public service: QrcodeService,
    private http: HttpClient,
    public message: NzMessageService
  ) {
    const that = this;
    that.qrcodeType = 1;
    that.secretInputType = 'password';
    that.channel = '0';
    that.createForm = fb.group({
      appId: ['', [Validators.required]],
      appSecret: ['', [Validators.required]],
      //  qrcodePath: ['', [Validators.required, that.inputCheckPath]],
      channel: '',
      //  utmSource: ['', [Validators.maxLength(42), that.inputCheck2]],
      onlineEditText: ['', [Validators.required]]
    });
    that.qrcodeParams = [{ paramName: '', paramValue: '' }];
    that.appIdErrMessage = '';
    //that.paramsNameErrMessage = '';
    //that.isParamsNameErr = [];
    // that.isParamsNumberErr = [];
    // that.isUrlParamsLengthErr = false;
    //that.isPathLengthErr = false;
    that.isUtmSourceErr = false;
    // that.urlParamsLengthErrMessage = '';
    that.isNoUtmSource = false;
    that.isUtmSourceNull = false;
    that.isLoading = false;
  }

  ngOnInit() {}

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

  /**
   * 占时无用
   */
  changeSelectChannel(e: any) {
    //        const that = this;
  }

  createQrcode() {
    const that = this;
    that.isLoading = true;
    for (const i in that.createForm.controls) {
      if (that.createForm.controls.hasOwnProperty(i)) {
        that.createForm.controls[i].markAsDirty();
        // that.createForm.controls[i].updateValueAndValidity();
      }
    }
    if (that.createForm.invalid) {
      that.isLoading = false;
      return;
    }
    const json = JSON.parse(JSON.stringify(that.createForm.value));

    const qrLength = json['onlineEditText'].split('name:').length - 1; //校验二维码个数
    if (qrLength > 200) {
      this.message.error('最多支持创建200个二维码');
      that.isLoading = false;
      return;
    }
    json['productId'] = +that.productId;
    json['qrcodeType'] = that.qrcodeType;
    if (that.channel === '0') {
      delete json.utmSource;
    }
    delete json.channel;
    that.service.batchCreateQrocde(json).subscribe(
      (res: any) => {
        that.isLoading = false;
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
      (error: any) => {
        that.isLoading = false;
        that.message.create('warning', error.message);
      }
    );
  }

  changeAppId() {
    const that = this;
    if (that.appIdErr) {
      that.appIdErr = false;
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

  downloadModal() {
    const form = document.createElement('form'); //定义一个form表单
    const url = this.service.baseUrl + '/qrcode/downloadTemplate';
    form.setAttribute('style', 'display:none');
    form.setAttribute('target', '');
    form.setAttribute('method', 'get'); //请求类型
    form.setAttribute('action', url); //请求地址
    document.body.appendChild(form);
    form.submit();
  }

  handleChange({ file, fileList }): void {
    const status = file.status;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      this.message.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.message.error(`${file.name} file upload failed.`);
    }
  }

  beforeUpload = (file: UploadFile): boolean => {
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      this.message.error('HTML文件大小需要小于10M');
      this.fileList = [];
      return isLt2M;
    }
    let ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    if (!(ext == 'xls' || ext == 'csv' || ext == 'xlsx' || ext == 'XLS' || ext == 'CSV' || ext == 'XLSX')) {
      this.message.error('上传的文件格式不对');
      this.fileList = [];
      return false;
    }
    if (this.fileList.length > 0) {
      this.message.error('只能上传一个文件');
      return false;
    } else {
      this.fileList.push(file);
    }
    return false;
  };

  handleUpload(): void {
    var that = this;

    const json = JSON.parse(JSON.stringify(that.createForm.value));

    json['productId'] = +that.productId;
    json['qrcodeType'] = that.qrcodeType;

    const formData = new FormData();
    if (that.fileList.length == 0) {
      that.message.error('请先上传文件');
      return;
    }
    let ext = that.fileList[0].name.substr(that.fileList[0].name.lastIndexOf('.') + 1);
    if (!(ext == 'xls' || ext == 'csv' || ext == 'xlsx' || ext == 'XLS' || ext == 'CSV' || ext == 'XLSX')) {
      that.message.error('上传的文件格式不对');
      that.fileList = [];
      return;
    }
    that.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    // formData.append("productId",  json['productId']);
    formData.append('qrcodeType', json['qrcodeType']);
    formData.append('appSecret', json['appSecret']);
    formData.append('appId', json['appId']);
    that.isLoading = true;

    const req = new HttpRequest('POST', that.service.baseUrl + '/qrcode/uploadTemplate', formData, {});
    that.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (event: {}) => {
          that.isLoading = false;
          let res = JSON.parse(JSON.stringify(event)).body;
          if (res.code === 200) {
            that.message.success('上传成功');
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
        err => {
          that.isLoading = false;
          that.message.error('上传失败');
        }
      );
  }
}
