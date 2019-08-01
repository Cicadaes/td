import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DataSearchService } from '../data-search.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Globals } from '../../utils/globals';

@Component({
  selector: 'app-table-structure-dialog',
  templateUrl: './table-structure-dialog.component.html',
  styleUrls: ['./table-structure-dialog.component.less'],
  providers: [DataSearchService]
})
export class TableStructureDialogComponent implements OnInit, OnChanges {
  @Input() isVisible: string;
  @Input() data: any;
  @Output() onHide = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  _isVisible = false;
  _isConfirmLoading = false;
  _data: any;
  _isSubmitForm: boolean;
  _validateForm: any = {};
  _systemError: any = {
    error: false,
    msg: ''
  };
  loading: any;
  total: any = [];
  dataSet = [
    { name: 'name', type: 'string', info: '姓名' },
    { name: 'IDCard', type: 'string', info: '身份识别码' },
    { name: 'viplevel', type: 'dictionary', info: 'vip级别', value: "'青铜','白银','黄金','钻石','王者'" },
    { name: 'accountId', type: 'int', info: '账户Id' },
    { name: 'productId', type: 'int', info: '产品Id' },
    { name: 'accountType', type: 'dictionary', info: '账户类型', value: "'普通','会员','高级会员'" }
  ];

  constructor(public globals: Globals, private message: NzMessageService, private service: DataSearchService) {}

  successCopy(title: any) {
    this.message.create('success', title);
  }

  showModal(): void {
    this._isVisible = true;
  }

  hideModal(): void {
    this._isVisible = false;
    this.globals.resetBodyStyle();
    this.onHide.emit(this._isVisible);
  }

  _generateApi(data: any) {
    this.service.generateApi(data).subscribe((response: any) => {
      this._resetComponentStatus(response);
    });
  }

  _resetComponentStatus(response) {
    this._resetFormStatus();
    if (response) {
      if (response.success) {
        this.hideModal();
        this.onSubmit.emit(true);
      } else {
        this._systemError = {
          error: true,
          msg: response.msg
        };
      }
    }
  }

  _resetFormStatus() {
    this._isConfirmLoading = false;
    this._isSubmitForm = false;
  }

  handleOk(): void {
    this._isSubmitForm = true;
    setTimeout(() => {
      this._isSubmitForm = false;
    }, 100);
  }

  handleCancel(): void {
    this.globals.resetBodyStyle();
    this._isVisible = false;
    this.onHide.emit(this._isVisible);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isVisible) {
      this._isVisible = changes.isVisible.currentValue;
    }
    if (changes.data) {
      this._data = changes.data.currentValue;
    }
  }

  ngOnInit() {}
}
