import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorAnalysisService } from '../../behavior-analysis.service';
import { BaseComponent } from '../../../../common/base-component';

@Component({
  selector: 'app-event-attrs-dialog',
  templateUrl: './event-attrs-dialog.component.html',
  styleUrls: ['./event-attrs-dialog.component.less'],
  providers: [BehaviorAnalysisService]
})
export class EventAttrsDialogComponent extends BaseComponent implements OnInit, OnChanges {
  @Output() onBack = new EventEmitter<any>();
  @Output() onHide = new EventEmitter<any>();
  @Input() data: any;
  @Input() dic: any;
  @Input() show: any;
  _dic: any;
  _dicItems: any[] = [];
  _checkedDicItems: any[] = [];
  _searchValue: any;
  _showHide: boolean;

  constructor(public service: BehaviorAnalysisService, private injector: Injector) {
    super(injector);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  onSearch(value: any) {
    this._searchValue = value || '';
    this.queryDimensionAttrs();
  }

  queryDimensionAttrs() {
    this.service.queryDictItems(this._dic, this._searchValue).subscribe((response: any) => {
      //修改接口返回参数变更
      response = {
        data: response['data']['list']
      };
      if (response) {
        this._dicItems = response.data;
        this._checkedDicItems.forEach(element => {
          for (let i = 0; i < this._dicItems.length; i++) {
            if (this._dicItems[i].id == element.id) {
              this._dicItems[i]['checked'] = true;
            }
          }
        });
      }
    });
  }

  _getCheckedDicItems(list: any[]) {
    const dicItems = [];
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].checked) {
          dicItems.push(list[i]);
        }
      }
    }
    return dicItems;
  }

  onHideDialog() {
    this._showHide = false;
    this.onHide.emit(this._showHide);
  }

  onBackData(isSearch: any) {
    const data = {
      isSearch: isSearch || false,
      list: this._checkedDicItems || []
    };
    this.onBack.emit(data);
  }

  _selectItem(data: any) {
    // this._checkedDicItems = this._getCheckedDicItems(this._dicItems);
    if (this._dicItems && this._dicItems.length > 0) {
      for (let i = 0; i < this._dicItems.length; i++) {
        if (this._dicItems[i].id == data.id) {
          if (data.checked) {
            this._checkedDicItems.push(this._dicItems[i]);
          } else {
            this._checkedDicItems = this._checkedDicItems.filter(item => item.id != data.id);
          }
          break;
        }
      }
    }
    this.onBackData(false);
  }

  handleOk() {
    //  this._checkedDicItems = this._getCheckedDicItems(this._dicItems);
    if (this._checkedDicItems.length > 10) {
      this.message.warning('最多可选 10 项');
      return false;
    }
    this.onBackData(true);
    this.onHideDialog();
  }

  handleCancel() {
    this.onHideDialog();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this._dicItems = changes.data.currentValue;
    }
    if (changes.show) {
      this._searchValue = '';
      this._showHide = changes.show.currentValue;
      if (this._showHide) {
        this.queryDimensionAttrs();
      }
    }
    if (changes.dic) {
      this._dic = changes.dic.currentValue;
      this._checkedDicItems = [];
      this.queryDimensionAttrs();
    }
  }

  ngOnInit() {}
}
