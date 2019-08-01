import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EventAnalysisService } from '../../event-analysis.service';
import { BaseComponent } from '../../../../common/base-component';

@Component({
  selector: 'app-event-analysis-detail-compare',
  templateUrl: './event-analysis-detail-compare.component.html',
  styleUrls: ['./event-analysis-detail-compare.component.less'],
  providers: [EventAnalysisService]
})
export class EventAnalysisDetailCompareComponent extends BaseComponent implements OnInit, OnChanges {
  @Output() onBack = new EventEmitter<any>();
  @Output() onHide = new EventEmitter<any>();
  @Input() data: any;
  @Input() dic: any;
  @Input() show: any;
  @Input() max: any;
  @Input() setList: any;
  _dic: any;
  _dicItems: any[] = [];
  _checkedDicItems: any[] = [];
  _checkedDicItemsCopy: any[] = [];
  _searchValue: any;
  _showHide: boolean;
  maxLength: any = 10;

  constructor(public service: EventAnalysisService, private injector: Injector) {
    super(injector);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  onSearch(value?: any) {
    this._searchValue = value || '';
    this.queryDimensionAttrs();
  }

  queryDimensionAttrs() {
    if (this._dic && this._dic !== 'all') {
      this.service.queryDictItems(this._dic, this._searchValue).subscribe((response: any) => {
        //修改接口返回参数变更
        response = {
          data: response['data']['list']
        };
        if (response) {
          this._dicItems = response.data;
          if (!this.setList) {
            this._checkedDicItems.forEach(element => {
              for (let i = 0; i < this._dicItems.length; i++) {
                if (this._dicItems[i].id == element.id) {
                  this._dicItems[i]['checked'] = true;
                }
              }
            });
          } else {
            this._checkedDicItems = [];
            this._dicItems.forEach(element => {
              element['checked'] = false;
            });
          }
        }
      });
    } else {
      this._dicItems = [];
    }
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
    if (this._checkedDicItems.length > this.maxLength) {
      this.message.warning(`最多可选 ${this.maxLength} 项`);
      return false;
    }
    this._checkedDicItemsCopy = this.deepCopy(this._checkedDicItems);
    this.setList = false;
    this.onBackData(true);
    this.onHideDialog();
  }

  handleCancel() {
    this._checkedDicItemsCopy.forEach(element => {
      for (let i = 0; i < this._dicItems.length; i++) {
        if (this._dicItems[i].id == element.id) {
          this._dicItems[i]['checked'] = true;
        }
      }
    });
    this._checkedDicItems = this.deepCopy(this._checkedDicItemsCopy);
    this.setList = false;
    this.onHideDialog();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this._dicItems = changes.data.currentValue;
    }
    if (changes.show) {
      this._searchValue = '';
      this._showHide = changes.show.currentValue.show || false;
      this.setList = changes.show.currentValue.reset || false;
      this.onSearch();
    }
    if (changes.dic) {
      this._dic = changes.dic.currentValue;
      this._checkedDicItems = [];
    }
    if (changes.max) {
      if (changes.max.currentValue) {
        this.maxLength = 5;
        this._checkedDicItems = this._checkedDicItems.slice(0, 5);
      } else {
        this.maxLength = 10;
      }
    }
  }

  ngOnInit() {}
}
