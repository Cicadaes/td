import { Output, OnChanges, Component, OnInit, Input, EventEmitter } from '@angular/core';
import { QrcodeService } from '../qrcode.service';

@Component({
  selector: 'app-edit-qrcode',
  templateUrl: './edit-qrcode.component.html',
  styleUrls: ['./edit-qrcode.component.less']
})
export class EditQrcodeComponent implements OnInit, OnChanges {
  @Input() qrcode;
  @Input() productId: number;
  @Output() closeModel = new EventEmitter<any>();

  isError: boolean;
  isErrorMsg: string;
  oldName: string;

  constructor(public service: QrcodeService) {
    const that = this;
    that.isError = false;
    that.isErrorMsg = '';
  }

  ngOnInit() {
    //        const that = this;
  }

  ngOnChanges() {
    const that = this;
    that.oldName = that.qrcode.qrcodeName;
  }

  submit() {
    const that = this;
    if (that.qrcode.type !== 'edit') {
      that.cancel();
      return;
    }
    if (!that.qrcode.qrcodeName) {
      that.isError = true;
      that.isErrorMsg = '请输入二维码名称';
      return;
    }
    if (that.isError) {
      return;
    }
    const json = {
      id: that.qrcode.id,
      qrcodeName: that.qrcode.qrcodeName,
      productId: that.productId,
      oldQrcodeName: that.oldName,
      qrcodeId: that.qrcode.qrcodeId
    };
    that.service.updateName(json).subscribe((res: any) => {
      that.cancel();
    });
  }

  /**
   * input框输入
   */
  change() {
    const that = this;
    // that.isError = false;
    if (!that.qrcode.qrcodeName) {
      that.isError = true;
      that.isErrorMsg = '请输入二维码名称';
      return;
    }
    if (that.getLength(that.qrcode.qrcodeName) > 42) {
      that.isError = true;
      that.isErrorMsg = '长度限制在42个字符，可包含中文、数字或英文';
      return;
    }
    if (that.qrcode.qrcodeName === that.oldName) {
      that.isError = false;
      return;
    }
    that.service.checkQrcodeName(that.qrcode.qrcodeName, that.productId).subscribe((data: any) => {
      if (data.code === 200 && data.data.count === 0) {
        that.isError = false;
      } else {
        that.isError = true;
        that.isErrorMsg = '二维码名称重复';
      }
      const tmp = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+$');
      if (!tmp.test(that.qrcode.qrcodeName)) {
        that.isError = true;
        that.isErrorMsg = '请输入中文、英文或数字';
      }
    });
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

  cancel() {
    const that = this;
    that.closeModel.emit(true);
  }
}
