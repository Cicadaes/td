import { Component, OnInit, SimpleChanges, OnChanges, EventEmitter, Input, Output } from '@angular/core';
import { Globals } from '../../../../utils/globals';

@Component({
  selector: 'app-sms-detail',
  templateUrl: './sms-detail.component.html',
  styleUrls: ['./sms-detail.component.less']
})
export class SmsDetailComponent implements OnInit, OnChanges {
  @Input() isVisible;
  @Input() editData: any;
  @Output() hideDetailDialog = new EventEmitter<any>();
  data: any = {
    signaList: [{ key: '', sign: '' }],
    subCodeList: [{ key: '' }]
  };
  constructor(private globals: Globals) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editData) {
      this.editData = changes.editData.currentValue;
    }

    if (this.editData) {
      this.data.subCodeList = [];
      this.data.signaList = this.editData.param.signList;
      this.editData.param.subCodeList.map(one => {
        this.data.subCodeList.push({
          key: one
        });
      });
      this.data = Object.assign({}, this.data);
    }
  }

  //  取消
  handleCancel = e => {
    this.isVisible = false;
    this.globals.resetBodyStyle();
    this.hideDetailDialog.emit(this.isVisible);
  };
}
