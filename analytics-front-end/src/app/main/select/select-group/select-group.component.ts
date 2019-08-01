import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectGroupService } from './select-group.service';

@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.component.html',
  styleUrls: ['./select-group.component.less']
})
export class SelectGroupComponent implements OnInit, OnChanges {
  @Input() select: any;
  @Output() onSelect = new EventEmitter<any>();
  _selectedValue = '';
  _selectedOption: any;
  _select: any;
  _selectGroupOptions: any;

  constructor(private service: SelectGroupService) {}

  querySeletGroupData() {
    this.service
      .getDatas(this._select.apiUrl, this._select.apiType, this._select.apiParam)
      .subscribe((response: any) => {
        if (response && response.list) {
          this._selectGroupOptions = response.list;
          this._initSelectValue();
          this.onBack();
        }
      });
  }

  _initSelectValue() {
    for (const o in this._selectGroupOptions) {
      this._selectedOption = this._selectGroupOptions[o][0];
      if (this._selectedOption) {
        this._selectedValue = this._selectedOption.id;
        break;
      }
    }
  }

  changeSelectGroup(value: any) {
    this.onBack();
  }

  getOptionByValue(value: any) {
    let option;
    if (value && this._selectGroupOptions) {
      for (const o in this._selectGroupOptions) {
        const list = this._selectGroupOptions[o];
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            const li = list[i];
            if (value === li.id) {
              option = li;
              break;
            }
          }
        }
      }
    }
    return option;
  }

  onBack() {
    this._selectedOption = this.getOptionByValue(this._selectedValue);
    this.onSelect.emit(this._selectedOption);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.select) {
      this._select = changes.select.currentValue;
      if (this._select) {
        this.querySeletGroupData();
      }
    }
  }

  ngOnInit() {}
}
