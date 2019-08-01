import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit, OnChanges {
  @Input() title: any = '';
  @Input() columnData: any = [];
  @Input() attrLoadingFlag: any; // 属性Table的loading
  @Output() edtiData = new EventEmitter<any>();

  constructor(private message: NzMessageService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  // 修改
  edit() {
    if (this.attrLoadingFlag) {
      this.message.info(`数据没有加载完全，此时不能进行编辑操作`);
      return;
    }
    this.edtiData.emit();
  }
}
