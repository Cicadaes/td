import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Globals } from '../../../../../utils/globals';

@Component({
  selector: 'app-param-mgt-view-dialog',
  templateUrl: './param-mgt-view-dialog.component.html',
  styleUrls: ['./param-mgt-view-dialog.component.less']
})
export class ParamMgtViewDialogComponent implements OnInit, OnChanges {
  @Input() isVisible: string;
  @Input() data: any;
  @Output() onHide = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  _isVisible = false;
  loading = false;
  total: any = 20;
  pageIndex: number = 1;
  pageSize: number = 10;
  checkedNumber: number = 0;
  disabledButton: boolean = true;

  allChecked = false;
  indeterminate = false;
  displayData = [];
  constructor(private golbals: Globals) {}

  refreshStatus(): void {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
    this.disabledButton = !this.displayData.some(value => value.checked);
    this.checkedNumber = this.displayData.filter(value => value.checked).length;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      data.checked = value;
    });
    this.refreshStatus();
  }
  handleCancel(): void {
    this._isVisible = false;
    this.golbals.resetBodyStyle();
    this.onHide.emit(this._isVisible);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isVisible) {
      this._isVisible = changes.isVisible.currentValue;
    }
  }

  ngOnInit() {
    for (let i = 0; i < 200; i++) {
      this.displayData.push({
        paramName: `新浪微博 ${i}`,
        id: i,
        status: i % 2,
        checked: false
      });
    }
  }
}
