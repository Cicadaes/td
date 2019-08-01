import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { QrcodeService } from '../qrcode.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-batch-create-result',
  templateUrl: './batch-create-result.component.html',
  styleUrls: ['./batch-create-result.component.less']
})
export class BatchCreateResultComponent implements OnInit, OnChanges {
  successNum: Number;
  total: Number;
  errorNum: Number;
  errorList: Array<any>[];

  @Input() creatResult: any;
  @Output() closeModel = new EventEmitter<boolean>();
  @Output() downloadNext = new EventEmitter<boolean>();

  constructor(public service: QrcodeService, public message: NzMessageService) {}

  ngOnInit() {}
  ngOnChanges() {
    const that = this;
    that.errorList = [];
    that.successNum = that.creatResult.successNum;
    that.total = that.creatResult.total;
    that.errorNum = that.creatResult.errorNum;
    that.errorList = that.creatResult.errorQrcodes;
  }

  /**
   * 批量下载
   */
  download() {
    const that = this;
    if (that.successNum == 0) {
      that.message.create('warning', '没有可以下载的二维码图片，请重新生成');
    } else {
      that.downloadNext.emit(true);
    }
  }

  /**
   * 关闭弹框
   */
  cancel() {
    const that = this;
    that.closeModel.emit(true);
  }
}
