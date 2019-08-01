import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QrcodeService } from '../qrcode.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-download-qrcode',
  templateUrl: './download-qrcode.component.html',
  styleUrls: ['./download-qrcode.component.less']
})
export class DownloadQrcodeComponent implements OnInit, OnChanges {
  @Input() num: Number;
  @Input() percent: Number;
  @Output() downloadStart = new EventEmitter<boolean>();
  @Output() closeModel = new EventEmitter<boolean>();

  completed: boolean = false;
  constructor(public service: QrcodeService, public message: NzMessageService) {
    this.percent = 0;
  }

  ngOnInit() {
    const that = this;
    setTimeout(() => {
      that.downloadStart.emit(true);
    }, 500);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.percent) {
      if (changes.percent.currentValue === 1 && !changes.percent.firstChange) {
        this.percent = Math.round(changes.percent.currentValue * 100);
        setTimeout(() => {
          this.completed = true;
          this.percent = 0;
          changes.percent.currentValue = 0;
        }, 500);
      } else {
        this.percent = Math.round(changes.percent.currentValue * 100);
      }
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
